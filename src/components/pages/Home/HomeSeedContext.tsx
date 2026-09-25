"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Course, HomePageContent } from "@/features/directus/types";
import { useGetCoursesQuery, useGetHomePageQuery } from "@/src/hooks";

interface HomeSeedValue {
  homePage: HomePageContent | null;
  courses: Course[];
}

const HomeSeedContext = createContext<HomeSeedValue>({
  homePage: null,
  courses: [],
});

export function HomeSeedProvider({
  homePage,
  courses,
  children,
}: {
  homePage: HomePageContent | null;
  courses: Course[];
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ homePage, courses }),
    [homePage, courses],
  );

  return <HomeSeedContext.Provider value={value}>{children}</HomeSeedContext.Provider>;
}

/**
 * Server-seeded content renders first (so SSR/static HTML and the first client
 * render match — no hydration mismatch), then live API data replaces it once it
 * arrives. The seed must NOT be the final answer: in a static export it is frozen
 * at build time, so skipping the query would leave the home page permanently
 * showing whatever the CMS/Laravel had when the build ran. Same pattern the
 * courses catalog, news and events pages already use.
 */
export function useHomePageContent() {
  const { homePage: seed } = useContext(HomeSeedContext);
  const { data } = useGetHomePageQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  return data ?? seed;
}

/** Live Laravel-backed courses for home sections, seeded for first paint. */
export function useSeededCoursesWithVendors() {
  const { courses: seedCourses } = useContext(HomeSeedContext);
  const coursesQuery = useGetCoursesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const data = useMemo(() => {
    if (Array.isArray(coursesQuery.data) && coursesQuery.data.length > 0) {
      return coursesQuery.data;
    }
    return seedCourses;
  }, [seedCourses, coursesQuery.data]);

  return {
    data,
    // `isUninitialized` covers the prerendered HTML, where the query has not run
    // yet: show the skeleton, not the fallback cards, until live data arrives.
    isLoading:
      seedCourses.length === 0 &&
      (coursesQuery.isLoading || coursesQuery.isUninitialized),
    isError: coursesQuery.isError,
  };
}
