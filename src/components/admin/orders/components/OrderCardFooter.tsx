"use client";

import { useState } from "react";
import { Check, X, Copy, CreditCard } from "lucide-react";
import { Order, OrderStatus } from "@/src/types";

interface OrderCardFooterProps {
  order: Order;
  isBusy: boolean;
  onUpdateStatus: (orderId: number, newStatus: OrderStatus) => Promise<void>;
}

export default function OrderCardFooter({
  order,
  isBusy,
  onUpdateStatus,
}: OrderCardFooterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyTransferNumber = async () => {
    if (!order.transferNumber) return;
    try {
      await navigator.clipboard.writeText(order.transferNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy transfer number:", error);
    }
  };

  const paymentMethodLabel =
    order.paymentMethod === "INSTAPAY"
      ? "إنستاباي (InstaPay)"
      : "فودافون كاش (Vodafone Cash)";

  return (
    <div className="flex flex-col gap-4 pt-3 border-t border-border-subtle">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="block text-[11px] text-muted font-bold">
            إجمالي الفاتورة (شامل الشحن {order.deliveryFee} ج)
          </span>
          <span className="text-lg sm:text-xl font-black text-heading">
            {Number(order.total || 0).toFixed(2)}
            <span className="text-xs font-bold">ج.م</span>
          </span>
        </div>

        <div className="text-right">
          <span className="block text-[11px] text-muted font-bold flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-primary" />
            <span>{paymentMethodLabel}</span>
          </span>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-muted-light font-medium">
              رقم التحويل:
            </span>
            <button
              type="button"
              onClick={handleCopyTransferNumber}
              title="اضغط لنسخ رقم التحويل"
              className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer active:scale-95 ${
                copied
                  ? "bg-success-light text-success border-success-border"
                  : "bg-primary-light text-primary border-primary/20 hover:bg-primary-subtle"
              }`}
            >
              <span>{order.transferNumber}</span>
              {copied ? (
                <Check className="w-3 h-3 text-success stroke-[2.5]" />
              ) : (
                <Copy className="w-3 h-3 opacity-70" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={isBusy || order.status === "CONFIRMED"}
          onClick={() => onUpdateStatus(order.id, "CONFIRMED")}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            order.status === "CONFIRMED"
              ? "bg-success-light text-success border border-success-border cursor-default opacity-90"
              : "bg-success hover:bg-success text-white shadow-xs active:scale-[0.99]"
          }`}
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>
            {order.status === "CONFIRMED" ? "تم تأكيد الطلب" : "تأكيد الطلب"}
          </span>
        </button>

        <button
          type="button"
          disabled={isBusy || order.status === "CANCELLED"}
          onClick={() => onUpdateStatus(order.id, "CANCELLED")}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            order.status === "CANCELLED"
              ? "bg-danger-light text-danger border border-danger-border cursor-default opacity-90"
              : "bg-danger hover:bg-danger text-white shadow-xs active:scale-[0.99]"
          }`}
        >
          <X className="w-4 h-4 stroke-[2.5]" />
          <span>
            {order.status === "CANCELLED"
              ? "الطلب ملغي (أُرجع المخزون)"
              : "إلغاء الطلب"}
          </span>
        </button>
      </div>
    </div>
  );
}
