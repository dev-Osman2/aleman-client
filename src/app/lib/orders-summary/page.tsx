"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getAdminToken } from "@/src/lib/cookies";
import { Order } from "@/src/types";
import {
  Wallet,
  ShoppingBag,
  TrendingUp,
  Clock,
  BookOpen,
  Users,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  CreditCard,
  Flame,
} from "lucide-react";
import { toast } from "sonner";

interface AdminStatsResponse {
  totalBooks: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  authenticatedAdmin?: {
    name: string;
    email: string;
  };
}

interface SoldBookStat {
  code: string;
  title: string;
  image?: string;
  totalQty: number;
  totalRevenue: number;
  ordersCount: number;
}

export default function AdminOrdersSummaryPage() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAdminToken();

      const statsPromise = fetch(`${apiUrl}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordersPromise = fetch(`${apiUrl}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const [statsRes, ordersRes] = await Promise.all([
        statsPromise,
        ordersPromise,
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
  }, [apiUrl]);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted text-xs font-bold">
            <span>إجمالي الإيرادات المؤكدة</span>
            <div className="w-9 h-9 rounded-xl bg-success-light text-success flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-heading">
            {calculatedReports.totalRevenue.toFixed(2)}{" "}
            <span className="text-xs font-bold text-muted">ج.م</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted text-xs font-bold">
            <span>متوسط قيمة الطلب</span>
            <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-primary">
            {calculatedReports.averageOrderValue.toFixed(2)}{" "}
            <span className="text-xs font-bold">ج.م</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted text-xs font-bold">
            <span>الطلبات المكتملة</span>
            <div className="w-9 h-9 rounded-xl bg-info-light text-info flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-heading">
            {calculatedReports.confirmedCount}{" "}
            <span className="text-xs font-bold text-muted-light">
              من أصل {orders.length} طلب
            </span>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border/80 p-5 flex flex-col gap-2 shadow-2xs">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-border/80 p-6 flex flex-col gap-4 shadow-2xs">
          <h2 className="text-base font-black text-heading flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>توزيع حالات الطلبات الحالية</span>
          </h2>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-success-light/60 border border-success-border rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center text-success mb-1">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="block text-xs font-bold text-success">
                مؤكد ومكتمل
              </span>
              <span className="text-xl font-black text-heading mt-1 block">
                {calculatedReports.confirmedCount}
              </span>
            </div>

            <div className="bg-warning-light/60 border border-warning-border rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center text-warning mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <span className="block text-xs font-bold text-warning">
                قيد المراجعة
              </span>
              <span className="text-xl font-black text-heading mt-1 block">
                {calculatedReports.pendingCount}
              </span>
            </div>

            <div className="bg-danger-light/60 border border-danger-border rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center text-danger mb-1">
                <XCircle className="w-5 h-5" />
              </div>
              <span className="block text-xs font-bold text-danger">
                طلبات ملغاة
              </span>
              <span className="text-xl font-black text-heading mt-1 block">
                {calculatedReports.cancelledCount}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border/80 p-6 flex flex-col gap-4 shadow-2xs">
          <h2 className="text-base font-black text-heading flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>طرق الدفع المستخدمة</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-soft border border-border rounded-2xl p-4 text-right flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-muted">
                  إنستاباي (InstaPay)
                </span>
                <span className="text-xl font-black text-heading mt-1 block">
                  {calculatedReports.instapayCount} طلب
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-black text-xs font-mono">
                IP
              </div>
            </div>

            <div className="bg-surface-soft border border-border rounded-2xl p-4 text-right flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-muted">
                  فودافون كاش
                </span>
                <span className="text-xl font-black text-heading mt-1 block">
                  {calculatedReports.vodafoneCount} طلب
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-danger-light text-danger flex items-center justify-center font-black text-xs font-mono">
                VF
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-2xs">
        <div className="p-6 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" />
            <h2 className="text-base font-black text-heading">
              الكتب الأكثر مبيعاً وطلباً في المتجر
            </h2>
          </div>
          <span className="text-xs font-extrabold text-muted">
            إجمالي {calculatedReports.topSoldBooks.length} كتاب مباع
          </span>
        </div>

        {calculatedReports.topSoldBooks.length === 0 ? (
          <div className="py-14 text-center text-muted-light font-bold text-sm">
            لا توجد مبيعات مؤكدة بعد لعرض إحصائيات الكتب الأكثر طلباً.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-surface-soft text-sub text-xs font-extrabold border-b border-border">
                  <th className="py-3.5 px-6 w-12">#</th>
                  <th className="py-3.5 px-6">عنوان الكتاب</th>
                  <th className="py-3.5 px-6 text-center">كود الكتاب</th>
                  <th className="py-3.5 px-6 text-center">النسخ المباعة</th>
                  <th className="py-3.5 px-6 text-left">إجمالي الإيراد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs sm:text-sm">
                {calculatedReports.topSoldBooks.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-primary-light/10 transition-colors"
                  >
                    <td className="py-3.5 px-6 font-black text-primary">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-6 font-extrabold text-heading flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-8 h-10 rounded-md object-cover border border-border shadow-2xs"
                        />
                      )}
                      <span>{item.title}</span>
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-muted">
                      #{item.code}
                    </td>
                    <td className="py-3.5 px-6 text-center font-black text-heading">
                      {item.totalQty} نسخة
                    </td>
                    <td className="py-3.5 px-6 text-left font-black text-success">
                      {item.totalRevenue.toFixed(2)} ج.م
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
