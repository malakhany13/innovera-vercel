import type { EventsPageContent, EventsPageEvent } from "@/features/directus/types";
import {
  hasLaravelBackend,
  isTimeoutError,
  LARAVEL_JSON_HEADERS,
  LARAVEL_REQUEST_TIMEOUT_MS,
  laravelApiUrl,
  laravelFetchAttempts,
} from "@/lib/laravel/config";
import { resolveLaravelMediaPath } from "@/lib/laravel/media";
import { formatNewsDate } from "@/lib/laravel/news";

/** Raw event row from Laravel GET /api/v1/events. */
export interface LaravelEventRow {
  id: number;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  event_date?: string | null;
  location?: string | null;
  category?: string | null;
  link?: string | null;
  badge?: string | null;
  image_path?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export class LaravelEventsError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "LaravelEventsError";
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

function isLaravelEventRow(value: unknown): value is LaravelEventRow {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as LaravelEventRow).id === "number",
  );
}

function extractEventsArray(payload: unknown): LaravelEventRow[] {
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;

  if (Array.isArray(record.data)) {
    return record.data.filter(isLaravelEventRow);
  }
  if (Array.isArray(record.events)) {
    return record.events.filter(isLaravelEventRow);
  }
  if (Array.isArray(payload)) {
    return payload.filter(isLaravelEventRow);
  }
  return [];
}

/** Map a Laravel event row onto `EventsPageEvent`. */
export function normalizeLaravelEvent(row: LaravelEventRow, index = 0): EventsPageEvent {
  const id = asNumber(row.id);
  const description = asOptionalString(row.description) ?? "";

  return {
    id,
    externalId: id > 0 ? id : null,
    sort: index,
    title: asOptionalString(row.title) ?? "",
    date: formatNewsDate(row.event_date),
    location: asOptionalString(row.location) ?? "",
    category: asOptionalString(row.category) ?? "Event",
    description,
    content: asOptionalString(row.content) ?? description,
    link: asOptionalString(row.link) ?? "#",
    badge: asOptionalString(row.badge),
    image: resolveLaravelMediaPath(row.image_path),
  };
}

async function laravelEventsFetch(path: string): Promise<unknown> {
  if (!hasLaravelBackend()) {
    throw new LaravelEventsError(
      "API is not configured. Set API_BASE_URL / NEXT_PUBLIC_API_BASE_URL in .env.local.",
      503,
    );
  }

  const url = laravelApiUrl(path);
  let lastError: LaravelEventsError | null = null;

  for (let attempt = 0; attempt < laravelFetchAttempts(); attempt++) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: "GET",
        headers: LARAVEL_JSON_HEADERS,
        cache: "no-store",
        signal: AbortSignal.timeout(LARAVEL_REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      if (isTimeoutError(error)) {
        throw new LaravelEventsError("Laravel events API timed out.", 504);
      }
      lastError = new LaravelEventsError("Unable to reach Laravel events API.", 502);
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
        : `Laravel events request failed (${response.status})`;
    lastError = new LaravelEventsError(message, response.status);

    if (response.status !== 404 && response.status !== 502 && response.status !== 503) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
  }

  throw lastError ?? new LaravelEventsError("Unable to load events from Laravel.", 502);
}

/** Normalize a Laravel `/api/v1/events` JSON body into page content (browser-safe). */
export function mapLaravelEventsPayload(payload: unknown): EventsPageContent {
  const rows = extractEventsArray(payload)
    .filter((row) => !row.deleted_at)
    .filter((row) => row.is_active !== false);

  const events = rows.map((row, index) => normalizeLaravelEvent(row, index));

  return {
    hero: {
      badge: "Stay Connected",
      title: "Events & Conferences",
      description:
        "Join us at the forefront of technology. We participate in and host major events across Egypt and the region to share knowledge and innovate together.",
    },
    gridHeader: {
      title: "Upcoming Events",
    },
    events,
  };
}

/** GET /api/v1/events — active events only, preserving API order. */
export async function fetchLaravelEvents(): Promise<EventsPageContent> {
  return mapLaravelEventsPayload(await laravelEventsFetch("/api/v1/events"));
}
