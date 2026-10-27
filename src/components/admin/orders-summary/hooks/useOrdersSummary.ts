import { useState, useCallback, useEffect, useMemo } from "react";
import { adminFetch } from "@/src/lib/adminFetch";
import { Order } from "@/src/types";
import { toast } from "sonner";

export interface AdminStatsResponse {
  totalBooks: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  authenticatedAdmin?: {
    name: string;
    email: string;
  };
}

export interface SoldBookStat {
  code: string;
  title: string;
  image?: string;
  totalQty: number;
  totalRevenue: number;
  ordersCount: number;
}

export function useOrdersSummary() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        adminFetch("/admin/stats"),
        adminFetch("/admin/orders"),
      ]);

      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        setStats(statsJson.data || statsJson);
      }

      if (ordersRes.ok) {
        const ordersJson = await ordersRes.json();
        const list: Order[] = Array.isArray(ordersJson)
          ? ordersJson
          : Array.isArray(ordersJson.data)
            ? ordersJson.data
            : [];
        setOrders(list);
      }
    } catch (err) {
      console.error("Failed to fetch admin stats and summary:", err);
      toast.error("تعذر تحميل بيانات الإحصائيات والتقارير");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const calculatedReports = useMemo(() => {
    const confirmedOrders = orders.filter((o) => o.status === "CONFIRMED");
    const pendingOrders = orders.filter((o) => o.status === "PENDING");
    const cancelledOrders = orders.filter((o) => o.status === "CANCELLED");

    const instapayOrders = orders.filter((o) => o.paymentMethod === "INSTAPAY");
    const vodafoneOrders = orders.filter(
      (o) => o.paymentMethod === "VODAFONE_CASH",
    );

    const totalRevenue =
      stats?.totalRevenue ??
      confirmedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    const averageOrderValue =
      confirmedOrders.length > 0
        ? totalRevenue / confirmedOrders.length
        : orders.length > 0
          ? totalRevenue / orders.length
          : 0;

    const booksMap = new Map<string, SoldBookStat>();

    confirmedOrders.forEach((order) => {
      order.items?.forEach((item) => {
        const bookCode = item.book?.code || item.bookId || "كود";
        const bookTitle = item.book?.title || "كتاب";
        const bookImage = item.book?.image;
        const qty = Number(item.quantity || 1);
        const revenue = Number(item.priceAtBuy || 0) * qty;

        if (!booksMap.has(bookCode)) {
          booksMap.set(bookCode, {
            code: bookCode,
            title: bookTitle,
            image: bookImage,
            totalQty: qty,
            totalRevenue: revenue,
            ordersCount: 1,
          });
        } else {
          const current = booksMap.get(bookCode)!;
          current.totalQty += qty;
          current.totalRevenue += revenue;
          current.ordersCount += 1;
        }
      });
    });

    const topSoldBooks = Array.from(booksMap.values()).sort(
      (a, b) => b.totalQty - a.totalQty,
    );

    return {
      confirmedCount: confirmedOrders.length,
      pendingCount: pendingOrders.length,
      cancelledCount: cancelledOrders.length,
      instapayCount: instapayOrders.length,
      vodafoneCount: vodafoneOrders.length,
      totalRevenue,
      averageOrderValue,
      topSoldBooks,
    };
  }, [orders, stats]);

  return {
    stats,
    orders,
    loading,
    calculatedReports,
    fetchDashboardData,
  };
}
