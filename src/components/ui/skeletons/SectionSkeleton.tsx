interface SectionSkeletonProps {
  height?: string;
  className?: string;
}

export default function SectionSkeleton({
  height = "h-96",
  className = "",
}: SectionSkeletonProps) {
  return (
    <div
      className={`w-full ${height} bg-slate-100 animate-pulse rounded-none ${className}`}
      aria-hidden
    />
  );
}
