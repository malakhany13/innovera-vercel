import { API_CONFIG } from "@/lib/config/api.config";
import { PUBLIC_DIRECTUS_URL } from "@/lib/config/directus.config";
import { directusAdminFetch, DirectusRequestError } from "@/lib/directus-admin";
import {
  normalizeAboutPage,
  normalizeAcademyPage,
  emptyAcademyPageContent,
  normalizeHomePage,
  normalizePartnersPage,
  normalizeServicesPage,
} from "@/features/directus/transforms";
import type {
  AboutPageContent,
  AcademyPageContent,
  Course,
  DirectusAboutPageItem,
  DirectusAcademyPageItem,
  DirectusHomePageItem,
  DirectusListResponse,
  DirectusPartnersPageItem,
  DirectusServicesPageItem,
  EventsPageContent,
  HomePageContent,
  Lesson,
  NewsPageContent,
  PartnersPageContent,
  ServicesPageContent,
} from "@/features/directus/types";
import cmsAssetMap from "@/generated/cms-asset-map.json";
import {
  isCmsAssetsLocalMode,
  resolveLocalCmsAssetUrl,
  type CmsAssetMap,
} from "@/lib/cms-assets/local";
import { extractDirectusAssetId } from "@/lib/cms-assets/parse-asset-ref";
import { fetchLaravelNews } from "@/lib/laravel/news";
import { fetchLaravelEvents } from "@/lib/laravel/events";
import {
  fetchLaravelCourseById,
  fetchLaravelCourses,
  LaravelCoursesError,
} from "@/lib/laravel/courses";
import {
  isLaravelStorageUrl,
  isUsableLaravelStoragePath,
  laravelAssetProxyUrl,
  laravelStoragePath,
} from "@/lib/laravel/media";
import { laravelApiUrl, LARAVEL_API_BASE_URL } from "@/lib/laravel/config";

/**
 * Public Directus URL for client-side asset links (images).
 * From NEXT_PUBLIC_DIRECTUS_URL — set this in production (not localhost).
 */
export const DIRECTUS_URL = PUBLIC_DIRECTUS_URL;

export const FALLBACK_COURSE_IMAGE =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800";

export const FALLBACK_COURSE_IMAGE_ALT =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800";

const LOCAL_ASSET_MAP = cmsAssetMap as CmsAssetMap;

/**
 * Build a Directus asset URL with optional transform params.
 * Always returns an absolute Directus URL — never `/api/directus/...`.
 * The Next rewrite proxy only exists when a Next server is running; static
 * export (`out/`) has no rewrites, so proxy paths break in production HTML.
 *
 * During `build:static` (`NEXT_STATIC_EXPORT` / `NEXT_PUBLIC_CMS_ASSETS_LOCAL`),
 * returns a local `/cms-images/...` path from the build-time asset map instead.
 */
export function getAssetUrl(id: string, params?: { width?: number; height?: number }): string {
  if (isCmsAssetsLocalMode()) {
    const assetId = extractDirectusAssetId(id);
    if (!assetId) {
      // Not a Directus asset (e.g. a Laravel `storage/...` reference). Laravel
      // serves the export, so keep those same-origin rather than failing.
      return laravelStoragePath(id) ?? id.trim();
    }
    const local = resolveLocalCmsAssetUrl(assetId, LOCAL_ASSET_MAP);
    if (local) return local;
    throw new Error(
      `[cms-assets] Missing local asset for id "${assetId}". Re-run the static asset download step.`,
    );
  }

  const search = new URLSearchParams();
  if (params?.width) search.set("width", String(params.width));
  if (params?.height) search.set("height", String(params.height));
  const query = search.toString();
  const assetPath = query ? `/assets/${id}?${query}` : `/assets/${id}`;
  return `${DIRECTUS_URL}${assetPath}`;
}

export function getCourseImage(image: string | null, params?: { width?: number; height?: number }): string {
  if (!image) return FALLBACK_COURSE_IMAGE;

  // Static files under public/images (courses, vendors, partners, …)
  if (image.startsWith("/images/")) return image;

  if (isCmsAssetsLocalMode()) {
    if (image.startsWith("/cms-images/")) return image;
    // Laravel hosts both the export and `/storage/...`, so stay same-origin
    // instead of baking in the (rotating) tunnel hostname.
    const storagePath = laravelStoragePath(image);
    if (storagePath) return storagePath;
    const assetId = extractDirectusAssetId(image);
    if (assetId) {
      const local = resolveLocalCmsAssetUrl(assetId, LOCAL_ASSET_MAP);
      if (local) return local;
      throw new Error(
        `[cms-assets] Missing local asset for id "${assetId}". Re-run the static asset download step.`,
      );
    }
    // External non-Directus URLs (Unsplash, CDNs) stay as-is.
    if (image.startsWith("http")) {
      // During static export there is no Next API proxy — keep absolute URL.
      return image;
    }
  }

  // Courses / news / events storage URLs (absolute or `/storage/...`) → BFF proxy.
  // Skip bare `/storage/{uuid}` — Laravel SPA returns HTML and next/image 400s.
  const storagePath = laravelStoragePath(image);
  if (storagePath && LARAVEL_API_BASE_URL) {
    if (!isUsableLaravelStoragePath(storagePath)) {
      return FALLBACK_COURSE_IMAGE;
    }
    return laravelAssetProxyUrl(laravelApiUrl(storagePath));
  }
  if (isLaravelStorageUrl(image)) {
    if (!isUsableLaravelStoragePath(image)) {
      return FALLBACK_COURSE_IMAGE;
    }
    return laravelAssetProxyUrl(image);
  }

  if (image.startsWith("http")) return image;
  return getAssetUrl(image, params);
}

