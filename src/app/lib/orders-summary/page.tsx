"use client";

import React from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { useOrdersSummary } from "@/src/components/admin/orders-summary/hooks/useOrdersSummary";
import SummaryKpiCards from "@/src/components/admin/orders-summary/SummaryKpiCards";
import SummaryStatusAndPayment from "@/src/components/admin/orders-summary/SummaryStatusAndPayment";
import TopSellingBooksTable from "@/src/components/admin/orders-summary/TopSellingBooksTable";

export default function AdminOrdersSummaryPage() {
  const { stats, orders, loading, calculatedReports, fetchDashboardData } =
    useOrdersSummary();

  if (loading) {
    return (
      <div
        className="bg-white rounded-3xl border border-border/80 py-24 flex flex-col items-center justify-center gap-3 text-muted"
        dir="rtl"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-sm font-bold">
          جاري تحليل بيانات وتقارير مبيعات المكتبة...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-heading">
            التقارير والإحصائيات المالية
          </h1>
          <p className="text-xs sm:text-sm text-muted font-medium mt-1">
            ملخص مبيعات مكتبة الإيمان، الإيرادات المؤكدة، ومؤشرات الأداء اللحظية
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          className="px-4 py-2.5 rounded-xl bg-white border border-border hover:border-primary text-sub hover:text-primary text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>تحديث الأرقام الآن</span>
        </button>
      </div>

      <SummaryKpiCards
        stats={stats}
        totalOrdersCount={orders.length}
        totalRevenue={calculatedReports.totalRevenue}
        averageOrderValue={calculatedReports.averageOrderValue}
        confirmedCount={calculatedReports.confirmedCount}
      />

      <SummaryStatusAndPayment
        confirmedCount={calculatedReports.confirmedCount}
        pendingCount={calculatedReports.pendingCount}
        cancelledCount={calculatedReports.cancelledCount}
        instapayCount={calculatedReports.instapayCount}
        vodafoneCount={calculatedReports.vodafoneCount}
      />

      <TopSellingBooksTable books={calculatedReports.topSoldBooks} />
    </div>
  );
}
