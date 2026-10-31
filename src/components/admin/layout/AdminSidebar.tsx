"use client";

import Link from "next/link";
import {
  X,
  ClipboardList,
  BookOpen,
  BarChart3,
  Calculator,
  Store,
  Users,
  MessageCircle,
} from "lucide-react";
import { User } from "@/src/types";
import AdminUserProfileBadge from "./AdminUserProfileBadge";
import AdminSidebarActions from "./AdminSidebarActions";

export const ADMIN_NAV_LINKS = [
  { href: "/lib/products", label: "إدارة الكتب والمخزون", icon: BookOpen },
  { href: "/lib/orders", label: "متابعة وسجل الطلبات", icon: ClipboardList },
  { href: "/lib/cashier", label: "نقطة بيع الكاشير (POS)", icon: Calculator },
  { href: "/lib/users", label: "سجل العملاء والمستخدمين", icon: Users },
  {
    href: "/lib/orders-summary",
    label: "التقارير وملخص المبيعات",
    icon: BarChart3,
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  pathname: string;
  currentUser?: User | null;
  onClose: () => void;
  onLogout: () => void;
  clearingOrders?: boolean;
  onRequestClearOrders?: () => void;
}

export default function AdminSidebar({
  isOpen,
  pathname,
  currentUser,
  onClose,
  onLogout,
  clearingOrders = false,
  onRequestClearOrders,
}: AdminSidebarProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start print:hidden transition-opacity"
      onClick={onClose}
      dir="rtl"
    >
      <aside
        className="w-80 max-w-[85vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center p-2 border border-primary/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-heading text-sm">دار الإيمان</h2>
                <p className="text-[11px] text-muted-light font-medium">
                  لوحة الإدارة والتحكم
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق القائمة"
              className="w-8 h-8 rounded-full bg-surface-subtle hover:bg-surface-hover text-sub flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {currentUser && <AdminUserProfileBadge user={currentUser} />}

          <nav className="flex flex-col gap-1.5">
            {ADMIN_NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/lib/products"
                  ? pathname.startsWith("/lib/products")
                  : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-sub hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-border-subtle">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm text-sub hover:bg-surface-subtle transition"
              >
                <Store className="w-4 h-4 shrink-0 text-primary" />
                <span>الذهاب لمتجر الكتب الرئيسي</span>
              </Link>
              <Link
                href="https://web.telegram.org/a/#8820366769"
                target="_blank"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm text-sub hover:bg-surface-subtle transition"
              >
                <MessageCircle className="w-4 h-4 shrink-0 text-primary" />
                <span>الذهاب لجروب التلجرام</span>
              </Link>
            </div>
          </nav>
        </div>

        <AdminSidebarActions
          clearingOrders={clearingOrders}
          onRequestClearOrders={onRequestClearOrders}
          onLogout={onLogout}
        />
      </aside>
    </div>
  );
}
