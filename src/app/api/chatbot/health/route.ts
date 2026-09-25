import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * AI chatbot temporarily disabled.
 * Previous implementation proxied GET → upstream health.php.
 */
export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Chatbot is temporarily disabled." },
    { status: 503 },
  );
}
