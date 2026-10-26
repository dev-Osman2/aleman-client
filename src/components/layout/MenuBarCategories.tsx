"use client";

import { Layers } from "lucide-react";
import { CATEGORIES } from "@/src/constants/categories";

interface MenuBarCategoriesProps {
  currentCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function MenuBarCategories({
  currentCategory,
  onSelectCategory,
}: MenuBarCategoriesProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2">
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={`w-full text-right px-4 py-3 rounded-xl font-bold text-sm transition flex items-center justify-between cursor-pointer ${
          !currentCategory
            ? "bg-primary text-white shadow-xs"
            : "bg-surface-soft hover:bg-primary-light text-sub"
        }`}
      >
        <span>جميع الكتب (المكتبة الكاملة)</span>
        <Layers className="w-4 h-4 shrink-0" />
      </button>

      {CATEGORIES.map((category) => {
        const isActive = currentCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
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
  );
}
