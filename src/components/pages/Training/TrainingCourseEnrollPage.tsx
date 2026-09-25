"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Calendar, Clock, GraduationCap, Mail, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OptimizedImage from "@/components/ui/OptimizedImage";
import {
  parseEnrollmentPaymentResult,
  type EnrollmentPaymentResult,
} from "@/lib/enroll/enrollment-response";
import type { CourseActiveSlot } from "@/lib/enroll/slots";
import {
  fetchCourseActiveSlots,
  formatSlotDateRange,
  formatSlotSessions,
  formatSlotTitle,
  getSlotSeatsAvailable,
} from "@/lib/enroll/slots";
import { FALLBACK_COURSE_IMAGE_ALT } from "@/lib/directus";
import { toRelativePaymentPagePath } from "@/lib/config/payment.config";
import type { Course } from "@/features/directus/types";

interface TrainingCourseEnrollPageProps {
  course: Course;
}

const ACADEMIC_YEAR_OPTIONS = [
  "First Year",
  "Second Year",
  "Third Year",
  "Fourth Year",
  "Fifth Year",
  "Postgraduate",
] as const;

const ROLE_IN_TECH_OPTIONS = [
  { value: "developer", label: "Developer" },
  { value: "tester", label: "Tester" },
  { value: "quality", label: "Quality" },
  { value: "ui/ux", label: "UI/UX" },
  { value: "devops", label: "DevOps" },
  { value: "security", label: "Security" },
  { value: "infrastructure", label: "Infrastructure" },
] as const;

type AcademicYear = (typeof ACADEMIC_YEAR_OPTIONS)[number];
type RoleInTech = (typeof ROLE_IN_TECH_OPTIONS)[number]["value"];

const selectClassName =
  "w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all text-slate-800";

function isAcademicYear(value: string): value is AcademicYear {
  return (ACADEMIC_YEAR_OPTIONS as readonly string[]).includes(value);
}

function isRoleInTech(value: string): value is RoleInTech {
  return ROLE_IN_TECH_OPTIONS.some((option) => option.value === value);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatApiErrors(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") return null;

  const messages: string[] = [];
  for (const value of Object.values(errors as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string" && item.trim()) messages.push(item.trim());
      }
    } else if (typeof value === "string" && value.trim()) {
      messages.push(value.trim());
    }
  }

  return messages.length > 0 ? messages.join(" ") : null;
}

