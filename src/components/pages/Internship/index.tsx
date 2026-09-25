"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  type AuthUser,
  useAuth,
} from "@/components/providers/AuthProvider";
import Config from "@/lib/config/app.config";
import { studentAuthHeaders } from "@/lib/auth/student-headers";
import {
  formatInterviewerStatusLabel,
  formatPaymentStatusLabel,
  isInternshipInterviewFailed,
  isInternshipInterviewPassed,
  isInternshipPaid,
  type InternshipEnrollment,
} from "@/lib/laravel/internship-enrollment-status";
import { fetchMyEnrollmentsClient } from "@/lib/laravel/my-enrollments-client";
import { parseInternshipEnrollmentsPayload } from "@/lib/laravel/internship-enrollments";
import InternshipFormStep, { type InternshipFormValues } from "./InternshipFormStep";
import InternshipInterviewStep, {
  type InternshipFieldSelection,
} from "./InternshipInterviewStep";
import InternshipLanding from "./InternshipLanding";
import InternshipPaymentStep from "./InternshipPaymentStep";
import InternshipResultStep from "./InternshipResultStep";
import {
  INTERNSHIP_LEVELS,
  isInternshipScorePassing,
  type InternshipLevel,
} from "./constants";
import type { InternshipProgram } from "@/lib/laravel/internship-programs";
import { useGetInternshipProgramsQuery } from "@/store/baseApi";
import type { LandingTrack, TracksStatus } from "./InternshipLanding";

type Step = "landing" | "form" | "field" | "payment" | "interview" | "preview-passed";

type EnrollmentGate =
  | { status: "idle" | "loading" }
  | { status: "guest" }
  | { status: "none" }
  | {
      status: "pending" | "paid";
      enrollment: InternshipEnrollment;
      selection: InternshipFieldSelection;
      paymentLabel: string;
      interviewerLabel: string;
      interviewOutcome: "passed" | "failed" | "pending";
    }
  | { status: "error"; message: string };

function isInternshipLevel(value: string): value is InternshipLevel {
  return (INTERNSHIP_LEVELS as readonly string[]).includes(value);
}

/** Map cached login/signup student into internship form defaults. */
function authToInternshipDefaults(
  user: AuthUser | null,
): Partial<InternshipFormValues> {
  if (!user) return {};

  const defaults: Partial<InternshipFormValues> = {};

  if (user.name.trim()) defaults.name = user.name.trim();
  if (user.email.trim()) defaults.email = user.email.trim();

  const phone = user.phone?.trim();
  if (phone) {
    defaults.phone = phone;
    defaults.whatsapp = phone;
  }

  if (user.college?.trim()) defaults.university = user.college.trim();
  if (user.roleInTech?.trim()) defaults.major = user.roleInTech.trim();

  const academicYear = user.academicYear?.trim();
  if (academicYear && isInternshipLevel(academicYear)) {
    defaults.level = academicYear;
  }

  return defaults;
}

function pickEnrollment(
  enrollments: InternshipEnrollment[],
): InternshipEnrollment | null {
  if (enrollments.length === 0) return null;

  const paid = enrollments.find(
    (row) =>
      isInternshipPaid(row.internshipPaymentStatus) || Boolean(row.interviewUrl),
  );
  if (paid) return paid;

  return enrollments[0];
}

function selectionFromEnrollment(
  enrollment: InternshipEnrollment,
  program?: InternshipProgram | null,
): InternshipFieldSelection {
  return {
    programId: enrollment.internshipProgramId,
    title: enrollment.internshipProgramTitle || program?.title || "",
    price: program?.price || "",
    secondPrice: program?.secondPrice ?? null,
  };
}

function tracksFromPrograms(programs: InternshipProgram[]): LandingTrack[] {
  return programs.map((program) => ({
    id: program.id,
    title: program.title,
    description: program.description,
    price: program.price,
    secondPrice: program.secondPrice,
  }));
}

