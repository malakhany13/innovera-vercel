import CourseCardSkeletonGrid from "./CourseCardSkeletonGrid";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`bg-slate-200 animate-pulse rounded-xl ${className}`} aria-hidden />;
}

function SectionHeaderSkeleton({
  centered = false,
  dark = false,
}: {
  centered?: boolean;
  dark?: boolean;
}) {
  const labelClass = dark ? "bg-white/20" : "bg-brand-cyan/20";
  const titleClass = dark ? "bg-white/20" : "bg-slate-200";
  const descClass = dark ? "bg-white/10" : "bg-slate-100";

  return (
    <div className={`space-y-4 mb-16 ${centered ? "text-center max-w-3xl mx-auto" : "max-w-xl"}`}>
      <SkeletonBlock className={`h-4 w-32 rounded-full ${centered ? "mx-auto" : ""} ${labelClass}`} />
      <SkeletonBlock className={`h-12 w-full max-w-md ${centered ? "mx-auto" : ""} ${titleClass}`} />
      <SkeletonBlock className={`h-5 w-full max-w-lg ${centered ? "mx-auto" : ""} ${descClass}`} />
    </div>
  );
}

export function HomeHeroSkeleton() {
  return (
    <section
      className="relative h-[500px] md:h-[600px] lg:h-[700px] bg-brand-navy overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-slate-800/60 animate-pulse" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="max-w-3xl space-y-6 w-full">
          <SkeletonBlock className="h-14 w-full max-w-2xl bg-white/20 rounded-2xl" />
          <SkeletonBlock className="h-14 w-4/5 max-w-xl bg-white/15 rounded-2xl" />
          <SkeletonBlock className="h-6 w-full max-w-xl bg-white/10 rounded-lg" />
          <div className="flex gap-4 pt-2">
            <SkeletonBlock className="h-14 w-44 rounded-full bg-white/20" />
            <SkeletonBlock className="h-14 w-36 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeAboutSkeleton() {
  return (
    <section className="py-24 bg-white" aria-hidden>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <SectionHeaderSkeleton />
          <SkeletonBlock className="h-4 w-full bg-slate-100" />
          <SkeletonBlock className="h-4 w-full bg-slate-100" />
          <SkeletonBlock className="h-4 w-3/4 bg-slate-100" />
          <div className="space-y-4 pt-4">
            <SkeletonBlock className="h-20 w-full bg-slate-50 rounded-2xl" />
            <SkeletonBlock className="h-20 w-full bg-slate-50 rounded-2xl" />
          </div>
          <SkeletonBlock className="h-11 w-44 rounded-full bg-slate-200" />
        </div>
        <SkeletonBlock className="aspect-[4/3] w-full rounded-[3rem] bg-slate-200" />
      </div>
    </section>
  );
}

export function HomeStatsSkeleton() {
  return (
    <section className="py-24 bg-brand-navy" aria-hidden>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <SkeletonBlock className="h-10 w-24 bg-white/20 rounded-lg" />
            <SkeletonBlock className="h-4 w-28 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomeVendorsSkeleton() {
  return (
    <section className="py-24 bg-gray-50" aria-hidden>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeaderSkeleton centered />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBlock key={index} className="h-[160px] rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePartnersMarqueeSkeleton() {
  return (
    <section className="py-16 bg-white overflow-hidden" aria-hidden>
      <div className="max-w-7xl mx-auto px-6 flex gap-12">
        {Array.from({ length: 6 }, (_, index) => (
          <SkeletonBlock key={index} className="h-16 w-32 lg:w-48 shrink-0 rounded-xl bg-slate-100" />
        ))}
      </div>
    </section>
  );
}

export function HomeSolutionsSkeleton() {
  return (
    <section className="py-32 bg-slate-50" aria-hidden>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <SectionHeaderSkeleton centered />
        <SkeletonBlock className="h-11 w-52 rounded-full bg-slate-200 mx-auto mb-16" />
        <SkeletonBlock className="h-[600px] w-full max-w-5xl mx-auto rounded-[1.5rem] bg-slate-200" />
      </div>
    </section>
  );
}

export function HomeAcademySkeleton() {
  return (
    <section className="py-32 bg-white" aria-hidden>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1 space-y-6">
          <SectionHeaderSkeleton />
          <SkeletonBlock className="h-4 w-32 bg-slate-100 rounded-full" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <SkeletonBlock key={index} className="h-20 rounded-2xl bg-slate-100" />
            ))}
          </div>
          <SkeletonBlock className="h-11 w-48 rounded-full bg-slate-200" />
        </div>
        <div className="lg:col-span-2">
          <CourseCardSkeletonGrid count={4} gridClassName="grid sm:grid-cols-2 gap-6" />
        </div>
      </div>
    </section>
  );
}

export function HomeFeaturedCardsSkeleton({
  className = "py-32 bg-slate-50 border-b border-slate-200",
}: {
  className?: string;
}) {
  return (
    <section className={className} aria-hidden>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <SectionHeaderSkeleton />
          <SkeletonBlock className="h-5 w-36 bg-slate-200 rounded-lg shrink-0" />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBlock key={index} className="h-80 rounded-[2rem] bg-slate-200" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeEcosystemSkeleton() {
  return (
    <section className="py-32 bg-brand-navy" aria-hidden>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeaderSkeleton centered dark />
        <div className="grid lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBlock key={index} className="h-80 rounded-3xl bg-white/10" />
          ))}
        </div>
        <SkeletonBlock className="h-14 w-56 rounded-full bg-white/15 mx-auto mt-16" />
      </div>
    </section>
  );
}

export function HomeIndustriesSkeleton() {
  return (
    <section className="py-24 bg-white border-b border-slate-100" aria-hidden>
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeaderSkeleton centered />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-12">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="flex flex-col items-center gap-4">
              <SkeletonBlock className="h-10 w-10 rounded-full bg-slate-100" />
              <SkeletonBlock className="h-4 w-20 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeContactSkeleton() {
  return (
    <section className="py-32 bg-white" aria-hidden>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <SectionHeaderSkeleton />
          <SkeletonBlock className="h-5 w-full bg-slate-100" />
          <div className="grid grid-cols-2 gap-6">
            <SkeletonBlock className="h-36 rounded-3xl bg-slate-50" />
            <SkeletonBlock className="h-36 rounded-3xl bg-slate-50" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4 mt-8">
            <SkeletonBlock className="h-48 rounded-[2rem] bg-slate-200" />
            <SkeletonBlock className="h-40 rounded-[2rem] bg-slate-200" />
          </div>
          <div className="space-y-4">
            <SkeletonBlock className="h-40 rounded-[2rem] bg-slate-200" />
            <SkeletonBlock className="h-48 rounded-[2rem] bg-slate-200" />
          </div>
        </div>
      </div>
    </section>
  );
}
