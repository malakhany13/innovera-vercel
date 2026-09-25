import { formatPaymentType } from "@/lib/payment/format";
import type { PaymentData } from "@/types/payment";

interface PaymentSummaryProps {
  data: PaymentData;
}

export default function PaymentSummary({ data }: PaymentSummaryProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <dl className="space-y-2">
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-gray-600">Student Name:</dt>
          <dd className="text-sm font-medium text-gray-900 text-right">
            {data.student_name}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-gray-600">Course Title:</dt>
          <dd className="text-sm font-medium text-gray-900 text-right">
            {data.course_title}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-sm text-gray-600">Payment Type:</dt>
          <dd className="text-sm font-medium text-gray-900 text-right capitalize">
            {formatPaymentType(data.payment_type)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
