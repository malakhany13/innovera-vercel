import SkeletonBlock from "./SkeletonBlock";
import { HomeHeroSkeleton } from "./homeSectionSkeletons";

function PageHeaderSkeleton({ centered = true }: { centered?: boolean }) {
  return (
    <div className={`space-y-4 mb-12 ${centered ? "text-center max-w-2xl mx-auto" : ""}`}>
      <SkeletonBlock className={`h-12 w-full max-w-md rounded-2xl ${centered ? "mx-auto" : ""}`} />
      <SkeletonBlock className={`h-5 w-full max-w-xl ${centered ? "mx-auto" : ""} bg-slate-100`} />
      <SkeletonBlock className={`h-5 w-4/5 max-w-lg ${centered ? "mx-auto" : ""} bg-slate-100`} />
    </div>
  );
}

function LightHeroSkeleton() {
  return (
    <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
      <SkeletonBlock className="h-7 w-36 rounded-full bg-brand-cyan/20 mx-auto" />
      <SkeletonBlock className="h-12 w-full max-w-2xl mx-auto" />
      <SkeletonBlock className="h-12 w-4/5 max-w-xl mx-auto bg-slate-100" />
      <SkeletonBlock className="h-5 w-full max-w-2xl mx-auto bg-slate-100" />
    </div>
  );
}

/** News / events featured + grid layout. */
export function ContentFeaturedPageSkeleton({ withHero = false }: { withHero?: boolean }) {
  return (
    <div className="min-h-screen bg-white" aria-busy="true">
      <section className="pt-32 pb-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {withHero && <LightHeroSkeleton />}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            <SkeletonBlock className="lg:col-span-8 h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl" />
            <div className="lg:col-span-4 flex flex-col gap-8">
              <SkeletonBlock className="h-40 rounded-2xl bg-slate-100" />
              <SkeletonBlock className="h-40 rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SkeletonBlock className="h-9 w-56 mb-10 bg-slate-200" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="space-y-5">
                <SkeletonBlock className="h-56 rounded-xl" />
                <SkeletonBlock className="h-4 w-24 bg-slate-100 rounded-full" />
                <SkeletonBlock className="h-6 w-full bg-slate-200" />
                <SkeletonBlock className="h-4 w-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function EventsPageSkeleton() {
  return <ContentFeaturedPageSkeleton withHero />;
}

export function NewsPageSkeleton() {
  return <ContentFeaturedPageSkeleton />;
}

export function AboutPageSkeleton() {
  return (
    <div className="min-h-screen bg-white" aria-busy="true" aria-label="Loading about page">
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <SkeletonBlock className="h-16 w-full max-w-lg" />
            <SkeletonBlock className="h-16 w-4/5 max-w-md bg-slate-100" />
            <SkeletonBlock className="h-5 w-full bg-slate-100" />
            <SkeletonBlock className="h-5 w-full bg-slate-100" />
            <div className="flex gap-4 pt-2">
              {Array.from({ length: 4 }, (_, index) => (
                <SkeletonBlock key={index} className="h-12 w-12 rounded-full bg-slate-100" />
              ))}
            </div>
          </div>
          <SkeletonBlock className="hidden md:block aspect-[4/3] w-full rounded-3xl" />
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <SkeletonBlock className="min-h-[400px] rounded-3xl" />
          <SkeletonBlock className="min-h-[400px] rounded-3xl" />
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <PageHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, index) => (
              <SkeletonBlock key={index} className="h-64 rounded-3xl bg-white border border-slate-100" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <SkeletonBlock className="aspect-[4/3] w-full rounded-3xl" />
          <div className="space-y-4">
            <SkeletonBlock className="h-10 w-2/3" />
            <SkeletonBlock className="h-5 w-full bg-slate-100" />
            <SkeletonBlock className="h-5 w-full bg-slate-100" />
            <SkeletonBlock className="h-5 w-3/4 bg-slate-100" />
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <PageHeaderSkeleton />
          <div className="grid lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonBlock key={index} className="h-80 rounded-3xl bg-white" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-navy">
        <div className="max-w-7xl mx-auto px-6">
          <PageHeaderSkeleton />
          <div className="grid md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonBlock key={index} className="h-72 rounded-3xl bg-white/10" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ContactPageSkeleton() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50" aria-busy="true">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 lg:gap-24">
        <div className="space-y-6">
          <SkeletonBlock className="h-12 w-64" />
          <SkeletonBlock className="h-5 w-full bg-slate-100" />
          <SkeletonBlock className="h-5 w-4/5 bg-slate-100" />
          <div className="space-y-8 pt-4">
            <SkeletonBlock className="h-16 w-full max-w-sm bg-white rounded-xl" />
            <SkeletonBlock className="h-16 w-full max-w-sm bg-white rounded-xl" />
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-5 shadow-sm">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBlock key={index} className="h-14 w-full bg-slate-50 rounded-2xl" />
          ))}
          <SkeletonBlock className="h-14 w-full rounded-2xl bg-brand-cyan/20" />
        </div>
      </div>
    </div>
  );
}

