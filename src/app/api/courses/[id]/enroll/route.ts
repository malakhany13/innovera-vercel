import { NextRequest, NextResponse } from "next/server";
import { parseEnrollmentPaymentResult } from "@/lib/enroll/enrollment-response";
import { parseEnrollBody, toLaravelEnrollBody } from "@/lib/enroll/parse";
import {
  CourseNotFoundError,
  getLaravelCourseId,
  resolveCourseByParam,
} from "@/lib/directus";
import { hasLaravelBackend } from "@/lib/laravel/config";
import { extractPaymentToken, proxyLaravelPost } from "@/lib/laravel/proxy";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * BFF: POST /api/courses/{courseId}/enroll
 * `courseId` may be Directus `id` or Directus `Course_ID`.
 * Proxies to Laravel: {LARAVEL_API_BASE_URL}/api/courses/{Course_ID}/enroll
 */
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

  const { id: courseIdParam } = await context.params;
  const courseId = courseIdParam?.trim();
  if (!courseId) {
    return NextResponse.json({ error: "Course id is required." }, { status: 400 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // course_slot_id must be a real active slot id from GET /api/courses/{id}
  // — never default it to the course id in the URL.
  const payload = parseEnrollBody(body);
  if (!payload) {
    return NextResponse.json(
      {
        error:
          "Invalid enrollment data. Full name, email, mobile number, course slot, academic details, and terms consent are required.",
      },
      { status: 400 },
    );
  }

  let laravelCourseId: string;
  try {
    const course = await resolveCourseByParam(courseId);
    laravelCourseId = getLaravelCourseId(course);
  } catch (error) {
    if (error instanceof CourseNotFoundError) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    console.error(`[POST /api/courses/${courseId}/enroll] resolve course`, error);
    return NextResponse.json(
      { error: "Unable to resolve course for enrollment." },
      { status: 502 },
    );
  }

  const laravelPath = `/api/courses/${encodeURIComponent(laravelCourseId)}/enroll`;

  const response = await proxyLaravelPost(laravelPath, toLaravelEnrollBody(payload));

  if (!response) {
    return NextResponse.json(
      { error: "Unable to reach Laravel enrollment API." },
      { status: 502 },
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const record = data as { message?: string; error?: string };
    const message = record.message ?? record.error ?? "Failed to submit enrollment";
    return NextResponse.json({ error: message, ...record }, { status: response.status });
  }

  const enrollment = parseEnrollmentPaymentResult(data);
  const paymentToken = enrollment.paymentToken ?? extractPaymentToken(data);

  return NextResponse.json(
    {
      success: true,
      payment_token: paymentToken ?? undefined,
      enrollment_id: enrollment.enrollmentId,
      course_payment_token: enrollment.coursePaymentToken,
      assessment_payment_token: enrollment.assessmentPaymentToken,
      payment_show_url: enrollment.paymentShowUrl,
      generated_mobile: enrollment.generatedMobile,
      generated_email: enrollment.generatedEmail,
      message: enrollment.message,
      data:
        data && typeof data === "object" && "data" in data
          ? (data as { data: unknown }).data
          : data,
    },
    { status: response.status },
  );
}
