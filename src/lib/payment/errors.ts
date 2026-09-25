export function isPaymentLinkExpiredMessage(message: string): boolean {
  return /incorrect|expired|invalid.*link/i.test(message);
}
