import type { PaymentData, Pricing } from "@/types/payment";

interface MockPaymentState extends PaymentData {
  base_total: number;
}

const mockPayments = new Map<string, MockPaymentState>();

/** Offline demo tokens only — real payments use Laravel vouchers. */
const VOUCHER_CODES: Record<string, { value: number; comment?: string }> = {
  INNOVERA10: { value: 500, comment: "10% off (max L.E. 500)" },
  SAVE1000: { value: 1000, comment: "L.E. 1,000 discount" },
  MINA: { value: 500, comment: "L.E. 500 discount" },
};

function buildBasePayment(token: string): MockPaymentState {
  const isAssessment = token.startsWith("assessment");
  const baseTotal = token === "assessment-internship" ? 150 : isAssessment ? 50 : 5000;

  return {
    payment_type: isAssessment ? "assessment" : "course",
    student_name: "Mina Maged Faris",
    course_title: isAssessment
      ? "AI Interview Assessment"
      : "AI & Machine Learning",
    base_total: baseTotal,
    pricing: {
      total_amount: baseTotal,
      original_price: null,
      voucher_applied: false,
      voucher_value: 0,
    },
  };
}

export function getMockPayment(token: string): MockPaymentState {
  const existing = mockPayments.get(token);
  if (existing) return existing;

  const seeded =
    token === "voucher-demo"
      ? {
          ...buildBasePayment(token),
          voucher_code: "INNOVERA10",
          voucher_comment: VOUCHER_CODES.INNOVERA10.comment,
          pricing: {
            total_amount: 4500,
            original_price: 5000,
            voucher_applied: true,
            voucher_value: 500,
          },
        }
      : buildBasePayment(token);

  mockPayments.set(token, seeded);
  return seeded;
}

export function mockPaymentResponse(token: string) {
  const payment = getMockPayment(token);
  return {
    success: true,
    data: {
      payment_type: payment.payment_type,
      student_name: payment.student_name,
      course_title: payment.course_title,
      pricing: payment.pricing,
      ...(payment.voucher_code ? { voucher_code: payment.voucher_code } : {}),
      ...(payment.voucher_comment ? { voucher_comment: payment.voucher_comment } : {}),
    },
  };
}

function applyPricing(baseTotal: number, voucherValue: number): Pricing {
  return {
    total_amount: Math.max(0, baseTotal - voucherValue),
    original_price: baseTotal,
    voucher_applied: true,
    voucher_value: voucherValue,
  };
}

export function mockApplyVoucher(token: string, voucherCode: string) {
  const code = voucherCode.trim().toUpperCase();
  const voucher = VOUCHER_CODES[code];

  if (!voucher) {
    return {
      success: false as const,
      message:
        "Invalid voucher code. Demo codes (local only): INNOVERA10, SAVE1000, MINA.",
    };
  }

  const payment = getMockPayment(token);
  if (payment.payment_type === "assessment") {
    return {
      success: false as const,
      message: "Vouchers cannot be applied to assessment payments.",
    };
  }

  const pricing = applyPricing(payment.base_total, voucher.value);
  const updated: MockPaymentState = {
    ...payment,
    voucher_code: code,
    voucher_comment: voucher.comment,
    pricing,
  };

  mockPayments.set(token, updated);

  return {
    success: true as const,
    message: "Voucher applied successfully.",
    data: {
      pricing,
      voucher_code: code,
      voucher_comment: voucher.comment,
    },
  };
}

export function mockRemoveVoucher(token: string) {
  const payment = getMockPayment(token);

  if (!payment.pricing.voucher_applied) {
    return {
      success: false as const,
      message: "No voucher is applied.",
    };
  }

  const pricing: Pricing = {
    total_amount: payment.base_total,
    original_price: null,
    voucher_applied: false,
    voucher_value: 0,
  };

  const updated: MockPaymentState = {
    ...payment,
    voucher_code: undefined,
    voucher_comment: undefined,
    pricing,
  };

  mockPayments.set(token, updated);

  return {
    success: true as const,
    message: "Voucher removed.",
    data: { pricing },
  };
}
