"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 flex items-center justify-center px-6 font-sans antialiased">
        <div className="text-center max-w-md">
          <p className="text-sm font-bold text-cyan-600 uppercase tracking-wider mb-3">Something went wrong</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Unexpected error</h1>
          <p className="text-slate-500 mb-8">
            We hit a snag loading this page. Please try again or return to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="px-6 py-3 bg-cyan-600 text-white font-bold rounded-full hover:bg-cyan-500 transition-colors"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-6 py-3 text-slate-900 font-bold rounded-full border border-slate-200 hover:bg-white transition-colors"
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