export class CourseNotFoundError extends Error {
  constructor(id: string) {
    super(`Course not found: ${id}`);
    this.name = "CourseNotFoundError";
  }
}

async function directusFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return directusAdminFetch<T>(path, init);
}

/** Fetch normalized home page CMS content with ISR (60s). */
export async function getHomePage(): Promise<HomePageContent> {
  const response = await directusFetch<DirectusListResponse<DirectusHomePageItem>>(
    API_CONFIG.directus.endpoints.homePage,
  );
  return normalizeHomePage(response.data ?? []);
}

/** Fetch normalized about page CMS content. */
export async function getAboutPage(): Promise<AboutPageContent> {
  const response = await directusFetch<DirectusListResponse<DirectusAboutPageItem>>(
    API_CONFIG.directus.endpoints.aboutPage,
    process.env.NODE_ENV === "development" ? { cache: "no-store" } : undefined,
  );
  return normalizeAboutPage(response.data ?? []);
}

/** Fetch normalized academy page CMS content. */
export async function getAcademyPage(): Promise<AcademyPageContent> {
  try {
    const response = await directusFetch<DirectusListResponse<DirectusAcademyPageItem>>(
      API_CONFIG.directus.endpoints.academyPage,
      process.env.NODE_ENV === "development" ? { cache: "no-store" } : undefined,
    );
    return normalizeAcademyPage(response.data ?? []);
  } catch (error) {
    if (error instanceof DirectusRequestError && error.status === 403) {
      console.warn(
        "[getAcademyPage] Directus returned 403 — grant read access on Academy_page for DIRECTUS_ADMIN_TOKEN.",
      );
      return emptyAcademyPageContent();
    }
    throw error;
  }
}

/** Fetch normalized events page content from Laravel GET /api/v1/events. */
export async function getEventsPage(): Promise<EventsPageContent> {
  return fetchLaravelEvents();
}

/** Fetch normalized news page content from Laravel GET /api/v1/news. */
export async function getNewsPage(): Promise<NewsPageContent> {
  return fetchLaravelNews();
}

/** Fetch normalized partners page CMS content. */
export async function getPartnersPage(): Promise<PartnersPageContent> {
  const response = await directusFetch<DirectusListResponse<DirectusPartnersPageItem>>(
    API_CONFIG.directus.endpoints.partnersPage,
  );
  return normalizePartnersPage(response.data ?? []);
}

/** Fetch normalized services page CMS content from Directus `Services_Page`. */
export async function getServicesPage(): Promise<ServicesPageContent> {
  const response = await directusFetch<DirectusListResponse<DirectusServicesPageItem>>(
    API_CONFIG.directus.endpoints.servicesPage,
  );
  return normalizeServicesPage(response.data ?? []);
}

/** Fetch all active courses from the Laravel backend API. */
export async function getCourses(): Promise<Course[]> {
  return fetchLaravelCourses();
}

/** Courses from Laravel (vendor logos come from API `vendor_logo_path`). */
export async function getCoursesWithVendors(): Promise<Course[]> {
  return fetchLaravelCourses();
}

/** Fetch a single course by Laravel id. Throws {@link CourseNotFoundError} when missing. */
export async function getCourseById(id: string): Promise<Course> {
  try {
    const course = await fetchLaravelCourseById(id);
    if (!course) throw new CourseNotFoundError(id);
    return course;
  } catch (error) {
    if (error instanceof CourseNotFoundError) throw error;
    if (error instanceof LaravelCoursesError && error.status === 404) {
      throw new CourseNotFoundError(id);
    }
    throw error;
  }
}

/**
 * Laravel / enrollment id for a course.
 * Prefer explicit `courseId`; fall back to numeric `id`.
 */
export function getLaravelCourseId(course: Pick<Course, "id" | "courseId">): string {
  const fromField = course.courseId?.trim();
  return fromField || String(course.id);
}

/** Look up a course by Laravel course id. */
export async function getCourseByLaravelCourseId(courseId: string): Promise<Course | null> {
  const trimmed = courseId.trim();
  if (!trimmed) return null;
  return fetchLaravelCourseById(trimmed);
}

/** Resolve a course from a URL/API param (Laravel course id). */
export async function resolveCourseByParam(id: string): Promise<Course> {
  const trimmed = id.trim();
  if (!trimmed) throw new CourseNotFoundError(id);

  const course = await fetchLaravelCourseById(trimmed);
  if (!course) throw new CourseNotFoundError(trimmed);
  return course;
}

export interface CourseWithLessons {
  course: Course;
  lessons: Lesson[];
}

/** Fetch a course from Laravel (lessons are not provided by the courses API). */
export async function getCourseWithLessons(id: string): Promise<CourseWithLessons> {
  const course = await resolveCourseByParam(id);
  return { course, lessons: [] };
}

/** Lessons are not sourced for Laravel courses — always empty. */
export async function getLessons(_courseId: string): Promise<Lesson[]> {
  return [];
}

/** SEO-friendly description derived from course content fields. */
export function getCourseDescription(course: Course): string {
  if (course.description?.trim()) return course.description.trim();
  if (course.whatYouWillCover.length > 0) {
    return course.whatYouWillCover.slice(0, 3).join(". ");
  }
  return `${course.track} training — ${course.level}, ${course.hours} hours, ${course.format}.`;
}
