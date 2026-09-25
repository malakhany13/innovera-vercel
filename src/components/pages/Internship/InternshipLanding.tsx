"use client";

import { ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import {
  formatInternshipFee,
  INTERNSHIP_HERO_IMAGE,
  INTERNSHIP_INTRO,
} from "./constants";

export interface LandingTrack {
  id: number | string;
  title: string;
  description: string;
  /** Dashboard first-trial fee (EGP). */
  price?: string | null;
  /** Dashboard second-trial fee (EGP). */
  secondPrice?: string | null;
}

export type TracksStatus = "loading" | "ready" | "error";

type LandingGate =
  | { status: "idle" | "loading" }
  | { status: "guest" }
  | { status: "none" }
  | {
      status: "pending" | "paid";
      paymentLabel: string;
      interviewerLabel: string;
      interviewOutcome: "passed" | "failed" | "pending";
      enrollment: {
        internshipProgramTitle: string;
        internshipProgramId?: number;
      };
    }
  | { status: "error"; message: string };

interface InternshipLandingProps {
  gate: LandingGate;
  /** Programs from the parent RTK subscription (fetched once). */
  tracks: LandingTrack[];
  tracksStatus: TracksStatus;
  onApply: () => void;
  onRefresh: () => void;
}

function ctaLabel(gate: LandingGate): string {
  if (gate.status === "loading" || gate.status === "idle") return "Checking status…";
  if (gate.status === "guest") return "Log in to apply";
  if (gate.status === "paid" && gate.interviewOutcome === "passed") {
    return "View your result";
  }
  if (gate.status === "paid" && gate.interviewOutcome === "failed") {
    return "Retry payment";
  }
  if (gate.status === "paid") return "Continue to AI interview";
  if (gate.status === "pending") return "Complete payment";
  return "Apply Now";
}

export default function InternshipLanding({
  gate,
  tracks,
  tracksStatus,
  onApply,
  onRefresh,
}: InternshipLandingProps) {
  const checking = gate.status === "loading" || gate.status === "idle";
  const liveRetakeFee =
    gate.status === "paid" && gate.enrollment.internshipProgramId != null
      ? tracks.find((track) => track.id === gate.enrollment.internshipProgramId)
          ?.secondPrice
      : null;

  return (
    <div className="bg-[#f5f7fa] min-h-[70vh]">
      <section className="max-w-4xl mx-auto px-6 pt-14 pb-8 lg:pt-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl sm:text-5xl lg:text-[3.25rem] font-display font-bold text-slate-700 leading-tight mb-5"
        >
          Our <span className="text-brand-cyan">internship</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
        >
          {INTERNSHIP_INTRO}
        </motion.p>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="bg-white rounded-[1.75rem] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.12)] border border-slate-100/80 overflow-hidden"
        >
          <div className="relative w-full h-48 sm:h-56 md:h-64 bg-slate-100">
            <OptimizedImage
              src={INTERNSHIP_HERO_IMAGE}
              alt="Internship workspace"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <div className="px-6 sm:px-10 py-8 sm:py-10">
            <div className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 text-left">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                    Your account status
                  </p>
                  {checking ? (
                    <p className="text-sm text-slate-600 inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-cyan" />
                      Checking enrollment & payment…
                    </p>
                  ) : gate.status === "guest" ? (
                    <p className="text-sm text-slate-600">
                      Log in to see if this account already paid for the internship.
                    </p>
                  ) : gate.status === "paid" && gate.interviewOutcome === "passed" ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-emerald-700">
                        You&apos;ve passed!
                      </p>
                      <p className="text-sm text-slate-600">
                        {gate.enrollment.internshipProgramTitle}. {gate.interviewerLabel}.
                      </p>
                    </div>
                  ) : gate.status === "paid" && gate.interviewOutcome === "failed" ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-red-600">
                        Interview unsuccessful — retry required
                      </p>
                      <p className="text-sm text-slate-600">
                        {gate.enrollment.internshipProgramTitle}. Pay{" "}
                        {liveRetakeFee
                          ? `${formatInternshipFee(liveRetakeFee)} EGP`
                          : "again"}{" "}
                        to retake the AI interview.
                      </p>
                    </div>
                  ) : gate.status === "paid" ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-emerald-700">
                        Paid — {gate.paymentLabel}
                      </p>
                      <p className="text-sm text-slate-600">
                        {gate.enrollment.internshipProgramTitle}. {gate.interviewerLabel}.
                      </p>
                    </div>
                  ) : gate.status === "pending" ? (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-amber-800">
                        Not paid yet — {gate.paymentLabel}
                      </p>
                      <p className="text-sm text-slate-600">
                        Enrollment found for {gate.enrollment.internshipProgramTitle}.
                        Complete payment to unlock the AI interview.
                      </p>
                    </div>
                  ) : gate.status === "error" ? (
                    <p className="text-sm text-red-600">{gate.message}</p>
                  ) : (
                    <p className="text-sm text-slate-600">
                      No internship enrollment on this account yet. Choose a track and
                      pay to continue.
                    </p>
                  )}
                </div>
                {gate.status !== "guest" && gate.status !== "idle" ? (
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={checking}
                    className="shrink-0 rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-white disabled:opacity-50"
                    aria-label="Refresh enrollment status"
                  >
                    <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
                  </button>
                ) : null}
              </div>
            </div>

            {tracksStatus !== "ready" || tracks.length === 0 ? (
              <div className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                {tracksStatus === "loading" ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading internship tracks…
                  </span>
                ) : tracksStatus === "error" ? (
                  "Internship tracks couldn't be loaded right now. Please refresh the page or try again later."
                ) : (
                  "No internship tracks are open right now. Please check back soon."
                )}
              </div>
            ) : null}

            <ol className="space-y-8 mb-10">
              {tracks.map((track, index) => (
                <motion.li
                  key={track.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <h2 className="text-base sm:text-lg font-display font-bold text-slate-900 mb-1.5">
              
                    <span className="text-brand-cyan tabular-nums">
                      {String(index + 1).padStart(2, "0")}.
                    </span>{" "}
                    {track.title}
                   
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed pl-0 sm:pl-0">
                    {track.description}
                  </p>
                </motion.li>
              ))}
            </ol>

            <button
              type="button"
              onClick={onApply}
              disabled={checking}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-cyan text-white font-bold text-sm sm:text-base shadow-lg shadow-brand-cyan/25 hover:bg-cyan-500 transition-colors disabled:opacity-60"
            >
              {checking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking status…
                </>
              ) : (
                <>
                  {ctaLabel(gate)}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
