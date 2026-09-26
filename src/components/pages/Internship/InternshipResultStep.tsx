"use client";

import { ArrowRight, CheckCircle2, GraduationCap, XCircle } from "lucide-react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import {
  formatInternshipFee,
  INTERNSHIP_FORM_HERO_IMAGE,
  INTERNSHIP_INTRO,
  INTERNSHIP_PASS_PERCENT,
} from "./constants";

interface InternshipResultStepProps {
  outcome: "passed" | "failed";
  feeAmount?: string | number | null;
  /** Aggregate AI-interviewer score, when Laravel recorded one for this attempt. */
  score?: { total: number; max: number } | null;
  /** Selected internship track title (used for free short-course messaging). */
  programTitle?: string | null;
  /**
   * Both AI interview attempts failed — student is enrolled in a free short course
   * for their internship field (no further retake payment).
   */
  attemptsExhausted?: boolean;
  onRetryPayment?: () => void;
}

export default function InternshipResultStep({
  outcome,
  feeAmount,
  score,
  programTitle = null,
  attemptsExhausted = false,
  onRetryPayment,
}: InternshipResultStepProps) {
  const failed = outcome === "failed";
  const fee = feeAmount != null ? formatInternshipFee(feeAmount) : null;
  const scorePercent =
    score && score.max > 0 ? Math.round((score.total / score.max) * 100) : null;
  const fieldLabel = programTitle?.trim() || "your internship field";
  const showShortCourse = failed && attemptsExhausted;

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

      <section className="relative z-10 max-w-2xl mx-auto px-6 -mt-20 sm:-mt-28 pb-20">
        <div className="bg-white rounded-[1.75rem] shadow-[0_16px_50px_-12px_rgba(15,23,42,0.18)] border border-slate-100 px-6 sm:px-10 py-8 sm:py-10">
          {showShortCourse ? (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-cyan/10">
                <GraduationCap className="h-8 w-8 text-brand-cyan" aria-hidden />
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 leading-snug mb-3">
                You&apos;re on the list
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
                You have enrolled in a free of charge short course in your field
                {programTitle?.trim() ? (
                  <>
                    {" "}
                    (
                    <span className="font-semibold text-slate-800">{fieldLabel}</span>
                    )
                  </>
                ) : null}
                .
              </p>
              <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                Both AI interview attempts for this internship are complete, so there
                is no further payment or retake.
              </p>
            </div>
          ) : (
          <>
          <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-8">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 leading-snug mb-4">
                Overall Rating{" "}
                {failed ? (
                  <span className="text-red-500">(Unsuccessful)</span>
                ) : (
                  <span className="text-emerald-600">(Passed)</span>
                )}
              </h2>
              {failed ? (
                <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                  <p>
                    Unfortunately, you didn&apos;t pass this time. You can retry the
                    AI interview after completing payment again.
                  </p>
                  {fee ? (
                    <p className="font-semibold text-slate-800">
                      Note: Retaking the AI Interview requires repaying the {fee}{" "}
                      EGP administrative fee.
                    </p>
                  ) : (
                    <p className="font-semibold text-slate-800">
                      Note: Retaking the AI Interview requires repaying the
                      administrative fee.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-600 leading-relaxed">
                  Congratulations! You&apos;ve passed! Your AI interview score meets the{" "}
                  {INTERNSHIP_PASS_PERCENT}% threshold for the internship track.
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 sm:pt-1">
              {scorePercent != null && score ? (
                <div
                  className={
                    failed
                      ? "flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 border-red-200 text-red-600"
                      : "flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 border-emerald-200 text-emerald-600"
                  }
                >
                  <span className="text-xl font-display font-bold leading-none">
                    {scorePercent}%
                  </span>
                </div>
              ) : failed ? (
                <XCircle className="w-20 h-20 text-red-500" aria-hidden />
              ) : (
                <CheckCircle2 className="w-20 h-20 text-emerald-500" aria-hidden />
              )}
              <span
                className={
                  failed
                    ? "inline-flex rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white"
                    : "inline-flex rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white"
                }
              >
                {failed ? "Not Passed" : "Passed"}
              </span>
            </div>
          </div>

          {failed ? (
            <button
              type="button"
              onClick={() => onRetryPayment?.()}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-cyan text-white font-bold shadow-lg shadow-brand-cyan/20 hover:bg-cyan-500 transition-colors"
            >
              Retry payment
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : null}
          </>
          )}
        </div>
      </section>
    </div>
  );
}
