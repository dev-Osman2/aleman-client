import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Order } from "@/src/types";

export function useProfileOrders(token: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  const fetchMyOrders = useCallback(async () => {
    if (!token) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(`${apiUrl}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("تعذر جلب سجل الطلبات");

      const json = await res.json();
      const list: Order[] = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
          ? json.data
          : [];
      setOrders(list);
    } catch (err: unknown) {
      console.error("Error fetching my orders:", err);
      toast.error("حدث خطأ أثناء تحميل سجل طلباتك");
    } finally {
      setOrdersLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    if (token) {
      fetchMyOrders();
    }
  }, [token, fetchMyOrders]);

  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const confirmedOrders = orders.filter(
      (o) => o.status === "CONFIRMED",
    ).length;
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
    const totalSpent = orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    return { totalOrders, confirmedOrders, pendingOrders, totalSpent };
  }, [orders]);

  return { orders, ordersLoading, fetchMyOrders, orderStats };
}
