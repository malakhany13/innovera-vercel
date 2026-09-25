"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  type ClipboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/lib/routes";
import Config from "@/lib/config/app.config";
import AuthShell, { authButtonClass, authFieldClass } from "./AuthShell";
import { cn } from "@/lib/utils";

export type ForgotStep = "email" | "otp" | "reset";

const OTP_LENGTH = 6;
const EMAIL_STORAGE_KEY = "innovera_forgot_password_email";
const OTP_STORAGE_KEY = "innovera_forgot_password_otp";

interface ApiMessageResponse {
  message?: string;
  error?: string;
  errors?: unknown;
}

interface ForgotPasswordPageProps {
  step?: ForgotStep;
}

function readApiError(payload: ApiMessageResponse | null, fallback: string): string {
  if (!payload) return fallback;
  if (payload.error?.trim()) return payload.error.trim();
  if (payload.message?.trim()) return payload.message.trim();
  if (payload.errors && typeof payload.errors === "object") {
    for (const value of Object.values(payload.errors as Record<string, unknown>)) {
      if (Array.isArray(value) && value[0]) return String(value[0]);
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return fallback;
}

type SendOtpResult =
  | { ok: true; message: string }
  | { ok: false; message: string };

async function requestSendOtp(targetEmail: string): Promise<SendOtpResult> {
  const response = await fetch(Config.AUTH.forgotPasswordSendOtp, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: targetEmail }),
  });
  const payload = (await response.json().catch(() => null)) as ApiMessageResponse | null;
  if (!response.ok) {
    return {
      ok: false,
      message: readApiError(payload, "An error occurred while sending OTP."),
    };
  }
  return {
    ok: true,
    message: payload?.message || "OTP has been sent to your email.",
  };
}

function readStoredEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(EMAIL_STORAGE_KEY)?.trim() || "";
  } catch {
    return "";
  }
}

function writeStoredEmail(email: string) {
  try {
    window.sessionStorage.setItem(EMAIL_STORAGE_KEY, email.trim().toLowerCase());
  } catch {
    // ignore
  }
}

function readStoredOtp(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(OTP_STORAGE_KEY)?.trim() || "";
  } catch {
    return "";
  }
}

function writeStoredOtp(otp: string) {
  try {
    window.sessionStorage.setItem(OTP_STORAGE_KEY, otp);
  } catch {
    // ignore
  }
}

