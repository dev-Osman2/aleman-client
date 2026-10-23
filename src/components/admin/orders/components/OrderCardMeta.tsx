"use client";

import { Order } from "@/src/types";
import { Store, ShoppingBag, Calculator, Truck, Clock, Phone } from "lucide-react";

interface OrderCardMetaProps {
  order: Order;
  formattedDate: string;
}

export default function OrderCardMeta({
  order,
  formattedDate,
}: OrderCardMetaProps) {
  const renderOrderLocation = () => {
    if (order.orderType === "dine_in") {
      return (
        <span className="inline-flex items-center gap-1.5 text-sub font-bold truncate max-w-full">
          <Store className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">
            الطاولة {order.tableNumber} - صالة المطعم
          </span>
        </span>
      );
    }
    if (order.orderType === "pickup") {
      return (
        <span className="inline-flex items-center gap-1.5 text-sub font-bold truncate max-w-full">
          <ShoppingBag className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">استلام من المطعم</span>
        </span>
      );
    }
    if (order.orderType === "cashier") {
      return (
        <span className="inline-flex items-center gap-1.5 text-sub font-bold truncate max-w-full">
          <Calculator className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">طلب كاشير مباشر</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-sub font-bold truncate max-w-full">
        <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="truncate">
          توصيل - {order.address || "عنوان غير محدد"}
        </span>
      </span>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
      {renderOrderLocation()}

      {formattedDate && (
        <span className="inline-flex items-center gap-1 font-medium shrink-0">
          <Clock className="w-3.5 h-3.5 text-muted-light" />
          <span>{formattedDate}</span>
        </span>
      )}

      {order.phone && (
        <a
          href={`tel:${order.phone}`}
          className="inline-flex items-center gap-1 font-mono font-bold text-sub hover:text-primary transition shrink-0"
        >
          <Phone className="w-3.5 h-3.5 text-muted-light" />
          <span>{order.phone}</span>
        </a>
      )}
    </div>
  );
}
