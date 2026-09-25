"use client";

import dynamic from "next/dynamic";
import DirectusCacheHydrator from "@/components/providers/DirectusCacheHydrator";
import type {
  Course,
  EventsPageEvent,
  HomePageContent,
  NewsPageArticle,
  ServicesPageCard,
} from "@/features/directus/types";
import { HomeSeedProvider } from "./HomeSeedContext";
import HomeHeroSection from "./HomeHeroSection";
import {
  HomeAboutSkeleton,
  HomeAcademySkeleton,
  HomeContactSkeleton,
  HomeFeaturedCardsSkeleton,
  HomeIndustriesSkeleton,
  HomeStatsSkeleton,
  HomeVendorsSkeleton,
} from "@/components/ui/skeletons";

const HomeAboutSection = dynamic(() => import("./HomeAboutSection"), {
  loading: () => <HomeAboutSkeleton />,
});
const HomeStatsSection = dynamic(() => import("./HomeStatsSection"), {
  loading: () => <HomeStatsSkeleton />,
});
const HomeVendorsSection = dynamic(() => import("./HomeVendorsSection"), {
  loading: () => <HomeVendorsSkeleton />,
});
const HomeAcademySection = dynamic(() => import("./HomeAcademySection"), {
  loading: () => <HomeAcademySkeleton />,
});
const HomeServicesSection = dynamic(() => import("./HomeServicesSection"), {
  loading: () => <HomeFeaturedCardsSkeleton />,
});
const HomeNewsSection = dynamic(() => import("./HomeNewsSection"), {
  loading: () => <HomeFeaturedCardsSkeleton />,
});
const HomeEventsSection = dynamic(() => import("./HomeEventsSection"), {
  loading: () => <HomeFeaturedCardsSkeleton className="py-32 bg-white" />,
});
const HomeIndustriesSection = dynamic(() => import("./HomeIndustriesSection"), {
  loading: () => <HomeIndustriesSkeleton />,
});
const HomeContactSection = dynamic(() => import("./HomeContactSection"), {
  loading: () => <HomeContactSkeleton />,
});

interface HomeProps {
  initialHomePage?: HomePageContent | null;
  initialCourses?: Course[];
  initialServicesCards?: ServicesPageCard[];
  initialNewsArticles?: NewsPageArticle[];
  initialEvents?: EventsPageEvent[];
}

export default function Home({
  initialHomePage = null,
  initialCourses = [],
  initialServicesCards = [],
  initialNewsArticles = [],
  initialEvents = [],
}: HomeProps) {
  return (
    <DirectusCacheHydrator
      cache={{
        getHomePage: initialHomePage ?? undefined,
        getCourses: initialCourses.length > 0 ? initialCourses : undefined,
      }}
    >
      <HomeSeedProvider homePage={initialHomePage} courses={initialCourses}>
      <HomeHeroSection />
      <HomeAboutSection />
      <HomeStatsSection />
      <HomeVendorsSection />
      <HomeAcademySection />
      <HomeServicesSection cards={initialServicesCards} />
      <HomeNewsSection articles={initialNewsArticles} />
      <HomeEventsSection events={initialEvents} />
      <HomeIndustriesSection />
      <HomeContactSection />
      </HomeSeedProvider>
    </DirectusCacheHydrator>
  );
}
