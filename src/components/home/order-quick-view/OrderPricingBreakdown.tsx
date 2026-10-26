import { TrackedOrder } from "../OrderQuickViewModal";

interface OrderPricingBreakdownProps {
  order: TrackedOrder;
}

export default function OrderPricingBreakdown({
  order,
}: OrderPricingBreakdownProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-xs sm:text-sm">
      <div className="flex justify-between text-gray-600">
        <span>قيمة الكتب:</span>
        <span className="font-bold text-gray-800">{order.subtotal} ج.م</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>رسوم التوصيل:</span>
        <span className="font-bold text-gray-800">{order.deliveryFee} ج.م</span>
      </div>
      <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm sm:text-base">
        <span className="font-extrabold text-gray-900">الإجمالي النهائي:</span>
        <span className="font-black text-lg text-teal-700">
          {order.total} ج.م
        </span>
      </div>
    </div>
  );
}
