"use client";

import { Search, X } from "lucide-react";

interface AdminSearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function AdminSearchBar({
  searchQuery,
  setSearchQuery,
}: AdminSearchBarProps) {
  return (
    <div className="relative w-full max-w-xl" dir="rtl">
      <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-light">
        <Search className="w-4 h-4" />
      </span>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="ابحث باسم العميل أو رقم الهاتف أو رقم الطلب أو رقم الطاولة..."
        className="w-full bg-white border border-border/90 rounded-full py-3 pr-11 pl-10 text-xs sm:text-sm text-body placeholder:text-muted-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 shadow-2xs transition-all"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={() => setSearchQuery("")}
          className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-light hover:text-sub cursor-pointer"
          aria-label="مسح البحث"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}