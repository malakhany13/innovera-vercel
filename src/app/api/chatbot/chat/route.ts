import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * AI chatbot temporarily disabled.
 * Previous implementation proxied POST → upstream SSE chat.php.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Chatbot is temporarily disabled." },
    { status: 503 },
  );
}
