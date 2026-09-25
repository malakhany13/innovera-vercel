import { NextRequest, NextResponse } from "next/server";
import { hasLaravelBackend } from "@/lib/laravel/config";
import {
  applyInternship,
  LaravelInternshipError,
  type InternshipApplyPayload,
} from "@/lib/laravel/internship";

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseBody(body: unknown): InternshipApplyPayload | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;

  const payload: InternshipApplyPayload = {
    name: asTrimmedString(record.name),
    email: asTrimmedString(record.email),
    phone: asTrimmedString(record.phone),
    whatsapp: asTrimmedString(record.whatsapp),
    university: asTrimmedString(record.university),
    major: asTrimmedString(record.major),
    level: asTrimmedString(record.level),
  };

  if (
    !payload.name ||
    !payload.email ||
    !payload.phone ||
    !payload.whatsapp ||
    !payload.university ||
    !payload.major ||
    !payload.level
  ) {
    return null;
  }

  return payload;
}

/** BFF: POST /api/internship/apply → Laravel POST /api/v1/internship/apply */
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
      { error: "Please fill in all internship form fields." },
      { status: 400 },
    );
  }

  try {
    const result = await applyInternship(payload);
    return NextResponse.json({
      success: true,
      data: {
        payment_token: result.paymentToken ?? result.assessmentPaymentToken ?? null,
        assessment_payment_token: result.assessmentPaymentToken ?? null,
        payment_show_url: result.paymentShowUrl ?? null,
        message: result.message ?? "Application submitted",
      },
      message: result.message ?? "Application submitted",
    });
  } catch (error) {
    console.error("[POST /api/internship/apply]", error);
    if (error instanceof LaravelInternshipError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          errors: error.errors,
        },
        { status: error.status && error.status >= 400 ? error.status : 502 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to submit internship application." },
      { status: 502 },
    );
  }
}
