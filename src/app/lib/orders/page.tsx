"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Order, OrderStatus } from "@/src/types";
import { getAdminToken } from "@/src/lib/cookies";
import OrderStatsHeader from "@/src/components/admin/orders/OrderStatsHeader";
import AdminSearchBar from "@/src/components/admin/orders/AdminSearchBar";
import OrderFilterTabs, {
  OrderFilterStatus,
} from "@/src/components/admin/orders/OrderFilterTabs";
import OrderCard from "@/src/components/admin/orders/OrderCard";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<OrderFilterStatus>("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  const fetchOrders = useCallback(async () => {
    setError(null);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("تعذر جلب سجل الطلبات، يرجى التأكد من الصلاحيات");
      }

      const json = await res.json();
      const list: Order[] = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : [];
      setOrders(list);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء تحميل سجل الطلبات"
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchOrders();

    // تحديث دوري هادئ كل 30 ثانية
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleUpdateStatus = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    setUpdatingId(orderId);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          newStatus === "CONFIRMED"
            ? `تم تأكيد الطلب #${orderId} وتحديث المخزون`
            : `تم إلغاء الطلب #${orderId}`
        );
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.data : o))
        );
      } else {
        toast.error(data.message || "تعذر تحديث حالة الطلب");
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
      toast.error("حدث خطأ أثناء الاتصال بالخادم لتحديث الطلب");
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = useMemo(() => {
    return {
      all: orders.length,
      PENDING: orders.filter((o) => o.status === "PENDING").length,
      CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
      CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab =
        activeFilter === "all" ? true : order.status === activeFilter;

      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.trim().toLowerCase();
      const matchOrderNum = String(order.id).includes(q);
      const matchName = (order.user?.name || "").toLowerCase().includes(q);
      const matchPhone = (order.user?.phone || "").includes(q);
      const matchAddress = (order.address || "").toLowerCase().includes(q);
      const matchTransfer = (order.transferNumber || "").toLowerCase().includes(q);

      return (
        matchOrderNum ||
        matchName ||
        matchPhone ||
        matchAddress ||
        matchTransfer
      );
    });
  }, [orders, activeFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* الترويسة وشريط البحث السريع */}
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
            className="w-11 h-11 rounded-full bg-white border border-border hover:border-primary text-sub hover:text-primary flex items-center justify-center shrink-0 transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* تبويبات الفلترة بحالات الطلبات */}
      <OrderFilterTabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        counts={counts}
      />

      {/* عرض الطلبات أو حالات التحميل والخطأ */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-border/80 py-24 flex flex-col items-center justify-center gap-3 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-bold">جاري تحميل سجل طلبات العملاء...</span>
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
        <div className="flex flex-wrap gap-6 items-start">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="w-full lg:w-[calc(50%-0.75rem)] flex flex-col"
            >
              <OrderCard
                order={order}
                onUpdateStatus={handleUpdateStatus}
                updatingId={updatingId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
