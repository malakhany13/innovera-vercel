"use client";

import { Check, Loader2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VoucherMessage } from "@/types/payment";

interface VoucherSectionProps {
  voucherCode: string;
  appliedCode?: string;
  isApplying: boolean;
  isRemoving: boolean;
  message: VoucherMessage | null;
  onVoucherCodeChange: (value: string) => void;
  onApply: () => void;
}

export default function VoucherSection({
  voucherCode,
  appliedCode,
  isApplying,
  isRemoving,
  message,
  onVoucherCodeChange,
  onApply,
}: VoucherSectionProps) {
  const isApplied = Boolean(appliedCode);
  const isBusy = isApplying || isRemoving;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="size-4 text-gray-500" aria-hidden />
        <h3 className="text-sm font-medium text-gray-700">Voucher Code</h3>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={voucherCode}
          onChange={(e) => onVoucherCodeChange(e.target.value)}
          placeholder="Enter voucher code"
          disabled={isApplied || isBusy}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:bg-gray-100 disabled:text-gray-500"
        />
        <button
          type="button"
          onClick={onApply}
          disabled={isApplied || isBusy || !voucherCode.trim()}
          className={cn(
            "inline-flex min-w-[88px] items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold transition-colors",
            isApplied
              ? "cursor-default bg-green-100 text-green-700"
              : "bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          {isApplying ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : isApplied ? (
            <>
              <Check className="size-4" aria-hidden />
              Applied
            </>
          ) : (
            "Apply"
          )}
        </button>
      </div>

      {message ? (
        <p
          role="status"
          className={cn(
            "text-sm",
            message.type === "success" ? "text-green-700" : "text-red-600",
          )}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
