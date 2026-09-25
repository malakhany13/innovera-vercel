import { hasLaravelBackend, LARAVEL_JSON_HEADERS, laravelApiUrl } from "@/lib/laravel/config";
import {
  parseEnrollmentPaymentResult,
  type EnrollmentPaymentResult,
} from "@/lib/enroll/enrollment-response";

export interface InternshipApplyPayload {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  university: string;
  major: string;
  level: string;
}

export class LaravelInternshipError extends Error {
  constructor(
    message: string,
    public status?: number,
    public errors?: unknown,
  ) {
    super(message);
    this.name = "LaravelInternshipError";
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

/** POST /api/v1/internship/apply — returns payment token for assessment fee. */
export async function applyInternship(
  payload: InternshipApplyPayload,
): Promise<EnrollmentPaymentResult> {
  if (!hasLaravelBackend()) {
    throw new LaravelInternshipError(
      "Laravel API is not configured. Set LARAVEL_API_BASE_URL in .env.local.",
      503,
    );
  }

  const response = await fetch(laravelApiUrl("/api/v1/internship/apply"), {
    method: "POST",
    headers: LARAVEL_JSON_HEADERS,
    cache: "no-store",
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      whatsapp: payload.whatsapp,
      university: payload.university,
      major: payload.major,
      level: payload.level,
    }),
  });

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
      `Internship apply failed (${response.status})`;
    throw new LaravelInternshipError(message, response.status, data.errors);
  }

  return parseEnrollmentPaymentResult(data);
}
