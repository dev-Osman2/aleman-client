"use client";

import { CreditCard } from "lucide-react";
import { CartPaymentMethod } from "@/src/types";

interface PaymentMethodSelectorProps {
  paymentMethod: CartPaymentMethod;
  setPaymentMethod: (val: CartPaymentMethod) => void;
}

export default function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      <div className="flex items-center gap-1.5">
        <CreditCard className="w-4 h-4 text-primary" />
        <span className="text-xs font-extrabold text-body">طريقة الدفع</span>
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => setPaymentMethod("instapay")}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
            paymentMethod === "instapay"
              ? "border-primary bg-primary-light/70 text-primary shadow-2xs"
              : "border-border bg-white text-sub hover:bg-surface-soft"
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              paymentMethod === "instapay" ? "border-primary" : "border-border"
            }`}
          >
            {paymentMethod === "instapay" && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </span>
          <span>إنستاباي (InstaPay)</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod("vodafone_cash")}
          className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
            paymentMethod === "vodafone_cash"
              ? "border-primary bg-primary-light/70 text-primary shadow-2xs"
              : "border-border bg-white text-sub hover:bg-surface-soft"
          }`}
        >
          <span
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              paymentMethod === "vodafone_cash" ? "border-primary" : "border-border"
            }`}
          >
            {paymentMethod === "vodafone_cash" && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </span>
          <span>فودافون كاش</span>
        </button>
      </div>
    </div>
  );
}
