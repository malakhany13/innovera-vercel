import { NextRequest, NextResponse } from "next/server";
import { hasLaravelBackend } from "@/lib/laravel/config";
import {
  registerStudent,
  StudentAuthError,
  type StudentRegisterPayload,
} from "@/lib/laravel/student-auth";

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseBody(body: unknown): StudentRegisterPayload | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;

  const payload: StudentRegisterPayload = {
    full_name: asTrimmedString(record.full_name),
    email: asTrimmedString(record.email),
    password: typeof record.password === "string" ? record.password : "",
    password_confirmation:
      typeof record.password_confirmation === "string"
        ? record.password_confirmation
        : "",
    mobile_number: asTrimmedString(record.mobile_number),
    academic_year: asTrimmedString(record.academic_year),
    college: asTrimmedString(record.college),
    role_in_tech: asTrimmedString(record.role_in_tech),
  };

  if (
    !payload.full_name ||
    !payload.email ||
    !payload.password ||
    !payload.password_confirmation ||
    !payload.mobile_number ||
    !payload.academic_year ||
    !payload.college ||
    !payload.role_in_tech
  ) {
    return null;
  }

  return payload;
}

/** BFF: POST /api/student/register → backend POST /api/student/register */
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
      { error: "Please fill in all registration fields." },
      { status: 400 },
    );
  }

  if (payload.password !== payload.password_confirmation) {
    return NextResponse.json(
      { error: "Password confirmation does not match." },
      { status: 422 },
    );
  }

  try {
    const result = await registerStudent(payload);
    return NextResponse.json({
      message: result.message,
      student: result.student,
      token: result.token,
    });
  } catch (error) {
    console.error("[POST /api/student/register]", error);
    if (error instanceof StudentAuthError) {
      return NextResponse.json(
        { error: error.message, errors: error.errors },
        { status: error.status && error.status >= 400 ? error.status : 502 },
      );
    }
    return NextResponse.json(
      { error: "Unable to register student." },
      { status: 502 },
    );
  }
}