export function GalleryPageSkeleton() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50" aria-busy="true">
      <div className="max-w-7xl mx-auto px-6">
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonBlock key={index} className="aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PartnersPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50" aria-busy="true">
      <HomeHeroSkeleton />
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 flex flex-col gap-24">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-8">
              <div className="text-center space-y-4">
                <SkeletonBlock className="h-14 w-14 rounded-full mx-auto bg-white" />
                <SkeletonBlock className="h-9 w-64 mx-auto" />
                <SkeletonBlock className="h-5 w-full max-w-xl mx-auto bg-slate-100" />
              </div>
              <SkeletonBlock className="aspect-[16/9] w-full rounded-[2rem] bg-white" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function BranchesPageSkeleton() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white" aria-busy="true">
      <div className="max-w-7xl mx-auto px-6">
        <PageHeaderSkeleton />
        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBlock key={index} className="h-56 rounded-2xl bg-slate-50" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HowToBuyPageSkeleton() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50" aria-busy="true">
      <div className="max-w-7xl mx-auto px-6">
        <PageHeaderSkeleton />
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonBlock key={index} className="h-56 rounded-2xl bg-white" />
          ))}
        </div>
        <SkeletonBlock className="h-12 w-44 rounded-full mx-auto mt-16 bg-brand-cyan/20" />
      </div>
    </div>
  );
}

export function LegalPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24" aria-busy="true">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12 space-y-4">
          <SkeletonBlock className="h-12 w-2/3 max-w-lg mx-auto" />
          <SkeletonBlock className="h-5 w-48 mx-auto bg-slate-100" />
        </div>
        <SkeletonBlock className="h-24 w-full mb-10 bg-white rounded-2xl" />
        <div className="space-y-8">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-100 p-8 space-y-4">
              <SkeletonBlock className="h-7 w-1/2" />
              <SkeletonBlock className="h-4 w-full bg-slate-100" />
              <SkeletonBlock className="h-4 w-full bg-slate-100" />
              <SkeletonBlock className="h-4 w-4/5 bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EnrollPageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16" aria-busy="true">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl">
          <SkeletonBlock className="h-40 sm:h-48 rounded-none" />
          <div className="p-6 sm:p-10 space-y-5">
            <div className="text-center space-y-3 mb-4">
              <SkeletonBlock className="h-8 w-56 mx-auto" />
              <SkeletonBlock className="h-4 w-72 mx-auto bg-slate-100" />
            </div>
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonBlock key={index} className="h-14 w-full max-w-lg mx-auto bg-slate-50 rounded-2xl" />
            ))}
            <SkeletonBlock className="h-16 w-full max-w-lg mx-auto bg-brand-navy/5 rounded-2xl" />
            <div className="flex gap-3 pt-2 max-w-lg mx-auto">
              <SkeletonBlock className="h-14 flex-1 rounded-2xl bg-slate-50" />
              <SkeletonBlock className="h-14 flex-1 rounded-2xl bg-brand-cyan/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
