"use client";

import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  applyVoucher,
  fetchPayment,
  PaymentApiError,
  removeVoucher,
} from "@/lib/api/payment";
import { isPaymentLinkExpiredMessage } from "@/lib/payment/errors";
import { paymentTypeTitle } from "@/lib/payment/format";
import {
  hasVoucherDiscount,
  isAssessmentPayment,
  pricingWithoutVoucher,
  type PaymentData,
  type VoucherMessage,
} from "@/types/payment";
import PaymentMethods from "./PaymentMethods";
import PaymentPageSkeleton from "./PaymentPageSkeleton";
import PaymentSummary from "./PaymentSummary";
import PriceCard from "./PriceCard";
import VoucherSection from "./VoucherSection";

interface PaymentPageClientProps {
  token: string;
}

type PageState = "loading" | "ready" | "not_found" | "invalid_token" | "error";

/** Prefer the live URL path so host rewrites to the shell still work. */
function tokenFromPathname(pathname: string | null, fallback: string): string {
  const SHELL = "fallback";
  const sources = [
    typeof window !== "undefined" ? window.location.pathname : null,
    pathname,
  ];
  for (const source of sources) {
    const match = source?.match(/^\/payment\/([^/]+)\/?$/i);
    const fromPath = match?.[1] ? decodeURIComponent(match[1]) : "";
    if (fromPath && fromPath !== SHELL) return fromPath;
  }
  if (fallback && fallback !== SHELL) return fallback;
  return fallback;
}

