"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";

interface OrderSuccessCardProps {
  phoneNumber: string;
  orderNumber: string;
  onReset: () => void;
}

export default function OrderSuccessCard({
  phoneNumber,
  orderNumber,
  onReset,
}: OrderSuccessCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("فشل في نسخ رقم الطلب:", err);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-border/80 p-6 sticky top-24 text-center flex flex-col gap-4"
      dir="rtl"
    >
      <div className="w-16 h-16 bg-success-light text-success rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h3 className="text-xl font-extrabold text-heading">
        تم استلام طلبك بنجاح!
      </h3>
      <p className="text-xs text-muted">
        وصل طلبك الآن سيراجع الدفع ثم تحضير طلبك .
      </p>

      {phoneNumber && (
        <div className="flex items-center justify-center gap-2 bg-surface-soft border border-border/70 rounded-xl py-2 px-3 max-w-xs mx-auto">
          <span className="text-xs text-muted font-medium">بياناتك:</span>
          <span className="font-bold text-primary font-mono text-sm">
            {phoneNumber}
          </span>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 bg-primary-light/60 border border-primary/25 rounded-xl py-2.5 px-3 max-w-xs mx-auto">
        <span className="text-xs text-sub font-bold">رقم الطلب:</span>
        <span className="font-extrabold text-primary font-mono text-base">
          #{orderNumber}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          title="نسخ رقم الطلب"
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
            copied
              ? "bg-success-light text-success border-success-border"
              : "bg-white text-sub border-border hover:bg-surface-subtle hover:text-heading active:scale-95"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-success" />
              <span>تم النسخ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted-light" />
              <span>نسخ</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-muted leading-relaxed font-bold">
        احتفظ برقم الطلب لمتابعة حالة طلبك في أي وقت.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="w-full mt-4 bg-primary hover:bg-primary-hover text-white font-extrabold py-3 px-4 rounded-xl transition-all shadow-sm cursor-pointer active:scale-[0.99]"
      >
        طلب جديد
      </button>
    </div>
  );
}