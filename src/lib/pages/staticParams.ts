import { fetchLaravelCourses } from "@/lib/laravel/courses";
import { COURSE_SHELL_ROUTES } from "@/lib/pages/courseShell";
import { skipRemotePrerender } from "@/lib/pages/loaders";

export const STATIC_PAGE_SLUGS = [
  "contact",
  "internship",
  "login",
  "signup",
  "forgot-password",
  "account",
  "gallery",
  "how-to-buy",
  "privacy",
  "terms",
  "cookies",
] as const;

export const CMS_PAGE_SLUGS = [
  "services",
  "partners",
  "about",
  "academy",
  "events",
  "news",
] as const;

export type StaticPageSlug = (typeof STATIC_PAGE_SLUGS)[number];
export type CmsPageSlug = (typeof CMS_PAGE_SLUGS)[number];

/**
 * Enumerate every route the catch-all should statically generate at build time.
 * Kept in a page-free module so `generateStaticParams` does not compile every UI.
 * Static export patches `dynamicParams` to false so only these paths exist.
 */
export async function generateAllStaticParams(): Promise<{ segments: string[] }[]> {
  const params: { segments: string[] }[] = [
    { segments: [] },
    { segments: ["training"] },
    { segments: ["courses"] },
  ];

  for (const slug of STATIC_PAGE_SLUGS) {
    params.push({ segments: [slug] });
  }
  params.push({ segments: ["forgot-password", "otp"] });
  params.push({ segments: ["forgot-password", "reset"] });
  params.push({ segments: ["internship", "terms"] });
  for (const slug of CMS_PAGE_SLUGS) {
    params.push({ segments: [slug] });
  }

  // Shell pages for course ids the build does not know about. Emitted in every
  // environment so the export always has them, even if Laravel is unreachable
  // below and no real course pages get generated at all.
  for (const segments of COURSE_SHELL_ROUTES) {
    params.push({ segments: [...segments] });
  }

  // Static HTML export: do not call Laravel at build time. Course detail/enroll
  // pages are served via the fallback shell and fetched client-side only.
  // Route Handlers under /api/* are stashed by `build:static` and must not be
  // registered as build paths.
  if (skipRemotePrerender() || process.env.NODE_ENV === "development") {
    return params;
  }

  try {
    const courses = await fetchLaravelCourses();
    for (const course of courses) {
      const id = String(course.id);
      params.push({ segments: ["courses", id] });
      params.push({ segments: ["courses", "enroll", id] });
      params.push({ segments: ["training", "enroll", id] });
    }
  } catch {
    // Build continues with the statically known routes if Laravel is unreachable.
  }

  return params;
}
