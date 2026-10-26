/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Order, OrderStatus } from "@/src/types";

interface ProfileOrderItemProps {
  order: Order;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PENDING: {
    label: "قيد المراجعة والتجهيز",
    bg: "bg-warning-light",
    text: "text-warning",
    border: "border-warning-border",
    icon: Clock,
  },
  CONFIRMED: {
    label: "تم التأكيد وجاهز للتسليم",
    bg: "bg-success-light",
    text: "text-success",
    border: "border-success-border",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "طلب ملغي",
    bg: "bg-danger-light",
    text: "text-danger",
    border: "border-danger-border",
    icon: XCircle,
  },
};

export default function ProfileOrderItem({ order }: ProfileOrderItemProps) {
  const currentStatus = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = currentStatus.icon;
  const orderDate = new Date(order.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-3xl border border-border/80 p-5 sm:p-6 shadow-xs flex flex-col gap-4 hover:shadow-md transition">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span className="font-black text-sm sm:text-base text-heading">
            طلب رقم #{order.id}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{currentStatus.label}</span>
          </span>
        </div>

        <span className="text-xs text-muted font-medium">{orderDate}</span>
      </div>

      <div className="divide-y divide-border-subtle bg-surface-soft/60 rounded-2xl p-3 border border-border-subtle flex flex-col gap-2">
        {order.items?.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 py-1.5 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {item.book?.image && (
                <img
                  src={item.book.image}
                  alt={item.book.title}
                  className="w-8 h-11 rounded-lg object-cover border border-border shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div className="truncate">
                <span className="font-extrabold text-heading block truncate">
                  {item.book?.title || "كتاب من المكتبة"}
                </span>
                {item.book?.code && (
                  <span className="text-[10px] text-muted font-mono block">
                    #{item.book.code}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-bold text-sub">
                {item.quantity} × {item.priceAtBuy} ج
              </span>
              <span className="text-xs sm:text-sm font-black text-heading min-w-[60px] text-left">
                {(item.priceAtBuy * item.quantity).toFixed(2)} ج.م
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted">
        <div className="flex flex-col gap-1">
          <span className="font-medium">
            📍 العنوان:{" "}
            <span className="text-heading font-bold">{order.address}</span>
          </span>
          <span className="font-medium">
            💳 طريقة الدفع:{" "}
            <span className="text-heading font-bold">
              {order.paymentMethod === "INSTAPAY" ? "إنستاباي" : "فودافون كاش"}
            </span>
            {order.transferNumber && (
              <span className="font-mono mr-1 font-bold">
                ({order.transferNumber})
              </span>
            )}
          </span>
        </div>

        <div className="text-left">
          <span className="block text-[11px] text-muted">
            المجموع (شامل توصيل {order.deliveryFee} ج)
          </span>
          <span className="text-base sm:text-lg font-black text-primary">
            {Number(order.total).toFixed(2)} ج.م
          </span>
        </div>
      </div>
    </div>
  );
}
