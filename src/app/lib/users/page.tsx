"use client";
import { Users, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminUsers } from "@/src/components/admin/users/hooks/useAdminUsers";
import UsersStatCards from "@/src/components/admin/users/UsersStatCards";
import UsersFilterBar from "@/src/components/admin/users/UsersFilterBar";
import UsersTable from "@/src/components/admin/users/UsersTable";

export default function AdminUsersPage() {
  const {
    loading,
    setLoading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    copiedPhone,
    handleCopyPhone,
    fetchUsers,
    analytics,
    filteredUsers,
  } = useAdminUsers();

  return (
    <div className="flex flex-col gap-6" dir="rtl">
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
            متابعة حسابات العملاء المسجلين، أرقام الهواتف، وعدد الطلبات المسجلة
            لكل مستخدم
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
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`}
          />
          <span>تحديث القائمة</span>
        </button>
      </div>

      <UsersStatCards analytics={analytics} />

      <UsersFilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalUsers={analytics.totalUsers}
        usersWithOrders={analytics.usersWithOrders}
        usersWithoutOrders={analytics.usersWithoutOrders}
      />

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
          <p className="text-heading font-black text-base">
            لا يوجد عملاء مطابقون للبحث
          </p>
          <p className="text-muted text-xs max-w-sm">
            تأكد من كتابة الاسم أو رقم الهاتف أو البريد بشكل صحيح، أو اختر
            تصنيفاً آخر.
          </p>
        </div>
      ) : (
        <UsersTable
          users={filteredUsers}
          copiedPhone={copiedPhone}
          onCopyPhone={handleCopyPhone}
        />
      )}
    </div>
  );
}
