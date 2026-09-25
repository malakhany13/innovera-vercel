import { paymentApiUrl } from "@/lib/config/payment.config";
import { paymentDataFromLaravelPayload } from "@/lib/payment/show-from-status";
import {
  getMockPayment,
  mockApplyVoucher,
  mockPaymentResponse,
  mockRemoveVoucher,
} from "@/lib/payment/mock-store";
import { isDevMockToken } from "@/lib/payment/proxy";
import {
  normalizeApplyVoucherResponse,
  normalizeRemoveVoucherResponse,
} from "@/lib/payment/voucher";
import type {
  FawryReferenceResponse,
  PaymentData,
  PaymentRedirectResponse,
  VoucherActionResponse,
} from "@/types/payment";

const JSON_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
} as const;

class PaymentApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "PaymentApiError";
  }
}

function backendUnavailableMessage(rawBody: string, status: number): string {
  const lowered = rawBody.toLowerCase();
  if (
    lowered.includes("err_ngrok") ||
    (lowered.includes("ngrok") && lowered.includes("offline"))
  ) {
    return "The payment service is temporarily unavailable. Please try again in a few minutes.";
  }
  if (
    lowered.includes("<!doctype") ||
    lowered.includes("<html") ||
    lowered.includes("geist_")
  ) {
    return "Payment service returned a web page instead of payment data. Try again; if it persists, the Laravel payment API is not reachable from this app.";
  }
  if (!rawBody.trim()) {
    return status === 404
      ? "Payment not found, or the Laravel API is unreachable."
      : "Payment API request failed.";
  }
  return rawBody.trim().slice(0, 280);
}

async function parseJson<T>(response: Response): Promise<T> {
  const raw = await response.text();
  let data: (T & { error?: string; message?: string }) | null = null;

  if (raw.trim()) {
    try {
      data = JSON.parse(raw) as T & { error?: string; message?: string };
    } catch {
      throw new PaymentApiError(
        backendUnavailableMessage(raw, response.status),
        response.status >= 500 ? response.status : 502,
      );
    }
  }

  if (!response.ok) {
    const message =
      data?.error ??
      data?.message ??
      backendUnavailableMessage(raw, response.status);
    throw new PaymentApiError(message, response.status);
  }

  if (!data) {
    throw new PaymentApiError("Empty response from payment API.", 502);
  }

  return data;
}

function extractRedirectUrl(payload: PaymentRedirectResponse): string {
  const url =
    payload.redirect_url ??
    payload.redirectUrl ??
    payload.data?.redirect_url ??
    payload.data?.redirectUrl;

  if (!url) {
    throw new PaymentApiError("No redirect URL returned from payment provider.", 502);
  }

  return url;
}

/** Same-origin Next BFF (`src/app/api/payment/[token]`), then Laravel. */
async function paymentFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(paymentApiUrl(path), {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init?.headers ?? {}),
    },
  });
}

type PaymentShowBody = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: PaymentData;
};

function paymentDataFromShowBody(
  body: PaymentShowBody,
  status: number,
): PaymentData {
  if (body.success === false) {
    throw new PaymentApiError(
      body.message ?? body.error ?? "Payment not found.",
      status,
    );
  }

  const data = paymentDataFromLaravelPayload(body) ?? body.data;
  if (!data) {
    throw new PaymentApiError("Payment request was not successful.", status);
  }

  return data;
}


export async function fetchPayment(token: string): Promise<PaymentData> {
  const encoded = encodeURIComponent(token);
  const showPath = `/api/payment/${encoded}`;
  const statusPath = `/api/payment/${encoded}/status`;

  try {
    const showResponse = await paymentFetch(showPath);
    try {
      const body = await parseJson<PaymentShowBody>(showResponse);
      return paymentDataFromShowBody(body, showResponse.status);
    } catch (showError) {
      const statusResponse = await paymentFetch(statusPath);
      try {
        const body = await parseJson<PaymentShowBody>(statusResponse);
        return paymentDataFromShowBody(body, statusResponse.status);
      } catch {
        throw showError;
      }
    }
  } catch (error) {
    if (isDevMockToken(token)) {
      return mockPaymentResponse(token).data;
    }
    throw error;
  }
}

async function fetchPayTabsRedirectForPath(
  token: string,
  path: string,
): Promise<string> {
  if (isDevMockToken(token)) {
    throw new PaymentApiError(
      "PayTabs needs a live payment token from Laravel. Use Fawry for demo, or pass a real payment_token.",
      503,
    );
  }

  const response = await paymentFetch(path);
  const body = await parseJson<PaymentRedirectResponse>(response);

  if (body.success === false) {
    throw new PaymentApiError(body.message ?? "PayTabs redirect failed.", response.status);
  }

  return extractRedirectUrl(body);
}

