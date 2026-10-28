import { ShoppingBag, CheckCircle2, Clock, CreditCard } from "lucide-react";

interface ProfileStatsCardsProps {
  orderStats: {
    totalOrders: number;
    confirmedOrders: number;
    pendingOrders: number;
    totalSpent: number;
  };
}

export default function ProfileStatsCards({
  orderStats,
}: ProfileStatsCardsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-muted">إجمالي الطلبات</span>
          <p className="text-xl sm:text-2xl font-black text-heading mt-0.5">
            {orderStats.totalOrders}
            <span className="text-xs font-semibold text-muted">طلب</span>
          </p>
        </div>
      </div>

      <div className="flex-1 min-w-[200px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-success-light text-success flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-muted">طلبات مؤكدة</span>
          <p className="text-xl sm:text-2xl font-black text-heading mt-0.5">
            {orderStats.confirmedOrders}
            <span className="text-xs font-semibold text-muted">طلب</span>
          </p>
        </div>
      </div>

      <div className="flex-1 min-w-[200px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-warning-light text-warning flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-muted">قيد المراجعة</span>
          <p className="text-xl sm:text-2xl font-black text-heading mt-0.5">
            {orderStats.pendingOrders}
            <span className="text-xs font-semibold text-muted">طلب</span>
          </p>
        </div>
      </div>

      <div className="flex-1 min-w-[200px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
          <CreditCard className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-muted">إجمالي المشتريات</span>
          <p className="text-xl sm:text-2xl font-black text-heading mt-0.5">
            {orderStats.totalSpent}
            <span className="text-xs font-semibold text-muted">ج</span>
          </p>
        </div>
      </div>
    </div>
  );
}
