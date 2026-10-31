"use client";
import { Search } from "lucide-react";
import CashierCategoryBar from "./CashierCategoryBar";

interface CashierTopBarProps {
  currentCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export default function CashierTopBar({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: CashierTopBarProps) {
  return (
    <div className="sticky top-[72px] z-10 my-3 bg-white/95 backdrop-blur-md border border-border/60 rounded-2xl p-2.5 sm:p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
      <div className="flex-1 min-w-0">
        <CashierCategoryBar
          currentCategory={currentCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>

      <div className="relative w-full sm:w-72 shrink-0">
        <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="بحث سريع بالعنوان أو الكود..."
          className="w-full bg-white border border-border/90 rounded-xl py-2 pr-10 pl-4 text-xs sm:text-sm text-body focus:outline-none focus:border-primary transition"
        />
      </div>
    </div>
  );
}