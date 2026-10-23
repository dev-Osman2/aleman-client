"use client";

import { Flame, Truck, Wallet, Receipt } from "lucide-react";

interface SummaryStatsCardsProps {
  topDemandItem: { name: string; qty: number } | null;
  pickupCount: number;
  deliveryCount: number;
  pendingCash: number;
  averageOrderValue: number;
}

export default function SummaryStatsCards({
  topDemandItem,
  pickupCount,
  deliveryCount,
  pendingCash,
  averageOrderValue,
}: SummaryStatsCardsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="bg-white p-5 rounded-3xl border border-border/80 shadow-sm flex items-center gap-4 w-full sm:w-[calc(50%-0.5rem)] lg:flex-1">
        <div className="w-12 h-12 rounded-2xl bg-danger-light text-danger flex items-center justify-center shrink-0">
          <Flame className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs text-muted-light font-bold block">
            الأكثر طلباً
          </span>
          {topDemandItem ? (
            <div className="truncate">
              <span
                className="text-sm sm:text-base font-black text-heading block truncate"
                title={topDemandItem.name}
              >
                {topDemandItem.name}
              </span>
              <span className="text-xs font-bold text-danger font-mono">
                {topDemandItem.qty} قطعة
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-muted-light">لا يوجد</span>
          )}
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-border/80 shadow-sm flex items-center gap-4 w-full sm:w-[calc(50%-0.5rem)] lg:flex-1">
        <div className="w-12 h-12 rounded-2xl bg-info-light text-info flex items-center justify-center shrink-0">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-muted-light font-bold block">
            طريقة التسليم
          </span>
          <div className="flex items-center gap-1.5 text-sm sm:text-base font-black text-heading font-mono mt-0.5">
            <span className="text-info">{pickupCount} مقر</span>
            <span className="text-muted-light font-normal">/</span>
            <span className="text-sub">{deliveryCount} شحن</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-border/80 shadow-sm flex items-center gap-4 w-full sm:w-[calc(50%-0.5rem)] lg:flex-1">
        <div className="w-12 h-12 rounded-2xl bg-warning-light text-warning flex items-center justify-center shrink-0">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-muted-light font-bold block">
            قيد التحصيل (كاش معلق)
          </span>
          <span className="text-base sm:text-lg font-black text-warning font-mono block">
            {pendingCash.toFixed(2)} ج
          </span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-border/80 shadow-sm flex items-center gap-4 w-full sm:w-[calc(50%-0.5rem)] lg:flex-1">
        <div className="w-12 h-12 rounded-2xl bg-info-light text-info flex items-center justify-center shrink-0">
          <Receipt className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-muted-light font-bold block">
            متوسط الفاتورة
          </span>
          <span className="text-base sm:text-lg font-black text-info font-mono block">
            {averageOrderValue.toFixed(2)} ج
          </span>
        </div>
      </div>
    </div>
  );
}
