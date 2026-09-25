export interface InternshipEnrollment {
  id: number;
  studentId: number;
  internshipProgramId: number;
  internshipProgramTitle: string;
  fullName: string;
  mobileNumber: string | null;
  email: string;
  internshipCost: string;
  internshipPaymentStatus: string;
  interviewerStatus: string;
  note: string | null;
  paymentToken: string | null;
  interviewUrl: string | null;
  totalScore: number | null;
  totalScoreMax: number | null;
  /** Interview attempts already used (Laravel), when provided. */
  attemptsUsed: number | null;
  /** Max allowed attempts (defaults to 2 when absent on the API). */
  maxAttempts: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/**
 * Payment unlock statuses from Laravel my-enrollments. Mirrors Laravel's own
 * `in_array($status, ['accepted', 'cash'])` checks (PaymentController, redirectToInterview) —
 * 'cash' is a first-class paid status there (manually confirmed cash payment), not a synonym.
 */
export function isInternshipPaid(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return (
    normalized === "accepted" ||
    normalized === "cash" ||
    normalized === "paid" ||
    normalized === "completed" ||
    normalized === "success" ||
    normalized === "successful"
  );
}

export function formatPaymentStatusLabel(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (normalized === "accepted") return "Payment accepted";
  if (isInternshipPaid(status)) return "Paid";
  if (normalized === "pending") return "Pending payment";
  if (normalized === "failed") return "Payment failed";
  return status.trim() || "Unknown";
}

export function formatInterviewerStatusLabel(status: string): string {
  const normalized = status.trim().toLowerCase();
  if (isInternshipInterviewPassed(status)) {
    return "Passed interview";
  }
  if (isInternshipInterviewFailed(status)) {
    return "Did not pass";
  }
  if (normalized === "pending") return "Interview pending";
  if (normalized === "scheduled") return "Interview scheduled";
  return status.trim() || "Unknown";
}

/** Interviewer result: passed / accepted. */
export function isInternshipInterviewPassed(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return (
    normalized === "passed" ||
    normalized === "pass" ||
    normalized === "accepted"
  );
}

/** Interviewer result: failed / rejected. */
export function isInternshipInterviewFailed(status: string): boolean {
  const normalized = status.trim().toLowerCase();
  return (
    normalized === "failed" ||
    normalized === "fail" ||
    normalized === "rejected"
  );
}

/** True when both AI interview attempts are used (no retake left). */
export function isInternshipAttemptsExhausted(
  enrollment: Pick<InternshipEnrollment, "attemptsUsed" | "maxAttempts">,
): boolean {
  const used = enrollment.attemptsUsed;
  if (used == null) return false;
  const max = enrollment.maxAttempts != null && enrollment.maxAttempts > 0
    ? enrollment.maxAttempts
    : 2;
  return used >= max;
}
