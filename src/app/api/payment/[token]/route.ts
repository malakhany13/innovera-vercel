import { NextRequest } from "next/server";
import { handlePaymentGet, handlePaymentPost } from "@/lib/payment/bff-forward";

interface RouteContext {
  params: Promise<{ token: string }>;
}

/**
 * BFF: GET/POST /api/payment/{token}
 * Same shape as `/api/courses/[id]` so the root `[[...segments]]` page cannot
 * steal this path and return HTML to checkout.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  return handlePaymentGet(request, token);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  return handlePaymentPost(request, token);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
