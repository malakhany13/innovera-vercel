"use client";

import {
  ArrowRight,
  Building2,
  Copy,
  Landmark,
  Loader2,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import Config from "@/lib/config/app.config";
import { studentAuthHeaders } from "@/lib/auth/student-headers";
import {
  createInternshipFawryPayment,
  fetchInternshipPayTabsRedirectUrl,
  PaymentApiError,
} from "@/lib/api/payment";
import { parseInternshipEnrollmentsPayload } from "@/lib/laravel/internship-enrollments";
import type { FawryReferenceResponse, PaymentMethod } from "@/types/payment";
import {
  formatInternshipFee,
  getAssessmentBullets,
  INTERNSHIP_PASS_PERCENT,
} from "./constants";
import { internshipFeeForAttempt } from "@/lib/laravel/internship-programs";
import { useInternshipProgram } from "@/lib/laravel/internship-programs-client";
import { cn } from "@/lib/utils";

type PayTab = "paytabs" | "fawry";

interface InternshipPaymentStepProps {
  /** Laravel payment token when already known. */
  paymentToken?: string | null;
  /** Selected internship program id — fees come live from the dashboard API. */
  programId: number;
  /** True when paying again after a failed AI interview. */
  isSecondTrial?: boolean;
  onBack: () => void;
  onPaid: () => void;
}

export default function InternshipPaymentStep({
  paymentToken: paymentTokenProp,
  programId,
  isSecondTrial = false,
  onBack,
  onPaid,
}: InternshipPaymentStepProps) {
  const { user, ready } = useAuth();
  const { program, status: programStatus } = useInternshipProgram(programId);
  const attemptFee = program
    ? internshipFeeForAttempt(program, isSecondTrial)
    : "";
  /** Dashboard `Second_price` — shown as the retake cost in Retake Policy. */
  const secondTrialFee = program?.secondPrice?.trim() || "";
  const retakeCost = secondTrialFee
    ? formatInternshipFee(secondTrialFee)
    : null;
  const fee = attemptFee ? formatInternshipFee(attemptFee) : "";
  const assessmentBullets = attemptFee
    ? getAssessmentBullets(attemptFee, isSecondTrial)
    : [];
  const feesLoading = programStatus === "loading";
  const feesMissing = programStatus !== "loading" && !attemptFee;
  const [tab, setTab] = useState<PayTab>("paytabs");
  const [loadingMethod, setLoadingMethod] = useState<PaymentMethod | null>(null);
  const [fawryReference, setFawryReference] = useState<FawryReferenceResponse | null>(
    null,
  );
  const [resolvedToken, setResolvedToken] = useState<string | null>(
    paymentTokenProp?.trim() || null,
  );
  const [tokenLoading, setTokenLoading] = useState(!paymentTokenProp?.trim());
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    const fromProp = paymentTokenProp?.trim() || null;
    if (fromProp) {
      setResolvedToken(fromProp);
      setTokenLoading(false);
      setTokenError(null);
      return;
    }

    if (!ready) return;

    if (!user?.token) {
      setResolvedToken(null);
      setTokenLoading(false);
      setTokenError("Please log in to continue with payment.");
      return;
    }

    const authToken = user.token;
    let cancelled = false;

    const loadToken = async () => {
      setTokenLoading(true);
      setTokenError(null);

      try {
        const response = await fetch(Config.AUTH.myEnrollments, {
          method: "GET",
          headers: studentAuthHeaders(authToken),
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => null)) as {
          success?: boolean;
          error?: string;
        } | null;

        if (!response.ok || payload?.success === false) {
          throw new Error(payload?.error || "Failed to load payment link.");
        }

        const enrollments = parseInternshipEnrollmentsPayload(payload);
        const match =
          (programId != null
            ? enrollments.find((row) => row.internshipProgramId === programId)
            : null) ?? enrollments[0];
        const token = match?.paymentToken?.trim() || null;

        if (!cancelled) {
          setResolvedToken(token);
          if (!token) {
            setTokenError(
              match
                ? "No payment link is available for this enrollment yet. Contact support or re-apply."
                : "No internship enrollment found. Complete the application first.",
            );
          }
        }
      } catch (error) {
        if (!cancelled) {
          setResolvedToken(null);
          setTokenError(
            error instanceof Error
              ? error.message
              : "Unable to load your payment link.",
          );
        }
      } finally {
        if (!cancelled) setTokenLoading(false);
      }
    };

    void loadToken();

    return () => {
      cancelled = true;
    };
  }, [paymentTokenProp, programId, ready, user?.token]);

  const handlePayTabs = async () => {
    if (loadingMethod || !resolvedToken) return;

    setLoadingMethod("paytabs");
    toast.loading("Connecting to PayTabs…", { id: "internship-paytabs" });

    try {
      const redirectUrl = await fetchInternshipPayTabsRedirectUrl(resolvedToken);
      toast.success("Redirecting to PayTabs…", { id: "internship-paytabs" });
      window.location.assign(redirectUrl);
    } catch (error) {
      const message =
        error instanceof PaymentApiError
          ? error.message
          : "Unable to start PayTabs payment. Please try again.";
      toast.error(message, { id: "internship-paytabs" });
      setLoadingMethod(null);
    }
  };

  const handleFawry = async () => {
    if (loadingMethod || !resolvedToken) return;

    setLoadingMethod("fawry");
    toast.loading("Generating Fawry reference…", { id: "internship-fawry" });

    try {
      const result = await createInternshipFawryPayment(resolvedToken);
      setFawryReference(result);
      toast.success("Fawry reference ready", { id: "internship-fawry" });
    } catch (error) {
      const message =
        error instanceof PaymentApiError
          ? error.message
          : "Unable to start Fawry payment. Please try again.";
      toast.error(message, { id: "internship-fawry" });
    } finally {
      setLoadingMethod(null);
    }
  };

  const copyReference = async () => {
    const value = fawryReference?.transaction_number;
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      toast.success("Reference number copied");
    } catch {
      toast.error("Could not copy reference number");
    }
  };

  const handleConfirm = async () => {
    if (fawryReference) {
      onPaid();
      return;
    }
    if (tab === "paytabs") {
      await handlePayTabs();
      return;
    }
    await handleFawry();
  };

  const canPay =
    Boolean(resolvedToken) &&
    !tokenLoading &&
    !tokenError &&
    !feesLoading &&
    !feesMissing;

  return (
    <div className="bg-[#f5f7fa] min-h-[70vh] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-white rounded-[1.75rem] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.1)] border border-slate-100 p-6 sm:p-9">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-brand-navy leading-snug mb-7">
              {isSecondTrial
                ? "Innovera Internship: AI Interview Retake – Administration Fee"
                : "Innovera Internship: AI Interview Assessment – Administration Fee"}
            </h2>
            <ul className="space-y-5 mb-8">
              {feesLoading ? (
                <li className="text-sm text-slate-500 inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-cyan" />
                  Loading fee from the internship dashboard…
                </li>
              ) : feesMissing ? (
                <li className="text-sm text-red-600">
                  {isSecondTrial
                    ? "Retake fee is not available for this program yet."
                    : "Program fee is not available yet."}
                </li>
              ) : (
                assessmentBullets.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0" />
                    <div>
                      <p className="font-semibold text-brand-navy text-sm mb-1">
                        {item.title}
                      </p>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-5 py-4">
              <p className="font-semibold text-brand-navy text-sm mb-1">
                Retake Policy
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feesLoading ? (
                  "Loading…"
                ) : (
                  <>
                    Retakes cost{" "}
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {retakeCost ?? "—"}
                    </span>{" "}
                    EGP and are required if the score is below{" "}
                    {INTERNSHIP_PASS_PERCENT}%.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[1.75rem] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.1)] border border-slate-100 p-6 sm:p-9">
            <div className="flex items-start justify-between gap-4 mb-7">
              <h3 className="text-lg font-display font-bold text-brand-navy">
                {isSecondTrial ? "AI Interview retake fee" : "AI Interview fees"}
              </h3>
              <p className="text-2xl font-display font-bold text-brand-cyan tabular-nums">
                {feesLoading ? "…" : fee ? `${fee} LE` : "—"}
              </p>
            </div>

            {tokenLoading ? (
              <div className="mb-8 rounded-xl border border-slate-100 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-brand-cyan" />
                Loading your payment link…
              </div>
            ) : tokenError || !resolvedToken ? (
              <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-5 space-y-3 text-center">
                <p className="text-sm font-semibold text-amber-900">
                  Payment link unavailable
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {tokenError ||
                    "No valid payment token found for this internship enrollment."}
                </p>
                {!user?.token ? (
                  <Link
                    href="/login"
                    className="inline-flex text-sm font-semibold text-brand-cyan hover:underline"
                  >
                    Log in
                  </Link>
                ) : null}
              </div>
            ) : fawryReference ? (
              <div className="space-y-4 mb-8">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                      <Building2 className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Fawry reference number
                      </p>
                      {fawryReference.payment_status ? (
                        <p className="text-xs text-gray-600 capitalize">
                          Status: {fawryReference.payment_status}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p
                      className="flex-1 rounded-lg border border-amber-300 bg-white px-4 py-3 font-mono text-lg font-bold tracking-wide text-gray-900 text-center break-all"
                      aria-label="Fawry reference number"
                    >
                      {fawryReference.transaction_number}
                    </p>
                    <button
                      type="button"
                      onClick={() => void copyReference()}
                      className="shrink-0 rounded-lg border border-amber-300 bg-white p-3 text-amber-800 hover:bg-amber-100"
                      aria-label="Copy Fawry reference number"
                    >
                      <Copy className="size-4" aria-hidden />
                    </button>
                  </div>

                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
                    <li>Go to any Fawry outlet (or use Fawry Pay in supported apps).</li>
                    <li>
                      Provide this reference number:{" "}
                      <span className="font-semibold">
                        {fawryReference.transaction_number}
                      </span>
                    </li>
                    <li>Pay {fee} EGP to complete your assessment fee.</li>
                    <li>Keep your receipt until payment is confirmed.</li>
                  </ol>

                  <p
                    dir="rtl"
                    lang="ar"
                    className="rounded-lg border border-amber-200 bg-white/70 px-3 py-2 text-xs leading-relaxed text-gray-700 text-center"
                  >
                    مسؤولية فوري تقتصر على تحصيل المدفوعات. لأي استفسار يرجى التواصل معنا.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 mb-7">
                  {(
                    [
                      {
                        id: "paytabs" as const,
                        label: "PayTabs",
                        icon: WalletCards,
                      },
                      {
                        id: "fawry" as const,
                        label: "Pay with Fawry",
                        icon: Landmark,
                      },
                    ] as const
                  ).map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setTab(id);
                        setFawryReference(null);
                      }}
                      disabled={loadingMethod !== null}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border px-2 py-3.5 text-center transition-colors",
                        tab === id
                          ? "border-brand-cyan bg-brand-cyan/5 text-brand-navy"
                          : "border-slate-200 text-slate-500 hover:border-slate-300",
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          tab === id ? "text-brand-cyan" : "text-slate-400",
                        )}
                      />
                      <span className="text-[10px] sm:text-xs font-medium leading-tight">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mb-8 rounded-xl border border-slate-100 bg-slate-50 px-4 py-5 text-sm text-slate-600 leading-relaxed">
                  {tab === "fawry"
                    ? "After confirming, you will receive a Fawry reference to complete payment at any Fawry outlet or app."
                    : "You will be redirected to PayTabs to complete payment securely by card."}
                </div>
              </>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                disabled={loadingMethod !== null}
                className="px-5 py-3 rounded-full border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => void handleConfirm()}
                disabled={loadingMethod !== null || (!fawryReference && !canPay)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-cyan text-white font-bold shadow-lg shadow-brand-cyan/20 hover:bg-cyan-500 transition-colors disabled:opacity-60"
              >
                {loadingMethod || tokenLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing…
                  </>
                ) : fawryReference ? (
                  <>
                    Continue to AI interview
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Confirm Payment
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
