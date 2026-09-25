import {
  LARAVEL_API_BASE_URL,
  LARAVEL_JSON_HEADERS,
  LARAVEL_REQUEST_TIMEOUT_MS,
  laravelApiUrl,
} from "@/lib/laravel/config";

export async function proxyLaravelGet(path: string): Promise<Response | null> {
  if (!LARAVEL_API_BASE_URL) return null;

  try {
    return await fetch(laravelApiUrl(path), {
      method: "GET",
      headers: LARAVEL_JSON_HEADERS,
      cache: "no-store",
      signal: AbortSignal.timeout(LARAVEL_REQUEST_TIMEOUT_MS),
    });
  } catch {
    return null;
  }
}

export async function proxyLaravelPost(
  path: string,
  body: unknown,
): Promise<Response | null> {
  if (!LARAVEL_API_BASE_URL) return null;

  try {
    return await fetch(laravelApiUrl(path), {
      method: "POST",
      headers: LARAVEL_JSON_HEADERS,
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(LARAVEL_REQUEST_TIMEOUT_MS),
    });
  } catch {
    return null;
  }
}

export function extractPaymentToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.course_payment_token,
    record.coursePaymentToken,
    record.payment_token,
    record.paymentToken,
    record.token,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  const showUrl = record.payment_show_url ?? record.paymentShowUrl;
  if (typeof showUrl === "string" && showUrl.trim()) {
    try {
      const match = new URL(showUrl).pathname.match(/\/payment\/([^/]+)\/?$/i);
      if (match?.[1]) return decodeURIComponent(match[1]);
    } catch {
      const match = showUrl.match(/\/payment\/([^/?#]+)/i);
      if (match?.[1]) return decodeURIComponent(match[1]);
    }
  }

  if (record.data && typeof record.data === "object") {
    return extractPaymentToken(record.data);
  }

  return null;
}
