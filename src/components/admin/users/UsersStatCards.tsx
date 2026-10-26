import { Users, ShoppingBag, TrendingUp, UserCheck } from "lucide-react";

interface UsersStatCardsProps {
  analytics: {
    totalUsers: number;
    usersWithOrders: number;
    totalOrdersPlaced: number;
    usersWithoutOrders: number;
  };
}

export default function UsersStatCards({ analytics }: UsersStatCardsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[240px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-muted">
            إجمالي العملاء المسجلين
          </span>
          <p className="text-2xl font-black text-heading mt-0.5">
            {analytics.totalUsers}
            <span className="text-xs font-semibold text-muted">عميل</span>
          </p>
        </div>
      </div>

      <div className="flex-1 min-w-[240px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-success-light text-success flex items-center justify-center shrink-0">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-muted">
            عملاء أتموا طلبات
          </span>
          <p className="text-2xl font-black text-heading mt-0.5">
            {analytics.usersWithOrders}
            <span className="text-xs font-semibold text-muted">مشتري نشط</span>
          </p>
        </div>
      </div>

      <div className="flex-1 min-w-[240px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-warning-light text-warning flex items-center justify-center shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-muted">
            إجمالي طلبات العملاء
          </span>
          <p className="text-2xl font-black text-heading mt-0.5">
            {analytics.totalOrdersPlaced}
            <span className="text-xs font-semibold text-muted">طلب مسجل</span>
          </p>
        </div>
      </div>

      <div className="flex-1 min-w-[240px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-surface-subtle text-muted-dark flex items-center justify-center shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-muted">
            حسابات جديدة قيد الانتظار
          </span>
          <p className="text-2xl font-black text-heading mt-0.5">
            {analytics.usersWithoutOrders}
            <span className="text-xs font-semibold text-muted">مستخدم</span>
          </p>
        </div>
      </div>
    </div>
  );
}
