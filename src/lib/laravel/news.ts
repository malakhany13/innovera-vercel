import type { NewsPageArticle, NewsPageContent } from "@/features/directus/types";
import {
  hasLaravelBackend,
  isTimeoutError,
  LARAVEL_JSON_HEADERS,
  LARAVEL_REQUEST_TIMEOUT_MS,
  laravelApiUrl,
  laravelFetchAttempts,
} from "@/lib/laravel/config";
import { resolveLaravelMediaPath } from "@/lib/laravel/media";

/** Raw news row from Laravel GET /api/v1/news. */
export interface LaravelNewsRow {
  id: number;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  published_at?: string | null;
  category?: string | null;
  image_path?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export class LaravelNewsError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "LaravelNewsError";
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

function isLaravelNewsRow(value: unknown): value is LaravelNewsRow {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as LaravelNewsRow).id === "number",
  );
}

function extractNewsArray(payload: unknown): LaravelNewsRow[] {
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;

  if (Array.isArray(record.data)) {
    return record.data.filter(isLaravelNewsRow);
  }
  if (Array.isArray(record.news)) {
    return record.news.filter(isLaravelNewsRow);
  }
  if (Array.isArray(payload)) {
    return payload.filter(isLaravelNewsRow);
  }
  return [];
}

/** Format ISO date for display, e.g. "May 12, 2026". */
export function formatNewsDate(value: string | null | undefined): string {
  const raw = asOptionalString(value);
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Map a Laravel news row onto `NewsPageArticle`. */
export function normalizeLaravelNews(row: LaravelNewsRow, index = 0): NewsPageArticle {
  const id = asNumber(row.id);
  const excerpt = asOptionalString(row.excerpt) ?? "";
  const content = asOptionalString(row.content) ?? excerpt;

  return {
    id,
    externalId: id > 0 ? id : null,
    sort: index,
    title: asOptionalString(row.title) ?? "",
    date: formatNewsDate(row.published_at),
    category: asOptionalString(row.category) ?? "News",
    excerpt,
    content,
    image: resolveLaravelMediaPath(row.image_path),
    featured: index < 3,
    slug: asOptionalString(row.slug) ?? undefined,
  };
}

async function laravelNewsFetch(path: string): Promise<unknown> {
  if (!hasLaravelBackend()) {
    throw new LaravelNewsError(
      "API is not configured. Set API_BASE_URL / NEXT_PUBLIC_API_BASE_URL in .env.local.",
      503,
    );
  }

  const url = laravelApiUrl(path);
  let lastError: LaravelNewsError | null = null;

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
        throw new LaravelNewsError("Laravel news API timed out.", 504);
      }
      lastError = new LaravelNewsError("Unable to reach Laravel news API.", 502);
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
        : `Laravel news request failed (${response.status})`;
    lastError = new LaravelNewsError(message, response.status);

    if (response.status !== 404 && response.status !== 502 && response.status !== 503) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
  }

  throw lastError ?? new LaravelNewsError("Unable to load news from Laravel.", 502);
}

/** Normalize a Laravel `/api/v1/news` JSON body into page content (browser-safe). */
export function mapLaravelNewsPayload(payload: unknown): NewsPageContent {
  const rows = extractNewsArray(payload)
    .filter((row) => !row.deleted_at)
    .filter((row) => row.is_active !== false);

  const articles = rows.map((row, index) => normalizeLaravelNews(row, index));

  return {
    gridHeader: {
      id: 0,
      sort: 0,
      title: "Latest News",
      image: null,
    },
    articles,
  };
}

/** GET /api/v1/news — active articles only, preserving API order. */
export async function fetchLaravelNews(): Promise<NewsPageContent> {
  return mapLaravelNewsPayload(await laravelNewsFetch("/api/v1/news"));
}
