"use client";

import { useRef, type ReactNode } from "react";
import { baseApi } from "@/store/baseApi";
import { store } from "@/store/store";

export type HydratableDirectusEndpoint =
  | "getHomePage"
  | "getCourses"
  | "getAboutPage"
  | "getEventsPage"
  | "getNewsPage";

export type DirectusCachePayload = Partial<
  Record<HydratableDirectusEndpoint, unknown>
>;

interface DirectusCacheHydratorProps {
  cache: DirectusCachePayload;
  children: ReactNode;
}

/** Seed RTK Query cache from server-fetched Directus data before client sections render. */
export default function DirectusCacheHydrator({
  cache,
  children,
}: DirectusCacheHydratorProps) {
  const hydrated = useRef(false);

  if (!hydrated.current) {
    for (const [endpoint, data] of Object.entries(cache) as [
      HydratableDirectusEndpoint,
      unknown,
    ][]) {
      if (data != null) {
        store.dispatch(
          baseApi.util.upsertQueryData(endpoint, undefined, data as never),
        );
      }
    }
    hydrated.current = true;
  }

  return children;
}
