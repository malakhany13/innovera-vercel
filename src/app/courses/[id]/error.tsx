"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CourseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CourseError]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 pt-24">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-display font-bold text-brand-navy mb-3">Could not load course</h1>
        <p className="text-slate-500 mb-8">
          There was a problem fetching this course. Check your connection or try again shortly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 bg-brand-cyan text-white font-bold rounded-full hover:bg-cyan-500 transition-colors"
          >
            Retry
          </button>
          <Link
            href="/courses"
            className="px-6 py-3 text-brand-navy font-bold rounded-full border border-slate-200 hover:bg-white transition-colors"
          >
            Browse courses
          </Link>
        </div>
      </div>
    </div>
  );
}
