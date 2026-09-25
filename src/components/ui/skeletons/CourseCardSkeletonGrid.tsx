import CourseCardSkeleton from "./CourseCardSkeleton";

/** Default skeleton count: three rows on xl (4-col) grid — fills viewport without excess DOM. */
export const COURSE_CATALOG_SKELETON_COUNT = 12;

interface CourseCardSkeletonGridProps {
  count?: number;
  className?: string;
  gridClassName?: string;
}

export default function CourseCardSkeletonGrid({
  count = COURSE_CATALOG_SKELETON_COUNT,
  className = "",
  gridClassName = "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}: CourseCardSkeletonGridProps) {
  return (
    <div className={`${gridClassName} gap-6 ${className}`} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
