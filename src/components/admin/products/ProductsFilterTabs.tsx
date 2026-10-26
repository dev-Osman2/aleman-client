import React from "react";
import { CATEGORY_TABS } from "@/src/constants/categories";
import { Search, RefreshCw } from "lucide-react";

interface ProductsFilterTabsProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading: boolean;
  onRefresh: () => void;
}

export default function ProductsFilterTabs({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  loading,
  onRefresh,
}: ProductsFilterTabsProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-white text-sub border-border/90 hover:border-primary/40 hover:text-primary"
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0">
        <div className="relative w-full lg:w-72 shrink-0">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالعنوان، الكود، أو المؤلف..."
            className="w-full bg-white border border-border/90 rounded-2xl py-2.5 pr-10 pl-4 text-xs sm:text-sm text-body focus:outline-none focus:border-primary transition"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          title="تحديث قائمة المخزون الآن"
          className="md:inline-flex hidden items-center gap-2 px-4 py-2.5 bg-white border border-border/90 
                   hover:border-primary hover:text-primary rounded-2xl text-xs sm:text-sm font-extrabold text-sub 
                    transition cursor-pointer shadow-2xs shrink-0"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`}
          />
          <span className="hidden sm:inline">تحديث المخزون</span>
        </button>
      </div>
    </div>
  );
}
