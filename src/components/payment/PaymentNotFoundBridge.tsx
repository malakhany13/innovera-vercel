"use client";

import { useEffect, useState, type ReactNode } from "react";
import PaymentPageClient from "@/components/payment/PaymentPageClient";
import PaymentPageSkeleton from "@/components/payment/PaymentPageSkeleton";
import PaymentResultClient from "@/components/payment/PaymentResultClient";

const SHELL_TOKENS = new Set(["fallback", "demo123"]);

function decodePathToken(raw: string | undefined): string | null {
  const token = raw ? decodeURIComponent(raw).trim() : "";
  if (!token || SHELL_TOKENS.has(token)) return null;
  return token;
}

/** Extract a real payment token from a pathname like `/payment/{token}`. */
export function paymentTokenFromPath(pathname: string | null | undefined): string | null {
  const match = pathname?.match(/^\/payment\/([^/]+)\/?$/i);
  return decodePathToken(match?.[1]);
}

/** Extract a real payment token from `/payment/{token}/result`. */
export function paymentResultTokenFromPath(
  pathname: string | null | undefined,
): string | null {
  const match = pathname?.match(/^\/payment\/([^/]+)\/result\/?$/i);
  return decodePathToken(match?.[1]);
}

function browserPathname(): string {
  return typeof window === "undefined" ? "" : window.location.pathname;
}

/**
 * When static hosts serve `404.html` for `/payment/{token}` or
 * `/payment/{token}/result`, mount the payment UI from the live URL.
 */
export default function PaymentNotFoundBridge({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"checkout" | "result" | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const resultToken = paymentResultTokenFromPath(path);
    if (resultToken) {
      setMode("result");
      setToken(resultToken);
    } else {
      const checkoutToken = paymentTokenFromPath(path);
      if (checkoutToken) {
        setMode("checkout");
        setToken(checkoutToken);
      }
    }
    setReady(true);
  }, []);

  if (!ready) {
    const path = browserPathname();
    return paymentResultTokenFromPath(path) || paymentTokenFromPath(path) ? (
      <PaymentPageSkeleton />
    ) : (
      <>{children}</>
    );
  }

  if (mode === "result") {
    return <PaymentResultClient />;
  }

  if (mode === "checkout" && token) {
    return <PaymentPageClient token={token} />;
  }

  return <>{children}</>;
}
