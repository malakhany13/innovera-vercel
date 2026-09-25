"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { store } from "@/store/store";
import { AuthProvider } from "@/components/providers/AuthProvider";

function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    // Explicit "instant" overrides the global CSS `scroll-behavior: smooth` —
    // without it this reset animates, and scrolling during that animation
    // (which finishes almost immediately after the page loads) fights with
    // it and reads as a jump/skip.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ScrollToTop />
        {children}
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </Provider>
  );
}
