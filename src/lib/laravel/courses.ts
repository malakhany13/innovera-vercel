import type { Course, CourseWithLessonsResponse } from "@/features/directus/types";
import { extractActiveSlots } from "@/lib/enroll/slots";
import {
  hasLaravelBackend,
  isTimeoutError,
  LARAVEL_JSON_HEADERS,
  LARAVEL_REQUEST_TIMEOUT_MS,
  laravelFetchAttempts,
  laravelApiUrl,
} from "@/lib/laravel/config";
import {
  resolveCoursePublicImagePath,
  resolveVendorPublicImagePath,
} from "@/lib/laravel/media";
import { resolveCourseVendor } from "@/lib/vendors";

/** Raw course row from Laravel GET /api/v1/courses and GET /api/v1/courses/{id}. */
export interface LaravelCourseRow {
  id: number;
  title: string;
  category?: string | null;
  level?: string | null;
  hours?: number | null;
  format?: string | null;
  description?: string | null;
  price?: number | string | null;
  assessment_cost?: number | string | null;
  icon?: string | null;
  image_path?: string | null;
  features?: string | string[] | null;
  what_you_will_cover?: string | string[] | null;
  prerequisites?: string | string[] | null;
  hands_on?: boolean | string | string[] | null;
  vendor_key?: string | null;
  vendor_name?: string | null;
  vendor_logo_path?: string | null;
  /** Link to the syllabus PDF endpoint. Laravel never serializes the blob itself. */
  syllabus_url?: string | null;
  attachment?: string | null;
  is_active?: boolean | null;
  is_new?: boolean | null;
  show_enroll_button?: boolean | null;
  sort_order?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  active_slots?: unknown;
}

export class LaravelCoursesError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "LaravelCoursesError";
  }
}

function asOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  // Text entered on Windows arrives with CRLF. Normalise to LF so the exported
  // page data is identical regardless of how the files are later stored or
  // transferred: Next's length-prefixed text rows break if a CR is dropped.
  const trimmed = value.replace(/\r\n?/g, "\n").trim();
  return trimmed || null;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function asOptionalNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function parseToStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : String(item ?? "").trim()))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    return trimmed
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeHandsOn(value: LaravelCourseRow["hands_on"]): {
  items: string[];
  flag: boolean;
} {
  if (typeof value === "boolean") {
    return {
      items: value ? ["Hands-on labs and practical exercises included"] : [],
      flag: value,
    };
  }
  const items = parseToStringArray(value);
  return { items, flag: items.length > 0 };
}

/** Map a Laravel course row onto the app `Course` model used by existing UI. */
export function normalizeLaravelCourse(row: LaravelCourseRow): Course {
  const handsOn = normalizeHandsOn(row.hands_on);
  const vendorLogo = resolveVendorPublicImagePath(row.vendor_logo_path);
  const vendor = resolveCourseVendor({
    vendor_key: row.vendor_key,
    vendor_name: row.vendor_name,
    vendor_logo: vendorLogo,
    title: row.title,
  });

  const attachment =
    asOptionalString(row.syllabus_url) ?? asOptionalString(row.attachment);

  const id = asNumber(row.id);
  const courseId = id > 0 ? String(id) : null;
  const hours = asOptionalNumber(row.hours);

  return {
    id,
    courseId,
    track: asOptionalString(row.category) ?? "",
    title: asOptionalString(row.title) ?? "Untitled course",
    level: asOptionalString(row.level) ?? "",
    hours: hours ?? 0,
    format: asOptionalString(row.format) ?? "",
    // Relative image_path → /images/courses/{file}; absolute http(s) kept as-is.
    image: resolveCoursePublicImagePath(row.image_path),
    attachment,
    whatYouWillCover: parseToStringArray(row.what_you_will_cover),
    prerequisites: parseToStringArray(row.prerequisites),
    handsOn: handsOn.items,
    handsOnFlag: handsOn.flag,
    vendor,
    description: asOptionalString(row.description),
    price: asOptionalNumber(row.price),
    assessmentCost: asOptionalNumber(row.assessment_cost),
    icon: asOptionalString(row.icon),
    features: parseToStringArray(row.features),
    syllabusPdf: asOptionalString(row.syllabus_url),
    isActive: row.is_active !== false,
    isNew: Boolean(row.is_new),
    showEnrollButton: Boolean(row.show_enroll_button),
    sortOrder: asNumber(row.sort_order, 0),
  };
}

function isLaravelCourseRow(value: unknown): value is LaravelCourseRow {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      "title" in value,
  );
}

function extractCoursesArray(payload: unknown): LaravelCourseRow[] {
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;

  if (Array.isArray(record.courses)) {
    return record.courses.filter(isLaravelCourseRow);
  }
  if (Array.isArray(record.data)) {
    return record.data.filter(isLaravelCourseRow);
  }
  if (Array.isArray(payload)) {
    return payload.filter(isLaravelCourseRow);
  }
  return [];
}

function looksLikeNormalizedCourse(value: unknown): value is Course {
  return Boolean(
    value &&
      typeof value === "object" &&
      "title" in value &&
      ("whatYouWillCover" in value || "courseId" in value),
  );
}

