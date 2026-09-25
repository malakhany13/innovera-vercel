import { NextRequest } from "next/server";
import { handlePaymentGet, handlePaymentPost } from "@/lib/payment/bff-forward";

interface RouteContext {
  params: Promise<{ token: string; path: string[] }>;
}

/**
 * BFF: /api/payment/{token}/paytabs|fawry|status|apply-voucher|…
 * Nested under `[token]` so it wins over the site catch-all HTML page.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { token, path } = await context.params;
  return handlePaymentGet(request, token, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { token, path } = await context.params;
  return handlePaymentPost(request, token, path);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
