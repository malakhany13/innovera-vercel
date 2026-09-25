"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import { fetchPaymentStatus, type PaymentStatus } from "@/lib/api/payment";

const MAX_POLLS = 5;
const POLL_INTERVAL_MS = 3000;

const SHELL_TOKEN = "fallback";

/** Reads the real token from `/payment/{token}/result` (the exported shell is `fallback`). */
function tokenFromPathname(pathname: string | null): string | null {
  const token = pathname?.match(/\/payment\/([^/]+)\/result/i)?.[1];
  if (!token || token === SHELL_TOKEN) return null;
  return decodeURIComponent(token);
}

function resolveResultToken(
  pathname: string | null,
  searchParams: URLSearchParams,
): string | null {
  const fromWindow =
    typeof window !== "undefined" ? tokenFromPathname(window.location.pathname) : null;
  if (fromWindow) return fromWindow;

  const fromRouter = tokenFromPathname(pathname);
  if (fromRouter) return fromRouter;

  const fromQuery = searchParams.get("token")?.trim() || "";
  if (fromQuery && fromQuery !== SHELL_TOKEN) return fromQuery;

  return null;
}

/**
 * Where PayTabs and Fawry send the student after checkout
 * (`/payment/{token}/result?payment_status=…&transaction_number=…`).
 *
 * The query string only says what the gateway reported on the way back, so the
 * outcome shown here always comes from the server's payment status. A gateway
 * webhook can land a few seconds after the redirect, so "pending" is re-checked
 * briefly before settling.
 */
export default function PaymentResultClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPayAtFawry = searchParams.get("is_payatfawry") === "1";
  const gatewayReference = searchParams.get("transaction_number");

  const [token, setToken] = useState<string | null>(null);
  const [tokenReady, setTokenReady] = useState(false);
  const [result, setResult] = useState<PaymentStatus | null>(null);
  const [failed, setFailed] = useState(false);
  /** Polling finished for this round (settled, or out of retries). */
  const [settled, setSettled] = useState(false);
  /** Bumped by "Check again" to start a new round. */
  const [round, setRound] = useState(0);

  useEffect(() => {
    setToken(resolveResultToken(pathname, searchParams));
    setTokenReady(true);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    let timer: number | undefined;

    async function poll(n: number) {
      try {
        const next = await fetchPaymentStatus(token!);
        if (cancelled) return;
        setResult(next);
        setFailed(false);
        if (next.outcome === "pending" && !isPayAtFawry && n < MAX_POLLS) {
          timer = window.setTimeout(() => void poll(n + 1), POLL_INTERVAL_MS);
        } else {
          setSettled(true);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
          setSettled(true);
        }
      }
    }

    void poll(0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [token, isPayAtFawry, round]);

  const checkAgain = () => {
    setSettled(false);
    setFailed(false);
    setRound((n) => n + 1);
  };

  const reference = result?.transactionNumber || gatewayReference;
  const isInternship = result?.paymentType === "internship";
  const stillChecking = !settled;

  if (!tokenReady) {
    return (
      <ResultCard
        icon={<Loader2 className="w-10 h-10 text-slate-400 animate-spin" />}
        title="Loading…"
      />
    );
  }

  if (!token) {
    return (
      <ResultCard
        icon={<Clock className="w-10 h-10 text-amber-500" />}
        title="We couldn't find this payment"
        body="Open the payment result link from PayTabs or your enrollment email and try again."
      />
    );
  }

  if (stillChecking) {
    return (
      <ResultCard
        icon={<Loader2 className="w-10 h-10 text-brand-cyan animate-spin" />}
        title="Confirming your payment…"
        body="This usually takes a few seconds. Please don't close this page."
      />
    );
  }

  if (failed) {
    return (
      <ResultCard
        icon={<Clock className="w-10 h-10 text-amber-500" />}
        title="We couldn't confirm your payment yet"
        body="If you completed the payment, it will be confirmed shortly. You can check again in a moment."
        reference={reference}
        actions={
          <button type="button" onClick={checkAgain} className={primaryButton}>
            Check again
          </button>
        }
      />
    );
  }

  if (result?.outcome === "paid") {
    return (
      <ResultCard
        icon={<CheckCircle2 className="w-10 h-10 text-emerald-500" />}
        title="Payment successful"
        body={
          isInternship
            ? "Your internship payment is confirmed. Your AI interview is now unlocked."
            : "Your payment is confirmed. We'll email you the details of your enrollment."
        }
        reference={reference}
        actions={
          <Link href={isInternship ? "/internship" : "/courses"} className={primaryButton}>
            {isInternship ? "Continue to AI interview" : "Browse courses"}
          </Link>
        }
      />
    );
  }

  if (result?.outcome === "failed") {
    return (
      <ResultCard
        icon={<XCircle className="w-10 h-10 text-red-500" />}
        title="Payment was not completed"
        body="No payment was taken. You can try again with the same link."
        actions={
          <Link href={`/payment/${encodeURIComponent(token)}`} className={primaryButton}>
            Try again
          </Link>
        }
      />
    );
  }

  return (
    <ResultCard
      icon={<Clock className="w-10 h-10 text-amber-500" />}
      title={isPayAtFawry ? "Complete your payment at Fawry" : "Payment pending"}
      body={
        isPayAtFawry
          ? "Pay at any Fawry outlet or in the Fawry app using the reference number below. Your enrollment is confirmed automatically once you pay."
          : "We haven't received confirmation from the payment provider yet. This page will show the result once it arrives."
      }
      reference={reference}
      actions={
        <button type="button" onClick={checkAgain} className={primaryButton}>
          Check again
        </button>
      }
    />
  );
}

const primaryButton =
  "inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-cyan text-white font-bold hover:bg-cyan-500 transition-colors";

function ResultCard({
  icon,
  title,
  body,
  reference,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  body?: string;
  reference?: string | null;
  actions?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <h1 className="text-2xl font-display font-bold text-brand-navy mb-3">{title}</h1>
        {body ? <p className="text-slate-500 mb-6">{body}</p> : null}
        {reference ? (
          <p className="mb-6 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Reference number:{" "}
            <span className="font-mono font-semibold text-slate-900">{reference}</span>
          </p>
        ) : null}
        {actions ? <div className="flex justify-center">{actions}</div> : null}
      </div>
    </div>
  );
}
