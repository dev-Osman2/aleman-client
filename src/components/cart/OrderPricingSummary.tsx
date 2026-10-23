"use client";

import { Wallet } from "lucide-react";

interface OrderPricingSummaryProps {
  totalPrice: number;
  deliveryFee: number;
  isPickup: boolean;
  isDineIn?: boolean;
  finalTotal: number;
}

export default function OrderPricingSummary({
  totalPrice,
  deliveryFee,
  isPickup,
  isDineIn = false,
  finalTotal,
}: OrderPricingSummaryProps) {
  return (
    <div className="bg-surface-soft/90 p-4 rounded-xl flex flex-col gap-2.5 border border-border-subtle">
      <div className="flex justify-between items-center text-sub text-xs sm:text-sm">
        <span>مجموع الوجبات:</span>
        <span className="font-bold text-body">{totalPrice} ج</span>
      </div>

      {!isDineIn && (
        <div className="flex justify-between items-center text-sub text-xs sm:text-sm">
          <span>رسوم التوصيل:</span>
          {isPickup ? (
            <span className="font-bold text-success">مجاناً</span>
          ) : (
            <span className="font-bold text-body">{deliveryFee} ج</span>
          )}
        </div>
      )}

      <div className="border-t border-border/80 pt-2.5 flex justify-between items-center text-heading font-extrabold">
        <span className="text-sm flex items-center gap-1.5">
          <Wallet className="w-4 h-4 text-primary" />
          <span>الإجمالي النهائي:</span>
        </span>
        <span className="text-lg sm:text-xl text-primary">
          {finalTotal} ج
        </span>
      </div>
    </div>
  );
}
