import { Trash2, Loader2, LogOut } from "lucide-react";

interface AdminSidebarActionsProps {
  clearingOrders: boolean;
  onRequestClearOrders?: () => void;
  onLogout: () => void;
}

export default function AdminSidebarActions({
  clearingOrders,
  onRequestClearOrders,
  onLogout,
}: AdminSidebarActionsProps) {
  return (
    <div className="pt-4 border-t border-border flex flex-col gap-3">
      <button
        type="button"
        disabled={clearingOrders}
        onClick={onRequestClearOrders}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface-subtle hover:bg-danger hover:text-white text-sub font-extrabold text-xs sm:text-sm transition cursor-pointer"
      >
        {clearingOrders ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
        <span>مسح الطلبات</span>
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-danger-light hover:bg-danger hover:text-white text-danger font-extrabold text-xs sm:text-sm transition-all shadow-xs cursor-pointer group"
      >
        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>تسجيل الخروج من لوحة الإدارة</span>
      </button>
    </div>
  );
}
