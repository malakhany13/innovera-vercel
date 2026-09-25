import { NextRequest, NextResponse } from "next/server";
import { hasLaravelBackend } from "@/lib/laravel/config";
import {
  sendForgotPasswordOtp,
  StudentAuthError,
  type ForgotPasswordSendOtpPayload,
} from "@/lib/laravel/student-auth";

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseBody(body: unknown): ForgotPasswordSendOtpPayload | null {
  if (!body || typeof body !== "object") return null;
  const email = asTrimmedString((body as Record<string, unknown>).email).toLowerCase();
  if (!email) return null;
  return { email };
}

/** BFF: POST /api/student/forgot-password/send-otp */
export async function POST(request: NextRequest) {
  if (!hasLaravelBackend()) {
    return NextResponse.json(
      {
        error:
          "Laravel API is not configured. Set LARAVEL_API_BASE_URL in .env.local.",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = parseBody(body);
  if (!payload) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    const result = await sendForgotPasswordOtp(payload);
    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("[POST /api/student/forgot-password/send-otp]", error);
    if (error instanceof StudentAuthError) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: error.status && error.status >= 400 ? error.status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Unable to send OTP." },
      { status: 502 },
    );
  }
}
