import {
  HomeAboutSkeleton,
  HomeAcademySkeleton,
  HomeContactSkeleton,
  HomeEcosystemSkeleton,
  HomeFeaturedCardsSkeleton,
  HomeHeroSkeleton,
  HomeIndustriesSkeleton,
  HomeSolutionsSkeleton,
  HomeStatsSkeleton,
  HomeVendorsSkeleton,
} from "./homeSectionSkeletons";

/** Full home page loading state — mirrors every below-the-fold section layout. */
export default function HomePageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading home page">
      <HomeHeroSkeleton />
      <HomeAboutSkeleton />
      <HomeStatsSkeleton />
      <HomeVendorsSkeleton />
      <HomeSolutionsSkeleton />
      <HomeAcademySkeleton />
      <HomeFeaturedCardsSkeleton />
      <HomeFeaturedCardsSkeleton className="py-32 bg-white" />
      <HomeEcosystemSkeleton />
      <HomeIndustriesSkeleton />
      <HomeContactSkeleton />
    </div>
  );
}
