"use client";

import { Order } from "@/src/types";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface OrderCardHeaderProps {
  order: Order;
}

export default function OrderCardHeader({ order }: OrderCardHeaderProps) {
  const renderStatusBadge = () => {
    if (order.status === "CONFIRMED") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-extrabold bg-success-light text-success border border-success-border">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>تم التأكيد</span>
        </span>
      );
    }
    if (order.status === "CANCELLED") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-extrabold bg-danger-light text-danger border border-danger-border">
          <XCircle className="w-3.5 h-3.5" />
          <span>ملغي</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-extrabold bg-warning-light text-warning border border-warning-border">
        <Clock className="w-3.5 h-3.5" />
        <span>قيد المراجعة</span>
      </span>
    );
  };

  return (
    <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="bg-primary-light text-primary border border-primary/20 font-black text-xs sm:text-sm px-3 py-1 rounded-xl font-mono shrink-0">
          #{order.id}
        </span>
        <h3 className="font-black text-heading text-base sm:text-lg truncate">
          {order.user?.name || "عميل بدون اسم"}
        </h3>
      </div>

      <div className="shrink-0">{renderStatusBadge()}</div>
    </div>
  );
}
