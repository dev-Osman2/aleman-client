interface CheckoutSummaryPricingProps {
  subtotalPrice: number;
  deliveryFee: number;
  totalPrice: number;
}

export default function CheckoutSummaryPricing({
  subtotalPrice,
  deliveryFee,
  totalPrice,
}: CheckoutSummaryPricingProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs md:text-sm border border-gray-100 shrink-0">
      <div className="flex justify-between text-muted font-bold">
        <span>إجمالي الكتب:</span>
        <span>{subtotalPrice} ج.م</span>
      </div>
      <div className="flex justify-between text-muted font-bold">
        <span>رسوم التوصيل:</span>
        <span>{deliveryFee} ج.م</span>
      </div>
      <div className="flex justify-between text-base font-black text-heading border-t border-gray-200 pt-2">
        <span>الإجمالي الكلي:</span>
        <span className="text-primary">{totalPrice} ج.م</span>
      </div>
    </div>
  );
}
