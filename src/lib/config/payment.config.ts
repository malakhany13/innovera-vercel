import Config from "@/lib/config/app.config";


export function paymentApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  const isStaticExport =
    process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" ||
    process.env.NEXT_PUBLIC_CMS_ASSETS_LOCAL === "1";

  if (isStaticExport) {
    return normalized;
  }

  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_PAYMENT_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL?.trim() ||
    Config.BACK_END_URL?.trim() ||
    "";

  if (base) {
    return `${base.replace(/\/$/, "")}${normalized}`;
  }

  return normalized;
}


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
