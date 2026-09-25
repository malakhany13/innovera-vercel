/** Format price the same way as the Laravel Blade template (L.E. with 2 decimals). */
export function formatPrice(amount: number): string {
  return `L.E. ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPaymentType(paymentType: string): string {
  return paymentType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function paymentTypeTitle(paymentType: string): string {
  const normalized = paymentType.toLowerCase();
  if (normalized === "assessment" || normalized === "enrollment") {
    return "Assessment Payment";
  }
  return "Course Payment";
}