function clearForgotPasswordStorage() {
  try {
    window.sessionStorage.removeItem(EMAIL_STORAGE_KEY);
    window.sessionStorage.removeItem(OTP_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function ForgotPasswordPage({
  step = "email",
}: ForgotPasswordPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const storedEmail = readStoredEmail();
    if (storedEmail) setEmail(storedEmail);

    if (step === "otp" || step === "reset") {
      if (!storedEmail) {
        router.replace(APP_ROUTES.forgotPassword);
        return;
      }
    }

    if (step === "reset") {
      const storedOtp = readStoredOtp();
      if (storedOtp.length === OTP_LENGTH) {
        setOtp(storedOtp.split(""));
      } else {
        router.replace(APP_ROUTES.forgotPasswordOtp);
      }
    }
  }, [router, step]);

  const sendOtpAndGoToOtpPage = async (normalizedEmail: string) => {
    const result = await requestSendOtp(normalizedEmail);
    writeStoredEmail(normalizedEmail);
    writeStoredOtp("");

    if (result.ok) {
      toast.success(result.message);
      router.push(APP_ROUTES.forgotPasswordOtp);
      return;
    }

    throw new Error(result.message);
  };

  const handleEmailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Please enter your email.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await sendOtpAndGoToOtpPage(normalizedEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleOtpSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (otp.some((d) => !d)) {
      setError("Please enter the full 6-digit verification code.");
      return;
    }
    setError(null);
    writeStoredOtp(otp.join(""));
    router.push(APP_ROUTES.forgotPasswordReset);
  };

  const handleResendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase() || readStoredEmail();
    if (!normalizedEmail) {
      router.replace(APP_ROUTES.forgotPassword);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const result = await requestSendOtp(normalizedEmail);
      if (result.ok) {
        toast.success(result.message);
        setOtp(Array(OTP_LENGTH).fill(""));
        writeStoredOtp("");
        otpRefs.current[0]?.focus();
        return;
      }
      setError(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase() || readStoredEmail();
    const otpCode = otp.join("") || readStoredOtp();
    if (!normalizedEmail) {
      router.replace(APP_ROUTES.forgotPassword);
      return;
    }
    if (otpCode.length !== OTP_LENGTH) {
      setError("Please enter the full verification code.");
      router.push(APP_ROUTES.forgotPasswordOtp);
      return;
    }
    if (!password.trim() || !confirmPassword.trim()) {
      setError("Please fill in both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const response = await fetch(Config.AUTH.forgotPasswordReset, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          otp: otpCode,
          password,
          password_confirmation: confirmPassword,
        }),
      });
      const payload = (await response.json().catch(() => null)) as ApiMessageResponse | null;
      if (!response.ok) {
        const message = readApiError(payload, "Password reset failed.");
        setError(message);
        if (/otp/i.test(message)) {
          writeStoredOtp("");
          router.push(APP_ROUTES.forgotPasswordOtp);
        }
        return;
      }

      clearForgotPasswordStorage();
      toast.success(
        payload?.message ||
          "Password reset successfully. You can now log in with your new password.",
      );
      router.push(APP_ROUTES.login);
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AuthShell title="forget password">
        {step === "email" ? (
          <form onSubmit={(e) => void handleEmailSubmit(e)} className="space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 mb-2">
                forget password
              </h2>
              <p className="text-slate-400 text-sm">
                Enter your email and you will receive a verification code.
              </p>
            </div>

            <div>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className={authFieldClass}
                autoComplete="email"
                disabled={submitting}
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button type="submit" disabled={submitting} className={authButtonClass}>
              {submitting ? "Sending…" : "Send code"}
              {!submitting ? <ArrowRight className="w-4 h-4" /> : null}
            </button>

            <p className="text-sm text-slate-500 text-center pt-2">
              <Link href={APP_ROUTES.login} className="font-semibold text-brand-cyan hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        ) : null}

        {step === "otp" ? (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 mb-2">
                Enter verification code
              </h2>
              <p className="text-slate-400 text-sm">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-slate-600">{email.trim()}</span>.
              </p>
            </div>

            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    otpRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={handleOtpPaste}
                  disabled={submitting}
                  aria-label={`Digit ${index + 1}`}
                  className={cn(
                    "w-11 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border bg-white outline-none transition",
                    digit
                      ? "border-brand-cyan text-brand-cyan"
                      : "border-slate-200 text-slate-800",
                    "focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20",
                  )}
                />
              ))}
            </div>

            {error ? <p className="text-sm text-red-600 text-center">{error}</p> : null}

            <button type="submit" disabled={submitting} className={authButtonClass}>
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-sm text-slate-500 text-center">
              Didn&apos;t get the code?{" "}
              <button
                type="button"
                onClick={() => void handleResendOtp()}
                disabled={submitting}
                className="font-semibold text-brand-cyan hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </p>

            <p className="text-sm text-slate-500 text-center">
              <Link
                href={APP_ROUTES.forgotPassword}
                className="font-semibold text-brand-cyan hover:underline"
              >
                Change email
              </Link>
            </p>
          </form>
        ) : null}

        {step === "reset" ? (
          <form onSubmit={(e) => void handleResetSubmit(e)} className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 mb-2">
              Reset your password
            </h2>

            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                className={authFieldClass}
                autoComplete="new-password"
                disabled={submitting}
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="password"
                className={authFieldClass}
                autoComplete="new-password"
                disabled={submitting}
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button type="submit" disabled={submitting} className={authButtonClass}>
              {submitting ? "Saving…" : "Reset password"}
              {!submitting ? <ArrowRight className="w-4 h-4" /> : null}
            </button>
          </form>
        ) : null}
      </AuthShell>
    </div>
  );
}
