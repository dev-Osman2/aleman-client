"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { X, BookOpen, Receipt, User, LogIn } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import MenuBarCategories from "./MenuBarCategories";

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. المكون الداخلي الذي يتعامل مع useSearchParams
function MenuBarContent({ isOpen, onClose }: MenuBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { totalItems } = useCart();
  const { user } = useAuth();
  const currentCategory = searchParams.get("category")?.trim() || null;

  if (!isOpen) return null;

  const handleCategorySelect = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category.trim());
    } else {
      params.delete("category");
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
    onClose();
  };

  const handleScrollToOrderSummary = () => {
    onClose();

    // إذا كان المستخدم بالفعل في الصفحة الرئيسية
    if (pathname === "/") {
      setTimeout(() => {
        const el = document.getElementById("order-summary");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      // إذا كان في صفحة أخرى، يتم التوجيه للصفحة الرئيسية مع الـ Hash
      router.push("/#order-summary");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-start bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
      onClick={onClose}
    >
      <aside
        className="w-72 max-w-[82vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-heading text-base">
              أقسام المكتبة
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-subtle hover:bg-surface-hover text-sub flex items-center justify-center transition cursor-pointer"
            aria-label="إغلاق القائمة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-3 flex flex-col gap-2 shrink-0">
          <Link
            href={user ? "/profile" : "/login"}
            onClick={onClose}
            className="w-full px-4 py-3 rounded-xl bg-surface-soft hover:bg-primary-light border border-border text-heading hover:text-primary font-extrabold text-xs sm:text-sm flex items-center justify-between transition cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2 min-w-0">
              {user ? (
                user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0 border border-primary/20"
                  />
                ) : (
                  <User className="w-4 h-4 text-primary shrink-0" />
                )
              ) : (
                <LogIn className="w-4 h-4 text-primary shrink-0" />
              )}
              <span className="truncate">
                {user ? `حسابي (${user.name})` : "تسجيل الدخول / حسابي"}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleScrollToOrderSummary}
            className="w-full px-4 py-3 rounded-xl bg-primary-light hover:bg-primary-subtle border border-primary/30 text-primary font-extrabold text-xs sm:text-sm flex items-center justify-between transition cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 shrink-0" />
              <span>سلة الشراء والفاتورة</span>
            </div>
            {totalItems > 0 && (
              <span className="bg-primary text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <MenuBarCategories
          currentCategory={currentCategory}
          onSelectCategory={handleCategorySelect}
        />

        <div className="border-t border-border-subtle pt-3 mt-3 text-center text-xs text-muted-light font-medium shrink-0">
          دار الإيمان — خير جليس في الزمان كتاب
        </div>
      </aside>
    </div>
  );
}

export default function MenuBar(props: MenuBarProps) {
  if (!props.isOpen) return null;

  return (
    <Suspense fallback={null}>
      <MenuBarContent {...props} />
    </Suspense>
  );
}
