import type { EnrollCoursePayload } from "@/features/directus/types";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function parseEnrollBody(body: unknown): EnrollCoursePayload | null {
  if (!body || typeof body !== "object") return null;

  const {
    full_name,
    mobile_number,
    email,
    course_slot_id,
    academic_year,
    college,
    role_in_tech,
    terms_consent,
    note,
  } = body as Record<string, unknown>;

  if (
    typeof full_name !== "string" ||
    typeof mobile_number !== "string" ||
    typeof email !== "string" ||
    (typeof course_slot_id !== "number" && typeof course_slot_id !== "string") ||
    typeof academic_year !== "string" ||
    typeof college !== "string" ||
    typeof role_in_tech !== "string" ||
    (terms_consent !== "1" && terms_consent !== "0")
  ) {
    return null;
  }

  const trimmedName = full_name.trim();
  const trimmedEmail = email.trim();
  const trimmedPhone = mobile_number.trim();
  const trimmedYear = academic_year.trim();
  const trimmedCollege = college.trim();
  const trimmedRole = role_in_tech.trim();

  if (
    !trimmedName ||
    !trimmedEmail ||
    !trimmedPhone ||
    !trimmedYear ||
    !trimmedCollege ||
    !trimmedRole ||
    !isValidEmail(trimmedEmail) ||
    terms_consent !== "1"
  ) {
    return null;
  }

  const trimmedNote = typeof note === "string" ? note.trim() : "";

  return {
    full_name: trimmedName,
    mobile_number: trimmedPhone,
    email: trimmedEmail,
    course_slot_id,
    academic_year: trimmedYear,
    college: trimmedCollege,
    role_in_tech: trimmedRole,
    terms_consent,
    ...(trimmedNote ? { note: trimmedNote } : {}),
  };
}

/**
 * Laravel receives course id in the URL and still requires `course_slot_id`
 * in the JSON body (selected active slot id from GET /api/courses/{id}).
 */
export function toLaravelEnrollBody(payload: EnrollCoursePayload) {
  return {
    full_name: payload.full_name,
    mobile_number: payload.mobile_number,
    email: payload.email,
    course_slot_id: payload.course_slot_id,
    academic_year: payload.academic_year,
    college: payload.college,
    role_in_tech: payload.role_in_tech,
    terms_consent: payload.terms_consent,
    ...(payload.note ? { note: payload.note } : {}),
  };
}
