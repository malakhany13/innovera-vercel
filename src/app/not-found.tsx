import Link from "next/link";
import PaymentNotFoundBridge from "@/components/payment/PaymentNotFoundBridge";

export default function NotFound() {
  return (
    <PaymentNotFoundBridge>
      <div className="min-h-[60vh] flex items-center justify-center px-6 pt-24">
        <div className="text-center max-w-md">
          <p className="text-6xl font-display font-bold text-brand-cyan mb-4">404</p>
          <h1 className="text-2xl font-display font-bold text-brand-navy mb-3">Page not found</h1>
          <p className="text-slate-500 mb-8">
            The page you are looking for may have moved or no longer exists.
          </p>
          <Link
            href="/"
            className="inline-flex px-6 py-3 bg-brand-cyan text-white font-bold rounded-full hover:bg-cyan-500 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </PaymentNotFoundBridge>
  );
}
