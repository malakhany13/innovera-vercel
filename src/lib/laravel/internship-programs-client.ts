"use client";

import { useMemo } from "react";
import {
  baseApi,
  useGetInternshipProgramsQuery,
} from "@/store/baseApi";
import { store } from "@/store/store";
import type { InternshipProgram } from "@/lib/laravel/internship-programs";

const programsQueryOptions = {
  refetchOnMountOrArgChange: false as const,
  refetchOnFocus: false as const,
  refetchOnReconnect: false as const,
};

/**
 * Imperative read of the RTK cache (no extra network call when data exists).
 * Prefer {@link useGetInternshipProgramsQuery} in components.
 */
export async function fetchInternshipProgramsClient(): Promise<InternshipProgram[]> {
  const select = baseApi.endpoints.getInternshipPrograms.select();
  const cached = select(store.getState());
  if (cached.status === "fulfilled" && cached.data) {
    return cached.data;
  }

  const result = await store.dispatch(
    baseApi.endpoints.getInternshipPrograms.initiate(undefined, {
      subscribe: false,
      forceRefetch: false,
    }),
  );

  if (result.error) {
    const err = result.error;
    const message =
      typeof err === "object" &&
      err !== null &&
      "error" in err &&
      typeof (err as { error?: unknown }).error === "string"
        ? (err as { error: string }).error
        : "Unable to load internship programs.";
    throw new Error(message);
  }

  return result.data ?? [];
}

/** Pick one program from the cached internship-programs list. */
export function useInternshipProgram(programId: number | null | undefined): {
  program: InternshipProgram | null;
  status: "loading" | "ready" | "error";
} {
  const skip = programId == null;
  const { data, isLoading, isError, isFetching } = useGetInternshipProgramsQuery(
    undefined,
    { skip, ...programsQueryOptions },
  );

  const program = useMemo(() => {
    if (programId == null || !data) return null;
    return data.find((row) => row.id === programId) ?? null;
  }, [data, programId]);

  if (skip) {
    return { program: null, status: "error" };
  }

  if (isLoading || (isFetching && !data)) {
    return { program: null, status: "loading" };
  }

  if (isError || !program) {
    return { program: null, status: "error" };
  }

  return { program, status: "ready" };
}
