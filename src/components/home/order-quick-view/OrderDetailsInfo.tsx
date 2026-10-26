import { MapPin, CreditCard, FileText } from "lucide-react";
import { TrackedOrder } from "../OrderQuickViewModal";

interface OrderDetailsInfoProps {
  order: TrackedOrder;
  paymentLabel: string;
}

export default function OrderDetailsInfo({
  order,
  paymentLabel,
}: OrderDetailsInfoProps) {
  return (
    <div className="flex flex-col gap-3 mb-5 text-xs">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500 font-bold mb-1">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>عنوان التوصيل</span>
          </div>
          <p className="font-bold text-gray-800 wrap-break-word">
            {order.address}
          </p>
        </div>

        <div className="flex-1 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500 font-bold mb-1">
            <CreditCard className="w-4 h-4 text-teal-600" />
            <span>طريقة الدفع والتحويل</span>
          </div>
          <p className="font-bold text-gray-800">{paymentLabel}</p>
          <p className="text-gray-500 mt-0.5 font-mono dir-ltr text-right">
            رقم التحويل: {order.transferNumber}
          </p>
        </div>
      </div>

      {order.notes && (
        <div className="w-full bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-1">
            <FileText className="w-4 h-4 text-amber-600" />
            <span>ملاحظات على الطلب</span>
          </div>
          <p className="text-gray-700 font-medium">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
