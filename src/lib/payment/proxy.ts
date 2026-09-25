import {
  hasLaravelBackend,
  LARAVEL_API_BASE_URL,
  LARAVEL_REQUEST_TIMEOUT_MS,
  laravelApiUrl,
} from "@/lib/laravel/config";

const DEV_MOCK_TOKENS = new Set(["demo123", "voucher-demo", "missing", "invalid"]);

export function hasPaymentBackend(): boolean {
  return hasLaravelBackend();
}

export function isDevMockToken(token: string): boolean {
  return DEV_MOCK_TOKENS.has(token) || token.startsWith("assessment");
}

const LARAVEL_PAYMENT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest",
  "ngrok-skip-browser-warning": "true",
} as const;

function isJsonResponse(response: Response): boolean {
  return (response.headers.get("content-type") ?? "").includes("application/json");
}

/**
 * Exact `GET /api/payment/{token}` can be Next HTML on production. Nested
 * `/status` and `/paytabs/...` are Laravel JSON. If the primary path is not
 * JSON, try the `/api/v1/payment/...` prefix used by the public catalog.
 * Follow HTTP redirects (www ↔ apex); `redirect: "manual"` turned those 301s
 * into non-JSON responses and the BFF then returned 502.
 */
function v1PaymentPath(path: string): string | null {
  const queryIndex = path.indexOf("?");
  const pathname = queryIndex === -1 ? path : path.slice(0, queryIndex);
  const search = queryIndex === -1 ? "" : path.slice(queryIndex);
  if (pathname !== "/api/payment" && !pathname.startsWith("/api/payment/")) {
    return null;
  }
  return `/api/v1/payment${pathname.slice("/api/payment".length)}${search}`;
}

async function fetchLaravelPayment(
  path: string,
  init: RequestInit,
): Promise<Response | null> {
  if (!LARAVEL_API_BASE_URL) return null;

  try {
    const primary = await fetch(laravelApiUrl(path), init);
    if (isJsonResponse(primary)) return primary;

    const alt = v1PaymentPath(path);
    if (!alt) return primary;

    const secondary = await fetch(laravelApiUrl(alt), init);
    if (isJsonResponse(secondary)) return secondary;
    return primary;
  } catch {
    return null;
  }
}

export async function proxyPaymentGet(path: string): Promise<Response | null> {
  return fetchLaravelPayment(path, {
    method: "GET",
    headers: LARAVEL_PAYMENT_HEADERS,
    cache: "no-store",
    signal: AbortSignal.timeout(LARAVEL_REQUEST_TIMEOUT_MS),
  });
}

export async function proxyPaymentPost(
  path: string,
  body: unknown,
): Promise<Response | null> {
  return fetchLaravelPayment(path, {
    method: "POST",
    headers: LARAVEL_PAYMENT_HEADERS,
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(LARAVEL_REQUEST_TIMEOUT_MS),
  });
}

function readSetCookies(response: Response): string[] {
  if (typeof response.headers.getSetCookie === "function") {
    return response.headers.getSetCookie();
  }

  const header = response.headers.get("set-cookie");
  return header ? [header] : [];
}

function mergeCookieJar(jar: Map<string, string>, setCookies: string[]): void {
  for (const raw of setCookies) {
    const [pair] = raw.split(";");
    const separator = pair.indexOf("=");
    if (separator === -1) continue;

    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    jar.set(name, value);
  }
}

