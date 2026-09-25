"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  formatInterviewerStatusLabel,
  formatPaymentStatusLabel,
  isInternshipPaid,
  type InternshipEnrollment,
} from "@/lib/laravel/internship-enrollment-status";
import {
  fetchMyEnrollmentsClient,
  MyEnrollmentsClientError,
} from "@/lib/laravel/my-enrollments-client";
import { formatInternshipFee } from "@/components/pages/Internship/constants";
import { cn } from "@/lib/utils";

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
      <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800 break-all">{value}</p>
    </div>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "warning" | "danger" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone === "success" && "bg-emerald-50 text-emerald-700 border border-emerald-100",
        tone === "warning" && "bg-amber-50 text-amber-800 border border-amber-100",
        tone === "danger" && "bg-red-50 text-red-700 border border-red-100",
        tone === "neutral" && "bg-slate-50 text-slate-600 border border-slate-100",
      )}
    >
      {label}
    </span>
  );
}

function paymentTone(status: string): "success" | "warning" | "danger" | "neutral" {
  if (isInternshipPaid(status)) return "success";
  const normalized = status.toLowerCase();
  if (normalized === "failed") return "danger";
  if (normalized === "pending") return "warning";
  return "neutral";
}

function interviewerTone(status: string): "success" | "warning" | "danger" | "neutral" {
  const normalized = status.toLowerCase();
  if (normalized === "passed" || normalized === "pass" || normalized === "accepted") {
    return "success";
  }
  if (normalized === "failed" || normalized === "fail" || normalized === "rejected") {
    return "danger";
  }
  if (normalized === "pending" || normalized === "scheduled") return "warning";
  return "neutral";
}

export default function AccountPage() {
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const [enrollments, setEnrollments] = useState<InternshipEnrollment[]>([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [enrollmentsError, setEnrollmentsError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  const token = user?.token?.trim() || "";

  useEffect(() => {
    if (!token) {
      setEnrollments([]);
      setEnrollmentsError(null);
      setEnrollmentsLoading(false);
      return;
    }

    let cancelled = false;
    setEnrollmentsLoading(true);
    setEnrollmentsError(null);

    void fetchMyEnrollmentsClient(token)
      .then((data) => {
        if (!cancelled) setEnrollments(data);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (
          error instanceof MyEnrollmentsClientError &&
          error.status === 401
        ) {
          logout();
        }
        setEnrollments([]);
        setEnrollmentsError(
          error instanceof Error
            ? error.message
            : "Unable to load internship status.",
        );
      })
      .finally(() => {
        if (!cancelled) setEnrollmentsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  if (!ready || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-[#f7f8fa]">
        <p className="text-slate-500 text-sm">Loading your account…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#f7f8fa]">
      <section className="max-w-3xl mx-auto px-6 py-14 sm:py-20">
        <p className="text-sm font-bold text-brand-cyan uppercase tracking-[0.2em] mb-3">
          My Account
        </p>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-brand-navy mb-2">
          {user.name}
        </h1>
        <p className="text-slate-500 mb-10">Welcome back to your Innovera account.</p>

        <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.1)] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserRound className="w-7 h-7" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Account holder
              </p>
              <p className="text-lg font-display font-bold text-brand-navy">{user.name}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <InfoCell label="Email" value={user.email} />
            {user.phone ? <InfoCell label="Mobile" value={user.phone} /> : null}
            {user.college ? <InfoCell label="College" value={user.college} /> : null}
            {user.academicYear ? (
              <InfoCell label="Academic year" value={user.academicYear} />
            ) : null}
            {user.roleInTech ? (
              <InfoCell label="Role in tech" value={user.roleInTech} />
            ) : null}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h2 className="text-lg font-display font-bold text-brand-navy mb-1">
              Internship status
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Payment and interview progress for your enrollments.
            </p>

            {enrollmentsLoading ? (
              <p className="text-sm text-slate-500">Loading internship status…</p>
            ) : enrollmentsError ? (
              <p className="text-sm text-red-600">{enrollmentsError}</p>
            ) : enrollments.length === 0 ? (
              <p className="text-sm text-slate-500">
                No internship enrollments yet. Apply from the internship page.
              </p>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-5 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <p className="font-semibold text-brand-navy">
                          {enrollment.internshipProgramTitle}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Fee: {formatInternshipFee(enrollment.internshipCost)} EGP
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge
                        label={formatPaymentStatusLabel(
                          enrollment.internshipPaymentStatus,
                        )}
                        tone={paymentTone(enrollment.internshipPaymentStatus)}
                      />
                      <StatusBadge
                        label={formatInterviewerStatusLabel(
                          enrollment.interviewerStatus,
                        )}
                        tone={interviewerTone(enrollment.interviewerStatus)}
                      />
                    </div>

                    <p className="text-sm text-slate-600">
                      {isInternshipPaid(enrollment.internshipPaymentStatus)
                        ? "Internship payment accepted."
                        : "Internship payment is not completed yet."}{" "}
                      {formatInterviewerStatusLabel(enrollment.interviewerStatus)}.
                      {!isInternshipPaid(enrollment.internshipPaymentStatus) &&
                      enrollment.paymentToken ? (
                        <>
                          {" "}
                          <Link
                            href={`/payment/${encodeURIComponent(enrollment.paymentToken)}`}
                            className="font-semibold text-brand-cyan hover:underline"
                          >
                            Open payment
                          </Link>
                        </>
                      ) : null}
                      {enrollment.interviewUrl ? (
                        <>
                          {" "}
                          <a
                            href={enrollment.interviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-brand-cyan hover:underline"
                          >
                            Open interview
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/internship"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-cyan text-white font-bold hover:bg-cyan-500 transition-colors"
            >
              Go to Internship
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
