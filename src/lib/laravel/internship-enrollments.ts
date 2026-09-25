import Config from "@/lib/config/app.config";
import { hasLaravelBackend, LARAVEL_JSON_HEADERS, laravelApiUrl } from "@/lib/laravel/config";
import type { InternshipEnrollment } from "@/lib/laravel/internship-enrollment-status";

export type { InternshipEnrollment } from "@/lib/laravel/internship-enrollment-status";
export {
  formatInterviewerStatusLabel,
  formatPaymentStatusLabel,
  isInternshipPaid,
} from "@/lib/laravel/internship-enrollment-status";

export class InternshipEnrollmentsError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "InternshipEnrollmentsError";
  }
}

function asTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function parseEnrollment(value: unknown): InternshipEnrollment | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const nestedProgram =
    record.program && typeof record.program === "object"
      ? (record.program as Record<string, unknown>)
      : null;

  const id = asNumber(record.id);
  const studentId =
    asNumber(record.student_id) ?? asNumber(record.studentId) ?? 0;
  const internshipProgramId =
    asNumber(record.internship_program_id) ??
    asNumber(record.internshipProgramId) ??
    asNumber(nestedProgram?.id) ??
    0;
  const email = asTrimmedString(record.email);
  const fullName =
    asTrimmedString(record.full_name) ??
    asTrimmedString(record.fullName) ??
    email;
  const title =
    asTrimmedString(record.internship_program_title) ??
    asTrimmedString(record.internshipProgramTitle) ??
    asTrimmedString(nestedProgram?.title) ??
    "Internship program";

  if (id == null || !fullName || !email) return null;

  return {
    id,
    studentId,
    internshipProgramId,
    internshipProgramTitle: title,
    fullName,
    mobileNumber:
      asTrimmedString(record.mobile_number) ??
      asTrimmedString(record.mobileNumber),
    email,
    internshipCost:
      asTrimmedString(record.internship_cost) ??
      asTrimmedString(record.internshipCost) ??
      "0",
    internshipPaymentStatus:
      (
        asTrimmedString(record.internship_payment_status) ??
        asTrimmedString(record.internshipPaymentStatus)
      )?.toLowerCase() ?? "pending",
    interviewerStatus:
      (
        asTrimmedString(record.interviewer_status) ??
        asTrimmedString(record.interviewerStatus)
      )?.toLowerCase() ?? "pending",
    note: asTrimmedString(record.note),
    paymentToken:
      asTrimmedString(record.payment_token) ??
      asTrimmedString(record.paymentToken),
    interviewUrl:
      asTrimmedString(record.interview_url) ??
      asTrimmedString(record.interviewUrl),
    totalScore: asNumber(record.total_score) ?? asNumber(record.totalScore),
    totalScoreMax:
      asNumber(record.total_score_max) ?? asNumber(record.totalScoreMax),
    createdAt:
      asTrimmedString(record.created_at) ?? asTrimmedString(record.createdAt),
    updatedAt:
      asTrimmedString(record.updated_at) ?? asTrimmedString(record.updatedAt),
  };
}

function extractEnrollments(payload: unknown): InternshipEnrollment[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  const data = root.data;

  if (Array.isArray(data)) {
    return data.map(parseEnrollment).filter((row): row is InternshipEnrollment => row != null);
  }

  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    if (Array.isArray(nested.data)) {
      return nested.data
        .map(parseEnrollment)
        .filter((row): row is InternshipEnrollment => row != null);
    }
  }

  return [];
}

/**
 * Parse Next BFF `{ data: Enrollment[] }` or Laravel paginated
 * `{ data: { data: [...] } }` (snake_case or camelCase rows).
 * Use from the browser when static export hits Laravel directly.
 */
export function parseInternshipEnrollmentsPayload(
  payload: unknown,
): InternshipEnrollment[] {
  return extractEnrollments(payload);
}

/** GET /api/internships/my-enrollments (Bearer token required). */
export async function fetchMyInternshipEnrollments(
  token: string,
): Promise<InternshipEnrollment[]> {
  if (!hasLaravelBackend()) {
    throw new InternshipEnrollmentsError(
      "Laravel API is not configured. Set LARAVEL_API_BASE_URL in .env.local.",
      503,
    );
  }

  const bearer = token.trim().replace(/^Bearer\s+/i, "");
  if (!bearer) {
    throw new InternshipEnrollmentsError("Authentication token is required.", 401);
  }

  let response: Response;
  try {
    response = await fetch(laravelApiUrl(Config.AUTH.myEnrollments), {
      method: "GET",
      headers: {
        ...LARAVEL_JSON_HEADERS,
        Authorization: `Bearer ${bearer}`,
        // Some proxies strip Authorization; Laravel can also read this custom header if configured.
        "X-Student-Token": bearer,
      },
      cache: "no-store",
    });
  } catch {
    throw new InternshipEnrollmentsError(
      "Unable to reach Laravel internship enrollments API.",
      502,
    );
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : `Failed to load enrollments (${response.status})`;

    const normalized = message.trim().toLowerCase();
    if (
      response.status === 401 ||
      normalized === "unauthenticated." ||
      normalized === "unauthenticated"
    ) {
      throw new InternshipEnrollmentsError(
        "Your session expired. Please log in again.",
        401,
      );
    }

    throw new InternshipEnrollmentsError(message, response.status);
  }

  return extractEnrollments(payload);
}
