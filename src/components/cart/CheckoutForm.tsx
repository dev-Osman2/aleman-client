"use client";

import React from "react";
import Link from "next/link";
import { Send, AlertCircle, CheckCircle2, ShoppingBag } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useCheckoutForm } from "./hooks/useCheckoutForm";
import CheckoutCartItems from "./CheckoutCartItems";
import CheckoutPaymentSection from "./CheckoutPaymentSection";
import CheckoutSummaryPricing from "./CheckoutSummaryPricing";
import CheckoutCustomerInputs from "./CheckoutCustomerInputs";

export default function CheckoutForm() {
  const { updateQuantity, subtotalPrice, deliveryFee, totalPrice } = useCart();
  const {
    user,
    cart,
    name,
    setName,
    phone,
    setPhone,
    address,
    setAddress,
    notes,
    setNotes,
    paymentMethod,
    setPaymentMethod,
    transferNumber,
    setTransferNumber,
    isSubmitting,
    errorMsg,
    successOrderId,
    handleOrderSubmit,
  } = useCheckoutForm();

  return (
    <div
      id="order-summary"
      className="bg-white rounded-3xl border border-border-subtle p-5 sm:p-6 shadow-xs flex flex-col gap-5 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar"
      dir="rtl"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-black text-heading">ملخص الطلب</h3>
        </div>
        <span className="text-xs font-extrabold text-primary bg-primary-light px-2.5 py-1 rounded-full">
          {cart.length} كتاب
        </span>
      </div>

      {successOrderId && (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center space-y-1 shrink-0">
          <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
          <p className="text-sm font-black text-green-800">
            تم تسجيل طلبك بنجاح! رقم الطلب: #{successOrderId}
          </p>
          <p className="text-xs text-green-700">
            يمكنك متابعة حالة طلبك برقم الهاتف ({phone || user?.phone}) ورقم
            الطلب.
          </p>
        </div>
      )}

      <CheckoutCartItems cart={cart} onUpdateQuantity={updateQuantity} />

      {cart.length > 0 && (
        <CheckoutSummaryPricing
          subtotalPrice={subtotalPrice}
          deliveryFee={deliveryFee}
          totalPrice={totalPrice}
        />
      )}

      {!user && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-amber-800 shrink-0">
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>لابد من تسجيل حساب أولاً قبل إرسال الطلب</span>
          </div>
          <Link
            href="/register"
            className="shrink-0 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-amber-700"
          >
            سجل الآن
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-600 shrink-0">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleOrderSubmit} className="flex flex-col gap-4 shrink-0">
        <CheckoutCustomerInputs
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          address={address}
          setAddress={setAddress}
          notes={notes}
          setNotes={setNotes}
        />

        <CheckoutPaymentSection
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          transferNumber={transferNumber}
          setTransferNumber={setTransferNumber}
          totalPrice={totalPrice}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:opacity-95 py-4 text-sm md:text-base font-black text-white shadow-sm transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>
            {isSubmitting
              ? "جاري تسجيل الطلب..."
              : !user
                ? "سجل حسابك لإتمام الطلب"
                : "تأكيد وإرسال الطلب"}
          </span>
        </button>
      </form>
    </div>
  );
}
