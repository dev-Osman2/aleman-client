"use client";

 

import { AggregatedSummaryItem } from "./SummaryDesktopTable";

interface SummaryMobileListProps {
  items: AggregatedSummaryItem[];
}

export default function SummaryMobileList({ items }: SummaryMobileListProps) {
  return (
    <div className="flex flex-col gap-3 md:hidden p-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-surface-soft/80 rounded-2xl p-4 border border-border/80 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover border border-border bg-white shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <h3 className="font-bold text-heading text-sm leading-snug">
              {item.name}
            </h3>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border/60 text-center">
            <div className="flex-1 bg-white p-2 rounded-xl border border-border-subtle">
              <span className="text-[10px] font-bold text-muted-light block">
                الطلبات
              </span>
              <span className="font-black text-xs text-sub font-mono">
                {item.ordersCount}
              </span>
            </div>

            <div className="flex-1 bg-white p-2 rounded-xl border border-border-subtle">
              <span className="text-[10px] font-bold text-muted-light block">
                الكمية
              </span>
              <span className="font-black text-sm text-info font-mono">
                {item.totalQty}
              </span>
            </div>

            <div className="flex-1 bg-white p-2 rounded-xl border border-border-subtle">
              <span className="text-[10px] font-bold text-muted-light block">
                الإجمالي
              </span>
              <span className="font-black text-xs text-heading font-mono">
                {item.totalPrice.toFixed(0)} ج
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
