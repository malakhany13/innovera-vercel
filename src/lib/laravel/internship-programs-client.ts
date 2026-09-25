"use client";

import { useEffect, useState } from "react";
import { fetchPublicJson } from "@/lib/laravel/public-api";
import {
  parseInternshipProgramsPayload,
  type InternshipProgram,
} from "@/lib/laravel/internship-programs";

/**
 * Live dashboard programs (`price` + `Second_price`).
 * Prefer Magico `/api/internship-programs`, then `/api/v1/...` if that isn't JSON.
 */
export async function fetchInternshipProgramsClient(): Promise<InternshipProgram[]> {
  const attempts = [
    {
      bffPath: "/internship-programs",
      laravelPath: "/api/internship-programs",
    },
    {
      laravelPath: "/api/v1/internship-programs",
    },
  ] as const;

  let lastMessage = "Unable to load internship programs.";

  for (const attempt of attempts) {
    const result = await fetchPublicJson({
      ...attempt,
      errorLabel: "Failed to load internship programs",
    });
    if (!result.ok) {
      lastMessage = result.message;
      continue;
    }
    return parseInternshipProgramsPayload(result.payload);
  }

  throw new Error(lastMessage);
}

export function useInternshipProgram(programId: number | null | undefined): {
  program: InternshipProgram | null;
  status: "loading" | "ready" | "error";
} {
  const [program, setProgram] = useState<InternshipProgram | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    programId == null ? "error" : "loading",
  );

  useEffect(() => {
    if (programId == null) {
      setProgram(null);
      setStatus("error");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    void fetchInternshipProgramsClient()
      .then((programs) => {
        if (cancelled) return;
        const match = programs.find((row) => row.id === programId) ?? null;
        setProgram(match);
        setStatus(match ? "ready" : "error");
      })
      .catch(() => {
        if (cancelled) return;
        setProgram(null);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [programId]);

  return { program, status };
}
