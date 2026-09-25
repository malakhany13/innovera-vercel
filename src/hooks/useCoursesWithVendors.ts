import { useGetCoursesQuery } from "@/store/baseApi";

/** Courses from Laravel via BFF `/api/courses` (no Directus enrichment). */
export function useCoursesWithVendors() {
  return useGetCoursesQuery();
}
