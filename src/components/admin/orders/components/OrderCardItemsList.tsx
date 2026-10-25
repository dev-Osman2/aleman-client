/* eslint-disable @next/next/no-img-element */
"use client";

import { OrderItem } from "@/src/types";

interface OrderCardItemsListProps {
  items: OrderItem[];
}

export default function OrderCardItemsList({ items }: OrderCardItemsListProps) {
  return (
    <div className="bg-surface-soft/80 rounded-2xl border border-border-subtle overflow-hidden">
      <div className="flex items-center bg-surface-subtle/80 px-4 py-2 text-[11px] font-extrabold text-muted">
        <span className="w-1/2 text-right">عنوان الكتاب</span>
        <span className="w-1/4 text-center">الكمية</span>
        <span className="w-1/4 text-left">السعر</span>
      </div>

      <div className="divide-y divide-border-subtle px-4 max-h-[140px] overflow-y-auto custom-scrollbar">
        {items.map((item, idx) => {
          const unitPrice = Number(item.priceAtBuy || 0);
          const qty = Number(item.quantity || 1);
          const bookTitle = item.book?.title || "كتاب";
          const bookImage = item.book?.image;

          return (
            <div
              key={idx}
              className="flex items-center py-2.5 text-xs sm:text-sm gap-2"
            >
              <div className="w-1/2 font-extrabold text-body flex items-center gap-2 truncate">
                {bookImage && (
                  <img
                    src={bookImage}
                    alt={bookTitle}
                    className="w-7 h-9 rounded-md object-cover border border-border shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <div className="truncate">
                  <span className="block truncate">{bookTitle}</span>
                  {item.book?.code && (
                    <span className="text-[10px] text-muted font-mono block">
                      #{item.book.code}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-1/4 text-center font-bold text-sub dir-ltr">
                {qty} ×
              </div>

              <div className="w-1/4 text-left font-extrabold text-heading">
                {(unitPrice * qty).toFixed(2)} ج.م
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