export default function Internship() {
  const router = useRouter();
  const { user, ready } = useAuth();
  // Single page-level subscription — children read props / shared RTK cache.
  const {
    data: programs = [],
    isLoading: programsLoading,
    isError: programsError,
    isSuccess: programsSuccess,
    refetch: refetchPrograms,
  } = useGetInternshipProgramsQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const tracks = useMemo(() => tracksFromPrograms(programs), [programs]);
  const tracksStatus: TracksStatus = programsLoading
    ? "loading"
    : programsError || !programsSuccess
      ? "error"
      : "ready";

  const [step, setStep] = useState<Step>("landing");
  const [formValues, setFormValues] = useState<Partial<InternshipFormValues>>({});
  const [fieldSelection, setFieldSelection] =
    useState<InternshipFieldSelection | null>(null);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [isSecondTrial, setIsSecondTrial] = useState(false);
  const [gate, setGate] = useState<EnrollmentGate>({ status: "idle" });

  const authDefaults = useMemo(() => authToInternshipDefaults(user), [user]);

  const refreshEnrollmentGate = useCallback(async () => {
    if (!ready) {
      setGate({ status: "loading" });
      return;
    }

    if (!user?.token) {
      setGate({ status: "guest" });
      return;
    }

    setGate({ status: "loading" });

    try {
      // Programs come from the page-level RTK query — do not refetch here.
      const enrollments = await fetchMyEnrollmentsClient(user.token);
      const enrollment = pickEnrollment(enrollments);

      if (!enrollment) {
        setGate({ status: "none" });
        return;
      }

      const program =
        programs.find((row) => row.id === enrollment.internshipProgramId) ?? null;
      const selection = selectionFromEnrollment(enrollment, program);
      const paid =
        isInternshipPaid(enrollment.internshipPaymentStatus) ||
        Boolean(enrollment.interviewUrl);

      const interviewOutcome =
        enrollment.totalScore != null && enrollment.totalScoreMax != null
          ? isInternshipScorePassing(
              enrollment.totalScore,
              enrollment.totalScoreMax,
            )
            ? "passed"
            : "failed"
          : isInternshipInterviewPassed(enrollment.interviewerStatus)
            ? "passed"
            : isInternshipInterviewFailed(enrollment.interviewerStatus)
              ? "failed"
              : "pending";

      setGate({
        status: paid ? "paid" : "pending",
        enrollment,
        selection,
        paymentLabel: formatPaymentStatusLabel(enrollment.internshipPaymentStatus),
        interviewerLabel: formatInterviewerStatusLabel(
          enrollment.interviewerStatus,
        ),
        interviewOutcome,
      });
      setFieldSelection(selection);
      setPaymentToken(enrollment.paymentToken);
    } catch (error) {
      setGate({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to check internship payment status.",
      });
    }
  }, [ready, user?.token, programs]);

  useEffect(() => {
    void refreshEnrollmentGate();
  }, [refreshEnrollmentGate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("preview");
    if (preview === "passed") {
      setStep("preview-passed");
      return;
    }
    if (params.get("trial") !== "2") return;
    if (programsLoading || programs.length === 0) return;

    const wantedId = Number(params.get("program") || "");
    const program =
      (Number.isFinite(wantedId)
        ? programs.find((row) => row.id === wantedId)
        : null) ?? programs[0];
    if (!program) return;

    setFieldSelection({
      programId: program.id,
      title: program.title,
      price: program.price,
      secondPrice: program.secondPrice,
    });
    setIsSecondTrial(true);
    setStep("payment");
  }, [programs, programsLoading]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const startRetryPayment = async (programId: number) => {
    if (!user?.token) {
      router.push("/login?next=/internship");
      return;
    }

    setIsSecondTrial(true);

    try {
      const enrollResponse = await fetch(
        `/api/internships/${encodeURIComponent(String(programId))}/enroll`,
        {
          method: "POST",
          headers: {
            ...studentAuthHeaders(user.token),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
          cache: "no-store",
        },
      );
      const enrollPayload = (await enrollResponse.json().catch(() => null)) as {
        payment_token?: string;
        message?: string;
        error?: string;
      } | null;

      const token =
        typeof enrollPayload?.payment_token === "string"
          ? enrollPayload.payment_token.trim()
          : "";

      if (token) {
        setPaymentToken(token);
      }

      if (!enrollResponse.ok && !token) {
        const message = enrollPayload?.error || enrollPayload?.message || "";

        // Attempts exhausted (422, "You have already used all N attempts…") has
        // no valid payment step to retry into — sending the user to a payment UI
        // with no token would just look broken. Surface the real reason and stay
        // put instead.
        if (enrollResponse.status === 422 && /attempt/i.test(message)) {
          toast.error(
            message ||
              "You have used all available attempts for this internship program.",
          );
          void refreshEnrollmentGate();
          return;
        }

        // Other failures (network hiccup, etc.) — still let them land on the
        // payment step so they can retry from there.
        setStep("payment");
        toast.message(message || "Continue to payment to retry the AI interview.");
        return;
      }

      // Even if enroll returns an existing enrollment error, still open payment UI.
      setStep("payment");
    } catch {
      setStep("payment");
      toast.error("Unable to start retry payment. Please try again.");
    }
  };

  const handleApply = () => {
    if (!ready) return;

    if (!user?.token) {
      router.push("/login?next=/internship");
      return;
    }

    if (gate.status === "paid") {
      setFieldSelection(gate.selection);
      setPaymentToken(gate.enrollment.paymentToken);

      if (gate.interviewOutcome === "failed") {
        void startRetryPayment(gate.selection.programId);
        return;
      }

      // passed or pending interviewer → interview/result step
      setStep("interview");
      return;
    }

    if (gate.status === "pending") {
      setIsSecondTrial(false);
      setFieldSelection(gate.selection);
      setPaymentToken(gate.enrollment.paymentToken);
      setStep("payment");
      return;
    }

    // No enrollment yet (or check failed) → form → choose track → pay
    setIsSecondTrial(false);
    setStep("form");
  };

  if (step === "form") {
    if (!ready) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-slate-500 text-sm">Loading form…</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <InternshipFormStep
          initialValues={{ ...authDefaults, ...formValues }}
          onSubmit={(values) => {
            setFormValues(values);
            setStep("field");
          }}
        />
      </div>
    );
  }

  if (step === "field") {
    return (
      <div className="min-h-screen bg-white">
        <InternshipInterviewStep
          mode="field"
          selection={fieldSelection}
          onContinue={async (next) => {
            setFieldSelection(next);
            setIsSecondTrial(false);

            if (!user?.token) {
              router.push("/login?next=/internship");
              return;
            }

            try {
              // 1) Check if this account already paid for this program
              const statusResponse = await fetch(
                Config.AUTH.myEnrollments,
                {
                  method: "GET",
                  headers: studentAuthHeaders(user.token),
                  cache: "no-store",
                },
              );
              const statusPayload = (await statusResponse.json().catch(
                () => null,
              )) as {
                success?: boolean;
                error?: string;
              } | null;

              if (statusResponse.ok && statusPayload?.success !== false) {
                const enrollments =
                  parseInternshipEnrollmentsPayload(statusPayload);
                const match =
                  enrollments.find(
                    (row) => row.internshipProgramId === next.programId,
                  ) ?? null;

                const paid = match
                  ? isInternshipPaid(match.internshipPaymentStatus) ||
                    Boolean(match.interviewUrl)
                  : false;

                if (paid) {
                  setPaymentToken(match?.paymentToken ?? null);
                  // Paid → interview step (shows link, passed, or failed+retry)
                  setStep("interview");
                  return;
                }

                // Already enrolled but unpaid — reuse existing payment token
                if (match?.paymentToken) {
                  setPaymentToken(match.paymentToken);
                  setStep("payment");
                  return;
                }
              }

              // 2) Enroll with Bearer token → get payment_token
              const enrollResponse = await fetch(
                `/api/internships/${encodeURIComponent(String(next.programId))}/enroll`,
                {
                  method: "POST",
                  headers: {
                    ...studentAuthHeaders(user.token),
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({}),
                  cache: "no-store",
                },
              );
              const enrollPayload = (await enrollResponse.json().catch(
                () => null,
              )) as {
                success?: boolean;
                payment_token?: string;
                message?: string;
                error?: string;
              } | null;

              const token =
                typeof enrollPayload?.payment_token === "string"
                  ? enrollPayload.payment_token.trim()
                  : "";

              if (!enrollResponse.ok || !token) {
                throw new Error(
                  enrollPayload?.error ||
                    enrollPayload?.message ||
                    "Failed to enroll in internship program.",
                );
              }

              setPaymentToken(token);
              setStep("payment");
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Unable to enroll. Please try again.";
              toast.error(message);
            }
          }}
        />
      </div>
    );
  }

  if (step === "payment") {
    if (!fieldSelection?.programId) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-slate-500 text-sm">Missing program. Please select a field.</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        <InternshipPaymentStep
          programId={fieldSelection.programId}
          paymentToken={paymentToken}
          isSecondTrial={isSecondTrial}
          onBack={() => setStep(gate.status === "pending" ? "landing" : "field")}
          onPaid={() => {
            void refreshEnrollmentGate();
            setStep("interview");
          }}
        />
      </div>
    );
  }

  if (step === "preview-passed") {
    return (
      <div className="min-h-screen bg-white">
        <InternshipResultStep
          outcome="passed"
          score={{ total: 72, max: 100 }}
          programTitle="AI / ML"
        />
      </div>
    );
  }

  if (step === "interview") {
    return (
      <div className="min-h-screen bg-white">
        <InternshipInterviewStep
          mode="link"
          selection={fieldSelection}
          onBackToPayment={() => setStep("payment")}
          onRetryPayment={() => {
            if (!fieldSelection?.programId) {
              setStep("payment");
              return;
            }
            void startRetryPayment(fieldSelection.programId);
          }}
          onDone={() => setStep("landing")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <InternshipLanding
        gate={gate}
        tracks={tracks}
        tracksStatus={tracksStatus}
        onApply={handleApply}
        onRefresh={() => {
          void refetchPrograms();
          void refreshEnrollmentGate();
        }}
      />
    </div>
  );
}
