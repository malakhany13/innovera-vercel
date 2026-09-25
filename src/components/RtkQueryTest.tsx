"use client";

import { useGetCoursesQuery } from "@/features/directus/directusApi";

/** Temporary smoke-test component — confirms RTK Query hooks work inside the Redux Provider. */
export default function RtkQueryTest() {
  const { data: coursesData, isLoading, isError } = useGetCoursesQuery();
  const courses = Array.isArray(coursesData) ? coursesData : [];

  if (isLoading) {
    return (
      <div className="bg-slate-100 border border-slate-200 text-slate-600 text-xs px-4 py-2 text-center">
        RTK Query: loading courses…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2 text-center">
        RTK Query: failed to fetch courses (is Directus running?)
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2 text-center">
      RTK Query OK — {courses.length} course{courses.length === 1 ? "" : "s"} loaded from Directus
    </div>
  );
}
