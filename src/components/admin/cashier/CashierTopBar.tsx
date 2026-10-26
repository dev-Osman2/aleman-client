"use client";

import React from "react";
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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          className="w-full bg-white border border-border/90 rounded-2xl py-2.5 pr-10 pl-4 text-xs sm:text-sm text-body focus:outline-none focus:border-primary transition"
        />
      </div>
    </div>
  );
}
