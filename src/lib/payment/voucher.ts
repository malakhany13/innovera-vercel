import type { Pricing, VoucherActionResponse } from "@/types/payment";

interface LaravelVoucherPayload {
  success: boolean;
  message: string;
  original_price?: number | string;
  voucher_value?: number | string;
  new_price?: number | string;
  total_amount?: number | string;
  voucher_code?: string;
  voucher_comment?: string;
  data?: {
    pricing?: Pricing;
    voucher_code?: string;
    voucher_comment?: string;
    original_price?: number | string;
    voucher_value?: number | string;
    new_price?: number | string;
    total_amount?: number | string;
    voucher_applied?: boolean;
  };
}

function toNumber(value: number | string | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildPricingFromFields(fields: {
  original_price?: number | string;
  voucher_value?: number | string;
  new_price?: number | string;
  total_amount?: number | string;
  voucher_applied?: boolean;
}): Pricing | null {
  const originalPrice = toNumber(fields.original_price);
  const newPrice =
    toNumber(fields.new_price) ?? toNumber(fields.total_amount);

  if (newPrice === undefined || originalPrice === undefined) {
    return null;
  }

  const voucherValue =
    toNumber(fields.voucher_value) ?? Math.max(0, originalPrice - newPrice);

  return {
    total_amount: newPrice,
    original_price: originalPrice,
    voucher_applied: fields.voucher_applied ?? voucherValue > 0,
    voucher_value: voucherValue,
  };
}

/** Normalize Laravel blade/API voucher responses into the frontend contract. */
export function normalizeApplyVoucherResponse(
  payload: LaravelVoucherPayload,
  voucherCode?: string,
): VoucherActionResponse {
  if (payload.data?.pricing) {
    return {
      success: payload.success,
      message: payload.message,
      data: {
        pricing: payload.data.pricing,
        voucher_code: payload.data.voucher_code ?? voucherCode,
        voucher_comment: payload.data.voucher_comment,
      },
    };
  }

  const pricing =
    (payload.data ? buildPricingFromFields(payload.data) : null) ??
    buildPricingFromFields(payload);

  if (payload.success && pricing) {
    return {
      success: true,
      message: payload.message,
      data: {
        pricing,
        voucher_code:
          payload.data?.voucher_code ?? payload.voucher_code ?? voucherCode,
        voucher_comment:
          payload.data?.voucher_comment ?? payload.voucher_comment,
      },
    };
  }

  return {
    success: payload.success,
    message: payload.message,
  };
}

export function normalizeRemoveVoucherResponse(
  payload: LaravelVoucherPayload,
): VoucherActionResponse {
  if (payload.data?.pricing) {
    return {
      success: payload.success,
      message: payload.message,
      data: {
        pricing: payload.data.pricing,
        voucher_code: payload.data.voucher_code,
        voucher_comment: payload.data.voucher_comment,
      },
    };
  }

  const originalPrice =
    toNumber(payload.data?.original_price) ?? toNumber(payload.original_price);

  if (payload.success && originalPrice !== undefined) {
    return {
      success: true,
      message: payload.message,
      data: {
        pricing: {
          total_amount: originalPrice,
          original_price: null,
          voucher_applied: false,
          voucher_value: 0,
        },
      },
    };
  }

  return {
    success: payload.success,
    message: payload.message,
  };
}

/** Stateless Laravel API — POST /api/payment/:token/apply-voucher */
export function laravelEnrollmentsApplyVoucherPath(token: string): string {
  return `/api/payment/${encodeURIComponent(token)}/apply-voucher`;
}

export function laravelApplyVoucherApiPath(token: string, voucherCode: string): string {
  const query = new URLSearchParams({
    token,
    voucher_code: voucherCode,
  });

  return `/api/payment/apply-voucher?${query.toString()}`;
}

export function laravelRemoveVoucherApiPath(token: string): string {
  const query = new URLSearchParams({ token });
  return `/api/payment/remove-voucher?${query.toString()}`;
}
