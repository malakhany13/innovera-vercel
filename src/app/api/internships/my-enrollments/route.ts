import { NextRequest, NextResponse } from "next/server";
import { hasLaravelBackend } from "@/lib/laravel/config";
import {
  fetchMyInternshipEnrollments,
  InternshipEnrollmentsError,
} from "@/lib/laravel/internship-enrollments";

function extractBearerToken(request: NextRequest): string | null {
  const header =
    request.headers.get("authorization") ??
    request.headers.get("Authorization");
  if (header) {
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (match?.[1]?.trim()) return match[1].trim();
  }

  // Fallback: some runtimes strip Authorization on incoming Route Handler requests.
  const custom =
    request.headers.get("x-student-token") ??
    request.headers.get("X-Student-Token");
  return custom?.trim() || null;
}

/** BFF: GET /api/internships/my-enrollments → Laravel (Authorization: Bearer) */
export async function GET(request: NextRequest) {
  if (!hasLaravelBackend()) {
    return NextResponse.json(
      {
        error:
          "API is not configured. Set API_BASE_URL / NEXT_PUBLIC_API_BASE_URL in .env.local.",
      },
      { status: 503 },
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
    const enrollments = await fetchMyInternshipEnrollments(token);
    return NextResponse.json({
      success: true,
      data: enrollments,
    });
  } catch (error) {
    console.error("[GET /api/internships/my-enrollments]", error);
    if (error instanceof InternshipEnrollmentsError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status && error.status >= 400 ? error.status : 502 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Unable to load internship enrollments." },
      { status: 502 },
    );
  }
}
