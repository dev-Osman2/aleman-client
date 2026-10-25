"use client";

import { ClipboardList } from "lucide-react";

interface OrderStatsHeaderProps {
  totalOrders?: number;
  pendingCount?: number;
  confirmedCount?: number;
}

export default function OrderStatsHeader(_props: OrderStatsHeaderProps) {
  return (
    <div className="text-right flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
        <ClipboardList className="w-5 h-5" />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-heading">
          سجل وإدارة طلبات الكتب والشحن
        </h1>
        <p className="text-xs sm:text-sm text-muted font-medium mt-0.5">
          متابعة الطلبات اللحظية، فحص أرقام التحويل، وتأكيد شحن طلبات مكتبة الإيمان
        </p>
      </div>
    </div>
  );
}