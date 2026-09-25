import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import Config from "@/lib/config/app.config";
import { API_CONFIG } from "@/lib/config/api.config";
import { getPublicDirectusUrl, IS_STATIC_CMS } from "@/lib/config/directus.config";
import { parseCourseDetailPayload, parseCoursesApiPayload } from "@/lib/laravel/courses";
import { mapLaravelEventsPayload } from "@/lib/laravel/events";
import { mapLaravelNewsPayload } from "@/lib/laravel/news";
import {
  parseInternshipProgramsPayload,
  type InternshipProgram,
} from "@/lib/laravel/internship-programs";
import { isStaticExportRuntime } from "@/lib/laravel/public-api";
import {
  normalizeAboutPage,
  normalizeHomePage,
} from "@/features/directus/transforms";
import type {
  AboutPageContent,
  Course,
  CourseWithLessonsResponse,
  DirectusAboutPageItem,
  DirectusHomePageItem,
  DirectusListResponse,
  EnrollCourseMutationArg,
  EnrollCourseResponse,
  EventsPageContent,
  HomePageContent,
  NewsPageContent,
} from "@/features/directus/types";

/**
 * Unified RTK Query API (Magico-style).
 * Browser calls use {@link Config.BACK_END_URL} (Railway API host).
 * Static export hits `/api/v1/...` on the same backend origin.
 */
const baseQuery = fetchBaseQuery({
  baseUrl: Config.BACK_END_URL,
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

/** Next BFF path in next-dev; Laravel `/api/v1/...` on the static export. */
function laravelPublicPath(bffUnderApi: string, laravelV1Path: string): string {
  return isStaticExportRuntime() ? laravelV1Path : bffUnderApi;
}

function isNewsPageContent(value: unknown): value is NewsPageContent {
  return Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray((value as NewsPageContent).articles),
  );
}

function isEventsPageContent(value: unknown): value is EventsPageContent {
  return Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray((value as EventsPageContent).events),
  );
}

/** Absolute Directus URL (different host from BACK_END_URL). */
function directusUrl(path: string): string {
  const base = getPublicDirectusUrl().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

const staticCmsError: FetchBaseQueryError = {
  status: "CUSTOM_ERROR",
  error: "CMS content is prerendered in the static export",
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: [
    "Courses",
    "HomePage",
    "NewsPage",
    "EventsPage",
    "AboutPage",
    "Enrollments",
    "InternshipPrograms",
  ],
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], void>({
      query: () => laravelPublicPath("/api/courses", "/api/v1/courses"),
      transformResponse: (response: unknown) => parseCoursesApiPayload(response),
      providesTags: ["Courses"],
    }),

    getInternshipPrograms: builder.query<InternshipProgram[], void>({
      query: () =>
        laravelPublicPath(
          "/api/internship-programs",
          "/api/internship-programs",
        ),
      transformResponse: (response: unknown) =>
        parseInternshipProgramsPayload(response),
      providesTags: (result) =>
        result
          ? [
              { type: "InternshipPrograms", id: "LIST" },
              ...result.map(({ id }) => ({
                type: "InternshipPrograms" as const,
                id,
              })),
            ]
          : [{ type: "InternshipPrograms", id: "LIST" }],
      keepUnusedDataFor: 300,
    }),

    getCourseWithLessons: builder.query<CourseWithLessonsResponse, string | number>({
      queryFn: async (id, _api, _extra, baseQueryFn) => {
        const encoded = encodeURIComponent(String(id));
        const result = await baseQueryFn({
          url: laravelPublicPath(
            `/api/courses/${encoded}`,
            `/api/v1/courses/${encoded}`,
          ),
        });
        if (result.error) return { error: result.error };
        const course = parseCourseDetailPayload(result.data);
        if (!course) {
          return { error: { status: 404, data: "Course not found" } };
        }
        return { data: course };
      },
      providesTags: (_result, _error, id) => [{ type: "Courses", id: String(id) }],
    }),

    enrollInCourse: builder.mutation<EnrollCourseResponse, EnrollCourseMutationArg>({
      query: ({ courseId, ...body }) => {
        const encoded = encodeURIComponent(String(courseId));
        return {
          // Laravel enroll lives under `/api/courses/...` (BFF proxies the same path).
          url: `/api/courses/${encoded}/enroll`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Enrollments"],
    }),

    getNewsPage: builder.query<NewsPageContent, void>({
      query: () => laravelPublicPath("/api/news", "/api/v1/news"),
      transformResponse: (response: unknown) =>
        isNewsPageContent(response) ? response : mapLaravelNewsPayload(response),
      providesTags: ["NewsPage"],
    }),

    getEventsPage: builder.query<EventsPageContent, void>({
      query: () => laravelPublicPath("/api/events", "/api/v1/events"),
      transformResponse: (response: unknown) =>
        isEventsPageContent(response) ? response : mapLaravelEventsPayload(response),
      providesTags: ["EventsPage"],
    }),

    /** Directus CMS — absolute URL (not BACK_END_URL). */
    getHomePage: builder.query<HomePageContent, void>({
      queryFn: async (_arg, _api, _extra, baseQueryFn) => {
        if (IS_STATIC_CMS) return { error: staticCmsError };
        const result = await baseQueryFn({
          url: directusUrl(API_CONFIG.directus.endpoints.homePage),
        });
        if (result.error) return { error: result.error };
        const payload = result.data as DirectusListResponse<DirectusHomePageItem>;
        return { data: normalizeHomePage(payload.data ?? []) };
      },
      providesTags: ["HomePage"],
    }),

    /** Directus CMS — absolute URL (not BACK_END_URL). */
    getAboutPage: builder.query<AboutPageContent, void>({
      queryFn: async (_arg, _api, _extra, baseQueryFn) => {
        if (IS_STATIC_CMS) return { error: staticCmsError };
        const result = await baseQueryFn({
          url: directusUrl(API_CONFIG.directus.endpoints.aboutPage),
        });
        if (result.error) return { error: result.error };
        const payload = result.data as DirectusListResponse<DirectusAboutPageItem>;
        return { data: normalizeAboutPage(payload.data ?? []) };
      },
      providesTags: ["AboutPage"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseWithLessonsQuery,
  useEnrollInCourseMutation,
  useGetInternshipProgramsQuery,
  useLazyGetInternshipProgramsQuery,
  useGetHomePageQuery,
  useGetNewsPageQuery,
  useGetEventsPageQuery,
  useGetAboutPageQuery,
} = baseApi;

/** @deprecated Prefer `baseApi` — kept so existing imports keep working. */
export const directusApi = baseApi;
