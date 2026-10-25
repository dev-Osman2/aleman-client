"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  Search,
  RefreshCw,
  Loader2,
  Phone,
  Mail,
  Calendar,
  PackageCheck,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { getAdminToken } from "@/src/lib/cookies";

interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "with_orders" | "no_orders">("all");
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  const fetchUsers = useCallback(async () => {
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("تعذر جلب سجل العملاء من الخادم");
      }

      const json = await res.json();
      const list: AdminUserRecord[] = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : [];
      setUsers(list);
    } catch (err: unknown) {
      console.error("Failed to fetch admin users:", err);
      toast.error(
        err instanceof Error ? err.message : "حدث خطأ أثناء تحميل بيانات العملاء"
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCopyPhone = async (phone: string) => {
    if (!phone) return;
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      toast.success(`تم نسخ الرقم ${phone}`);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch {
      toast.error("تعذر نسخ رقم الهاتف");
    }
  };

  // إحصائيات تحليلية سريعة
  const analytics = useMemo(() => {
    const totalUsers = users.length;
    const usersWithOrders = users.filter((u) => (u._count?.orders || 0) > 0).length;
    const totalOrdersPlaced = users.reduce(
      (sum, u) => sum + (u._count?.orders || 0),
      0
    );
    const usersWithoutOrders = totalUsers - usersWithOrders;

    return {
      totalUsers,
      usersWithOrders,
      totalOrdersPlaced,
      usersWithoutOrders,
    };
  }, [users]);

  // تصفية وبحث المستخدمين
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // فلترة النوع
      const orderCount = user._count?.orders || 0;
      if (activeFilter === "with_orders" && orderCount === 0) return false;
      if (activeFilter === "no_orders" && orderCount > 0) return false;

      // بحث النص
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      const name = (user.name || "").toLowerCase();
      const phone = (user.phone || "").toLowerCase();
      const email = (user.email || "").toLowerCase();

      return name.includes(q) || phone.includes(q) || email.includes(q);
    });
  }, [users, activeFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* ترويسة الصفحة */}
      <div className="bg-white rounded-3xl border border-border/80 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="text-right flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-heading">
              سجل العملاء والمستخدمين
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted font-medium">
            متابعة حسابات العملاء المسجلين، أرقام الهواتف، وعدد الطلبات المسجلة لكل مستخدم
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            await fetchUsers();
            toast.success("تم تحديث قائمة العملاء بنجاح");
          }}
          className="bg-white hover:bg-surface-subtle border border-border/90 text-heading font-extrabold px-4 py-3 rounded-2xl shadow-2xs flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          <span>تحديث القائمة</span>
        </button>
      </div>

      {/* كروت التحليل البياني (مبنية بواسطة flex-box بدون grid) */}
      <div className="flex flex-wrap gap-4">
        {/* كارت 1: إجمالي المستخدمين */}
        <div className="flex-1 min-w-[240px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-muted">إجمالي العملاء المسجلين</span>
            <p className="text-2xl font-black text-heading mt-0.5">
              {analytics.totalUsers}{" "}
              <span className="text-xs font-semibold text-muted">عميل</span>
            </p>
          </div>
        </div>

        {/* كارت 2: عملاء نشطون بطلبات */}
        <div className="flex-1 min-w-[240px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-success-light text-success flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-muted">عملاء أتموا طلبات</span>
            <p className="text-2xl font-black text-heading mt-0.5">
              {analytics.usersWithOrders}{" "}
              <span className="text-xs font-semibold text-muted">مشتري نشط</span>
            </p>
          </div>
        </div>

        {/* كارت 3: إجمالي الطلبات */}
        <div className="flex-1 min-w-[240px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-warning-light text-warning flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-muted">إجمالي طلبات العملاء</span>
            <p className="text-2xl font-black text-heading mt-0.5">
              {analytics.totalOrdersPlaced}{" "}
              <span className="text-xs font-semibold text-muted">طلب مسجل</span>
            </p>
          </div>
        </div>

        {/* كارت 4: عملاء جدد بدون طلبات */}
        <div className="flex-1 min-w-[240px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-surface-subtle text-muted-dark flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-muted">حسابات جديدة قيد الانتظار</span>
            <p className="text-2xl font-black text-heading mt-0.5">
              {analytics.usersWithoutOrders}{" "}
              <span className="text-xs font-semibold text-muted">مستخدم</span>
            </p>
          </div>
        </div>
      </div>

      {/* شريط البحث وتصفية الحسابات */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* أزرار الفلترة السريعة */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
              activeFilter === "all"
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white text-sub border-border/90 hover:border-primary/40 hover:text-primary"
            }`}
          >
            جميع العملاء ({analytics.totalUsers})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("with_orders")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
              activeFilter === "with_orders"
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white text-sub border-border/90 hover:border-primary/40 hover:text-primary"
            }`}
          >
            أصحاب الطلبات ({analytics.usersWithOrders})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter("no_orders")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
              activeFilter === "no_orders"
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white text-sub border-border/90 hover:border-primary/40 hover:text-primary"
            }`}
          >
            بدون طلبات ({analytics.usersWithoutOrders})
          </button>
        </div>

        {/* حقل البحث بالاسم أو الرقم */}
        <div className="relative w-full sm:w-80 shrink-0">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم، الهاتف، أو الإيميل..."
            className="w-full bg-white border border-border/90 rounded-2xl py-2.5 pr-10 pl-4 text-xs sm:text-sm text-body focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {/* جدول العملاء أو مؤشر التحميل */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-border/80 py-24 flex flex-col items-center justify-center gap-3 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-bold">جاري تحميل سجل العملاء...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border/80 py-20 text-center flex flex-col items-center justify-center gap-3 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-surface-subtle text-muted flex items-center justify-center">
            <Users className="w-8 h-8 text-muted-light" />
          </div>
          <p className="text-heading font-black text-base">لا يوجد عملاء مطابقون للبحث</p>
          <p className="text-muted text-xs max-w-sm">
            تأكد من كتابة الاسم أو رقم الهاتف أو البريد بشكل صحيح، أو اختر تصنيفاً آخر.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-right border-collapse">
              <thead>
                <tr className="bg-surface-soft border-b border-border/80 text-sub text-xs font-extrabold">
                  <th className="py-4 px-6 w-[28%]">الاسم والصفة</th>
                  <th className="py-4 px-4 w-[24%]">رقم الهاتف</th>
                  <th className="py-4 px-4 w-[24%]">البريد الإلكتروني</th>
                  <th className="py-4 px-4 text-center w-[12%]">عدد الطلبات</th>
                  <th className="py-4 px-6 text-left w-[12%]">تاريخ التسجيل</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border-subtle">
                {filteredUsers.map((user) => {
                  const ordersCount = user._count?.orders || 0;
                  const formattedDate = new Date(user.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-primary-light/10"
                    >
                      {/* اسم العميل */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0">
                            {user.name ? user.name.trim().charAt(0) : "ع"}
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold text-heading text-sm block truncate">
                              {user.name || "عميل بدون اسم"}
                            </span>
                            <span className="text-[11px] font-bold text-muted-light block">
                              عميل مسجل
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* رقم الهاتف */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-heading dir-ltr">
                            {user.phone || "—"}
                          </span>
                          {user.phone && (
                            <button
                              type="button"
                              onClick={() => handleCopyPhone(user.phone)}
                              title="نسخ رقم الهاتف"
                              className="text-muted hover:text-primary transition cursor-pointer p-1 rounded-md hover:bg-surface-subtle"
                            >
                              {copiedPhone === user.phone ? (
                                <Check className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 opacity-60" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* البريد الإلكتروني */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-sub truncate" title={user.email}>
                          <Mail className="w-3.5 h-3.5 text-muted-light shrink-0" />
                          <span className="truncate">{user.email || "—"}</span>
                        </div>
                      </td>

                      {/* عدد الطلبات */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                            ordersCount > 0
                              ? "bg-success-light text-success border border-success-border"
                              : "bg-surface-subtle text-muted border border-border"
                          }`}
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>{ordersCount} طلب</span>
                        </span>
                      </td>

                      {/* تاريخ التسجيل */}
                      <td className="py-4 px-6 text-left">
                        <div className="inline-flex items-center gap-1.5 text-xs text-muted font-medium">
                          <Calendar className="w-3.5 h-3.5 text-muted-light" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
