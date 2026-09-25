"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  authUserFromStudent,
  useAuth,
} from "@/components/providers/AuthProvider";
import { useLoginMutation } from "@/store/authApi";
import AuthShell, { authButtonClass, authFieldClass } from "./AuthShell";

function safeNextPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/account";
  return value;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [loginRequest, { isLoading: submitting }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setError(null);

    try {
      const payload = await loginRequest({
        email: email.trim(),
        password,
      }).unwrap();

      if (!payload?.token || !payload.student) {
        setError(payload?.error || "Login failed. Check your email and password.");
        return;
      }

      const authUser = authUserFromStudent({
        student: payload.student,
        token: payload.token,
      });
      login(authUser);
      toast.success(payload.message || `Welcome back, ${authUser.name}`);
      router.push(safeNextPath(searchParams.get("next")));
    } catch (err: unknown) {
      const data =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { error?: string } }).data
          : null;
      setError(
        data?.error ||
          (err && typeof err === "object" && "status" in err
            ? "Login failed. Check your email and password."
            : "Unable to reach the server. Please try again."),
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AuthShell title="Login">
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-800 mb-2">
            Login
          </h2>

          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              className={authFieldClass}
              autoComplete="email"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={authFieldClass}
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-brand-cyan hover:underline"
            >
              Forgot password
            </Link>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button type="submit" disabled={submitting} className={authButtonClass}>
            {submitting ? "Logging in…" : "Login"}
            {!submitting ? <ArrowRight className="w-4 h-4" /> : null}
          </button>

          <p className="text-sm text-slate-500 text-center pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-brand-cyan hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </AuthShell>
    </div>
  );
}
