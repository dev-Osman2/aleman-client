"use client";

import { Plus } from "lucide-react";

interface ProductsHeaderProps {
  onAddClick: () => void;
}

export default function ProductsHeader({ onAddClick }: ProductsHeaderProps) {
  return (
    <div
      className="bg-white rounded-3xl border border-border/80 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
      dir="rtl"
    >
      <div className="text-right flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-black text-heading">
          إدارة قائمة الطعام والوجبات
        </h1>
        <p className="text-xs sm:text-sm text-muted font-medium">
          إضافة الوجبات، تحديد أحجام وأسعار كل وجبة، والتحكم الفوري في توفر
          الأصناف بالمطبخ
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="bg-primary hover:bg-primary-hover text-white font-extrabold px-5 py-3.5 rounded-2xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>إضافة وجبة جديدة</span>
      </button>
    </div>
  );
}
