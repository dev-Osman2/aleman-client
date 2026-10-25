"use client";

import Link from "next/link";
import {
  X,
  LogOut,
  ClipboardList,
  BookOpen,
  BarChart3,
  Calculator,
  Store,
  ShieldCheck,
  User as UserIcon,
  Users,
} from "lucide-react";
import { User } from "@/src/types";

export const ADMIN_NAV_LINKS = [
  {
    href: "/lib/products",
    label: "إدارة الكتب والمخزون",
    icon: BookOpen,
  },
  {
    href: "/lib/orders",
    label: "متابعة وسجل الطلبات",
    icon: ClipboardList,
  },
  {
    href: "/lib/cashier",
    label: "نقطة بيع الكاشير (POS)",
    icon: Calculator,
  },
  {
    href: "/lib/users",
    label: "سجل العملاء والمستخدمين",
    icon: Users,
  },
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
}

export default function AdminSidebar({
  isOpen,
  pathname,
  currentUser,
  onClose,
  onLogout,
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
          {/* رأس القائمة الجانبية */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center p-2 border border-primary/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-heading text-sm">
                  مكتبة الإيمان
                </h2>
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

          {/* بطاقة معلومات المشرف الحالي */}
          {currentUser && (
            <div className="p-3.5 bg-surface-soft border border-border rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-black text-heading truncate">
                    {currentUser.name}
                  </span>
                  <span className="bg-primary-light text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-primary/20 shrink-0 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>ADMIN</span>
                  </span>
                </div>
                <span className="text-[11px] text-muted truncate block">
                  {currentUser.email || currentUser.phone}
                </span>
              </div>
            </div>
          )}

          {/* روابط التنقل الرئيسية */}
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

            {/* الفاصل ورابط المتجر */}
            <div className="pt-2 mt-2 border-t border-border-subtle">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm text-sub hover:bg-surface-subtle transition"
              >
                <Store className="w-4 h-4 shrink-0 text-primary" />
                <span>الذهاب لمتجر الكتب الرئيسي</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* زر تسجيل الخروج السفلي */}
        <div className="pt-4 border-t border-border">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-danger-light hover:bg-danger hover:text-white text-danger font-extrabold text-xs sm:text-sm transition-all shadow-xs cursor-pointer group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>تسجيل الخروج من لوحة الإدارة</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
