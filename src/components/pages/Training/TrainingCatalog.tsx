"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetCoursesQuery } from "@/features/directus/directusApi";
import { courseMatchesVendor } from "@/lib/vendors";
import TrainingCourseExplorer from "./TrainingCourseExplorer";
import TrainingHeroSection from "./TrainingHeroSection";
import type { Course } from "@/features/directus/types";

const TrainingCourseModal = dynamic(() => import("./TrainingCourseModal"), {
  ssr: false,
  loading: () => null,
});

interface TrainingCatalogProps {
  initialCourses: Course[];
  fetchError?: boolean;
  /** When set, course cards link to this prefix (e.g. `/courses`) instead of opening a modal. */
  courseLinkPrefix?: string;
}

export default function TrainingCatalog({
  initialCourses,
  fetchError = false,
  courseLinkPrefix,
}: TrainingCatalogProps) {
  const searchParams = useSearchParams();
  const [selectedTrack, setSelectedTrack] = useState(
    () => searchParams.get("track") ?? "All Tracks",
  );
  const [selectedVendor, setSelectedVendor] = useState(
    () => searchParams.get("vendor") ?? "All Vendors",
  );
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Always load from Laravel via BFF `/api/courses` (not Directus).
  const {
    data: apiCourses,
    isLoading,
    isFetching,
    isError,
    isUninitialized,
    refetch,
  } = useGetCoursesQuery(undefined, {
    // Always refetch on mount so the list reflects the dashboard, not the build.
    refetchOnMountOrArgChange: true,
  });

  const courses = Array.isArray(apiCourses)
    ? apiCourses
    : Array.isArray(initialCourses)
      ? initialCourses
      : [];

  useEffect(() => {
    const track = searchParams.get("track");
    if (track) setSelectedTrack(track);
    const vendor = searchParams.get("vendor");
    if (vendor) setSelectedVendor(vendor);
  }, [searchParams]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.whatYouWillCover.some((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesTrack =
        selectedTrack === "All Tracks" || course.track === selectedTrack;
      const matchesVendor = courseMatchesVendor(course, selectedVendor);

      return matchesSearch && matchesTrack && matchesVendor;
    });
  }, [courses, searchQuery, selectedTrack, selectedVendor]);

  // A build-time miss (`fetchError`) is not an error to the visitor: the live
  // query runs on hydration and is the source of truth. Until it has run —
  // including in the prerendered HTML — show the loading state instead.
  const showError = courses.length === 0 && isError && !isLoading;

  return (
    <div className="min-h-screen bg-slate-50">
      <TrainingHeroSection />
      {showError && (
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-800 font-medium mb-4">
              We couldn&apos;t load courses right now. Please try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="px-6 py-2 bg-brand-cyan text-white font-medium rounded-full hover:bg-cyan-500 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <TrainingCourseExplorer
        selectedTrack={selectedTrack}
        setSelectedTrack={setSelectedTrack}
        selectedVendor={selectedVendor}
        setSelectedVendor={setSelectedVendor}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredCourses={filteredCourses}
        allCourses={courses}
        isLoading={isLoading || isUninitialized || (isFetching && courses.length === 0)}
        onSelectCourse={courseLinkPrefix ? undefined : setSelectedCourse}
        courseLinkPrefix={courseLinkPrefix}
      />
      {!courseLinkPrefix && (
        <TrainingCourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
}