/** GET /api/payment/:token/paytabs/redirect (course / general) */
/** Server-confirmed outcome of a payment, from GET /api/payment/{token}/status. */
export interface PaymentStatus {
  outcome: "paid" | "pending" | "failed";
  /** Raw status: fawry/paytabs payment status, or the internship payment status. */
  status: string;
  transactionNumber: string | null;
  paymentType: string | null;
}

const PAID_STATUSES = new Set(["paid", "accepted", "cash", "completed", "success"]);
const FAILED_STATUSES = new Set(["failed", "rejected", "cancelled", "canceled", "expired", "declined"]);

export async function fetchPaymentStatus(token: string): Promise<PaymentStatus> {
  const response = await paymentFetch(`/api/payment/${encodeURIComponent(token)}/status`);
  const body = await parseJson<{
    success?: boolean;
    data?: {
      status?: string | null;
      transaction_number?: string | null;
      payment_type?: string | null;
    };
  }>(response);

  const status = String(body.data?.status ?? "none").trim().toLowerCase();

  return {
    outcome: PAID_STATUSES.has(status)
      ? "paid"
      : FAILED_STATUSES.has(status)
        ? "failed"
        : "pending",
    status,
    transactionNumber: body.data?.transaction_number?.trim() || null,
    paymentType: body.data?.payment_type?.trim() || null,
  };
}

export async function fetchPayTabsRedirectUrl(token: string): Promise<string> {
  return fetchPayTabsRedirectForPath(
    token,
    `/api/payment/${encodeURIComponent(token)}/paytabs/redirect`,
  );
}

/** GET /api/payment/:token/paytabs/internship/redirect */
export async function fetchInternshipPayTabsRedirectUrl(
  token: string,
): Promise<string> {
  return fetchPayTabsRedirectForPath(
    token,
    `/api/payment/${encodeURIComponent(token)}/paytabs/internship/redirect`,
  );
}

/** GET /api/payment/:token/fawry/redirect — returns Fawry reference (no browser redirect). */
async function createFawryPaymentForPath(
  token: string,
  path: string,
): Promise<FawryReferenceResponse> {
  if (isDevMockToken(token)) {
    return {
      success: true,
      transaction_number: `FAWRY-DEMO-${token.toUpperCase()}`,
      payment_status: "unpaid",
      is_payatfawry: true,
      message: "Demo Fawry reference (Laravel offline).",
    };
  }

  const response = await paymentFetch(path);
  const body = await parseJson<FawryReferenceResponse>(response);

  if (body.success === false) {
    throw new PaymentApiError(body.message ?? "Fawry payment failed.", response.status);
  }

  const transactionNumber =
    typeof body.transaction_number === "string" ? body.transaction_number.trim() : "";

  if (!transactionNumber) {
    throw new PaymentApiError("No Fawry reference number was returned.", 502);
  }

  return {
    ...body,
    success: true,
    transaction_number: transactionNumber,
  };
}

/** GET /api/payment/:token/fawry/redirect (course / general) */
export async function createFawryPayment(token: string): Promise<FawryReferenceResponse> {
  return createFawryPaymentForPath(
    token,
    `/api/payment/${encodeURIComponent(token)}/fawry/redirect`,
  );
}

/** GET /api/payment/:token/fawry/internship/redirect */
export async function createInternshipFawryPayment(
  token: string,
): Promise<FawryReferenceResponse> {
  return createFawryPaymentForPath(
    token,
    `/api/payment/${encodeURIComponent(token)}/fawry/internship/redirect`,
  );
}

/** POST /api/payment/:token/apply-voucher */
export async function applyVoucher(
  token: string,
  voucherCode: string,
): Promise<VoucherActionResponse> {
  if (isDevMockToken(token)) {
    getMockPayment(token);
    return mockApplyVoucher(token, voucherCode);
  }

  const response = await paymentFetch(
    `/api/payment/${encodeURIComponent(token)}/apply-voucher`,
    {
      method: "POST",
      body: JSON.stringify({ voucher_code: voucherCode }),
    },
  );

  const payload = await parseJson<Parameters<typeof normalizeApplyVoucherResponse>[0]>(
    response,
  );

  return normalizeApplyVoucherResponse(payload, voucherCode);
}

/** POST /api/payment/:token/remove-voucher */
export async function removeVoucher(token: string): Promise<VoucherActionResponse> {
  if (isDevMockToken(token)) {
    return mockRemoveVoucher(token);
  }

  const response = await paymentFetch(
    `/api/payment/${encodeURIComponent(token)}/remove-voucher`,
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );

  const payload = await parseJson<Parameters<typeof normalizeRemoveVoucherResponse>[0]>(
    response,
  );

  return normalizeRemoveVoucherResponse(payload);
}

export { PaymentApiError };