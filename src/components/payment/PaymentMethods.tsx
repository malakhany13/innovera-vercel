"use client";

import { Building2, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  createFawryPayment,
  fetchPayTabsRedirectUrl,
  PaymentApiError,
} from "@/lib/api/payment";
import type { FawryReferenceResponse, PaymentMethod } from "@/types/payment";
import { cn } from "@/lib/utils";

interface PaymentMethodsProps {
  token: string;
  disabled?: boolean;
  onError?: (message: string) => void;
}

export default function PaymentMethods({
  token,
  disabled = false,
  onError,
}: PaymentMethodsProps) {
  const [loadingMethod, setLoadingMethod] = useState<PaymentMethod | null>(null);
  const [fawryReference, setFawryReference] = useState<FawryReferenceResponse | null>(
    null,
  );

  const handlePayTabs = async () => {
    if (disabled || loadingMethod) return;

    setLoadingMethod("paytabs");
    onError?.("");
    toast.loading("Connecting to PayTabs…", { id: "payment-paytabs" });

    try {
      const redirectUrl = await fetchPayTabsRedirectUrl(token);
      toast.success("Redirecting to PayTabs…", { id: "payment-paytabs" });
      window.location.assign(redirectUrl);
    } catch (error) {
      const message =
        error instanceof PaymentApiError
          ? error.message
          : "Unable to start payment. Please try again.";

      toast.error(message, { id: "payment-paytabs" });
      onError?.(message);
      setLoadingMethod(null);
    }
  };

  const handleFawry = async () => {
    if (disabled || loadingMethod) return;

    setLoadingMethod("fawry");
    onError?.("");
    toast.loading("Generating Fawry reference…", { id: "payment-fawry" });

    try {
      const result = await createFawryPayment(token);
      setFawryReference(result);
      toast.success("Fawry reference ready", { id: "payment-fawry" });
    } catch (error) {
      const message =
        error instanceof PaymentApiError
          ? error.message
          : "Unable to start Fawry payment. Please try again.";

      toast.error(message, { id: "payment-fawry" });
      onError?.(message);
    } finally {
      setLoadingMethod(null);
    }
  };

  const copyReference = async () => {
    const value = fawryReference?.transaction_number;
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      toast.success("Reference number copied");
    } catch {
      toast.error("Could not copy reference number");
    }
  };

  if (fawryReference) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Pay with Fawry</h3>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <Building2 className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Fawry reference number</p>
              {fawryReference.payment_status ? (
                <p className="text-xs text-gray-600 capitalize">
                  Status: {fawryReference.payment_status}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p
              className="flex-1 rounded-lg border border-amber-300 bg-white px-4 py-3 font-mono text-lg font-bold tracking-wide text-gray-900 text-center break-all"
              aria-label="Fawry reference number"
            >
              {fawryReference.transaction_number}
            </p>
            <button
              type="button"
              onClick={() => void copyReference()}
              className="shrink-0 rounded-lg border border-amber-300 bg-white p-3 text-amber-800 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Copy Fawry reference number"
            >
              <Copy className="size-4" aria-hidden />
            </button>
          </div>

          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>Go to any Fawry outlet (or use Fawry Pay in supported apps).</li>
            <li>
              Provide this reference number:{" "}
              <span className="font-semibold">{fawryReference.transaction_number}</span>
            </li>
            <li>Pay the amount shown above to complete your enrollment.</li>
            <li>Keep your receipt until payment is confirmed.</li>
          </ol>

          <p className="text-xs text-gray-600">
            You do not need to stay on this page. Once Fawry confirms the payment, your
            enrollment status will update automatically.
          </p>

          <p
            dir="rtl"
            lang="ar"
            className="rounded-lg border border-amber-200 bg-white/70 px-3 py-2 text-xs leading-relaxed text-gray-700 text-center"
          >
            مسؤولية فوري تقتصر على تحصيل المدفوعات. لأي استفسار يرجى التواصل معنا.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Select Payment Method</h3>

      <button
        type="button"
        onClick={() => void handlePayTabs()}
        disabled={disabled || loadingMethod !== null}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 text-base font-semibold text-white transition-colors",
          "hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {loadingMethod === "paytabs" ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : null}
        PayTabs
      </button>

      <button
        type="button"
        onClick={() => void handleFawry()}
        disabled={disabled || loadingMethod !== null}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl bg-[#FDB913] px-5 py-4 text-base font-semibold text-slate-900 transition-colors",
          "hover:bg-[#e5a800] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {loadingMethod === "fawry" ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : null}
        Fawry
      </button>

      <p
        dir="rtl"
        lang="ar"
        className="text-[11px] leading-relaxed text-gray-500 text-center"
      >
        مسؤولية فوري تقتصر على تحصيل المدفوعات. لأي استفسار يرجى التواصل معنا.
      </p>
    </div>
  );
}
