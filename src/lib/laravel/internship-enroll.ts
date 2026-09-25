import { hasLaravelBackend, LARAVEL_JSON_HEADERS, laravelApiUrl } from "@/lib/laravel/config";
import { extractPaymentToken } from "@/lib/laravel/proxy";

export class InternshipEnrollError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "InternshipEnrollError";
  }
}

export interface InternshipEnrollResult {
  paymentToken: string;
  message: string | null;
}

/**
 * POST /api/internships/{programId}/enroll
 * Requires student Bearer token. Returns payment_token for PayTabs / Fawry.
 */
export async function enrollInternshipProgram(
  programId: number | string,
  bearerToken: string,
): Promise<InternshipEnrollResult> {
  if (!hasLaravelBackend()) {
    throw new InternshipEnrollError(
      "Laravel API is not configured. Set LARAVEL_API_BASE_URL in .env.local.",
      503,
    );
  }

  const id = String(programId).trim();
  if (!id) {
    throw new InternshipEnrollError("Internship program id is required.", 400);
  }

  const token = bearerToken.trim().replace(/^Bearer\s+/i, "");
  if (!token) {
    throw new InternshipEnrollError("Authorization Bearer token is required.", 401);
  }

  let response: Response;
  try {
    response = await fetch(
      laravelApiUrl(`/api/internships/${encodeURIComponent(id)}/enroll`),
      {
        method: "POST",
        headers: {
          ...LARAVEL_JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
        cache: "no-store",
      },
    );
  } catch {
    throw new InternshipEnrollError(
      "Unable to reach Laravel internship enroll API.",
      502,
    );
  }

  const payload: unknown = await response.json().catch(() => null);
  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : null;

  if (!response.ok) {
    const message =
      (typeof record?.message === "string" && record.message.trim()) ||
      (typeof record?.error === "string" && record.error.trim()) ||
      `Internship enroll failed (${response.status})`;
    throw new InternshipEnrollError(message, response.status);
  }

  const paymentToken = extractPaymentToken(payload);
  if (!paymentToken) {
    throw new InternshipEnrollError(
      "Enrollment succeeded but no payment_token was returned.",
      502,
    );
  }

  return {
    paymentToken,
    message: typeof record?.message === "string" ? record.message : null,
  };
}
