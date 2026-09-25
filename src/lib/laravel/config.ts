import Config from "@/lib/config/app.config";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

/**
 * Laravel API base URL (server-side BFF / build).
 * Source of truth: {@link Config.LARAVEL_API_BASE_URL} in `app.config.ts`.
 */
export const LARAVEL_API_BASE_URL = trimTrailingSlash(
  Config.LARAVEL_API_BASE_URL,
);
/**
 * Optional second Laravel origin. Used by `/api/laravel-asset` when the primary
 * origin fails (e.g. local `localhost:8000` + ngrok fallback).
 */
export const LARAVEL_API_FALLBACK_BASE_URL = trimTrailingSlash(
  process.env.LARAVEL_API_FALLBACK_BASE_URL ??
    process.env.NEXT_PUBLIC_LARAVEL_API_FALLBACK_BASE_URL ??
    "",
);

/** Unique configured Laravel origins, primary first. */
export function laravelApiOrigins(): string[] {
  const origins: string[] = [];
  for (const origin of [LARAVEL_API_BASE_URL, LARAVEL_API_FALLBACK_BASE_URL]) {
    if (origin && !origins.includes(origin)) origins.push(origin);
  }
  return origins;
}

export function hasLaravelBackend(): boolean {
  return Boolean(LARAVEL_API_BASE_URL);
}

/**
 * Absolute URL for server→Laravel proxying (Node fetch needs a host).
 * In the browser, returns a same-origin relative path so no host is sent.
 */
export function laravelApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    return normalizedPath;
  }
  if (!LARAVEL_API_BASE_URL) return normalizedPath;
  return `${LARAVEL_API_BASE_URL}${normalizedPath}`;
}

/**
 * Abort upstream Laravel requests instead of waiting forever. A hung tunnel
 * otherwise blocks page prerendering until the build-level timeout.
 * Ngrok cold starts often exceed 8s, so keep this above a typical tunnel lag.
 */
export const LARAVEL_REQUEST_TIMEOUT_MS = 20000;

/** One attempt during `next build` so prerender stays under Next's 30s page budget. */
export function laravelFetchAttempts(): number {
  return process.env.NEXT_PHASE === "phase-production-build" ? 1 : 3;
}

/** True when a fetch rejection came from {@link AbortSignal.timeout}. */
export function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

export const LARAVEL_JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
} as const;
