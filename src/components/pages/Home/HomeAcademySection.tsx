"use client";

import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Course } from "@/src/api/types";
import CourseCard from "@/src/components/CourseCard";
import { CourseCardSkeletonGrid } from "@/components/ui/skeletons";
import { getCourseImage } from "@/src/lib/directus";
import { useHomePageContent, useSeededCoursesWithVendors } from "./HomeSeedContext";
import { buildHomeVendorList } from "@/src/lib/vendors";
import HomeAcademyFallbackCards from "./HomeAcademyFallbackCards";

const TrainingCourseModal = dynamic(
  () => import("@/components/pages/Training/TrainingCourseModal"),
  { ssr: false, loading: () => null },
);

function vendorLogoUrl(image: string | null): string | null {
  if (!image) return null;
  // Curated local partner assets — do not run through Directus URL helpers.
  if (image.startsWith("/images/") || image.startsWith("/cms-images/")) {
    return image;
  }
  return getCourseImage(image);
}

export default function HomeAcademySection() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { data: coursesData, isLoading, isError } = useSeededCoursesWithVendors();
  const homePage = useHomePageContent();
  // Static export may hit Laravel `{ success, courses }` — never assume an array.
  const courses = Array.isArray(coursesData) ? coursesData : [];
  const showFallback = isError || (!isLoading && courses.length === 0);

  const vendors = useMemo(() => {
    const homeVendors = Array.isArray(homePage?.vendors) ? homePage.vendors : [];
    return buildHomeVendorList(courses, homeVendors)
      .map((vendor) => ({
        ...vendor,
        logo: vendorLogoUrl(vendor.image),
      }))
      .filter((vendor): vendor is typeof vendor & { logo: string } => Boolean(vendor.logo));
  }, [courses, homePage?.vendors]);

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 order-1">
            <div className="sticky top-24 flex flex-col">
              <h2 className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-4">World-Class Training</h2>
              <h3 className="text-4xl lg:text-5xl font-display font-bold text-brand-navy mb-6">Innovera Academy</h3>
              <p className="text-lg text-slate-500 leading-relaxed mb-8">
                Explore specialized learning tracks developed directly with our global technology partners, ensuring practical outcomes.
              </p>

              <div className="w-full mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Certificates
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {vendors.map((vendor) => {
                    const isLargePartner =
                      vendor.vendorKey === "Hanwha" ||
                      vendor.vendorKey === "H3C" ||
                      vendor.vendorKey === "Courses by Innovera";
                    return (
                      <button
                        key={vendor.id}
                        type="button"
                        onClick={() => {
                          router.push(`/courses?vendor=${encodeURIComponent(vendor.vendorKey)}`);
                        }}
                        className="group relative flex items-center justify-center h-20 rounded-2xl border border-slate-200 bg-white p-4 hover:border-brand-cyan hover:shadow-md transition-all duration-300"
                      >
                        <div
                          className={
                            isLargePartner
                              ? "relative h-12 w-full max-w-[160px]"
                              : "relative h-10 w-full max-w-[140px]"
                          }
                        >
                          <Image
                            src={vendor.logo}
                            alt={vendor.name}
                            fill
                            sizes={isLargePartner ? "160px" : "140px"}
                            loading="lazy"
                            className={
                              isLargePartner
                                ? "object-contain scale-125 group-hover:scale-[1.35] transition-transform duration-300"
                                : "object-contain group-hover:scale-105 transition-transform duration-300"
                            }
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-navy text-white rounded-full font-medium hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-brand-navy/30 text-sm w-fit"
              >
                Go To Courses  <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-2 order-2">
            {isLoading ? (
              <CourseCardSkeletonGrid count={4} gridClassName="grid sm:grid-cols-2 gap-6" />
            ) : !showFallback ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {courses.slice(0, 4).map((course, idx) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    animationDelay={idx * 0.1}
                    showDescription
                    priority={idx < 2}
                    onClick={() => setSelectedCourse(course)}
                  />
                ))}
              </div>
            ) : (
              <HomeAcademyFallbackCards />
            )}
          </div>
        </div>
      </div>
      <TrainingCourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </section>
  );
}
