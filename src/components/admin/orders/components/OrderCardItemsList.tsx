"use client";

import { OrderItem } from "@/src/types";

interface OrderCardItemsListProps {
  items: OrderItem[];
}

export default function OrderCardItemsList({ items }: OrderCardItemsListProps) {
  return (
    <div className="bg-surface-soft/70 rounded-2xl border border-border-subtle overflow-hidden">
      <div className="flex items-center bg-surface-subtle/80 px-4 py-2 text-[11px] font-extrabold text-muted">
        <span className="w-1/2 text-right">المنتج</span>
        <span className="w-1/4 text-center">الكمية</span>
        <span className="w-1/4 text-left">السعر الإجمالي</span>
      </div>

      <div className="divide-y divide-border-subtle px-4 h-[132px] overflow-y-auto custom-scrollbar">
        {items.map((item, idx) => {
          const unitPrice = Number(item.price || 0);
          const qty = Number(item.quantity || 1);
          return (
            <div
              key={idx}
              className="flex items-center py-2.5 text-xs sm:text-sm"
            >
              <div className="w-1/2 font-extrabold text-body pr-1 truncate">
                <span>{item.name}</span>
                {item.size && (
                  <span className="text-muted font-bold"> - {item.size}</span>
                )}
              </div>
              <div className="w-1/4 text-center font-bold text-sub dir-ltr">
                {qty} ×
              </div>
              <div className="w-1/4 text-left font-extrabold text-heading">
                {(unitPrice * qty).toFixed(2)} ج
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
