"use client";

import { useCart } from "@/src/context/CartContext";
import { Receipt, AlertCircle, CheckCircle2 } from "lucide-react";
import CashierCartItemList from "./components/CashierCartItemList";
import CashierCartSummary from "./components/CashierCartSummary";
import CashierPaymentSelector from "./components/CashierPaymentSelector";
import CashierCartActions from "./components/CashierCartActions";

interface CashierCartPanelProps {
  notes: string;
  setNotes: (val: string) => void;
  paymentMode: "cash" | "card" | "instapay";
  setPaymentMode: (mode: "cash" | "card" | "instapay") => void;
  submitting: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  onPrintAndSubmit: () => void;
  onResetCart: () => void;
}

export default function CashierCartPanel({
  notes,
  setNotes,
  paymentMode,
  setPaymentMode,
  submitting,
  errorMsg,
  successMsg,
  onPrintAndSubmit,
  onResetCart,
}: CashierCartPanelProps) {
  const { cart, updateQuantity, removeFromCart, subtotalPrice } = useCart();
  const totalPrice = Number(subtotalPrice || 0);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-border/80 p-5 sm:p-6 sticky top-24 flex flex-col gap-5 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2 text-heading">
          <Receipt className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-extrabold">
            ملخص الطلب والحساب
          </h3>
        </div>
        <span className="text-[11px] font-extrabold bg-primary-light text-primary px-2.5 py-1 rounded-full">
          نقطة بيع الكاشير
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-danger-light border border-danger-border text-danger rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-success-light border border-success-border text-success rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <CashierCartItemList
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <CashierCartSummary
        notes={notes}
        setNotes={setNotes}
        totalPrice={totalPrice}
      />

      <CashierPaymentSelector
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
      />

      <CashierCartActions
        submitting={submitting}
        isCartEmpty={cart.length === 0}
        onPrintAndSubmit={onPrintAndSubmit}
        onResetCart={onResetCart}
      />
    </div>
  );
}
