import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Order, OrderStatus } from "@/src/types";
import { OrderFilterStatus } from "../OrderFilterTabs";
import { calculateOrderCounts, filterAdminOrdersList } from "./adminOrdersFilterHelper";
import { fetchAdminOrdersApi, updateOrderStatusApi, updateAdminNoteApi } from "./adminOrdersApi";

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<OrderFilterStatus>("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    setError(null);
    try {
      const list = await fetchAdminOrdersApi();
      setOrders(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل سجل الطلبات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const updatedOrder = await updateOrderStatusApi(orderId, newStatus);
      toast.success(
        newStatus === "CONFIRMED"
          ? `تم تأكيد الطلب #${orderId} وإرساله للتجهيز عبر التلجرام`
          : `تم إلغاء الطلب #${orderId} وإرجاع المخزون بنجاح`,
      );
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "تعذر تحديث حالة الطلب");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateAdminNote = async (orderId: number, adminNote: string): Promise<boolean> => {
    try {
      const savedNote = await updateAdminNoteApi(orderId, adminNote);
      toast.success("تم حفظ ملاحظة الأدمن بنجاح");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, adminNote: savedNote } : o)),
      );
      return true;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "تعذر حفظ ملاحظة الأدمن");
      return false;
    }
  };

  const counts = useMemo(() => calculateOrderCounts(orders), [orders]);

  const filteredOrders = useMemo(
    () => filterAdminOrdersList(orders, activeFilter, searchQuery),
    [orders, activeFilter, searchQuery],
  );

  return {
    orders,
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
  };
}
