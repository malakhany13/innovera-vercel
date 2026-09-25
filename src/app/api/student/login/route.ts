import { NextRequest, NextResponse } from "next/server";
import { hasLaravelBackend } from "@/lib/laravel/config";
import {
  loginStudent,
  StudentAuthError,
  type StudentLoginPayload,
} from "@/lib/laravel/student-auth";

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseBody(body: unknown): StudentLoginPayload | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const email = asTrimmedString(record.email);
  const password =
    typeof record.password === "string" ? record.password : "";
  if (!email || !password) return null;
  return { email, password };
}

/** BFF: POST /api/student/login → Laravel POST /api/student/login */
export async function POST(request: NextRequest) {
  if (!hasLaravelBackend()) {
    return NextResponse.json(
      {
        error:
          "API is not configured. Set API_BASE_URL / NEXT_PUBLIC_API_BASE_URL in .env.local.",
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
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    const result = await loginStudent(payload);
    return NextResponse.json({
      message: result.message,
      student: result.student,
      token: result.token,
    });
  } catch (error) {
    console.error("[POST /api/student/login]", error);
    if (error instanceof StudentAuthError) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: error.status && error.status >= 400 ? error.status : 502 },
      );
    }
    return NextResponse.json({ error: "Unable to log in." }, { status: 502 });
  }
}
