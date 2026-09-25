import { getCourseImage } from "@/src/lib/directus";

export const FALLBACK_NEWS_IMAGE = "/images/placeholders/news.svg";
export const FALLBACK_EVENT_IMAGE = "/images/placeholders/event.svg";

/**
 * Same dynamic flow as CourseCard: `getCourseImage` → `/api/laravel-asset` → Laravel.
 * Normalization of `image_path` already happens in `normalizeLaravelNews` /
 * `normalizeLaravelEvent` (same as `normalizeLaravelCourse`).
 */
export function resolveNewsImage(image: string | null | undefined): string {
  if (!image?.trim()) return FALLBACK_NEWS_IMAGE;
  return getCourseImage(image.trim());
}

/** Same as {@link resolveNewsImage} / CourseCard — Laravel via `getCourseImage`. */
export function resolveEventImage(image: string | null | undefined): string {
  if (!image?.trim()) return FALLBACK_EVENT_IMAGE;
  return getCourseImage(image.trim());
}
