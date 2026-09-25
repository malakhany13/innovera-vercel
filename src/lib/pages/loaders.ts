import { getCoursesWithVendors, getEventsPage, getNewsPage } from "@/lib/directus";
import type {
  Course,
  EventsPageContent,
  NewsPageContent,
} from "@/features/directus/types";

export interface CourseCatalogLoadResult {
  initialCourses: Course[];
  fetchError: boolean;
}

export interface EventsPageLoadResult {
  initialEventsPage: EventsPageContent | null;
  fetchError: boolean;
}

export interface NewsPageLoadResult {
  initialNewsPage: NewsPageContent | null;
  fetchError: boolean;
}

/** Skip remote prerender fetches — client RTK loads the data after hydration. */
export function skipRemotePrerender(): boolean {
  return (
    process.env.NEXT_STATIC_EXPORT === "1" ||
    process.env.NEXT_PUBLIC_STATIC_EXPORT === "1" ||
    process.env.NEXT_PHASE === "phase-production-build"
  );
}

/** Shared loader for `/training` and `/courses` — Laravel backend only. */
export async function loadCourseCatalog(): Promise<CourseCatalogLoadResult> {
  // Static HTML export: do not block prerender on Laravel (often down / slow).
  // TrainingCatalog always refetches via RTK on the client.
  if (skipRemotePrerender()) {
    return { initialCourses: [], fetchError: false };
  }

  try {
    return {
      initialCourses: await getCoursesWithVendors(),
      fetchError: false,
    };
  } catch (error) {
    console.error("[loadCourseCatalog] Laravel courses fetch failed", error);
    return {
      initialCourses: [],
      fetchError: true,
    };
  }
}

/** Loader for `/events` — Laravel backend via BFF, same pattern as courses. */
export async function loadEventsPage(): Promise<EventsPageLoadResult> {
  if (skipRemotePrerender()) {
    return { initialEventsPage: null, fetchError: false };
  }

  try {
    return {
      initialEventsPage: await getEventsPage(),
      fetchError: false,
    };
  } catch (error) {
    console.error("[loadEventsPage] Laravel events fetch failed", error);
    return {
      initialEventsPage: null,
      fetchError: true,
    };
  }
}

/** Loader for `/news` — Laravel backend via BFF, same pattern as courses/events. */
export async function loadNewsPage(): Promise<NewsPageLoadResult> {
  if (skipRemotePrerender()) {
    return { initialNewsPage: null, fetchError: false };
  }

  try {
    return {
      initialNewsPage: await getNewsPage(),
      fetchError: false,
    };
  } catch (error) {
    console.error("[loadNewsPage] Laravel news fetch failed", error);
    return {
      initialNewsPage: null,
      fetchError: true,
    };
  }
}
