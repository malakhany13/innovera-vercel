"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Error]", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] bg-slate-50 flex items-center justify-center px-6 py-16">
      <div className="text-center max-w-md">
        <p className="text-sm font-bold text-brand-cyan uppercase tracking-wider mb-3">Something went wrong</p>
        <h1 className="text-3xl font-display font-bold text-brand-navy mb-4">Unexpected error</h1>
        <p className="text-slate-500 mb-8">
          We hit a snag loading this page. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-6 py-3 bg-brand-cyan text-white font-bold rounded-full hover:bg-cyan-500 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 text-brand-navy font-bold rounded-full border border-slate-200 hover:bg-white transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
