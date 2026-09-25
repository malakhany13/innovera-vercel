import Config from "@/lib/config/app.config";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

/**
 * Backend API base URL (server-side BFF / build).
 * Source of truth: {@link Config.API_BASE_URL} in `app.config.ts`.
 */
export const API_BASE_URL = trimTrailingSlash(Config.API_BASE_URL);

/** @deprecated Use {@link API_BASE_URL}. */
export const LARAVEL_API_BASE_URL = API_BASE_URL;

/**
 * Optional second API origin. Used by `/api/laravel-asset` when the primary
 * origin fails (e.g. local + tunnel fallback).
 */
export const API_FALLBACK_BASE_URL = trimTrailingSlash(
  process.env.API_FALLBACK_BASE_URL ??
    process.env.NEXT_PUBLIC_API_FALLBACK_BASE_URL ??
    process.env.LARAVEL_API_FALLBACK_BASE_URL ??
    process.env.NEXT_PUBLIC_LARAVEL_API_FALLBACK_BASE_URL ??
    "",
);

/** @deprecated Use {@link API_FALLBACK_BASE_URL}. */
export const LARAVEL_API_FALLBACK_BASE_URL = API_FALLBACK_BASE_URL;

/** Unique configured API origins, primary first. */
export function apiOrigins(): string[] {
  const origins: string[] = [];
  for (const origin of [API_BASE_URL, API_FALLBACK_BASE_URL]) {
    if (origin && !origins.includes(origin)) origins.push(origin);
  }
  return origins;
}

/** @deprecated Use {@link apiOrigins}. */
export function laravelApiOrigins(): string[] {
  return apiOrigins();
}

export function hasApiBackend(): boolean {
  return Boolean(API_BASE_URL);
}

/** @deprecated Use {@link hasApiBackend}. */
export function hasLaravelBackend(): boolean {
  return hasApiBackend();
}

/**
 * Absolute URL for server→API proxying (Node fetch needs a host).
 * In the browser, returns a same-origin relative path so no host is sent
 * (prefer {@link Config.BACK_END_URL} for client RTK instead).
 */
export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    return normalizedPath;
  }
  if (!API_BASE_URL) return normalizedPath;
  return `${API_BASE_URL}${normalizedPath}`;
}

/** @deprecated Use {@link apiUrl}. */
export function laravelApiUrl(path: string): string {
  return apiUrl(path);
}

/**
 * Abort upstream API requests instead of waiting forever. A hung tunnel
 * otherwise blocks page prerendering until the build-level timeout.
 */
export const API_REQUEST_TIMEOUT_MS = 20000;

/** @deprecated Use {@link API_REQUEST_TIMEOUT_MS}. */
export const LARAVEL_REQUEST_TIMEOUT_MS = API_REQUEST_TIMEOUT_MS;

/** One attempt during `next build` so prerender stays under Next's 30s page budget. */
export function apiFetchAttempts(): number {
  return process.env.NEXT_PHASE === "phase-production-build" ? 1 : 3;
}

/** @deprecated Use {@link apiFetchAttempts}. */
export function laravelFetchAttempts(): number {
  return apiFetchAttempts();
}

/** True when a fetch rejection came from AbortSignal.timeout. */
export function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

export const API_JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
} as const;

/** @deprecated Use {@link API_JSON_HEADERS}. */
export const LARAVEL_JSON_HEADERS = API_JSON_HEADERS;
