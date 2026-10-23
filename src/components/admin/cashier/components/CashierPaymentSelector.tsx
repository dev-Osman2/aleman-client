"use client";

import { CreditCard, Banknote, Wallet } from "lucide-react";

interface CashierPaymentSelectorProps {
  paymentMode: "cash" | "card" | "instapay";
  setPaymentMode: (mode: "cash" | "card" | "instapay") => void;
}

export default function CashierPaymentSelector({
  paymentMode,
  setPaymentMode,
}: CashierPaymentSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-extrabold text-sub">
        <CreditCard className="w-4 h-4 text-primary" />
        <span>طريقة الدفع</span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setPaymentMode("cash")}
          className={`py-2.5 px-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
            paymentMode === "cash"
              ? "bg-primary text-white border-primary shadow-xs"
              : "bg-surface-soft text-sub border-border hover:bg-surface-subtle"
          }`}
        >
          <Banknote className="w-4 h-4" />
          <span>كاش</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMode("card")}
          className={`py-2.5 px-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
            paymentMode === "card"
              ? "bg-primary text-white border-primary shadow-xs"
              : "bg-surface-soft text-sub border-border hover:bg-surface-subtle"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>فيزا / بطاقة</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMode("instapay")}
          className={`py-2.5 px-2 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
            paymentMode === "instapay"
              ? "bg-primary text-white border-primary shadow-xs"
              : "bg-surface-soft text-sub border-border hover:bg-surface-subtle"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>إنستاباي / محفظة</span>
        </button>
      </div>
    </div>
  );
}