function cookieHeader(jar: Map<string, string>): string {
  return Array.from(jar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

function xsrfTokenFromJar(jar: Map<string, string>): string {
  const token = jar.get("XSRF-TOKEN");
  return token ? decodeURIComponent(token) : "";
}

function csrfTokenFromHtml(html: string): string {
  const meta = html.match(/name=["']csrf-token["']\s+content=["']([^"']+)["']/i);
  if (meta?.[1]) return meta[1];

  const hidden = html.match(/name=["']_token["']\s+value=["']([^"']+)["']/i);
  return hidden?.[1] ?? "";
}

async function resolveLaravelCsrfToken(
  token: string,
  jar: Map<string, string>,
): Promise<string> {
  const bootstrapHeaders = {
    Accept: "text/html,application/xhtml+xml,application/json",
    "ngrok-skip-browser-warning": "true",
  } as const;

  const root = await fetch(laravelApiUrl("/"), {
    method: "GET",
    headers: bootstrapHeaders,
    cache: "no-store",
    redirect: "follow",
  });
  mergeCookieJar(jar, readSetCookies(root));

  const csrfBootstrap = await fetch(laravelApiUrl("/sanctum/csrf-cookie"), {
    method: "GET",
    headers: {
      ...bootstrapHeaders,
      Cookie: cookieHeader(jar),
    },
    cache: "no-store",
  });
  mergeCookieJar(jar, readSetCookies(csrfBootstrap));

  const cookieToken = xsrfTokenFromJar(jar);
  if (cookieToken) return cookieToken;

  const paymentPage = await fetch(
    laravelApiUrl(`/payment/${encodeURIComponent(token)}`),
    {
      method: "GET",
      headers: {
        ...bootstrapHeaders,
        Cookie: cookieHeader(jar),
      },
      cache: "no-store",
      redirect: "follow",
    },
  );
  mergeCookieJar(jar, readSetCookies(paymentPage));

  const cookieAfterPayment = xsrfTokenFromJar(jar);
  if (cookieAfterPayment) return cookieAfterPayment;

  const html = await paymentPage.text();
  return csrfTokenFromHtml(html);
}

/**
 * Laravel Blade voucher routes are web routes that require a session + CSRF token:
 * POST /payment/{token}/apply-voucher
 * POST /payment/{token}/remove-voucher
 */
export async function proxyLaravelPaymentWebPost(
  token: string,
  action: "apply-voucher" | "remove-voucher",
  body?: Record<string, string>,
): Promise<Response | null> {
  if (!LARAVEL_API_BASE_URL) return null;

  const jar = new Map<string, string>();

  try {
    const csrfToken = await resolveLaravelCsrfToken(token, jar);
    const path = `/payment/${encodeURIComponent(token)}/${action}`;

    return await fetch(laravelApiUrl(path), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken,
        "X-XSRF-TOKEN": csrfToken,
        "X-Requested-With": "XMLHttpRequest",
        Referer: laravelApiUrl(`/payment/${encodeURIComponent(token)}`),
        Cookie: cookieHeader(jar),
        "ngrok-skip-browser-warning": "true",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

export async function proxyPaymentJson<T>(
  path: string,
): Promise<{ data: T; status: number } | null> {
  const response = await proxyPaymentGet(path);
  if (!response) return null;

  const data = (await response.json().catch(() => ({}))) as T;
  return { data, status: response.status };
}

export async function forwardPaymentJson(
  path: string,
  fallback: () => Response,
): Promise<Response> {
  const response = await proxyPaymentGet(path);
  if (!response) return fallback();

  const data = await response.json().catch(() => ({
    success: false,
    message: "Payment request failed",
  }));

  return Response.json(data, { status: response.status });
}

/** Returned when PAYMENT_API_BASE_URL is not configured (local dev without Laravel). */
export function mockPaymentBackendUnavailable(): Response {
  return Response.json(
    {
      success: false,
      message:
        "API is not configured. Set API_BASE_URL / NEXT_PUBLIC_API_BASE_URL in .env.local.",
    },
    { status: 503 },
  );
}

export async function readProxyErrorMessage(response: Response): Promise<string> {
  const text = await response.text();

  try {
    const data = JSON.parse(text) as { message?: string; error?: string };
    return data.message ?? data.error ?? "Payment not found";
  } catch {
    if (/ERR_NGROK|ngrok-free\.dev is offline|tunnel.*not found/i.test(text)) {
      return "The payment service is temporarily unavailable. Please try again in a few minutes.";
    }

    return "Payment not found";
  }
}
