import { Award, Filter, Search } from "lucide-react";
import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { useMemo } from "react";
import CourseCard from "@/components/CourseCard";
import { CourseCardSkeletonGrid } from "@/components/ui/skeletons";
import { getVendorByKey, getVendorFilterOptions } from "@/lib/vendors";
import type { Course } from "./types";

interface TrainingCourseExplorerProps {
  selectedTrack: string;
  setSelectedTrack: (track: string) => void;
  selectedVendor: string;
  setSelectedVendor: (vendor: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCourses: Course[];
  allCourses: Course[];
  isLoading: boolean;
  onSelectCourse?: (course: Course) => void;
  courseLinkPrefix?: string;
}

export default function TrainingCourseExplorer({
  selectedTrack,
  setSelectedTrack,
  selectedVendor,
  setSelectedVendor,
  searchQuery,
  setSearchQuery,
  filteredCourses,
  allCourses,
  isLoading,
  onSelectCourse,
  courseLinkPrefix,
}: TrainingCourseExplorerProps) {
  const availableTracks = useMemo(
    () => ["All Tracks", ...Array.from(new Set(allCourses.map((course) => course.track)))],
    [allCourses],
  );
  const availableVendors = useMemo(
    () => getVendorFilterOptions(allCourses),
    [allCourses],
  );

  return (
    <section id="course-explorer" className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-12 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, skills, or certifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-shadow text-slate-700 font-medium"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
            <div className="relative min-w-[200px] w-full sm:w-auto">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="w-full pl-10 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan appearance-none font-medium text-slate-700 cursor-pointer"
              >
                {availableTracks.map((track) => (
                  <option key={track} value={track}>{track}</option>
                ))}
              </select>
            </div>
            <div className="relative min-w-[200px] w-full sm:w-auto">
              <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full pl-10 pr-10 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-cyan appearance-none font-medium text-slate-700 cursor-pointer"
              >
                {availableVendors.map((vendorKey) => (
                  <option key={vendorKey} value={vendorKey}>
                    {vendorKey === "All Vendors"
                      ? vendorKey
                      : getVendorByKey(vendorKey)?.name ?? vendorKey}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <CourseCardSkeletonGrid />
        ) : filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredCourses.map((course, index) => {
                const card = (
                  <CourseCard
                    course={course}
                    layout
                    showArrow
                    priority={index < 4}
                    onClick={courseLinkPrefix ? undefined : () => onSelectCourse?.(course)}
                  />
                );

                return courseLinkPrefix ? (
                  <Link key={course.id} href={`${courseLinkPrefix}/${course.id}`} className="block h-full">
                    {card}
                  </Link>
                ) : (
                  <div key={course.id}>{card}</div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No courses found</h3>
            <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTrack("All Tracks");
                setSelectedVendor("All Vendors");
              }}
              className="mt-6 px-6 py-2 bg-brand-cyan text-white font-medium rounded-full hover:bg-cyan-500 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