export default function TrainingCourseEnrollPage({ course }: TrainingCourseEnrollPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enrollmentResult, setEnrollmentResult] = useState<EnrollmentPaymentResult | null>(
    null,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [activeSlots, setActiveSlots] = useState<CourseActiveSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [slotsStatus, setSlotsStatus] = useState<"loading" | "ready" | "error">("loading");
  const [academicYear, setAcademicYear] = useState("");
  const [roleInTech, setRoleInTech] = useState("");

  useEffect(() => {
    let cancelled = false;
    const apiCourseId = course.courseId?.trim() || String(course.id);

    async function loadSlots() {
      setSlotsStatus("loading");
      try {
        // Laravel slots are keyed by Directus `Course_ID`, not Directus `id`.
        const slots = await fetchCourseActiveSlots(apiCourseId);
        if (cancelled) return;
        setActiveSlots(slots);
        setSelectedSlotId(slots[0]?.id ?? null);
        setSlotsStatus("ready");
      } catch {
        if (cancelled) return;
        setActiveSlots([]);
        setSelectedSlotId(null);
        setSlotsStatus("error");
      }
    }

    void loadSlots();
    return () => {
      cancelled = true;
    };
  }, [course.id, course.courseId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setFormError(null);

    const fullName = String(formData.get("full_name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const mobileNumber = String(formData.get("mobile_number") ?? "").trim();
    const college = String(formData.get("college") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();
    const termsConsent = formData.get("terms_consent") === "on";
    const selectedAcademicYear = String(formData.get("academic_year") ?? "").trim();
    const selectedRole = String(formData.get("role_in_tech") ?? "").trim();

    const validationErrors: string[] = [];

    if (!fullName) validationErrors.push("Full name is required.");
    if (!email) validationErrors.push("Email is required.");
    else if (!isValidEmail(email)) validationErrors.push("Please enter a valid email address.");
    if (!mobileNumber) validationErrors.push("Phone number is required.");
    if (!college) validationErrors.push("College is required.");
    if (!isAcademicYear(selectedAcademicYear)) {
      validationErrors.push("Please select a valid academic year.");
    }
    if (!isRoleInTech(selectedRole)) {
      validationErrors.push("Please select a valid role in tech.");
    }
    if (slotsStatus === "loading") {
      validationErrors.push("Please wait while course slots finish loading.");
    } else if (slotsStatus === "error") {
      validationErrors.push("Unable to load course slots. Please refresh and try again.");
    } else if (selectedSlotId === null || activeSlots.length === 0) {
      validationErrors.push(
        "No active course slot is available for this course. Please try again later.",
      );
    }
    if (!termsConsent) {
      validationErrors.push("You must agree to the terms to continue.");
    }

    if (validationErrors.length > 0) {
      const message = validationErrors[0];
      setFormError(message);
      toast.error(message);
      return;
    }

    const body = {
      full_name: fullName,
      mobile_number: mobileNumber,
      email,
      course_slot_id: selectedSlotId,
      academic_year: selectedAcademicYear,
      college,
      role_in_tech: selectedRole,
      terms_consent: "1" as const,
      note,
    };

    try {
      setIsSubmitting(true);

      const apiCourseId = course.courseId?.trim() || String(course.id);
      const response = await fetch(
        `/api/courses/${encodeURIComponent(apiCourseId)}/enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        error?: string;
        errors?: unknown;
        [key: string]: unknown;
      };

      if (!response.ok || data.success === false) {
        const message =
          formatApiErrors(data.errors) ??
          (typeof data.error === "string" ? data.error : null) ??
          (typeof data.message === "string" ? data.message : null) ??
          "Unable to submit enrollment. Please try again.";
        setFormError(message);
        toast.error(message);
        return;
      }

      const enrollment = parseEnrollmentPaymentResult(data);
      setFormError(null);
      setAcademicYear("");
      setRoleInTech("");

      const successMessage =
        enrollment.message?.trim() ||
        (typeof data.message === "string" && data.message.trim()
          ? data.message.trim()
          : "Enrollment submitted successfully.");

      toast.success(successMessage);
      form.reset();

      const paymentToken =
        enrollment.coursePaymentToken ??
        enrollment.paymentToken ??
        null;

      // Go straight to checkout — no intermediate success screen.
      if (paymentToken) {
        toast.message("Opening payment…");
        router.replace(`/payment/${encodeURIComponent(paymentToken)}`);
        return;
      }

      if (enrollment.paymentShowUrl) {
        toast.message("Opening payment…");
        const relative =
          toRelativePaymentPagePath(enrollment.paymentShowUrl) ??
          enrollment.paymentShowUrl;
        router.replace(relative);
        return;
      }

      // Fallback only when Laravel did not return a payment token/URL.
      setEnrollmentResult(enrollment);
      setIsSubmitted(true);
    } catch {
      const message = "Unable to submit enrollment. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSubmitted(false);
    setEnrollmentResult(null);
    setFormError(null);
  };

  const handleCancel = () => {
    router.back();
  };

  const canSubmit = !isSubmitting;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden"
        >
          <div className="relative h-40 sm:h-48 overflow-hidden">
            <OptimizedImage
              src={course.image || FALLBACK_COURSE_IMAGE_ALT}
              alt={course.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              fallbackSrc={FALLBACK_COURSE_IMAGE_ALT}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/30" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-block py-1 px-3 rounded-full bg-brand-cyan/20 text-brand-cyan font-semibold text-xs mb-3 tracking-wider uppercase">
                Enrollment
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                {course.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {isSubmitted ? (
              <div className="text-center py-8 px-4">
                <div className="w-20 h-20 bg-brand-cyan/10 text-brand-cyan rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-display font-bold text-brand-navy mb-3">
                  Enrollment ready
                </h2>
                <p className="text-slate-500 max-w-md mx-auto mb-2">
                  Your enrollment for{" "}
                  <span className="font-semibold text-slate-700">{course.title}</span> was
                  created successfully.
                </p>
                {enrollmentResult?.enrollmentId != null ? (
                  <p className="text-slate-400 text-sm mb-2">
                    Enrollment ID: {enrollmentResult.enrollmentId}
                  </p>
                ) : null}
                {(enrollmentResult?.generatedEmail || enrollmentResult?.generatedMobile) && (
                  <div className="mx-auto mb-6 max-w-md rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-left text-sm text-slate-600 space-y-1">
                    {enrollmentResult.generatedEmail ? (
                      <p>
                        <span className="font-semibold text-slate-700">Email:</span>{" "}
                        {enrollmentResult.generatedEmail}
                      </p>
                    ) : null}
                    {enrollmentResult.generatedMobile ? (
                      <p>
                        <span className="font-semibold text-slate-700">Mobile:</span>{" "}
                        {enrollmentResult.generatedMobile}
                      </p>
                    ) : null}
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
                  {enrollmentResult?.coursePaymentToken || enrollmentResult?.paymentToken ? (
                    <button
                      type="button"
                      onClick={() => {
                        const token =
                          enrollmentResult.coursePaymentToken ??
                          enrollmentResult.paymentToken!;
                        router.push(`/payment/${encodeURIComponent(token)}`);
                      }}
                      className="px-8 py-3 bg-brand-cyan text-white font-bold rounded-full hover:bg-cyan-500 transition-colors shadow-lg shadow-brand-cyan/20"
                    >
                      Pay for course
                    </button>
                  ) : null}
                  {enrollmentResult?.assessmentPaymentToken ? (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/payment/${encodeURIComponent(enrollmentResult.assessmentPaymentToken!)}`,
                        )
                      }
                      className="px-8 py-3 bg-brand-navy text-white font-bold rounded-full hover:bg-slate-800 transition-colors"
                    >
                      Pay assessment
                    </button>
                  ) : null}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/courses")}
                    className="px-8 py-3 text-slate-600 font-bold rounded-full hover:bg-slate-100 transition-colors"
                  >
                    Back to Courses
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="px-8 py-3 text-slate-600 font-bold rounded-full hover:bg-slate-100 transition-colors"
                  >
                    Enroll Another Person
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-display font-bold text-brand-navy mb-2">Enroll in this course</h2>
                  <p className="text-slate-500 text-sm">
                    Fill in your details. After review and approval, we will email you a payment link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5 max-w-lg mx-auto">
                  <div className="space-y-1.5">
                    <label htmlFor="enroll-name" className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="enroll-name"
                        name="full_name"
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="enroll-email" className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="enroll-email"
                        name="email"
                        type="email"
                        required
                        placeholder="name@company.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="enroll-phone" className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="enroll-phone"
                        name="mobile_number"
                        type="tel"
                        required
                        placeholder="+20 100 000 0000"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="academic-year" className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                      Academic Year
                    </label>
                    <select
                      id="academic-year"
                      name="academic_year"
                      required
                      value={academicYear}
                      onChange={(event) => {
                        setAcademicYear(event.target.value);
                        setFormError(null);
                      }}
                      className={selectClassName}
                    >
                      <option value="" disabled>
                        Select academic year
                      </option>
                      {ACADEMIC_YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="college" className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                      College
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="college"
                        name="college"
                        type="text"
                        required
                        placeholder="Cairo University"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="role-in-tech" className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                      Role in Tech
                    </label>
                    <select
                      id="role-in-tech"
                      name="role_in_tech"
                      required
                      value={roleInTech}
                      onChange={(event) => {
                        setRoleInTech(event.target.value);
                        setFormError(null);
                      }}
                      className={selectClassName}
                    >
                      <option value="" disabled>
                        Select role in tech
                      </option>
                      {ROLE_IN_TECH_OPTIONS.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                      Course slot
                    </p>
                    {slotsStatus === "loading" ? (
                      <p className="text-sm text-slate-500 px-1 py-3">Loading available slots…</p>
                    ) : slotsStatus === "error" ? (
                      <p className="text-sm text-red-600 px-1 py-3">
                        Unable to load course slots. Please refresh and try again.
                      </p>
                    ) : activeSlots.length === 0 ? (
                      <p className="text-sm text-amber-700 px-1 py-3">
                        No active slots are available for this course right now.
                      </p>
                    ) : (
                      <div className="space-y-3" role="radiogroup" aria-label="Course slot">
                        {activeSlots.map((slot) => {
                          const selected = selectedSlotId === slot.id;
                          const seats = getSlotSeatsAvailable(slot);
                          const dateRange = formatSlotDateRange(slot);
                          const sessions = formatSlotSessions(slot);

                          return (
                            <label
                              key={slot.id}
                              className={`flex items-start gap-3 rounded-xl border bg-white px-4 py-3.5 cursor-pointer transition-colors ${
                                selected
                                  ? "border-brand-cyan ring-2 ring-brand-cyan/20"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                            >
                              <input
                                type="radio"
                                name="course_slot_id"
                                value={slot.id}
                                checked={selected}
                                onChange={() => {
                                  setSelectedSlotId(slot.id);
                                  setFormError(null);
                                }}
                                className="mt-1 size-4 shrink-0 border-slate-300 text-brand-cyan focus:ring-brand-cyan/20"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-slate-900 text-[15px]">
                                    {formatSlotTitle(slot)}
                                  </span>
                                  {seats != null ? (
                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                                      {seats} Available
                                    </span>
                                  ) : null}
                                </div>
                                {(dateRange || sessions) && (
                                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500">
                                    {dateRange ? (
                                      <span className="inline-flex items-center gap-1.5">
                                        <Calendar className="size-3.5 shrink-0 text-slate-400" />
                                        {dateRange}
                                      </span>
                                    ) : null}
                                    {sessions ? (
                                      <span className="inline-flex items-center gap-1.5">
                                        <Clock className="size-3.5 shrink-0 text-slate-400" />
                                        {sessions}
                                      </span>
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="enroll-note" className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                      Note <span className="font-normal normal-case text-slate-400">(optional)</span>
                    </label>
                    <textarea
                      id="enroll-note"
                      name="note"
                      rows={3}
                      placeholder="Anything else we should know?"
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none transition-all text-slate-800 resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      name="terms_consent"
                      required
                      className="mt-0.5 size-4 rounded border-slate-300 text-brand-cyan focus:ring-brand-cyan/20"
                    />
                    <span className="text-sm text-slate-600">
                      I agree to the terms and consent to Innovera contacting me about this enrollment.
                    </span>
                  </label>

                  <div className="p-4 rounded-2xl bg-brand-navy/5 border border-brand-navy/10 text-sm text-slate-600">
                    <span className="font-semibold text-brand-navy">Course: </span>
                    {course.title}
                  </div>

                  {formError ? (
                    <div
                      role="alert"
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {formError}
                    </div>
                  ) : null}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 py-4 text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="flex-1 py-4 bg-brand-cyan text-white rounded-2xl font-bold hover:bg-cyan-500 transition-all shadow-lg shadow-brand-cyan/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Submit <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
