import { NextRequest, NextResponse } from "next/server";
import { hasLaravelBackend } from "@/lib/laravel/config";
import {
  resetForgotPassword,
  StudentAuthError,
  type ForgotPasswordResetPayload,
} from "@/lib/laravel/student-auth";

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseBody(body: unknown): ForgotPasswordResetPayload | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const email = asTrimmedString(record.email).toLowerCase();
  const otp = asTrimmedString(record.otp);
  const password = typeof record.password === "string" ? record.password : "";
  const passwordConfirmation =
    typeof record.password_confirmation === "string"
      ? record.password_confirmation
      : "";
  if (!email || !otp || !password || !passwordConfirmation) return null;
  return {
    email,
    otp,
    password,
    password_confirmation: passwordConfirmation,
  };
}

/** BFF: POST /api/student/forgot-password/reset */
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
    return NextResponse.json(
      {
        error:
          "Email, OTP, password, and password confirmation are required.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await resetForgotPassword(payload);
    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("[POST /api/student/forgot-password/reset]", error);
    if (error instanceof StudentAuthError) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: error.status && error.status >= 400 ? error.status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Unable to reset password." },
      { status: 502 },
    );
  }
}
