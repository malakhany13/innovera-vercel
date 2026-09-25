import { formatPrice } from "@/lib/payment/format";
import { cn } from "@/lib/utils";
import { hasVoucherDiscount, type Pricing } from "@/types/payment";

interface PriceCardProps {
  pricing: Pricing;
  voucherComment?: string;
  isRemovingVoucher?: boolean;
  onRemoveVoucher?: () => void;
}

export default function PriceCard({
  pricing,
  voucherComment,
  isRemovingVoucher = false,
  onRemoveVoucher,
}: PriceCardProps) {
  const showDiscount = hasVoucherDiscount(pricing);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-lg border-2 border-blue-200 shadow-sm">
      {showDiscount ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center gap-3 text-sm">
            <span className="text-gray-600">Original price</span>
            <span className="text-gray-500 line-through font-medium">
              {formatPrice(pricing.original_price!)}
            </span>
          </div>
          <div className="flex justify-between items-center gap-3 text-sm">
            <span className="text-emerald-700 font-medium">Discount</span>
            <span className="text-emerald-700 font-semibold">
              −{formatPrice(pricing.voucher_value)}
            </span>
          </div>
          {voucherComment ? (
            <p className="text-xs text-emerald-700/90">{voucherComment}</p>
          ) : null}
          <div className="flex justify-between items-center gap-3 border-t border-blue-200 pt-3">
            <span className="text-sm font-medium text-gray-700">Total Amount:</span>
            <span className="text-xl font-bold text-green-600">
              {formatPrice(pricing.total_amount)}
            </span>
          </div>
          {onRemoveVoucher ? (
            <button
              type="button"
              onClick={onRemoveVoucher}
              disabled={isRemovingVoucher}
              className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
            >
              {isRemovingVoucher ? "Removing voucher…" : "Remove voucher"}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="flex justify-between items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Total Amount:</span>
          <span className={cn("text-lg font-bold text-blue-600")}>
            {formatPrice(pricing.total_amount)}
          </span>
        </div>
      )}
    </div>
  );
}
