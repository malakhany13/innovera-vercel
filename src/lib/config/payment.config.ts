/**
 * Browser payment API URL builder.
 *
 * Prefers NEXT_PUBLIC_API_BASE_URL (Railway). Falls back to same-origin
 * `/api/payment/...` (Next BFF) when unset. Static export stays relative.
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
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_PAYMENT_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL?.trim() ||
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
