"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  authUserFromStudent,
  useAuth,
} from "@/components/providers/AuthProvider";
import {
  useRegisterMutation,
  type AuthSessionResponse,
} from "@/store/authApi";
import AuthShell, { authButtonClass, authFieldClass } from "./AuthShell";

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

function firstRegisterErrorMessage(payload: AuthSessionResponse | null): string | null {
  if (!payload) return null;
  if (payload.error) return payload.error;
  const firstFieldError = payload.errors && Object.values(payload.errors)[0]?.[0];
  if (firstFieldError) return firstFieldError;
  if (payload.message && !payload.token) return payload.message;
  return null;
}

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [registerRequest, { isLoading: submitting }] = useRegisterMutation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [college, setCollege] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [roleInTech, setRoleInTech] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (
      !fullName.trim() ||
      !email.trim() ||
      !mobileNumber.trim() ||
      !college.trim() ||
      !academicYear ||
      !roleInTech ||
      !password ||
      !passwordConfirmation
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Password confirmation does not match.");
      return;
    }

    setError(null);

    try {
      const payload = await registerRequest({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
        mobile_number: mobileNumber.trim(),
        academic_year: academicYear,
        college: college.trim(),
        role_in_tech: roleInTech,
      }).unwrap();

      if (!payload?.token || !payload.student) {
        setError(firstRegisterErrorMessage(payload) || "Registration failed. Please try again.");
        return;
      }

      const authUser = authUserFromStudent({
        student: payload.student,
        token: payload.token,
      });
      login(authUser);
      toast.success(payload.message || `Welcome, ${authUser.name}`);
      router.push("/account");
    } catch (err: unknown) {
      const data =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: AuthSessionResponse }).data
          : null;
      setError(
        firstRegisterErrorMessage(data ?? null) ||
          "Unable to reach the server. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AuthShell title="Sign up">
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 mb-2">
            <span className="text-brand-cyan">Sign up</span> Form
          </h2>

          <div>
            <label htmlFor="signup-full-name" className="block text-sm font-medium text-slate-700 mb-2">
              Full name
            </label>
            <input
              id="signup-full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ahmed Mohamed"
              className={authFieldClass}
              autoComplete="name"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmed@example.com"
              className={authFieldClass}
              autoComplete="email"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="signup-mobile" className="block text-sm font-medium text-slate-700 mb-2">
              Mobile number
            </label>
            <input
              id="signup-mobile"
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+201012345678"
              className={authFieldClass}
              autoComplete="tel"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="signup-college" className="block text-sm font-medium text-slate-700 mb-2">
              College
            </label>
            <input
              id="signup-college"
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Faculty of Computers and Artificial Intelligence"
              className={authFieldClass}
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="signup-academic-year"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Academic year
            </label>
            <select
              id="signup-academic-year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className={authFieldClass}
              disabled={submitting}
            >
              <option value="">Select academic year</option>
              {ACADEMIC_YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="signup-role"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Role in tech
            </label>
            <select
              id="signup-role"
              value={roleInTech}
              onChange={(e) => setRoleInTech(e.target.value)}
              className={authFieldClass}
              disabled={submitting}
            >
              <option value="">Select role</option>
              {ROLE_IN_TECH_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={authFieldClass}
              autoComplete="new-password"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="signup-password-confirmation"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Confirm password
            </label>
            <input
              id="signup-password-confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Confirm password"
              className={authFieldClass}
              autoComplete="new-password"
              disabled={submitting}
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button type="submit" disabled={submitting} className={authButtonClass}>
            {submitting ? "Submitting…" : "Submit"}
            {!submitting ? <ArrowRight className="w-4 h-4" /> : null}
          </button>

          <p className="text-sm text-slate-500 text-center pt-2">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-cyan hover:underline">
              Login
            </Link>
          </p>
        </form>
      </AuthShell>
    </div>
  );
}
