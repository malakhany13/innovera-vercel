"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { useAuth } from "@/components/providers/AuthProvider";
import Config from "@/lib/config/app.config";
import { studentAuthHeaders } from "@/lib/auth/student-headers";
import {
  isInternshipInterviewFailed,
  isInternshipInterviewPassed,
  isInternshipPaid,
  type InternshipEnrollment,
} from "@/lib/laravel/internship-enrollment-status";
import { parseInternshipEnrollmentsPayload } from "@/lib/laravel/internship-enrollments";
import {
  INTERNSHIP_FORM_HERO_IMAGE,
  INTERNSHIP_INTRO,
  isInternshipScorePassing,
} from "./constants";
import InternshipResultStep from "./InternshipResultStep";
import {
  fetchInternshipProgramsClient,
  useInternshipProgram,
} from "@/lib/laravel/internship-programs-client";

type InterviewStepMode = "field" | "link";

export interface InternshipFieldSelection {
  /** Backend internship program id from GET /api/v1/internship-programs */
  programId: number;
  /** Backend program title, for display */
  title: string;
  /** First-trial fee (EGP). Laravel `price`. */
  price: string;
  /** Second-trial / retake fee (EGP). Laravel `Second_price`. */
  secondPrice?: string | null;
}

interface InternshipInterviewStepProps {
  mode: InterviewStepMode;
  /** Stored selection (field mode seed + link mode display). */
  selection?: InternshipFieldSelection | null;
  /** Field mode: continue after field select (parent checks paid → interview, else payment). */
  onContinue?: (selection: InternshipFieldSelection) => void | Promise<void>;
  /** Link mode: go back to payment when unpaid. */
  onBackToPayment?: () => void;
  /** Link mode: interviewer failed → retry payment (PayTabs / Fawry). */
  onRetryPayment?: () => void;
  /** Link mode: finished after opening / confirming interview. */
  onDone?: () => void;
}

interface FieldOption {
  programId: number;
  label: string;
  description: string;
  price: string;
}

const fieldClass =
  "w-full rounded-xl bg-slate-100 border border-transparent px-4 py-3.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 transition appearance-none";

