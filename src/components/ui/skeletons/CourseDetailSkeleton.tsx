import SkeletonBlock from "./SkeletonBlock";

/** Course detail page loading state — mirrors {@link CourseDetailView} layout. */
export default function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16" aria-busy="true" aria-label="Loading course">
      <div className="max-w-4xl mx-auto px-6">
        <SkeletonBlock className="h-4 w-36 rounded-full mb-6 bg-slate-200" />
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl">
          <SkeletonBlock className="h-44 sm:h-56 rounded-none" />
          <div className="px-6 md:px-8 py-4 bg-slate-50 border-b border-slate-100">
            <SkeletonBlock className="h-3 w-20 mb-2 bg-slate-100" />
            <SkeletonBlock className="h-10 w-32 bg-slate-100 rounded-lg" />
          </div>
          <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }, (_, index) => (
                <SkeletonBlock key={index} className="h-20 bg-slate-50 rounded-2xl" />
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <SkeletonBlock className="h-7 w-40" />
                <SkeletonBlock className="h-4 w-full bg-slate-100" />
                <SkeletonBlock className="h-4 w-full bg-slate-100" />
                <SkeletonBlock className="h-4 w-3/4 bg-slate-100" />
              </div>
              <div className="space-y-4">
                <SkeletonBlock className="h-7 w-44" />
                <SkeletonBlock className="h-4 w-full bg-slate-100" />
                <SkeletonBlock className="h-4 w-full bg-slate-100" />
              </div>
            </div>
            <SkeletonBlock className="h-14 w-full max-w-sm rounded-full bg-brand-cyan/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
