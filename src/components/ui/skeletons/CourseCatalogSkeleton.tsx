import CourseCardSkeletonGrid from "./CourseCardSkeletonGrid";

/** Full training/courses catalog loading state — mirrors hero, filters, and card grid. */
export default function CourseCatalogSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50" aria-busy="true" aria-label="Loading courses">
      <section className="relative bg-brand-navy pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-brand-navy/80" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-6">
            <div className="h-7 w-36 bg-white/20 rounded-full animate-pulse" />
            <div className="space-y-3">
              <div className="h-12 w-full max-w-xl bg-white/20 rounded-2xl animate-pulse" />
              <div className="h-12 w-4/5 max-w-lg bg-white/15 rounded-2xl animate-pulse" />
            </div>
            <div className="h-5 w-full max-w-xl bg-white/10 rounded-xl animate-pulse" />
            <div className="h-5 w-3/4 max-w-md bg-white/10 rounded-xl animate-pulse" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 mb-12 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
            <div className="h-14 flex-1 w-full bg-white border border-slate-200 rounded-xl animate-pulse" />
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
              <div className="h-14 min-w-[200px] w-full sm:w-[200px] bg-white border border-slate-200 rounded-xl animate-pulse" />
              <div className="h-14 min-w-[200px] w-full sm:w-[200px] bg-white border border-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>

          <CourseCardSkeletonGrid />
        </div>
      </section>
    </div>
  );
}
