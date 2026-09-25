import type { PaymentData, Pricing } from "@/types/payment";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asAmount(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function asPricing(value: unknown, fallbackAmount: number): Pricing {
  const record = asRecord(value);
  if (record) {
    return {
      total_amount: asAmount(record.total_amount) || fallbackAmount,
      original_price:
        record.original_price == null ? null : asAmount(record.original_price),
      voucher_applied: Boolean(record.voucher_applied),
      voucher_value: asAmount(record.voucher_value),
    };
  }

  return {
    total_amount: fallbackAmount,
    original_price: null,
    voucher_applied: false,
    voucher_value: 0,
  };
}

/** Laravel `/api/payment/{token}/status` (and show) → checkout `PaymentData`. */
export function paymentDataFromLaravelPayload(payload: unknown): PaymentData | null {
  const root = asRecord(payload);
  if (!root) return null;

  const nested = asRecord(root.data) ?? root;
  const paymentType =
    asString(nested.payment_type) || asString(nested.paymentType);
  if (!paymentType && root.success === false) return null;

  const totalAmount =
    asAmount(asRecord(nested.pricing)?.total_amount) ||
    asAmount(nested.total_amount) ||
    asAmount(nested.amount) ||
    asAmount(nested.internship_cost);

  return {
    payment_type: paymentType || "course",
    student_name:
      asString(nested.student_name) ||
      asString(nested.studentName) ||
      asString(nested.full_name) ||
      asString(nested.fullName),
    course_title:
      asString(nested.course_title) ||
      asString(nested.courseTitle) ||
      asString(nested.title) ||
      "Payment",
    pricing: asPricing(nested.pricing, totalAmount),
    ...(asString(nested.voucher_code)
      ? { voucher_code: asString(nested.voucher_code) }
      : {}),
    ...(asString(nested.voucher_comment)
      ? { voucher_comment: asString(nested.voucher_comment) }
      : {}),
  };
}
