"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X, UtensilsCrossed, Flame, Receipt, ImagePlus } from "lucide-react";
import { CATEGORIES } from "@/src/constants/categories";
import MenuGalleryModal from "@/src/components/menu/MenuGalleryModal";
import { MENU_IMAGES } from "@/src/constants/menuImages";
import { useCart } from "@/src/context/CartContext";
import { useState } from "react";

interface MenuBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuBar({ isOpen, onClose }: MenuBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { totalItems } = useCart();
  const [isMenuGalleryOpen, setIsMenuGalleryOpen] = useState(false);
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
    setTimeout(() => {
      const el = document.getElementById("order-summary");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
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
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-heading text-base">
              أقسام المنيو
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

        <div className="mb-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsMenuGalleryOpen(true)}
            className="w-full px-4 py-3 rounded-xl bg-primary-light hover:bg-primary-subtle border border-primary/30 text-primary font-extrabold text-xs sm:text-sm flex items-center justify-between transition cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <ImagePlus className="w-4 h-4 shrink-0" />
              <span>صور المنيو</span>
            </div>
            <span className="bg-primary text-white text-[11px] font-black px-2 py-0.5 rounded-full">
              {MENU_IMAGES.length}
            </span>
          </button>
        </div>

        <MenuGalleryModal
          isOpen={isMenuGalleryOpen}
          onClose={() => setIsMenuGalleryOpen(false)}
          images={MENU_IMAGES}
        />

        <div className="mb-3 shrink-0">
          <button
            type="button"
            onClick={handleScrollToOrderSummary}
            className="w-full px-4 py-3 rounded-xl bg-primary-light hover:bg-primary-subtle border border-primary/30 text-primary font-extrabold text-xs sm:text-sm flex items-center justify-between transition cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 shrink-0" />
              <span>ملخص الطلب والحساب</span>
            </div>
            {totalItems > 0 && (
              <span className="bg-primary text-white text-[11px] font-black px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 gap-2">
          <button
            type="button"
            onClick={() => handleCategorySelect(null)}
            className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm transition flex items-center justify-between cursor-pointer ${
              !currentCategory
                ? "bg-primary text-white shadow-xs"
                : "bg-surface-soft hover:bg-primary-light text-sub"
            }`}
          >
            <span>كل الوجبات (المنيو الكامل)</span>
            <Flame className="w-4 h-4 shrink-0" />
          </button>

          {CATEGORIES.map((category) => {
            const isActive = currentCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm transition flex items-center justify-between cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface-soft hover:bg-primary-light text-sub"
                }`}
              >
                <span className="truncate">{category}</span>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    isActive ? "bg-white" : "bg-primary/40"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="border-t border-border-subtle pt-3 mt-3 text-center text-xs text-muted-light font-medium shrink-0">
          مطعم السرايا — أشهى المأكولات
        </div>
      </aside>
    </div>
  );
}
