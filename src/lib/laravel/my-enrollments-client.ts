import Config from "@/lib/config/app.config";
import { studentAuthHeaders } from "@/lib/auth/student-headers";
import {
  parseInternshipEnrollmentsPayload,
  type InternshipEnrollment,
} from "@/lib/laravel/internship-enrollments";

export class MyEnrollmentsClientError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "MyEnrollmentsClientError";
  }
}

/** In-flight dedupe — React Strict Mode remounts must not hit the API twice. */
const inflightByToken = new Map<string, Promise<InternshipEnrollment[]>>();

/**
 * Browser → Next BFF {@link Config.AUTH.myEnrollments}.
 * Concurrent calls with the same token share one network request.
 */
export function fetchMyEnrollmentsClient(
  token: string,
): Promise<InternshipEnrollment[]> {
  const key = token.trim().replace(/^Bearer\s+/i, "");
  if (!key) {
    return Promise.reject(
      new MyEnrollmentsClientError("Authentication token is required.", 401),
    );
  }

  const existing = inflightByToken.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const response = await fetch(Config.AUTH.myEnrollments, {
      headers: studentAuthHeaders(key),
      cache: "no-store",
    });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        payload &&
        typeof payload === "object" &&
        typeof (payload as { error?: unknown }).error === "string"
          ? (payload as { error: string }).error
          : "Failed to load internship status.";
      throw new MyEnrollmentsClientError(message, response.status);
    }

    return parseInternshipEnrollmentsPayload(payload);
  })().finally(() => {
    inflightByToken.delete(key);
  });

  inflightByToken.set(key, promise);
  return promise;
}
