import Config from "@/lib/config/app.config";
import {
  hasLaravelBackend,
  LARAVEL_API_BASE_URL,
  LARAVEL_JSON_HEADERS,
  LARAVEL_REQUEST_TIMEOUT_MS,
  laravelApiUrl,
} from "@/lib/laravel/config";

export interface StudentRecord {
  id: number;
  full_name: string;
  email: string;
  mobile_number?: string | null;
  academic_year?: string | null;
  college?: string | null;
  role_in_tech?: string | null;
  avatar?: string | null;
}

export interface StudentAuthResult {
  message: string;
  student: StudentRecord;
  token: string;
}

export interface StudentRegisterPayload {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  mobile_number: string;
  academic_year: string;
  college: string;
  role_in_tech: string;
}

export interface StudentLoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordSendOtpPayload {
  email: string;
}

export interface ForgotPasswordResetPayload {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export interface StudentMessageResult {
  message: string;
}

export class StudentAuthError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: unknown,
  ) {
    super(message);
    this.name = "StudentAuthError";
  }
}

function formatApiErrors(errors: unknown): string | null {
  if (!errors || typeof errors !== "object") return null;
  const parts: string[] = [];
  for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      parts.push(`${key}: ${value.map(String).join(", ")}`);
    } else if (typeof value === "string") {
      parts.push(`${key}: ${value}`);
    }
  }
  return parts.length > 0 ? parts.join(" ") : null;
}

function asTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function parseStudent(value: unknown): StudentRecord | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const id = asNumber(record.id);
  const fullName =
    asTrimmedString(record.full_name) ?? asTrimmedString(record.fullName);
  const email = asTrimmedString(record.email);
  if (id == null || !fullName || !email) return null;

  return {
    id,
    full_name: fullName,
    email,
    mobile_number:
      asTrimmedString(record.mobile_number) ??
      asTrimmedString(record.mobileNumber),
    academic_year:
      asTrimmedString(record.academic_year) ??
      asTrimmedString(record.academicYear),
    college: asTrimmedString(record.college),
    role_in_tech:
      asTrimmedString(record.role_in_tech) ??
      asTrimmedString(record.roleInTech),
    avatar: asTrimmedString(record.avatar),
  };
}

function tryParseAuthResult(
  payload: unknown,
  fallbackMessage: string,
): StudentAuthResult | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const nested =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : null;

  const token =
    asTrimmedString(root.token) ??
    asTrimmedString(nested?.token) ??
    asTrimmedString(root.access_token) ??
    asTrimmedString(nested?.access_token);

  const student =
    parseStudent(root.student) ??
    parseStudent(nested?.student) ??
    parseStudent(root.user) ??
    parseStudent(nested?.user) ??
    parseStudent(nested);

  if (!token || !student) return null;

  return {
    token,
    student,
    message:
      asTrimmedString(root.message) ??
      asTrimmedString(nested?.message) ??
      fallbackMessage,
  };
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function describeFetchError(error: unknown): string {
  if (!(error instanceof Error)) return "network error";
  const cause =
    "cause" in error && error.cause instanceof Error
      ? error.cause.message
      : null;
  return cause ? `${error.message} (${cause})` : error.message;
}

async function postStudentAuth(path: string, body: unknown): Promise<{
  ok: boolean;
  status: number;
  payload: unknown;
}> {
  if (!hasLaravelBackend()) {
    throw new StudentAuthError(
      "Laravel API is not configured. Set LARAVEL_API_BASE_URL in .env.local.",
      503,
    );
  }

  const url = laravelApiUrl(path);
  const serializedBody = JSON.stringify(body);
  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: LARAVEL_JSON_HEADERS,
        cache: "no-store",
        body: serializedBody,
        signal: AbortSignal.timeout(LARAVEL_REQUEST_TIMEOUT_MS),
      });
      const payload: unknown = await response.json().catch(() => null);
      return { ok: response.ok, status: response.status, payload };
    } catch (error) {
      lastError = error;
      console.error(
        `[student-auth] fetch failed attempt ${attempt}/${maxAttempts}`,
        url,
        describeFetchError(error),
      );
      if (attempt < maxAttempts) {
        await sleep(400 * attempt);
      }
    }
  }

  throw new StudentAuthError(
    `Unable to reach Laravel student auth API (${LARAVEL_API_BASE_URL || "missing LARAVEL_API_BASE_URL"}): ${describeFetchError(lastError)}. Check that ngrok is running and points to Laravel.`,
    502,
  );
}

function throwFromPayload(payload: unknown, status: number, fallback: string): never {
  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : null;
  const message =
    asTrimmedString(record?.message) ??
    formatApiErrors(record?.errors) ??
    asTrimmedString(record?.error) ??
    fallback;
  throw new StudentAuthError(message, status, record?.errors);
}

/** POST /api/student/login */
export async function loginStudent(
  payload: StudentLoginPayload,
): Promise<StudentAuthResult> {
  const { ok, status, payload: body } = await postStudentAuth(
    Config.AUTH.login,
    payload,
  );

  if (!ok) {
    throwFromPayload(body, status, `Login failed (${status})`);
  }

  const result = tryParseAuthResult(body, "Login successful");
  if (!result) {
    throw new StudentAuthError(
      "Login succeeded but token/student data was missing.",
      502,
    );
  }
  return result;
}

/**
 * POST /api/student/register
 * If register succeeds without a token, automatically logs in.
 */
export async function registerStudent(
  payload: StudentRegisterPayload,
): Promise<StudentAuthResult> {
  const { ok, status, payload: body } = await postStudentAuth(
    Config.AUTH.register,
    payload,
  );

  if (!ok) {
    throwFromPayload(body, status, `Registration failed (${status})`);
  }

  const result = tryParseAuthResult(body, "Registration successful");
  if (result) return result;

  // Register succeeded but no token — log in with the same credentials.
  return loginStudent({ email: payload.email, password: payload.password });
}

function parseMessageResult(
  payload: unknown,
  fallbackMessage: string,
): StudentMessageResult {
  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : null;
  return {
    message: asTrimmedString(record?.message) ?? fallbackMessage,
  };
}

/** POST /api/student/forgot-password/send-otp */
export async function sendForgotPasswordOtp(
  payload: ForgotPasswordSendOtpPayload,
): Promise<StudentMessageResult> {
  const { ok, status, payload: body } = await postStudentAuth(
    Config.AUTH.forgotPasswordSendOtp,
    payload,
  );

  if (!ok) {
    throwFromPayload(body, status, `Failed to send OTP (${status})`);
  }

  return parseMessageResult(body, "OTP has been sent to your email.");
}

/** POST /api/student/forgot-password/reset */
export async function resetForgotPassword(
  payload: ForgotPasswordResetPayload,
): Promise<StudentMessageResult> {
  const { ok, status, payload: body } = await postStudentAuth(
    Config.AUTH.forgotPasswordReset,
    payload,
  );

  if (!ok) {
    throwFromPayload(body, status, `Password reset failed (${status})`);
  }

  return parseMessageResult(
    body,
    "Password reset successfully. You can now log in with your new password.",
  );
}
