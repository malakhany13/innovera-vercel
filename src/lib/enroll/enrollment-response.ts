/**
 * Normalize Laravel enrollment success payloads into a stable frontend shape.
 *
 * Example backend payload:
 * {
 *   success: true,
 *   data: {
 *     enrollment_id,
 *     course_payment_token,
 *     assessment_payment_token,
 *     payment_show_url,
 *     generated_mobile,
 *     generated_email,
 *     message
 *   }
 * }
 */

export interface EnrollmentPaymentResult {
  enrollmentId?: number;
  coursePaymentToken?: string;
  assessmentPaymentToken?: string;
  paymentShowUrl?: string;
  generatedMobile?: string;
  generatedEmail?: string;
  message?: string;
  /** Prefer course token for checkout redirect. */
  paymentToken?: string;
}

function asNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function asOptionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function tokenFromPaymentShowUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const pathname = new URL(url, "http://local.invalid").pathname;
    const match = pathname.match(/\/payment\/([^/]+)\/?$/i);
    return match?.[1] ? decodeURIComponent(match[1]) : undefined;
  } catch {
    const match = url.match(/\/payment\/([^/?#]+)/i);
    return match?.[1] ? decodeURIComponent(match[1]) : undefined;
  }
}

/** Prefer `/payment/{token}` over absolute APP_URL links from Laravel. */
function toRelativePaymentShowUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const token = tokenFromPaymentShowUrl(url);
  if (token) return `/payment/${encodeURIComponent(token)}`;
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const parsed = new URL(url);
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    return url;
  }
  return url.startsWith("/") ? url : `/${url}`;
}

function readEnrollmentFields(
  record: Record<string, unknown>,
): EnrollmentPaymentResult {
  const coursePaymentToken =
    asNonEmptyString(record.course_payment_token) ??
    asNonEmptyString(record.coursePaymentToken) ??
    asNonEmptyString(record.payment_token) ??
    asNonEmptyString(record.paymentToken) ??
    asNonEmptyString(record.token);

  const assessmentPaymentToken =
    asNonEmptyString(record.assessment_payment_token) ??
    asNonEmptyString(record.assessmentPaymentToken);

  const paymentShowUrl = toRelativePaymentShowUrl(
    asNonEmptyString(record.payment_show_url) ??
      asNonEmptyString(record.paymentShowUrl),
  );

  const fromUrl = tokenFromPaymentShowUrl(paymentShowUrl);

  const paymentToken = coursePaymentToken ?? fromUrl;

  return {
    enrollmentId: asOptionalNumber(record.enrollment_id ?? record.enrollmentId),
    coursePaymentToken: coursePaymentToken ?? fromUrl,
    assessmentPaymentToken,
    paymentShowUrl,
    generatedMobile:
      asNonEmptyString(record.generated_mobile) ??
      asNonEmptyString(record.generatedMobile),
    generatedEmail:
      asNonEmptyString(record.generated_email) ??
      asNonEmptyString(record.generatedEmail),
    message: asNonEmptyString(record.message),
    paymentToken,
  };
}

export function parseEnrollmentPaymentResult(
  payload: unknown,
): EnrollmentPaymentResult {
  if (!payload || typeof payload !== "object") return {};

  const root = payload as Record<string, unknown>;
  const nested =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : null;

  const fromRoot = readEnrollmentFields(root);
  const fromNested = nested ? readEnrollmentFields(nested) : {};

  return {
    enrollmentId: fromNested.enrollmentId ?? fromRoot.enrollmentId,
    coursePaymentToken:
      fromNested.coursePaymentToken ?? fromRoot.coursePaymentToken,
    assessmentPaymentToken:
      fromNested.assessmentPaymentToken ?? fromRoot.assessmentPaymentToken,
    paymentShowUrl: fromNested.paymentShowUrl ?? fromRoot.paymentShowUrl,
    generatedMobile: fromNested.generatedMobile ?? fromRoot.generatedMobile,
    generatedEmail: fromNested.generatedEmail ?? fromRoot.generatedEmail,
    message: fromNested.message ?? fromRoot.message,
    paymentToken: fromNested.paymentToken ?? fromRoot.paymentToken,
  };
}
