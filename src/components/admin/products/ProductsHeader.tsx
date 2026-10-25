"use client";

import { Plus, BookPlus } from "lucide-react";

interface ProductsHeaderProps {
  onAddClick: () => void;
}

export default function ProductsHeader({ onAddClick }: ProductsHeaderProps) {
  return (
    <div
      className="bg-white rounded-3xl border border-border/80 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
      dir="rtl"
    >
      <div className="text-right flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
            <BookPlus className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-heading">
            إدارة مكتبة الكتب والمخزون
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted font-medium">
          إضافة الكتب الجديدة، تحديد الأسعار والكميات المتاحة في المخزن، وإدارة بيانات النشر والتأليف
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="bg-primary hover:bg-primary-hover text-white font-extrabold px-5 py-3.5 rounded-2xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>إضافة كتاب جديد للمكتبة</span>
      </button>
    </div>
  );
}
