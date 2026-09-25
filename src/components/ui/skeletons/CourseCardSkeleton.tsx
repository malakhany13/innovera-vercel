/** Single course card placeholder — mirrors {@link CourseCard} layout. */
export default function CourseCardSkeleton() {
  return (
    <div
      className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full"
      aria-hidden
    >
      <div className="h-48 bg-slate-200 animate-pulse shrink-0" />
      <div className="p-5 sm:p-6 flex flex-col flex-1 space-y-3">
        <div className="h-5 bg-slate-200 rounded-lg w-4/5 animate-pulse" />
        <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse" />
        <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
          <div className="flex gap-3">
            <div className="h-3.5 w-12 bg-slate-100 rounded animate-pulse" />
            <div className="h-3.5 w-16 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
