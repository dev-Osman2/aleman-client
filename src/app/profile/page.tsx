/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Settings,
  LogOut,
  Trash2,
  Loader2,
  RefreshCw,
  BookOpen,
  CreditCard,
  Hash,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/src/components/layout/Header";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import { useAuth } from "@/src/context/AuthContext";
import { Order, OrderStatus } from "@/src/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading, updateUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");

  // بيانات الطلبات
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // حقول تعديل الملف الشخصي
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // حذف الحساب
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  // جلب سجل طلبات المستخدم
  const fetchMyOrders = useCallback(async () => {
    if (!token) return;
    setOrdersLoading(true);
    try {
      const res = await fetch(`${apiUrl}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("تعذر جلب سجل الطلبات");
      }

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

  // ملء بيانات التعديل عند تحميل المستخدم
  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
    }
  }, [user]);

  // جلب الطلبات عند توفر التوكن
  useEffect(() => {
    if (token) {
      fetchMyOrders();
    }
  }, [token, fetchMyOrders]);

  // إحصائيات سريعة للطلبات
  const orderStats = useMemo(() => {
    const totalOrders = orders.length;
    const confirmedOrders = orders.filter((o) => o.status === "CONFIRMED").length;
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
    const totalSpent = orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    return { totalOrders, confirmedOrders, pendingOrders, totalSpent };
  }, [orders]);

  // حفظ تعديلات الملف الشخصي
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!editName.trim() || !editPhone.trim()) {
      toast.error("يرجى ملء الاسم ورقم الهاتف بشكل صحيح");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        updateUser({
          name: editName.trim(),
          phone: editPhone.trim(),
        });
        toast.success("تم تحديث بيانات ملفك الشخصي بنجاح");
      } else {
        toast.error(data.message || "تعذر حفظ التعديلات");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSavingProfile(false);
    }
  };

  // تأكيد وحذف الحساب نهائياً
  const handleConfirmDeleteAccount = async () => {
    if (!token) return;

    setIsDeletingAccount(true);
    try {
      const res = await fetch(`${apiUrl}/auth/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("تم حذف حسابك بنجاح، نتمنى لك التوفيق");
        logout();
        setShowDeleteModal(false);
        router.push("/");
      } else {
        toast.error(data.message || "تعذر حذف الحساب في الوقت الحالي");
      }
    } catch (err) {
      console.error("Failed to delete account:", err);
      toast.error("حدث خطأ أثناء محاولة حذف الحساب");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح");
    router.push("/");
  };

  // شاشات التحميل والحماية
  if (authLoading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3 text-muted" dir="rtl">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-bold">جاري تحميل بيانات حسابك...</span>
        </main>
      </>
    );
  }

  // إذا لم يكن مسجلاً للدخول
  if (!user) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center" dir="rtl">
          <div className="w-16 h-16 rounded-3xl bg-primary-light text-primary flex items-center justify-center mb-4 shadow-sm">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-heading mb-2">
            يرجى تسجيل الدخول أولاً
          </h2>
          <p className="text-muted text-xs sm:text-sm max-w-sm mb-6 font-medium">
            للوصول إلى ملفك الشخصي ومتابعة سجل طلباتك وتحديث بياناتك، يرجى تسجيل الدخول إلى حسابك.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="bg-primary hover:bg-primary-hover text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-sm transition active:scale-95"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="bg-white border border-border text-heading hover:text-primary font-extrabold text-sm px-6 py-3 rounded-2xl transition active:scale-95"
            >
              إنشاء حساب جديد
            </Link>
          </div>
        </main>
      </>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "عضو مميز";

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 flex flex-col gap-8 max-w-5xl" dir="rtl">
        {/* كارت هوية المستخدم (Flexbox Hero) */}
        <div className="bg-white rounded-3xl border border-border/80 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary text-white font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
              {user.name ? user.name.trim().charAt(0) : "ع"}
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-heading truncate">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full border border-primary/20 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{user.role === "ADMIN" ? "مدير المكتبة" : "عميل مسجل"}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-medium mt-0.5">
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-muted-light" />
                  <span className="font-mono dir-ltr">{user.phone}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-muted-light" />
                  <span>{user.email}</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-light" />
                  <span>انضم في: {joinDate}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleLogout}
              className="bg-surface-subtle hover:bg-danger-light text-sub hover:text-danger border border-border hover:border-danger-border font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl flex items-center gap-2 transition cursor-pointer active:scale-95 shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* إحصائيات سريعة للطلبات (Flexbox - بدون grid) */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-muted">إجمالي الطلبات</span>
              <p className="text-xl sm:text-2xl font-black text-heading mt-0.5">
                {orderStats.totalOrders}{" "}
                <span className="text-xs font-semibold text-muted">طلب</span>
              </p>
            </div>
          </div>

          <div className="flex-1 min-w-[200px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-success-light text-success flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-muted">طلبات مؤكدة</span>
              <p className="text-xl sm:text-2xl font-black text-heading mt-0.5">
                {orderStats.confirmedOrders}{" "}
                <span className="text-xs font-semibold text-muted">طلب</span>
              </p>
            </div>
          </div>

          <div className="flex-1 min-w-[200px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-warning-light text-warning flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-muted">قيد المراجعة</span>
              <p className="text-xl sm:text-2xl font-black text-heading mt-0.5">
                {orderStats.pendingOrders}{" "}
                <span className="text-xs font-semibold text-muted">طلب</span>
              </p>
            </div>
          </div>

          <div className="flex-1 min-w-[200px] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-muted">إجمالي المشتريات</span>
              <p className="text-xl sm:text-2xl font-black text-heading mt-0.5">
                {orderStats.totalSpent.toFixed(2)}{" "}
                <span className="text-xs font-semibold text-muted">ج.م</span>
              </p>
            </div>
          </div>
        </div>

        {/* أزرار التبديل بين التبويبات (Flexbox Tabs) */}
        <div className="flex items-center gap-3 border-b border-border/80 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
              activeTab === "orders"
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white text-sub border-border/80 hover:border-primary/40 hover:text-primary"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>سجل طلباتي ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
              activeTab === "settings"
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white text-sub border-border/80 hover:border-primary/40 hover:text-primary"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الحساب والبيانات</span>
          </button>
        </div>

        {/* محتوى التبويب الأول: سجل الطلبات */}
        {activeTab === "orders" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-heading">
                قائمة طلبات الكتب السابقة
              </h2>
              <button
                type="button"
                onClick={fetchMyOrders}
                disabled={ordersLoading}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:text-primary-hover bg-primary-light px-3 py-1.5 rounded-xl border border-primary/20 transition cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? "animate-spin" : ""}`} />
                <span>تحديث</span>
              </button>
            </div>

            {ordersLoading ? (
              <div className="bg-white rounded-3xl border border-border/80 py-20 flex flex-col items-center justify-center gap-3 text-muted">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="text-sm font-bold">جاري تحميل قائمة طلباتك...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-border/80 py-16 px-6 text-center flex flex-col items-center justify-center gap-3 shadow-2xs">
                <div className="w-16 h-16 rounded-2xl bg-surface-subtle text-muted flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-muted-light" />
                </div>
                <h3 className="font-black text-base text-heading">
                  لم تقم بتسجيل أي طلبات حتى الآن
                </h3>
                <p className="text-xs text-muted max-w-sm">
                  تصفح مجموعتنا الواسعة من كتب العقيدة والفقه والتفسير واطلب كتبك المفضلة لتصلك مباشرة.
                </p>
                <Link
                  href="/"
                  className="mt-2 inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition active:scale-95"
                >
                  <span>تصفح الكتب واطلب الآن</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => {
                  const statusConfig: Record<
                    OrderStatus,
                    { label: string; bg: string; text: string; border: string; icon: any }
                  > = {
                    PENDING: {
                      label: "قيد المراجعة والتجهيز",
                      bg: "bg-warning-light",
                      text: "text-warning",
                      border: "border-warning-border",
                      icon: Clock,
                    },
                    CONFIRMED: {
                      label: "تم التأكيد وجاهز للتسليم",
                      bg: "bg-success-light",
                      text: "text-success",
                      border: "border-success-border",
                      icon: CheckCircle2,
                    },
                    CANCELLED: {
                      label: "طلب ملغي",
                      bg: "bg-danger-light",
                      text: "text-danger",
                      border: "border-danger-border",
                      icon: XCircle,
                    },
                  };

                  const currentStatus = statusConfig[order.status] || statusConfig.PENDING;
                  const StatusIcon = currentStatus.icon;
                  const orderDate = new Date(order.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-border/80 p-5 sm:p-6 shadow-xs flex flex-col gap-4 hover:shadow-md transition"
                    >
                      {/* رأس كارت الطلب */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border-subtle">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-sm sm:text-base text-heading">
                            طلب رقم #{order.id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span>{currentStatus.label}</span>
                          </span>
                        </div>

                        <span className="text-xs text-muted font-medium">
                          {orderDate}
                        </span>
                      </div>

                      {/* قائمة عناصر الطلب (الكتب) */}
                      <div className="divide-y divide-border-subtle bg-surface-soft/60 rounded-2xl p-3 border border-border-subtle flex flex-col gap-2">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 py-1.5 text-xs sm:text-sm"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {item.book?.image && (
                                <img
                                  src={item.book.image}
                                  alt={item.book.title}
                                  className="w-8 h-11 rounded-lg object-cover border border-border shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              )}
                              <div className="truncate">
                                <span className="font-extrabold text-heading block truncate">
                                  {item.book?.title || "كتاب من المكتبة"}
                                </span>
                                {item.book?.code && (
                                  <span className="text-[10px] text-muted font-mono block">
                                    #{item.book.code}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs font-bold text-sub">
                                {item.quantity} × {item.priceAtBuy} ج
                              </span>
                              <span className="text-xs sm:text-sm font-black text-heading min-w-[60px] text-left">
                                {(item.priceAtBuy * item.quantity).toFixed(2)} ج.م
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ملخص الدفع والعنوان */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">
                            📍 العنوان: <span className="text-heading font-bold">{order.address}</span>
                          </span>
                          <span className="font-medium">
                            💳 طريقة الدفع:{" "}
                            <span className="text-heading font-bold">
                              {order.paymentMethod === "INSTAPAY" ? "إنستاباي" : "فودافون كاش"}
                            </span>
                            {order.transferNumber && (
                              <span className="font-mono mr-1 font-bold">
                                ({order.transferNumber})
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="text-left">
                          <span className="block text-[11px] text-muted">
                            المجموع (شامل توصيل {order.deliveryFee} ج)
                          </span>
                          <span className="text-base sm:text-lg font-black text-primary">
                            {Number(order.total).toFixed(2)} ج.م
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* محتوى التبويب الثاني: إعدادات الحساب وحذف الحساب */}
        {activeTab === "settings" && (
          <div className="flex flex-col gap-6">
            {/* نموذج تحديث البيانات الأساسية */}
            <div className="bg-white rounded-3xl border border-border/80 p-6 sm:p-8 shadow-xs flex flex-col gap-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border-subtle">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-base sm:text-lg font-black text-heading">
                  تحديث البيانات الشخصية
                </h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-4">
                  {/* الاسم الكامل */}
                  <div className="w-full sm:w-[calc(50%-0.5rem)]">
                    <label className="block text-xs font-extrabold text-heading mb-1.5">
                      الاسم الكامل <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                        className="w-full pr-10 pl-4 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
                      />
                    </div>
                  </div>

                  {/* رقم الهاتف */}
                  <div className="w-full sm:w-[calc(50%-0.5rem)]">
                    <label className="block text-xs font-extrabold text-heading mb-1.5">
                      رقم الهاتف (المستخدم لتسجيل الدخول والتوصيل) <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="010xxxxxxxx"
                        className="w-full pr-10 pl-4 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition dir-ltr text-right"
                      />
                    </div>
                  </div>
                </div>

                {/* البريد الإلكتروني (للعرض فقط) */}
                <div className="w-full">
                  <label className="block text-xs font-extrabold text-heading mb-1.5">
                    البريد الإلكتروني (معرف الحساب)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full pr-10 pl-4 py-3 bg-surface-soft border border-border rounded-xl text-sm font-bold text-muted cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[11px] text-muted-light mt-1 block">
                    البريد الإلكتروني مرتبط بحسابك الأمني ولا يمكن تعديله يدوياً.
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-primary hover:bg-primary-hover text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري حفظ التعديلات...</span>
                      </>
                    ) : (
                      <span>حفظ التعديلات</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* منطقة الخطر: حذف الحساب */}
            <div className="bg-white rounded-3xl border border-danger-border/80 p-6 sm:p-8 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-danger-border/50">
                <Trash2 className="w-5 h-5 text-danger" />
                <h3 className="text-base sm:text-lg font-black text-danger">
                  منطقة الخطر — حذف الحساب نهائياً
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-muted font-medium leading-relaxed">
                عند حذف حسابك، سيتم مسح كافة بياناتك وسجل طلباتك وجلسات تسجيل الدخول بالكامل من قاعدة بيانات مكتبة الإيمان. هذا الإجراء نهائي ولا يمكن استرجاع الحساب بعد تأكيده.
              </p>

              <div className="pt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-danger hover:bg-danger text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف الحساب نهائياً</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة تأكيد حذف الحساب */}
        <ConfirmModal
          isOpen={showDeleteModal}
          title="حذف الحساب نهائياً"
          message="هل أنت متأكد تماماً من رغبتك في حذف حسابك من مكتبة الإيمان؟ سيتم حذف جميع بياناتك وسجل طلباتك ولا يمكن التراجع عن هذا الإجراء."
          confirmText="نعم، احذف حسابي الآن"
          cancelText="إلغاء وتراجع"
          variant="danger"
          loading={isDeletingAccount}
          onConfirm={handleConfirmDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      </main>
    </>
  );
}
