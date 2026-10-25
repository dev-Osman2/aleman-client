"use client";

import { OrderStatus } from "@/src/types";

export type OrderFilterStatus = "all" | OrderStatus;

interface OrderFilterTabsProps {
  activeFilter: OrderFilterStatus;
  setActiveFilter: (filter: OrderFilterStatus) => void;
  counts: {
    all: number;
    PENDING: number;
    CONFIRMED: number;
    CANCELLED: number;
  };
}

export default function OrderFilterTabs({
  activeFilter,
  setActiveFilter,
  counts,
}: OrderFilterTabsProps) {
  const tabs: { id: OrderFilterStatus; label: string; count: number }[] = [
    { id: "all", label: "جميع الطلبات", count: counts.all },
    { id: "PENDING", label: "قيد المراجعة", count: counts.PENDING },
    { id: "CONFIRMED", label: "تم التأكيد", count: counts.CONFIRMED },
    { id: "CANCELLED", label: "ملغاة", count: counts.CANCELLED },
  ];

  return (
    <div
      className="flex items-center gap-2.5 overflow-x-auto pb-1 custom-scrollbar"
      dir="rtl"
    >
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer border ${
              isActive
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white text-sub border-border hover:border-primary/40 hover:bg-primary-light/40"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                isActive
                  ? "bg-white/25 text-white"
                  : "bg-surface-subtle text-sub"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}