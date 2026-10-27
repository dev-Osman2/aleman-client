"use client";

import Link from "next/link";
import { CATEGORIES, getCategoryLabel } from "@/src/constants/categories";

interface HomeCategoryBarProps {
  currentCategory: string | null;
}

export default function HomeCategoryBar({ currentCategory }: HomeCategoryBarProps) {
  return (
    <div className="mb-6 overflow-x-auto no-scrollbar py-2" dir="rtl">
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className={`shrink-0 px-4 py-2 rounded-2xl text-xs md:text-sm font-extrabold transition-all duration-150 ${
            currentCategory === "latest"
              ? "bg-primary text-white shadow-xs"
              : "bg-white text-heading border border-border-subtle hover:bg-gray-50"
          }`}
        >
          أحدث الكتب
        </Link>

        <Link
          href="/?category=all"
          className={`shrink-0 px-4 py-2 rounded-2xl text-xs md:text-sm font-extrabold transition-all duration-150 ${
            currentCategory === "all"
              ? "bg-primary text-white shadow-xs"
              : "bg-white text-heading border border-border-subtle hover:bg-gray-50"
          }`}
        >
          جميع الكتب
        </Link>

        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat;
          return (
            <Link
              key={cat}
              href={`/?category=${cat}`}
              className={`shrink-0 px-4 py-2 rounded-2xl text-xs md:text-sm font-extrabold transition-all duration-150 ${
                isActive
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-heading border border-border-subtle hover:bg-gray-50"
              }`}
            >
              {getCategoryLabel(cat)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}