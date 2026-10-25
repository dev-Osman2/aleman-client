"use client";

import { useEffect, useState, useCallback } from "react";
import { getAdminToken } from "@/src/lib/cookies";
import {
  Wallet,
  ShoppingBag,
  TrendingUp,
  Clock,
  Truck,
  Store,
  Calculator,
  Flame,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface SummaryData {
  totalOrders: number;
  confirmedCount: number;
  pendingCount: number;
  cancelledCount: number;
  totalRevenue: number;
  averageBill: number;
  orderTypesBreakdown: {
    delivery: number;
    dine_in: number;
    cashier: number;
    pickup: number;
  };
  mostOrderedItems: {
    name: string;
    size: string;
    totalQuantity: number;
    totalRevenue: number;
    ordersCount: number;
  }[];
}

export default function AdminOrdersSummaryPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/orders/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSummary();
  }, [fetchSummary]);

  if (loading || !summary) {
    return (
      <div className="bg-white rounded-3xl border border-border/80 py-20 flex flex-col items-center justify-center gap-3 text-muted">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
        <span className="text-sm font-bold">
          جاري تحليل بيانات وملخص طلبات اليوم...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-heading">
            ملخص طلبات وإحصائيات اليوم
          </h1>
          <p className="text-xs sm:text-sm text-muted font-medium mt-1">
            تقرير المبيعات، متوسط الفاتورة، أنواع التوصيل، والوجبات الأكثر طلباً
          </p>
        </div>
        <button
          type="button"
          onClick={fetchSummary}
          className="px-4 py-2.5 rounded-xl bg-white border border-border hover:border-primary text-sub hover:text-primary text-xs font-extrabold flex items-center gap-2 cursor-pointer transition shadow-2xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>تحديث الإحصائيات</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs w-full sm:w-[calc(50%-0.5rem)] lg:flex-1">
          <div className="flex items-center justify-between text-muted text-xs font-bold">
            <span>إجمالي المبيعات المؤكدة</span>
            <div className="w-9 h-9 rounded-xl bg-success-light text-success flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-heading">
            {summary.totalRevenue.toFixed(2)}{" "}
            <span className="text-xs font-bold text-muted">ج</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs w-full sm:w-[calc(50%-0.5rem)] lg:flex-1">
          <div className="flex items-center justify-between text-muted text-xs font-bold">
            <span>متوسط قيمة الفاتورة</span>
            <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-primary">
            {summary.averageBill.toFixed(2)}{" "}
            <span className="text-xs font-bold">ج</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs w-full sm:w-[calc(50%-0.5rem)] lg:flex-1">
          <div className="flex items-center justify-between text-muted text-xs font-bold">
            <span>الطلبات المكتملة / الإجمالي</span>
            <div className="w-9 h-9 rounded-xl bg-info-light text-info flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-heading">
            {summary.confirmedCount}{" "}
            <span className="text-xs font-bold text-muted-light">
              من أصل {summary.totalOrders} طلب
            </span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs w-full sm:w-[calc(50%-0.5rem)] lg:flex-1">
          <div className="flex items-center justify-between text-muted text-xs font-bold">
            <span>قيد الانتظار / الملغية</span>
            <div className="w-9 h-9 rounded-xl bg-warning-light text-warning flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-base font-black text-body pt-1">
            <span className="text-warning">
              {summary.pendingCount} انتظار
            </span>{" "}
            —{" "}
            <span className="text-danger">{summary.cancelledCount} ملغي</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border/80 p-6 flex flex-col gap-4 shadow-2xs">
        <h2 className="text-base font-black text-heading">
          توزيع الطلبات حسب نوع الخدمة والتوصيل
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="bg-surface-soft rounded-2xl p-4 border border-border-subtle flex items-center gap-3 w-[calc(50%-0.5rem)] lg:flex-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted">
                توصيل للمنازل
              </span>
              <span className="text-lg font-black text-heading">
                {summary.orderTypesBreakdown.delivery} طلب
              </span>
            </div>
          </div>

          <div className="bg-surface-soft rounded-2xl p-4 border border-border-subtle flex items-center gap-3 w-[calc(50%-0.5rem)] lg:flex-1">
            <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted">
                داخل الصالة (QR)
              </span>
              <span className="text-lg font-black text-heading">
                {summary.orderTypesBreakdown.dine_in} طلب
              </span>
            </div>
          </div>

          <div className="bg-surface-soft rounded-2xl p-4 border border-border-subtle flex items-center gap-3 w-[calc(50%-0.5rem)] lg:flex-1">
            <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted">
                كاشير مباشر (POS)
              </span>
              <span className="text-lg font-black text-heading">
                {summary.orderTypesBreakdown.cashier} طلب
              </span>
            </div>
          </div>

          <div className="bg-surface-soft rounded-2xl p-4 border border-border-subtle flex items-center gap-3 w-[calc(50%-0.5rem)] lg:flex-1">
            <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-muted">
                استلام من الفرع
              </span>
              <span className="text-lg font-black text-heading">
                {summary.orderTypesBreakdown.pickup} طلب
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-border-subtle flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          <h2 className="text-base font-black text-heading">
            الوجبات والأصناف الأكثر طلباً اليوم
          </h2>
        </div>

        {summary.mostOrderedItems.length === 0 ? (
          <div className="py-14 text-center text-muted-light font-bold text-sm">
            لا توجد وجبات مؤكدة بعد لعرض الإحصائيات.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-primary-light text-sub text-xs font-extrabold border-b border-primary-light">
                  <th className="py-3.5 px-6">#</th>
                  <th className="py-3.5 px-6">اسم الوجبة</th>
                  <th className="py-3.5 px-6 text-center">الحجم</th>
                  <th className="py-3.5 px-6 text-center">
                    إجمالي الكمية المباعة
                  </th>
                  <th className="py-3.5 px-6 text-left">إجمالي الإيراد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs sm:text-sm">
                {summary.mostOrderedItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-primary-light/20">
                    <td className="py-3.5 px-6 font-black text-primary">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-6 font-extrabold text-heading">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="bg-primary-light text-primary font-bold px-2.5 py-1 rounded-lg text-xs">
                        {item.size}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center font-black text-body">
                      {item.totalQuantity} وجبة
                    </td>
                    <td className="py-3.5 px-6 text-left font-black text-success">
                      {item.totalRevenue.toFixed(2)} ج
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
