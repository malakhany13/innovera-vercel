"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AcademyPageContent } from "@/features/directus/types";

const AcademySeedContext = createContext<AcademyPageContent | null>(null);

export function AcademySeedProvider({
  academyPage,
  children,
}: {
  academyPage: AcademyPageContent | null;
  children: ReactNode;
}) {
  const [page, setPage] = useState<AcademyPageContent | null>(academyPage);

  useEffect(() => {
    setPage(academyPage);
  }, [academyPage]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/academy-page", { credentials: "same-origin" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AcademyPageContent | null) => {
        if (!cancelled && data) setPage(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => page, [page]);

  return (
    <AcademySeedContext.Provider value={value}>{children}</AcademySeedContext.Provider>
  );
}

export function useAcademyPageContent(): AcademyPageContent | null {
  return useContext(AcademySeedContext);
}
