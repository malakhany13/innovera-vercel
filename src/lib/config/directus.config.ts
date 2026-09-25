/**
 * Directus URL configuration.
 *
 * Production — set these on the host (Vercel, CI, static host, etc.):
 *   NEXT_PUBLIC_DIRECTUS_URL  Public Directus base URL. Used for image/asset `src`
 *                             (`{url}/assets/...`) and any client-side CMS calls.
 *                             Used for client CMS calls and (in `next dev`) image
 *                             `src` URLs. Static export downloads assets locally.
 *   DIRECTUS_URL              Server-only Directus base URL for SSR, ISR, BFF
 *                             route handlers, and build-time data fetches.
 *                             Prefer this for server code; falls back to
 *                             NEXT_PUBLIC_DIRECTUS_URL when unset.
 *
 * Localhost (`http://localhost:8055`) is used ONLY when neither variable is set
 * (local development). Never rely on localhost in a production deploy.
 */

/**
 * Dev-only fallback when no Directus env var is configured. Empty in production
 * builds so a localhost URL can never be compiled into a shipped bundle.
 */
const DEV_FALLBACK_DIRECTUS_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:8055" : "";

/**
 * True in the static export. There is no Directus server in production: CMS
 * content is baked into the HTML at build time and assets are downloaded into
 * the export, so the browser must never call Directus.
 */
export const IS_STATIC_CMS = process.env.NEXT_PUBLIC_CMS_ASSETS_LOCAL === "1";

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Client-safe Directus base URL (`NEXT_PUBLIC_DIRECTUS_URL`).
 * Safe to use in components, asset helpers, and client bundles.
 */
export function getPublicDirectusUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_DIRECTUS_URL?.trim();
  return normalizeBaseUrl(fromEnv || DEV_FALLBACK_DIRECTUS_URL);
}

/**
 * Server-only Directus base URL (`DIRECTUS_URL`, then public, then localhost).
 * Use in Route Handlers, Server Components, and `directusAdminFetch`.
 */
export function getServerDirectusUrl(): string {
  const fromEnv =
    process.env.DIRECTUS_URL?.trim() ||
    process.env.NEXT_PUBLIC_DIRECTUS_URL?.trim();
  return normalizeBaseUrl(fromEnv || DEV_FALLBACK_DIRECTUS_URL);
}

/** Resolved at module load — public asset / client CMS base. */
export const PUBLIC_DIRECTUS_URL = getPublicDirectusUrl();

/** Resolved at module load — server REST base. */
export const SERVER_DIRECTUS_URL = getServerDirectusUrl();
