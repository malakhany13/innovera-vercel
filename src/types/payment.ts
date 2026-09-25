export interface PaymentResponse {
  success: boolean;
  data: PaymentData;
}

export interface PaymentData {
  payment_type: string;
  student_name: string;
  course_title: string;
  pricing: Pricing;
  voucher_code?: string;
  voucher_comment?: string;
}

export interface Pricing {
  total_amount: number;
  original_price: number | null;
  voucher_applied: boolean;
  voucher_value: number;
}

export type PaymentMethod = "paytabs" | "fawry";

export interface PaymentRedirectResponse {
  success?: boolean;
  redirect_url?: string;
  redirectUrl?: string;
  data?: {
    redirect_url?: string;
    redirectUrl?: string;
  };
  message?: string;
}

/** Fawry Pay-at-Fawry: reference number, no browser redirect. */
export interface FawryReferenceResponse {
  success: boolean;
  transaction_number: string;
  payment_status?: string;
  is_payatfawry?: boolean;
  message?: string;
}

export function hasVoucherDiscount(pricing: Pricing): boolean {
  return pricing.original_price !== null && pricing.voucher_applied;
}

/** Full price before any voucher discount. */
export function getFullPrice(pricing: Pricing): number {
  return pricing.original_price ?? pricing.total_amount;
}

export function pricingWithoutVoucher(pricing: Pricing): Pricing {
  const fullPrice = getFullPrice(pricing);

  return {
    total_amount: fullPrice,
    original_price: null,
    voucher_applied: false,
    voucher_value: 0,
  };
}

export interface VoucherMessage {
  type: "success" | "error";
  text: string;
  persistent?: boolean;
}

export interface VoucherActionResponse {
  success: boolean;
  message: string;
  data?: {
    pricing: Pricing;
    voucher_code?: string;
    voucher_comment?: string;
  };
}

export function isAssessmentPayment(paymentType: string): boolean {
  const normalized = paymentType.toLowerCase();
  return normalized === "assessment" || normalized === "enrollment";
}
