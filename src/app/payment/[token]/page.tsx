import type { Metadata } from "next";
import PaymentPageClient from "@/components/payment/PaymentPageClient";
import { buildPageMetadata } from "@/lib/metadata";

interface PaymentPageProps {
  params: Promise<{ token: string }>;
}

/**
 * Static export cannot enumerate payment tokens at build time.
 * We emit a single shell at `/payment/fallback/` ; the host MUST rewrite
 * `/payment/{token}` → that HTML while keeping the browser URL so the
 * client can read the real token from the path.
 *
 * See docs/static-payment-hosting.md for required backend/web-server config.
 *
 * next-dev: `dynamicParams: true` so real payment links work locally.
 * `build:static` patches these to force-static / false (Next requires literals).
 */
export const dynamic = "force-static";
export const dynamicParams = true;

/** Shell segment used only for static export; not a real payment token. */
export const PAYMENT_STATIC_SHELL_TOKEN = "fallback";

export function generateStaticParams() {
  return [{ token: PAYMENT_STATIC_SHELL_TOKEN }, { token: "demo123" }];
}

export async function generateMetadata({ params }: PaymentPageProps): Promise<Metadata> {
  const { token } = await params;

  return buildPageMetadata({
    title: "Complete Payment",
    description: "Secure checkout for your Innovera Academy course enrollment.",
    path: `/payment/${token}`,
  });
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { token } = await params;

  return <PaymentPageClient token={token} />;
}
