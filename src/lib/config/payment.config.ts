/**
 * Browser payment API URL builder.
 *
 * next-dev / Node: same-origin `/api/payment/...` so the Next BFF
 * (`src/app/api/payment/[token]`) proxies Laravel — no CORS, no catch-all HTML.
 * Static export: relative (Laravel is the same origin).
 * Override with NEXT_PUBLIC_LARAVEL_API_BASE_URL / NEXT_PUBLIC_PAYMENT_API_BASE_URL
 * only when payment must hit another host from the browser.
 */
export function paymentApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  const isStaticExport =
    process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" ||
    process.env.NEXT_PUBLIC_CMS_ASSETS_LOCAL === "1";

  if (isStaticExport) {
    return normalized;
  }

  const explicit =
    process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_PAYMENT_API_BASE_URL?.trim() ||
    "";

  if (explicit) {
    return `${explicit.replace(/\/$/, "")}${normalized}`;
  }

  return normalized;
}

/**
 * Turn a Laravel `payment_show_url` (often absolute with APP_URL) into a
 * same-origin path like `/payment/{token}` for client navigation.
 */
export function toRelativePaymentPagePath(urlOrPath: string): string | null {
  const raw = urlOrPath.trim();
  if (!raw) return null;

  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      const { pathname, search, hash } = new URL(raw);
      return `${pathname}${search}${hash}` || null;
    }
  } catch {
    return null;
  }

  return raw.startsWith("/") ? raw : `/${raw}`;
}
