import { NextRequest, NextResponse } from "next/server";
import { hasLaravelBackend } from "@/lib/laravel/config";
import {
  enrollInternshipProgram,
  InternshipEnrollError,
} from "@/lib/laravel/internship-enroll";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function extractBearerToken(request: NextRequest): string | null {
  const header =
    request.headers.get("authorization") ??
    request.headers.get("Authorization");
  if (header) {
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (match?.[1]?.trim()) return match[1].trim();
  }

  const custom =
    request.headers.get("x-student-token") ??
    request.headers.get("X-Student-Token");
  return custom?.trim() || null;
}

/** BFF: POST /api/internships/{id}/enroll → Laravel (Authorization: Bearer) */
export async function POST(request: NextRequest, context: RouteContext) {
  if (!hasLaravelBackend()) {
    return NextResponse.json(
      {
        error:
          "Laravel API is not configured. Set LARAVEL_API_BASE_URL in .env.local.",
      },
      { status: 503 },
    );
  }

  const { id } = await context.params;
  const programId = id?.trim();
  if (!programId) {
    return NextResponse.json(
      { error: "Internship program id is required." },
      { status: 400 },
    );
  }

  const token = extractBearerToken(request);
  if (!token) {
    return NextResponse.json(
      { error: "Authorization Bearer token is required." },
      { status: 401 },
    );
  }

  try {
    const result = await enrollInternshipProgram(programId, token);
    return NextResponse.json({
      success: true,
      payment_token: result.paymentToken,
      message: result.message ?? "Internship enrollment created successfully.",
    });
  } catch (error) {
    console.error(`[POST /api/internships/${programId}/enroll]`, error);
    if (error instanceof InternshipEnrollError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status && error.status >= 400 ? error.status : 502 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to enroll in internship program." },
      { status: 502 },
    );
  }
}
