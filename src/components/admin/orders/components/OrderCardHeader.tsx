"use client";

import { Order } from "@/src/types";

interface OrderCardHeaderProps {
  order: Order;
}

export default function OrderCardHeader({ order }: OrderCardHeaderProps) {
  const renderStatusBadge = () => {
    if (order.status === "confirmed") {
      return (
        <span className="px-3.5 py-1 rounded-xl text-xs font-extrabold bg-success-light text-success border border-success-border">
          مكتمل
        </span>
      );
    }
    if (order.status === "cancelled") {
      return (
        <span className="px-3.5 py-1 rounded-xl text-xs font-extrabold bg-danger-light text-danger border border-danger-border">
          ملغي
        </span>
      );
    }
    return (
      <span className="px-3.5 py-1 rounded-xl text-xs font-extrabold bg-warning-light text-warning border border-warning-border">
        قيد الإنتظار
      </span>
    );
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="bg-primary-light text-primary border border-primary/20 font-black text-xs sm:text-sm px-3 py-1 rounded-xl font-mono shrink-0">
          #{order.orderNumber}
        </span>
        <h3 className="font-black text-heading text-base sm:text-lg truncate">
          {order.customerName || "عميل السرايا"}
        </h3>
      </div>

      <div className="shrink-0">{renderStatusBadge()}</div>
    </div>
  );
}
