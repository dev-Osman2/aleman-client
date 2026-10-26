"use client";

import OrderStatsHeader from "@/src/components/admin/orders/OrderStatsHeader";
import AdminSearchBar from "@/src/components/admin/orders/AdminSearchBar";
import OrderFilterTabs from "@/src/components/admin/orders/OrderFilterTabs";
import OrderCard from "@/src/components/admin/orders/OrderCard";
import { Loader2, RefreshCw } from "lucide-react";
import { useAdminOrders } from "@/src/components/admin/orders/hooks/useAdminOrders";

export default function AdminOrdersPage() {
  const {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    updatingId,
    fetchOrders,
    handleUpdateStatus,
    handleUpdateAdminNote,
    counts,
    filteredOrders,
  } = useAdminOrders();

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <OrderStatsHeader />

        <div className="flex items-center gap-2.5 flex-1 md:justify-end">
          <AdminSearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <button
            type="button"
            onClick={fetchOrders}
            title="تحديث قائمة الطلبات الآن"
            className="w-11 h-11 rounded-full bg-white border border-border
                     hover:border-primary text-sub hover:text-primary flex items-center justify-center
                      shrink-0 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <OrderFilterTabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      {loading ? (
        <div className="bg-white rounded-3xl border border-border/80 py-24 flex flex-col items-center justify-center gap-3 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-bold">
            جاري تحميل سجل طلبات العملاء...
          </span>
        </div>
      ) : error ? (
        <div className="bg-danger-light border border-danger-border text-danger rounded-3xl p-6 text-center font-bold text-sm">
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border/80 py-20 text-center text-muted font-bold text-sm">
          لا توجد طلبات مطابقة للعرض في هذا التبويب حالياً.
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 items-stretch">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="w-full lg:w-[calc(50%-0.75rem)] flex flex-col"
            >
              <OrderCard
                order={order}
                onUpdateStatus={handleUpdateStatus}
                onUpdateAdminNote={handleUpdateAdminNote}
                updatingId={updatingId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
