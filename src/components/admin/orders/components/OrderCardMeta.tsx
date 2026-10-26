"use client";

import { Order } from "@/src/types";
import { Truck, Clock, Phone, Mail } from "lucide-react";

interface OrderCardMetaProps {
  order: Order;
  formattedDate: string;
}

export default function OrderCardMeta({
  order,
  formattedDate,
}: OrderCardMetaProps) {
  const phone = order.user?.phone;
  const email = order.user?.email;

  return (
    <div className="flex flex-col gap-2 text-xs text-muted">
      <div className="flex items-center gap-2 text-sub font-bold">
        <Truck className="w-4 h-4 text-primary shrink-0" />
        <span className="truncate" title={order.address}>
          {order.address || "العنوان غير محدد"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-0.5">
        {formattedDate && (
          <span className="inline-flex items-center gap-1 font-medium shrink-0">
            <Clock className="w-3.5 h-3.5 text-muted-light" />
            <span>{formattedDate}</span>
          </span>
        )}

        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-1 font-mono font-bold text-sub hover:text-primary transition shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span>{phone}</span>
          </a>
        )}

        {email && (
          <span className="inline-flex items-center gap-1 font-medium text-muted-light truncate max-w-[180px]">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{email}</span>
          </span>
        )}
      </div>
    </div>
  );
}
