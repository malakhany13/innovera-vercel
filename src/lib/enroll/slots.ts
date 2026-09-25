/** Active course slot from Laravel GET /api/courses/{courseId}. */
import { fetchPublicJson } from "@/lib/laravel/public-api";

export interface CourseActiveSlot {
  id: number;
  format?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  sessions_per_week?: number | null;
  session_length_minutes?: number | null;
  max_enrollments?: number | null;
  current_enrollments?: number | null;
  is_active?: boolean | null;
}

function asSlotId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.trunc(value);
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed) && parsed > 0) return Math.trunc(parsed);
  }
  return null;
}

function asOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function asOptionalNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function asOptionalBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  return null;
}

function formatSlotDate(value: string | null | undefined, options?: Intl.DateTimeFormatOptions): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, options ?? {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatFormatLabel(format: string | null | undefined): string | null {
  if (!format) return null;
  return format
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Title shown on the slot card, e.g. "Hybrid Format". */
export function formatSlotTitle(slot: CourseActiveSlot): string {
  const format = formatFormatLabel(slot.format);
  if (!format) return `Slot #${slot.id}`;
  return format.toLowerCase().endsWith("format") ? format : `${format} Format`;
}

/** Date range like "Jul 31 - Aug 31, 2026". */
export function formatSlotDateRange(slot: CourseActiveSlot): string | null {
  const fromDate = slot.date_from ? new Date(slot.date_from) : null;
  const toDate = slot.date_to ? new Date(slot.date_to) : null;
  const fromOk = fromDate && !Number.isNaN(fromDate.getTime());
  const toOk = toDate && !Number.isNaN(toDate.getTime());

  if (fromOk && toOk) {
    const sameYear = fromDate.getFullYear() === toDate.getFullYear();
    const from = fromDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      ...(sameYear ? {} : { year: "numeric" }),
    });
    const to = toDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${from} - ${to}`;
  }

  const from = formatSlotDate(slot.date_from);
  const to = formatSlotDate(slot.date_to);
  if (from && to) return `${from} - ${to}`;
  if (from) return `From ${from}`;
  if (to) return `Until ${to}`;
  return null;
}

/** Session summary like "2 sessions/week, 240 min each". */
export function formatSlotSessions(slot: CourseActiveSlot): string | null {
  const parts: string[] = [];

  if (slot.sessions_per_week != null && slot.sessions_per_week > 0) {
    parts.push(
      `${slot.sessions_per_week} session${slot.sessions_per_week === 1 ? "" : "s"}/week`,
    );
  }

  if (
    slot.session_length_minutes != null &&
    Number.isFinite(slot.session_length_minutes) &&
    slot.session_length_minutes > 0
  ) {
    parts.push(`${slot.session_length_minutes} min each`);
  }

  return parts.length > 0 ? parts.join(", ") : null;
}

/** Remaining seats for the availability badge. */
export function getSlotSeatsAvailable(slot: CourseActiveSlot): number | null {
  if (
    slot.max_enrollments == null ||
    !Number.isFinite(slot.max_enrollments) ||
    slot.max_enrollments < 0
  ) {
    return null;
  }
  const current =
    slot.current_enrollments != null && Number.isFinite(slot.current_enrollments)
      ? Math.max(0, slot.current_enrollments)
      : 0;
  return Math.max(0, slot.max_enrollments - current);
}

/** Human-readable label for a course slot option. */
export function formatSlotLabel(slot: CourseActiveSlot): string {
  const parts: string[] = [];

  parts.push(formatSlotTitle(slot));

  const range = formatSlotDateRange(slot);
  if (range) parts.push(range);

  const sessions = formatSlotSessions(slot);
  if (sessions) parts.push(sessions);

  const seats = getSlotSeatsAvailable(slot);
  if (seats != null) {
    parts.push(`${seats} Available`);
  }

  return parts.length > 0 ? parts.join(" · ") : `Slot #${slot.id}`;
}

function parseSlotObject(item: Record<string, unknown>): CourseActiveSlot | null {
  const id = asSlotId(item.id);
  if (id === null) return null;

  return {
    id,
    format: asOptionalString(item.format),
    date_from: asOptionalString(item.date_from ?? item.dateFrom),
    date_to: asOptionalString(item.date_to ?? item.dateTo),
    sessions_per_week: asOptionalNumber(
      item.sessions_per_week ?? item.sessionsPerWeek,
    ),
    session_length_minutes: asOptionalNumber(
      item.session_length_minutes ?? item.sessionLengthMinutes,
    ),
    max_enrollments: asOptionalNumber(item.max_enrollments ?? item.maxEnrollments),
    current_enrollments: asOptionalNumber(
      item.current_enrollments ?? item.currentEnrollments,
    ),
    is_active: asOptionalBoolean(item.is_active ?? item.isActive),
  };
}

/** Pull `active_slots` from Laravel (or merged) course JSON. */
export function extractActiveSlots(payload: unknown): CourseActiveSlot[] {
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;
  const course =
    record.course && typeof record.course === "object"
      ? (record.course as Record<string, unknown>)
      : null;

  const raw =
    record.active_slots ??
    record.activeSlots ??
    nested?.active_slots ??
    nested?.activeSlots ??
    course?.active_slots ??
    course?.activeSlots;

  if (!Array.isArray(raw)) return [];

  const slots: CourseActiveSlot[] = [];
  const seen = new Set<number>();

  for (const item of raw) {
    if (item && typeof item === "object") {
      const slot = parseSlotObject(item as Record<string, unknown>);
      if (!slot || seen.has(slot.id)) continue;
      seen.add(slot.id);
      slots.push(slot);
      continue;
    }

    const id = asSlotId(item);
    if (id === null || seen.has(id)) continue;
    seen.add(id);
    slots.push({ id });
  }

  return slots;
}

/**
 * Browser: load active slots for a course.
 * next-dev: Next BFF `/api/courses/{id}` (merges Laravel slots).
 * Static export: Laravel `/api/v1/courses/{id}` only (no BFF in the export).
 * Pass Directus `Course_ID` (Laravel id), not Directus auto-increment `id`.
 */
export async function fetchCourseActiveSlots(
  courseId: string | number,
): Promise<CourseActiveSlot[]> {
  const encodedId = encodeURIComponent(String(courseId));
  const result = await fetchPublicJson({
    bffPath: `/courses/${encodedId}`,
    laravelPath: `/api/v1/courses/${encodedId}`,
    errorLabel: "Unable to load course slots.",
  });

  if (!result.ok) {
    throw new Error(result.message);
  }

  return extractActiveSlots(result.payload);
}
