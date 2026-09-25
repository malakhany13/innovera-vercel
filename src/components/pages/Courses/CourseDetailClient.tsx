"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Course, Lesson } from "@/features/directus/types";
import {
  useGetCourseWithLessonsQuery,
  useGetCoursesQuery,
} from "@/src/hooks";
import CourseDetailView from "./CourseDetailView";

interface CourseDetailClientProps {
  /** Build-time/server-rendered course — first paint, and the offline fallback. */
  initialCourse: Course;
  lessons?: Lesson[];
}

function courseKey(course: Pick<Course, "id" | "courseId">): string {
  return String(course.courseId ?? course.id ?? "");
}

/**
 * Live detail prefers GET /api/courses/{id} (includes Laravel `features`).
 * Falls back to the catalog row, then the prerendered course.
 */
export default function CourseDetailClient({
  initialCourse,
  lessons = [],
}: CourseDetailClientProps) {
  const key = courseKey(initialCourse);

  const { data: detailData } = useGetCourseWithLessonsQuery(key, {
    skip: !key,
    refetchOnMountOrArgChange: true,
  });

  const { data: catalog, isSuccess: catalogReady } = useGetCoursesQuery(undefined, {
    skip: Boolean(detailData?.course) || !key,
    refetchOnMountOrArgChange: true,
  });

  const catalogMatch = useMemo(() => {
    if (!Array.isArray(catalog) || !key) return undefined;
    return catalog.find((candidate) => courseKey(candidate) === key) ?? null;
  }, [catalog, key]);

  const course = detailData?.course ?? catalogMatch ?? initialCourse;

  // Catalog loaded successfully but this course is gone from the dashboard.
  if (catalogReady && catalogMatch === null && !detailData?.course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">
            Course not available
          </h1>
          <p className="text-slate-500 mb-6">
            This course is no longer offered.
          </p>
          <Link
            href="/courses"
            className="inline-block px-6 py-2 bg-brand-cyan text-white font-medium rounded-full hover:bg-cyan-500 transition-colors"
          >
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CourseDetailView
      course={course}
      lessons={detailData?.lessons?.length ? detailData.lessons : lessons}
    />
  );
}
