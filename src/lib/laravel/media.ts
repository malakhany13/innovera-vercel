import { laravelApiOrigins } from "@/lib/laravel/config";

/** True when `url` is a Laravel storage asset on a configured API host. */
export function isLaravelStorageUrl(url: string): boolean {
  if (!url.startsWith("http://") && !url.startsWith("https://")) return false;

  const origins = laravelApiOrigins();
  if (origins.length === 0) return /\/storage\//.test(url);

  try {
    const target = new URL(url);
    if (!target.pathname.startsWith("/storage/")) return false;
    return origins.some((origin) => {
      try {
        return new URL(origin).hostname === target.hostname;
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}

/**
 * Same-origin proxy URL for Laravel storage images.
 * Avoids ngrok HTML interstitials breaking next/image optimization.
 */
export function laravelAssetProxyUrl(absoluteUrl: string): string {
  return `/api/laravel-asset?url=${encodeURIComponent(absoluteUrl)}`;
}

/**
 * True when a `/storage/...` path looks like a real file Laravel can serve.
 * Bare `/storage/{uuid}` (no folder, no extension) currently returns HTML from
 * the SPA catch-all and breaks next/image — prefer catalog/fallback instead.
 */
export function isUsableLaravelStoragePath(pathOrUrl: string): boolean {
  const path = laravelStoragePath(pathOrUrl);
  if (!path) return false;
  const pathname = path.split("?")[0] ?? path;
  // /storage/courses/foo.png or /storage/vendors/bar.png
  if (/^\/storage\/[^/]+\//.test(pathname)) return true;
  // /storage/something.png
  if (/\.[a-z0-9]+$/i.test(pathname)) return true;
  return false;
}

/**
 * Same-origin `/storage/...` path for a Laravel media reference, or null when the
 * value is not Laravel storage. The static export is served by Laravel itself and
 * has no Next proxy, so exported HTML must not hard-code the tunnel hostname.
 */
export function laravelStoragePath(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;

  if (raw.startsWith("/storage/")) return raw;
  if (raw.startsWith("storage/")) return `/${raw}`;

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const url = new URL(raw);
      if (url.pathname.startsWith("/storage/")) return `${url.pathname}${url.search}`;
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Normalize Laravel `image_path` values to a same-origin `/storage/...` path
 * (or leave external absolute URLs alone). Never bake a Laravel host into HTML —
 * the static export is served by Laravel on the same origin.
 */
export function resolveLaravelMediaPath(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const url = new URL(raw);
      if (url.pathname.startsWith("/storage/")) {
        return `${url.pathname}${url.search}`;
      }
      return raw;
    } catch {
      return null;
    }
  }

  if (raw.startsWith("/")) return raw;
  if (raw.startsWith("storage/")) return `/${raw}`;
  return `/storage/${raw}`;
}

const PUBLIC_COURSE_IMAGE_DIR = "/images/courses";
const PUBLIC_VENDOR_IMAGE_DIR = "/images/vendors";

function mediaBasename(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;

  let pathname = raw;
  if (/^https?:\/\//i.test(raw)) {
    try {
      pathname = new URL(raw).pathname;
    } catch {
      return null;
    }
  }

  const cleaned = pathname.replace(/^\/+/, "");
  const file = cleaned.split("/").filter(Boolean).pop();
  if (!file || file.includes("..")) return null;
  return file;
}

/**
 * Course `image_path` → display URL.
 * - Absolute http(s) URL: use as-is.
 * - Already under `/images/courses/`: use as-is.
 * - Otherwise (filename or `/…` path): `/images/courses/{filename}`.
 */
export function resolveCoursePublicImagePath(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith(`${PUBLIC_COURSE_IMAGE_DIR}/`)) return raw;

  const file = mediaBasename(raw);
  return file ? `${PUBLIC_COURSE_IMAGE_DIR}/${file}` : null;
}

/**
 * Vendor `vendor_logo_path` → display URL.
 * - Absolute http(s) URL: use as-is.
 * - Already under `/images/vendors/`: use as-is.
 * - Otherwise: `/images/vendors/{filename}`.
 */
export function resolveVendorPublicImagePath(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith(`${PUBLIC_VENDOR_IMAGE_DIR}/`)) return raw;

  const file = mediaBasename(raw);
  return file ? `${PUBLIC_VENDOR_IMAGE_DIR}/${file}` : null;
}