export default function PaymentPageClient({ token: tokenProp }: PaymentPageClientProps) {
  const pathname = usePathname();
  const token = tokenFromPathname(pathname, tokenProp);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState<VoucherMessage | null>(null);
  const [voucherAppliedInSession, setVoucherAppliedInSession] = useState(false);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [isRemovingVoucher, setIsRemovingVoucher] = useState(false);

  const loadPayment = useCallback(async () => {
    if (!token.trim()) {
      setPageState("invalid_token");
      return;
    }

    setPageState("loading");
    setErrorMessage(null);

    try {
      let data = await fetchPayment(token);

      if (!isAssessmentPayment(data.payment_type) && hasVoucherDiscount(data.pricing)) {
        try {
          const removed = await removeVoucher(token);
          if (removed.success && removed.data?.pricing) {
            data = {
              ...data,
              pricing: removed.data.pricing,
              voucher_code: undefined,
              voucher_comment: undefined,
            };
          } else {
            data = {
              ...data,
              pricing: pricingWithoutVoucher(data.pricing),
              voucher_code: undefined,
              voucher_comment: undefined,
            };
          }
        } catch {
          data = {
            ...data,
            pricing: pricingWithoutVoucher(data.pricing),
            voucher_code: undefined,
            voucher_comment: undefined,
          };
        }
      }

      setPayment(data);
      setVoucherCode("");
      setVoucherAppliedInSession(false);
      setPageState("ready");
    } catch (error) {
      if (error instanceof PaymentApiError) {
        const message = error.message;
        const lowered = message.toLowerCase();

        if (error.status === 404 && isPaymentLinkExpiredMessage(lowered)) {
          setErrorMessage(message);
          setPageState("invalid_token");
          return;
        }

        if (error.status === 404) {
          setErrorMessage(message);
          setPageState("not_found");
          return;
        }

        if (error.status === 400 || error.status === 401 || error.status === 403) {
          setErrorMessage(message);
          setPageState("invalid_token");
          return;
        }

        if (error.status === 503 || error.status === 502) {
          setErrorMessage(message);
          setPageState("error");
          return;
        }

        // Laravel/ngrok down often surfaces as a bare 404 through the rewrite.
        if (
          error.status === 404 &&
          (lowered.includes("ngrok") ||
            lowered.includes("unreachable") ||
            lowered.includes("offline"))
        ) {
          setErrorMessage(message);
          setPageState("error");
          return;
        }
      }

      setErrorMessage(
        error instanceof PaymentApiError
          ? error.message
          : "Unable to load payment details. Please try again.",
      );
      setPageState("error");
    }
  }, [token]);

  useEffect(() => {
    void loadPayment();
  }, [loadPayment]);

  useEffect(() => {
    if (!voucherMessage || voucherMessage.persistent) return;

    const timer = window.setTimeout(() => setVoucherMessage(null), 5000);
    return () => window.clearTimeout(timer);
  }, [voucherMessage]);

  const handleApplyVoucher = async () => {
    const code = voucherCode.trim();
    if (!code || !payment) return;

    setIsApplyingVoucher(true);
    setVoucherMessage(null);

    try {
      const result = await applyVoucher(token, code);

      if (!result.success || !result.data?.pricing) {
        setVoucherMessage({ type: "error", text: result.message });
        return;
      }

      setPayment((current) =>
        current
          ? {
              ...current,
              pricing: result.data!.pricing,
              voucher_code: result.data!.voucher_code ?? code,
              voucher_comment: result.data!.voucher_comment,
            }
          : current,
      );
      setVoucherCode(result.data.voucher_code ?? code);
      setVoucherAppliedInSession(true);
      setVoucherMessage({ type: "success", text: result.message });
    } catch (error) {
      setVoucherMessage({
        type: "error",
        text:
          error instanceof PaymentApiError
            ? error.message
            : "Unable to apply voucher. Please try again.",
      });
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = async () => {
    if (!payment) return;

    setIsRemovingVoucher(true);
    setVoucherMessage(null);

    try {
      const result = await removeVoucher(token);

      if (!result.success || !result.data?.pricing) {
        setVoucherMessage({ type: "error", text: result.message });
        return;
      }

      setPayment((current) =>
        current
          ? {
              ...current,
              pricing: result.data!.pricing,
              voucher_code: undefined,
              voucher_comment: undefined,
            }
          : current,
      );
      setVoucherCode("");
      setVoucherAppliedInSession(false);
      setVoucherMessage({ type: "success", text: result.message });
    } catch (error) {
      setVoucherMessage({
        type: "error",
        text:
          error instanceof PaymentApiError
            ? error.message
            : "Unable to remove voucher. Please try again.",
      });
    } finally {
      setIsRemovingVoucher(false);
    }
  };

  if (pageState === "loading") {
    return <PaymentPageSkeleton />;
  }

  if (pageState === "invalid_token") {
    return (
      <ErrorState
        title="Invalid payment link"
        description={
          errorMessage ??
          "This payment link is invalid or has expired. Please enroll again to get a new link."
        }
        onRetry={() => void loadPayment()}
      />
    );
  }

  if (pageState === "not_found") {
    return (
      <ErrorState
        title="Payment not found"
        description={
          errorMessage ??
          "We couldn't find a payment matching this link. It may have been removed or already completed."
        }
        onRetry={() => void loadPayment()}
      />
    );
  }

  if (pageState === "error") {
    const backendDown = errorMessage?.toLowerCase().includes("unreachable");

    return (
      <ErrorState
        title="Something went wrong"
        description={errorMessage ?? "Unable to load payment details. Please try again later."}
        hint={
          backendDown ? (
            <ol className="mt-4 space-y-2 text-left text-sm text-gray-600 list-decimal list-inside">
              <li>Confirm Laravel is running and exposes <code className="text-xs bg-gray-100 px-1 rounded">/api/payment/…</code>.</li>
              <li>
                Prefer serving this page from the same host as Laravel (relative{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">/api/payment/…</code>, no CORS).
              </li>
              <li>
                If the API is on another origin, rebuild with{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">NEXT_PUBLIC_LARAVEL_API_BASE_URL</code> set.
              </li>
              <li>Retry this page, or open a fresh payment link from email.</li>
            </ol>
          ) : undefined
        }
        onRetry={() => void loadPayment()}
      />
    );
  }

  if (!payment) {
    return (
      <ErrorState
        title="Payment not found"
        description="We couldn't find a payment matching this link."
      />
    );
  }

  // Internship payments deliberately have no voucher support (see
  // PaymentController::show / apply-voucher backend), so gate the voucher UI
  // off for them too, not just assessment/enrollment payments.
  const showVoucher =
    !isAssessmentPayment(payment.payment_type) &&
    payment.payment_type.toLowerCase() !== "internship";
  const displayPricing = voucherAppliedInSession
    ? payment.pricing
    : pricingWithoutVoucher(payment.pricing);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Out Page</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {paymentTypeTitle(payment.payment_type)}
          </h2>
          <p className="text-gray-600">{payment.course_title}</p>
        </div>

        <div className="space-y-6">
          <PaymentSummary data={payment} />

          {showVoucher ? (
            <VoucherSection
              voucherCode={voucherCode}
              appliedCode={voucherAppliedInSession ? payment.voucher_code ?? voucherCode : undefined}
              isApplying={isApplyingVoucher}
              isRemoving={isRemovingVoucher}
              message={voucherMessage}
              onVoucherCodeChange={setVoucherCode}
              onApply={() => void handleApplyVoucher()}
            />
          ) : null}

          <PriceCard
            pricing={displayPricing}
            voucherComment={voucherAppliedInSession ? payment.voucher_comment : undefined}
            isRemovingVoucher={isRemovingVoucher}
            onRemoveVoucher={
              showVoucher && voucherAppliedInSession ? () => void handleRemoveVoucher() : undefined
            }
          />

          {redirectError ? (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden />
              <p>{redirectError}</p>
            </div>
          ) : null}

          <PaymentMethods
            token={token}
            onError={(message) => setRedirectError(message || null)}
          />

          <p className="text-[10px] text-gray-500 text-center leading-relaxed">
            By proceeding, you agree to our terms of service. Payments are processed
            securely via our partner gateways.
          </p>
        </div>
      </div>
    </div>
  );
}

function ErrorState({
  title,
  description,
  hint,
  onRetry,
}: {
  title: string;
  description: string;
  hint?: ReactNode;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertCircle className="size-7" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
        {hint}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        ) : null}
      </div>
    </div>
  );
}
