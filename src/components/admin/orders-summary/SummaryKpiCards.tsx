import { Wallet, TrendingUp, ShoppingBag, BookOpen, Users } from "lucide-react";
import { AdminStatsResponse } from "./hooks/useOrdersSummary";

interface SummaryKpiCardsProps {
  stats: AdminStatsResponse | null;
  totalOrdersCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  confirmedCount: number;
}

export default function SummaryKpiCards({
  stats,
  totalOrdersCount,
  totalRevenue,
  averageOrderValue,
  confirmedCount,
}: SummaryKpiCardsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-center justify-between text-muted text-xs font-bold">
          <span>إجمالي الإيرادات المؤكدة</span>
          <div className="w-9 h-9 rounded-xl bg-success-light text-success flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-black text-heading">
          {totalRevenue.toFixed(2)}{" "}
          <span className="text-xs font-bold text-muted">ج.م</span>
        </p>
      </div>

      <div className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-center justify-between text-muted text-xs font-bold">
          <span>متوسط قيمة الطلب</span>
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-black text-primary">
          {averageOrderValue.toFixed(2)}{" "}
          <span className="text-xs font-bold">ج.م</span>
        </p>
      </div>

      <div className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-center justify-between text-muted text-xs font-bold">
          <span>الطلبات المكتملة</span>
          <div className="w-9 h-9 rounded-xl bg-info-light text-info flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-black text-heading">
          {confirmedCount}{" "}
          <span className="text-xs font-bold text-muted-light">
            من أصل {totalOrdersCount} طلب
          </span>
        </p>
      </div>

      <div className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs">
        <div className="flex items-center justify-between text-muted text-xs font-bold">
          <span>الكتب والعملاء المسجلين</span>
          <div className="w-9 h-9 rounded-xl bg-surface-subtle text-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        <p className="text-base font-black text-body pt-1 flex items-center justify-between">
          <span className="text-primary font-bold">
            {stats?.totalBooks || 0} كتاب
          </span>
          <span className="text-muted-light">|</span>
          <span className="text-heading font-bold flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{stats?.totalUsers || 0} عميل</span>
          </span>
        </p>
      </div>
    </div>
  );
}
