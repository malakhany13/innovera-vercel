/**
 * Browser-side fetching for public Laravel data (non-RTK callers).
 *
 * Same pattern as auth / my-enrollments: hit the Next BFF on the page origin
 * (`Config.BACK_END_URL` is `""` → http://localhost:3001/api/...).
 * The BFF proxies to {@link Config.LARAVEL_API_BASE_URL} on the server.
 *
 * On the static export there is no BFF — callers must use {@link laravelPath}
 * (`/api/v1/...`) so Apache/Laravel never serve the SPA HTML for `/api/courses/{id}`.
 */

import Config from "@/lib/config/app.config";

/** True in the client bundle produced by `npm run build:static`. */
export function isStaticExportRuntime(): boolean {
  return (
    process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" ||
    process.env.NEXT_PUBLIC_CMS_ASSETS_LOCAL === "1"
  );
}

/** Laravel public API headers. `ngrok-skip-browser-warning` matters for tunnels. */
const PUBLIC_JSON_HEADERS = {
  Accept: "application/json",
  "ngrok-skip-browser-warning": "true",
} as const;

/** URL against browser API base (same-origin BFF when BACK_END_URL is empty). */
export function laravelPublicUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = Config.BACK_END_URL.replace(/\/$/, "");
  return base ? `${base}${normalizedPath}` : normalizedPath;
}

export type PublicJsonResult =
  | { ok: true; payload: unknown }
  | { ok: false; status: number | "FETCH_ERROR"; message: string };

/** True only for a response we are willing to parse as JSON. */
function isJsonResponse(response: Response): boolean {
  return (response.headers.get("content-type") ?? "").includes("application/json");
}

/**
 * GET a public resource via the Next BFF (preferred in next-dev) or Laravel path
 * (required for the static export).
 *
 * @param bffPath     Path under `/api` on Next, e.g. `/internship-programs`
 *                    → `/api/internship-programs` on localhost:3001.
 * @param laravelPath Laravel public path, e.g. `/api/v1/courses/11`.
 * @param errorLabel  Human-readable label used when the request fails.
 */
export async function fetchPublicJson(options: {
  bffPath?: string;
  laravelPath: string;
  errorLabel: string;
}): Promise<PublicJsonResult> {
  const useBff = Boolean(options.bffPath) && !isStaticExportRuntime();
  const path = useBff
    ? `/api${options.bffPath!.startsWith("/") ? options.bffPath! : `/${options.bffPath!}`}`
    : options.laravelPath;

  let response: Response;
  try {
    response = await fetch(laravelPublicUrl(path), {
      credentials: "same-origin",
      cache: "no-store",
      headers: PUBLIC_JSON_HEADERS,
    });
  } catch {
    return { ok: false, status: "FETCH_ERROR", message: options.errorLabel };
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: `${options.errorLabel} (${response.status})`,
    };
  }

  if (!isJsonResponse(response)) {
    return {
      ok: false,
      status: "FETCH_ERROR",
      message: `${options.errorLabel}: expected JSON, got ${
        response.headers.get("content-type") ?? "no content type"
      }`,
    };
  }

  try {
    return { ok: true, payload: await response.json() };
  } catch {
    return { ok: false, status: "FETCH_ERROR", message: options.errorLabel };
  }
}