export default function InternshipInterviewStep({
  mode,
  selection = null,
  onContinue,
  onBackToPayment,
  onRetryPayment,
  onDone,
}: InternshipInterviewStepProps) {
  const { user, ready: authReady, logout } = useAuth();
  const [programId, setProgramId] = useState<number | "">(
    selection?.programId ?? "",
  );
  const [options, setOptions] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(mode === "field");
  const [loadError, setLoadError] = useState<string | null>(null);

  const [paymentChecking, setPaymentChecking] = useState(mode === "link");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [enrollmentInterviewUrl, setEnrollmentInterviewUrl] = useState<string | null>(
    null,
  );
  const [interviewerStatus, setInterviewerStatus] = useState<string | null>(null);
  const [enrollmentProgramTitle, setEnrollmentProgramTitle] = useState<string | null>(
    null,
  );
  const [score, setScore] = useState<{ total: number; max: number } | null>(null);
  const [continuing, setContinuing] = useState(false);
  const { program: liveProgram } = useInternshipProgram(
    mode === "link" ? selection?.programId ?? null : null,
  );

  useEffect(() => {
    if (mode !== "field") return;

    let cancelled = false;

    async function loadPrograms() {
      setLoading(true);
      setLoadError(null);

      try {
        const allPrograms = await fetchInternshipProgramsClient();
        // A program with no price can't be paid for, so it can't be enrolled in —
        // but dropping it silently renders an empty dropdown with no explanation
        // (the exact symptom seen in production), so surface that case instead.
        const programs = allPrograms.filter((program) => Boolean(program.price));

        if (allPrograms.length === 0) {
          throw new Error(
            "No internship programs are available right now. Please try again later.",
          );
        }

        if (programs.length === 0) {
          throw new Error(
            "Internship programs are configured but none have a price set. Please contact support.",
          );
        }

        // Everything shown here is the program as the dashboard defines it.
        // The interview link is not: it comes from the enrollment once paid.
        const nextOptions: FieldOption[] = programs.map((program) => ({
          programId: program.id,
          label: program.title || `Program #${program.id}`,
          description: program.description,
          price: program.price,
        }));

        if (!cancelled) {
          setOptions(nextOptions);
          if (
            selection?.programId &&
            nextOptions.some((option) => option.programId === selection.programId)
          ) {
            setProgramId(selection.programId);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setOptions([]);
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load internship programs.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPrograms();
    return () => {
      cancelled = true;
    };
  }, [mode, selection?.programId]);

  useEffect(() => {
    if (mode !== "link") return;
    if (!authReady) return;

    let cancelled = false;

    async function verifyPayment() {
      setPaymentChecking(true);
      setPaymentError(null);
      setHasPaid(false);
      setEnrollmentInterviewUrl(null);
      setInterviewerStatus(null);
      setScore(null);

      if (!user?.token) {
        if (!cancelled) {
          setPaymentError("Please log in to verify your internship payment.");
          setPaymentChecking(false);
        }
        return;
      }

      if (!selection?.programId) {
        if (!cancelled) {
          setPaymentError("No internship program selected.");
          setPaymentChecking(false);
        }
        return;
      }

      try {
        const response = await fetch(Config.AUTH.myEnrollments, {
          headers: studentAuthHeaders(user.token),
          cache: "no-store",
        });
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        if (!response.ok) {
          const message = payload?.error || "Failed to verify payment status.";
          if (response.status === 401) {
            logout();
          }
          throw new Error(message);
        }

        const enrollments = parseInternshipEnrollmentsPayload(payload);
        const match =
          enrollments.find(
            (row) => row.internshipProgramId === selection.programId,
          ) ?? enrollments[0];

        const paid = match
          ? isInternshipPaid(match.internshipPaymentStatus) ||
            Boolean(match.interviewUrl)
          : false;
        const interviewUrl = match?.interviewUrl?.trim() || null;
        const interviewer = match?.interviewerStatus?.trim().toLowerCase() || null;
        const matchedScore =
          match?.totalScore != null && match?.totalScoreMax != null
            ? { total: match.totalScore, max: match.totalScoreMax }
            : null;

        if (!cancelled) {
          setHasPaid(paid);
          setEnrollmentInterviewUrl(interviewUrl);
          setEnrollmentProgramTitle(match?.internshipProgramTitle?.trim() || null);
          setInterviewerStatus(interviewer);
          setScore(matchedScore);
          if (!paid) {
            setPaymentError(
              match
                ? "Payment is still pending. Complete payment before accessing the AI interview link."
                : "No paid internship enrollment found for this program yet.",
            );
          }
        }
      } catch (error) {
        if (!cancelled) {
          setHasPaid(false);
          setEnrollmentInterviewUrl(null);
          setInterviewerStatus(null);
          setPaymentError(
            error instanceof Error
              ? error.message
              : "Unable to verify internship payment.",
          );
        }
      } finally {
        if (!cancelled) setPaymentChecking(false);
      }
    }

    void verifyPayment();
    return () => {
      cancelled = true;
    };
  }, [mode, authReady, user?.token, selection?.programId, logout]);

  const selectedOption = useMemo(
    () => options.find((option) => option.programId === programId) ?? null,
    [options, programId],
  );

  // Only the server's link: it carries the signed token the interviewer needs,
  // so there is no meaningful local fallback.
  const interviewUrl = enrollmentInterviewUrl;

  const canShowInterviewLink = Boolean(
    interviewUrl && hasPaid && !paymentChecking,
  );

  const interviewPassed =
    score != null
      ? isInternshipScorePassing(score.total, score.max)
      : interviewerStatus != null && isInternshipInterviewPassed(interviewerStatus);
  const interviewFailed =
    score != null
      ? !isInternshipScorePassing(score.total, score.max)
      : interviewerStatus != null && isInternshipInterviewFailed(interviewerStatus);

  if (mode === "link" && !paymentChecking && interviewPassed) {
    return (
      <InternshipResultStep
        outcome="passed"
        feeAmount={liveProgram?.price}
        score={score}
      />
    );
  }

  if (mode === "link" && !paymentChecking && interviewFailed) {
    return (
      <InternshipResultStep
        outcome="failed"
        feeAmount={liveProgram?.secondPrice}
        score={score}
        onRetryPayment={onRetryPayment ?? onBackToPayment}
      />
    );
  }

  return (
    <div className="bg-white min-h-[70vh]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src={INTERNSHIP_FORM_HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/55" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-28 sm:pt-20 sm:pb-36 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-tight mb-5">
            Our <span className="text-brand-cyan">internship</span>
          </h1>
          <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {INTERNSHIP_INTRO}
          </p>
        </div>
      </section>

      <section className="relative z-10 max-w-xl mx-auto px-6 -mt-20 sm:-mt-28 pb-20">
        <div className="bg-white rounded-[1.75rem] shadow-[0_16px_50px_-12px_rgba(15,23,42,0.18)] border border-slate-100 px-6 sm:px-10 py-8 sm:py-10">
          {mode === "field" ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 mb-1">
                  <span className="text-brand-cyan">Select</span> Your internship Field
                </h2>
                <p className="text-slate-400 text-sm">Sign up in our internship</p>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="internship-field"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Select your Field
                </label>
                <select
                  id="internship-field"
                  value={programId === "" ? "" : String(programId)}
                  onChange={(e) => {
                    const next = e.target.value;
                    setProgramId(next ? Number(next) : "");
                  }}
                  className={fieldClass}
                  disabled={loading || Boolean(loadError)}
                >
                  <option value="" disabled>
                    {loading ? "Loading fields…" : "-- Select --"}
                  </option>
                  {options.map((option) => (
                    <option key={option.programId} value={option.programId}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {loadError ? (
                  <p className="mt-2 text-sm text-red-600">{loadError}</p>
                ) : null}
              </div>

              <div className="mb-6 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-cyan transition-all duration-300"
                  style={{ width: selectedOption ? "50%" : "25%" }}
                />
              </div>

              <button
                type="button"
                disabled={!selectedOption || continuing}
                onClick={() => {
                  if (!selectedOption || continuing) return;
                  const nextSelection: InternshipFieldSelection = {
                    programId: selectedOption.programId,
                    title: selectedOption.label,
                    price: selectedOption.price,
                  };
                  setContinuing(true);
                  void Promise.resolve(onContinue?.(nextSelection)).finally(() => {
                    setContinuing(false);
                  });
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-cyan text-white font-bold shadow-lg shadow-brand-cyan/20 hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {continuing ? "Checking payment…" : "Continue"}
                {!continuing ? <ArrowRight className="w-4 h-4" /> : null}
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 mb-1">
                  <span className="text-brand-cyan">AI</span> Interview
                </h2>
                <p className="text-slate-400 text-sm">
                  Your assessment link unlocks after payment is confirmed
                </p>
              </div>

              <div className="mb-6">
                {paymentChecking ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                    <p className="text-sm text-slate-500">
                      Verifying your payment status…
                    </p>
                  </div>
                ) : canShowInterviewLink && interviewUrl ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center">
                      <p className="text-sm font-semibold text-emerald-800">
                        Payment confirmed
                      </p>
                      <p className="text-sm text-emerald-700 mt-1">
                        You paid successfully. Your AI interview link is unlocked.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-brand-cyan/30 bg-brand-cyan/5 px-5 py-6 sm:px-6 sm:py-7">
                      <p className="text-sm font-medium text-slate-500 mb-1">
                        Your interview for
                      </p>
                      <p className="text-lg font-display font-bold text-brand-navy mb-2">
                        {enrollmentProgramTitle ||
                          selection?.title ||
                          "Selected internship"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-8 text-center space-y-3">
                    <p className="text-sm font-semibold text-amber-900">
                      Interview link locked
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      {paymentError ||
                        "Complete payment before accessing the AI interview link."}
                    </p>
                    {!user?.token ? (
                      <Link
                        href="/login"
                        className="inline-flex text-sm font-semibold text-brand-cyan hover:underline"
                      >
                        Log in again
                      </Link>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="mb-6 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-cyan transition-all duration-300"
                  style={{
                    width: canShowInterviewLink
                      ? "100%"
                      : paymentChecking
                        ? "85%"
                        : "75%",
                  }}
                />
              </div>

              {canShowInterviewLink && interviewUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    window.open(interviewUrl, "_blank", "noopener,noreferrer");
                    onDone?.();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-cyan text-white font-bold shadow-lg shadow-brand-cyan/20 hover:bg-cyan-500 transition-colors"
                >
                  Go to AI interview
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={paymentChecking}
                  onClick={() => onBackToPayment?.()}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-cyan text-white font-bold shadow-lg shadow-brand-cyan/20 hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentChecking ? "Checking payment…" : "Back to payment"}
                  {!paymentChecking ? <ArrowRight className="w-4 h-4" /> : null}
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
