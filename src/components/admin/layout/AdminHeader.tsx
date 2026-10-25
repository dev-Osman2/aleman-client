"use client";

import Link from "next/link";
import {
  Menu,
  LogOut,
  Search,
  BookOpen,
  ClipboardList,
  Calculator,
  BarChart3,
  ShieldCheck,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { User } from "@/src/types";

interface AdminHeaderProps {
  isCashierPage?: boolean;
  currentUser?: User | null;
  onOpenMenu: () => void;
  onLogout: () => void;
  onOpenSearch?: () => void;
}

const ADMIN_NAV_ITEMS = [
  {
    name: "الكتب والمخزون",
    href: "/lib/products",
    icon: BookOpen,
  },
  {
    name: "الطلبات الحية",
    href: "/lib/orders",
    icon: ClipboardList,
  },
  {
    name: "نقطة البيع (الكاشير)",
    href: "/lib/cashier",
    icon: Calculator,
  },
  {
    name: "التقارير والمبيعات",
    href: "/lib/orders-summary",
    icon: BarChart3,
  },
];

export default function AdminHeader({
  isCashierPage = false,
  currentUser,
  onOpenMenu,
  onLogout,
  onOpenSearch,
}: AdminHeaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll =
        window.scrollY || document.documentElement.scrollTop;

      if (totalScroll > 0) {
        const progress = (currentScroll / totalScroll) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className="sticky top-0 z-40 bg-primary text-white shadow-md print:hidden transition-colors"
      dir="rtl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* الشعار وبيانات الهوية */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center p-2 shadow-sm transition-transform group-hover:scale-105">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="leading-tight text-right">
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base sm:text-lg tracking-tight">
                  مكتبة الإيمان
                </h1>
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>لوحة الإدارة</span>
                </span>
              </div>
              <p className="text-[11px] text-primary-subtle font-medium hidden sm:block">
                إدارة الكتب، الطلبات، الكاشير والمبيعات
              </p>
            </div>
          </div>
        </div>

        {/* شريط الروابط الرئيسية */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/lib/products"
                ? pathname.startsWith("/lib/products")
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-primary shadow-xs"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* الأزرار الجانبية ومعلومات الأدمن */}
        <div className="flex items-center gap-2">
          {/* اسم الأدمن إن وجد */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/20 text-right">
              <div className="leading-tight">
                <span className="block text-xs font-black truncate max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="block text-[10px] text-primary-subtle font-semibold">
                  مشرف النظام
                </span>
              </div>
            </div>
          )}

          {/* زر التوجه للمتجر الرئيسي */}
          <Link
            href="/"
            title="المتجر الرئيسي"
            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer text-white"
          >
            <Store className="w-4 h-4" />
          </Link>

          {/* زر البحث إن كان في صفحة الكاشير */}
          {isCashierPage && onOpenSearch && (
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={onOpenSearch}
              title="بحث عن كتاب"
              aria-label="بحث عن كتاب"
              className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* زر تسجيل الخروج */}
          <button
            type="button"
            onClick={onLogout}
            title="تسجيل الخروج"
            aria-label="تسجيل الخروج"
            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-danger hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* زر فتح القائمة الجانبية للشاشات المتوسطة والصغيرة */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onOpenMenu}
            title="القائمة"
            aria-label="القائمة الجانبية"
            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* مؤشر التمرير السفلي */}
      <div
        className="absolute bottom-0 right-0 h-0.5 bg-secondary transition-[width] duration-100 ease-out z-50"
        style={{ width: `${scrollProgress}%` }}
      />
    </header>
  );
}
