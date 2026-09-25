"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AboutPageContent } from "@/features/directus/types";

const AboutSeedContext = createContext<AboutPageContent | null>(null);

export function AboutSeedProvider({
  aboutPage,
  children,
}: {
  aboutPage: AboutPageContent | null;
  children: ReactNode;
}) {
  const [page, setPage] = useState<AboutPageContent | null>(aboutPage);

  useEffect(() => {
    setPage(aboutPage);
  }, [aboutPage]);

  // Refresh after hydration so SSR markup and first client paint stay aligned.
  useEffect(() => {
    let cancelled = false;

    fetch("/api/about-page", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AboutPageContent | null) => {
        if (!cancelled && data) setPage(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => page, [page]);

  return <AboutSeedContext.Provider value={value}>{children}</AboutSeedContext.Provider>;
}

export function useAboutPageContent(): AboutPageContent | null {
  return useContext(AboutSeedContext);
}
