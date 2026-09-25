import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentResultClient from "@/components/payment/PaymentResultClient";
import { buildPageMetadata } from "@/lib/metadata";

/**
 * Where PayTabs and Fawry return the student after checkout. Like the payment
 * page, the static export emits one shell (`/payment/fallback/result/`) and
 * Laravel serves it for every token while keeping the URL.
 *
 * next-dev: `dynamicParams: true` so real result links work locally.
 * `build:static` patches these to force-static / false (Next requires literals).
 */
export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
  return [{ token: "fallback" }];
}

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Payment Result",
    description: "The result of your Innovera payment.",
    path: "/payment/result",
  }),
  robots: { index: false, follow: false },
};

export default function PaymentResultPage() {
  // useSearchParams needs a Suspense boundary in a statically rendered page.
  return (
    <Suspense fallback={null}>
      <PaymentResultClient />
    </Suspense>
  );
}
