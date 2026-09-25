"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetCourseWithLessonsQuery } from "@/features/directus/directusApi";
import { COURSE_STATIC_SHELL_ID, courseIdFromPathname } from "@/lib/pages/courseShell";
import TrainingCourseEnrollPage from "@/components/pages/Training/TrainingCourseEnrollPage";
import CourseDetailView from "./CourseDetailView";

/**
 * The shell rendered for a course that was not in the export.
 *
 * Nothing about the course is known at build time here — the id only exists in
 * the URL the visitor actually requested, which is why the id is read on the
 * client rather than passed in as a prop.
 */
interface CourseLiveShellProps {
  /** Which page the shell stands in for: `/courses/{id}` or an enroll route. */
  variant: "detail" | "enroll";
}

export default function CourseLiveShell({ variant }: CourseLiveShellProps) {
  // Prerendered as `/courses/fallback`; after hydration this is the URL the
  // visitor actually asked for, which is where the real id lives.
  const pathname = usePathname();
  const courseId = courseIdFromPathname(pathname ?? "");

  // In the prerendered HTML the path is still the shell's own, so there is no id
  // to look up yet. That is "not loaded", not "not found".
  const isShellPath =
    (pathname ?? "").split("/").filter(Boolean).at(-1) === COURSE_STATIC_SHELL_ID;

  const { data, isLoading, isUninitialized, isError } = useGetCourseWithLessonsQuery(
    courseId ?? "",
    { skip: !courseId },
  );

  if (isShellPath || (courseId && (isLoading || isUninitialized))) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <p className="text-slate-500">Loading course…</p>
      </div>
    );
  }

  if (!courseId || isError || !data?.course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">
            Course not found
          </h1>
          <p className="text-slate-500 mb-6">
            This course may have been removed or is no longer available.
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

  if (variant === "enroll") {
    return <TrainingCourseEnrollPage course={data.course} />;
  }

  return <CourseDetailView course={data.course} lessons={data.lessons ?? []} />;
}
