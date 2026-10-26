"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getAdminToken } from "@/src/lib/cookies";
import AdminHeader from "@/src/components/admin/layout/AdminHeader";
import AdminSidebar from "@/src/components/admin/layout/AdminSidebar";
import SearchBar from "@/src/components/layout/SearchBar";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import { BookOpen, Loader2, ShieldCheck } from "lucide-react";
import { useAdminAuthSession } from "@/src/components/admin/layout/hooks/useAdminAuthSession";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authorized, checking, currentUser, handleLogout, pathname } =
    useAdminAuthSession();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showClearOrdersModal, setShowClearOrdersModal] = useState(false);
  const [clearingOrders, setClearingOrders] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
  const isCashierPage = pathname === "/lib/cashier";

  const handleClearAllOrders = async () => {
    setClearingOrders(true);
    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/admin/orders/clear-all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("تم مسح كافة الطلبات وحذف رسائل التلجرام بنجاح");
        setShowClearOrdersModal(false);
        setDrawerOpen(false);
        window.location.reload();
      } else {
        toast.error(data.message || "فشل في مسح الطلبات");
      }
    } catch (err) {
      console.error("Failed to clear orders:", err);
      toast.error("حدث خطأ في الاتصال أثناء مسح الطلبات");
    } finally {
      setClearingOrders(false);
    }
  };

  if (checking) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-dark text-white p-4"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary animate-pulse">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 shadow-md">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جاري التحقق من الصلاحيات الأمنية...</span>
          </div>
          <p className="text-xs text-muted-light">
            مكتبة الإيمان - بوابة الإدارة المركزية
          </p>
        </div>
      </div>
    );
  }

  if (pathname === "/lib") {
    return <>{children}</>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-surface-soft flex flex-col print:bg-white print:min-h-0 text-body selection:bg-primary-light selection:text-primary"
      dir="rtl"
    >
      <AdminHeader
        isCashierPage={isCashierPage}
        currentUser={currentUser}
        onOpenMenu={() => setDrawerOpen(true)}
        onLogout={() => {
          setDrawerOpen(false);
          handleLogout();
        }}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <AdminSidebar
        isOpen={drawerOpen}
        pathname={pathname}
        currentUser={currentUser}
        onClose={() => setDrawerOpen(false)}
        onLogout={() => {
          setDrawerOpen(false);
          handleLogout();
        }}
        clearingOrders={clearingOrders}
        onRequestClearOrders={() => setShowClearOrdersModal(true)}
      />

      {isCashierPage && (
        <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      )}

      <main className="flex-1 container mx-auto px-4 py-6 print:p-0 print:m-0 print:max-w-none">
        {children}
      </main>

      <ConfirmModal
        isOpen={showClearOrdersModal}
        title="مسح وتفريغ جميع الطلبات نهائياً"
        message="هل أنت متأكد من تفريغ قاعدة بيانات الطلبات بالكامل ومسح جميع رسائل التلجرام المرسلة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="افرغ قاعدة البيانات"
        cancelText="تراجع"
        variant="danger"
        loading={clearingOrders}
        onConfirm={handleClearAllOrders}
        onCancel={() => setShowClearOrdersModal(false)}
      />
    </div>
  );
}
