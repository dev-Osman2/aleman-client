"use client";
import Link from "next/link";
import { User, Loader2 } from "lucide-react";
import Header from "@/src/components/layout/Header";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import { useProfile } from "@/src/components/profile/hooks/useProfile";
import ProfileHeaderCard from "@/src/components/profile/ProfileHeaderCard";
import ProfileStatsCards from "@/src/components/profile/ProfileStatsCards";
import ProfileTabsNav from "@/src/components/profile/ProfileTabsNav";
import ProfileOrdersList from "@/src/components/profile/ProfileOrdersList";
import ProfileSettingsTab from "@/src/components/profile/ProfileSettingsTab";

export default function ProfilePage() {
  const {
    user,
    authLoading,
    activeTab,
    setActiveTab,
    orders,
    ordersLoading,
    fetchMyOrders,
    orderStats,
    editName,
    setEditName,
    editPhone,
    setEditPhone,
    savingProfile,
    handleUpdateProfile,
    showDeleteModal,
    setShowDeleteModal,
    isDeletingAccount,
    handleConfirmDeleteAccount,
    handleLogout,
  } = useProfile();

  if (authLoading) {
    return (
      <>
        <Header />
        <main
          className="container mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3 text-muted"
          dir="rtl"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-bold">جاري تحميل بيانات حسابك...</span>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main
          className="flex-1 container  mx-auto px-4 py-10 max-w-md min-h-[calc(100vh-180px)] flex flex-col items-center justify-center text-center"
          dir="rtl"
        >
          <div className="w-16 h-16 rounded-3xl bg-primary-light text-primary flex items-center justify-center mb-4 shadow-sm">
            <User className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-heading mb-2">
            يرجى تسجيل الدخول أولاً
          </h2>

          <p className="text-muted text-xs sm:text-sm max-w-sm mb-6 font-medium text-center">
            للوصول إلى ملفك الشخصي ومتابعة سجل طلباتك وتحديث بياناتك، يرجى تسجيل
            الدخول إلى حسابك.
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

  return (
    <>
      <Header />
      <main
        className="container mx-auto px-4 py-8 flex flex-col gap-8 max-w-5xl"
        dir="rtl"
      >
        <ProfileHeaderCard user={user} onLogout={handleLogout} />

        <ProfileStatsCards orderStats={orderStats} />

        <ProfileTabsNav
          activeTab={activeTab}
          ordersCount={orders.length}
          onTabChange={setActiveTab}
        />

        {activeTab === "orders" && (
          <ProfileOrdersList
            orders={orders}
            loading={ordersLoading}
            onRefresh={fetchMyOrders}
          />
        )}

        {activeTab === "settings" && (
          <ProfileSettingsTab
            editName={editName}
            setEditName={setEditName}
            editPhone={editPhone}
            setEditPhone={setEditPhone}
            userEmail={user.email}
            savingProfile={savingProfile}
            onUpdateProfile={handleUpdateProfile}
            onOpenDeleteModal={() => setShowDeleteModal(true)}
          />
        )}

        <ConfirmModal
          isOpen={showDeleteModal}
          title="حذف الحساب نهائياً"
          message="هل أنت متأكد تماماً من رغبتك في حذف حسابك من مكتبة الإيمان؟ سيتم حذف جميع بياناتك وسجل طلباتك ولا يمكن التراجع عن هذا الإجراء."
          confirmText="احذف حسابي الآن"
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