/**
 * Accept Next BFF `Course[]` or Laravel `{ success, courses: [...] }` payloads.
 * Needed when the static export is served behind Laravel/ngrok and `/api/courses`
 * hits Laravel directly instead of the Next BFF.
 */
export function parseCoursesApiPayload(payload: unknown): Course[] {
  if (Array.isArray(payload)) {
    if (payload.length === 0) return [];
    if (looksLikeNormalizedCourse(payload[0])) {
      return payload.filter(looksLikeNormalizedCourse);
    }
    return payload.filter(isLaravelCourseRow).map(normalizeLaravelCourse);
  }

  return extractCoursesArray(payload).map(normalizeLaravelCourse);
}

function extractCourseRow(payload: unknown): LaravelCourseRow | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;

  if (isLaravelCourseRow(record.course)) return record.course;
  if (isLaravelCourseRow(record.data)) return record.data;
  if (isLaravelCourseRow(payload)) return payload;

  const list = extractCoursesArray(payload);
  return list[0] ?? null;
}

/**
 * Accept either course-detail shape and return the BFF's.
 *
 * The Next BFF answers `{ course, lessons, active_slots }` with `course`
 * already normalized. On the static export there is no BFF — Laravel answers
 * the same URL with a raw course row — so normalize that here instead of
 * casting, which would hand the UI a row with snake_case Laravel fields.
 */
export function parseCourseDetailPayload(
  payload: unknown,
): CourseWithLessonsResponse | null {
  const active_slots = extractActiveSlots(payload);

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (looksLikeNormalizedCourse(record.course)) {
      return {
        course: record.course,
        lessons: Array.isArray(record.lessons) ? record.lessons : [],
        active_slots,
      };
    }
  }

  const row = extractCourseRow(payload);
  if (!row) return null;

  return { course: normalizeLaravelCourse(row), lessons: [], active_slots };
}

async function laravelCoursesFetch(path: string): Promise<unknown> {
  if (!hasLaravelBackend()) {
    throw new LaravelCoursesError(
      "Laravel API is not configured. Set LARAVEL_API_BASE_URL in .env.local.",
      503,
    );
  }

  const url = laravelApiUrl(path);
  let lastError: LaravelCoursesError | null = null;

  // Ngrok tunnels can briefly 404/flake — retry a couple of times.
  for (let attempt = 0; attempt < laravelFetchAttempts(); attempt++) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: "GET",
        headers: LARAVEL_JSON_HEADERS,
        cache: "no-store",
        // A hung tunnel would otherwise block the request indefinitely and
        // stall page prerendering until the build-level timeout.
        signal: AbortSignal.timeout(LARAVEL_REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      // A tunnel that already timed out will not recover within the backoff.
      if (isTimeoutError(error)) {
        throw new LaravelCoursesError("Laravel courses API timed out.", 504);
      }
      lastError = new LaravelCoursesError("Unable to reach Laravel courses API.", 502);
      continue;
    }

    const payload: unknown = await response.json().catch(() => null);

    if (response.ok) {
      return payload;
    }

    const message =
      payload &&
      typeof payload === "object" &&
      typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : `Laravel courses request failed (${response.status})`;
    lastError = new LaravelCoursesError(message, response.status);

    // JSON 404 is a real missing route/resource — don't retry. Ngrok HTML 404s
    // parse as null and still retry with 502/503.
    const jsonNotFound = response.status === 404 && payload !== null;
    if (
      jsonNotFound ||
      (response.status !== 404 && response.status !== 502 && response.status !== 503)
    ) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
  }

  throw lastError ?? new LaravelCoursesError("Unable to load courses from Laravel.", 502);
}

function sortCourses(courses: Course[]): Course[] {
  return [...courses].sort((a, b) => {
    const sortDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    if (sortDiff !== 0) return sortDiff;
    return a.title.localeCompare(b.title);
  });
}

/** GET /api/v1/courses — active courses only, sorted. */
export async function fetchLaravelCourses(options?: {
  includeInactive?: boolean;
}): Promise<Course[]> {
  const payload = await laravelCoursesFetch("/api/v1/courses");
  const rows = extractCoursesArray(payload);
  const courses = rows
    .filter((row) => !row.deleted_at)
    .map(normalizeLaravelCourse)
    .filter((course) => options?.includeInactive || course.isActive !== false);

  return sortCourses(courses);
}

/** GET /api/v1/courses/{id} with list fallback. */
export async function fetchLaravelCourseById(id: string): Promise<Course | null> {
  const trimmed = id.trim();
  if (!trimmed) return null;

  try {
    const payload = await laravelCoursesFetch(
      `/api/v1/courses/${encodeURIComponent(trimmed)}`,
    );
    const row = extractCourseRow(payload);
    if (row) {
      const course = normalizeLaravelCourse(row);
      if (course.isActive === false) return null;
      return course;
    }
  } catch (error) {
    if (error instanceof LaravelCoursesError && error.status === 404) {
      return null;
    }
    // Fall through to list lookup when detail endpoint is unavailable.
    if (!(error instanceof LaravelCoursesError && (error.status === 502 || error.status === 503))) {
      // still try list
    }
  }

  const courses = await fetchLaravelCourses({ includeInactive: true });
  const match = courses.find(
    (course) =>
      String(course.id) === trimmed ||
      course.courseId === trimmed,
  );
  if (!match || match.isActive === false) return null;
  return match;
}
