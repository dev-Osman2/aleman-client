import React from "react";
import { PackageX, AlertTriangle, X } from "lucide-react";

interface ProductsStockFilterBarProps {
  totalCount: number;
  outOfStockCount: number;
  lowStockCount: number;
  stockFilter: "all" | "out_of_stock" | "low_stock";
  onStockFilterChange: (filter: "all" | "out_of_stock" | "low_stock") => void;
}

export default function ProductsStockFilterBar({
  totalCount,
  outOfStockCount,
  lowStockCount,
  stockFilter,
  onStockFilterChange,
}: ProductsStockFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-border/80 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-muted ml-1">
          تصفية المخزون السريعة:
        </span>

        <button
          type="button"
          onClick={() => onStockFilterChange("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            stockFilter === "all"
              ? "bg-heading text-white shadow-2xs"
              : "bg-surface-subtle text-sub hover:text-heading hover:bg-surface-hover"
          }`}
        >
          عرض الكل ({totalCount})
        </button>

        <button
          type="button"
          onClick={() =>
            onStockFilterChange(
              stockFilter === "out_of_stock" ? "all" : "out_of_stock",
            )
          }
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
            stockFilter === "out_of_stock"
              ? "bg-danger text-white border-danger shadow-xs shadow-danger/25"
              : "bg-white text-sub border-border/80 hover:border-danger/40 hover:text-danger"
          }`}
        >
          <PackageX className="w-4 h-4 shrink-0" />
          <span>نفدت من المخزون</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[11px] font-black font-mono ${
              stockFilter === "out_of_stock"
                ? "bg-white text-danger"
                : "bg-danger-light text-danger"
            }`}
          >
            {outOfStockCount}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              stockFilter === "out_of_stock"
                ? "bg-white animate-ping"
                : "bg-gray-300"
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() =>
            onStockFilterChange(
              stockFilter === "low_stock" ? "all" : "low_stock",
            )
          }
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
            stockFilter === "low_stock"
              ? "bg-warning text-white border-warning shadow-xs shadow-warning/25"
              : "bg-white text-sub border-border/80 hover:border-warning/40 hover:text-warning"
          }`}
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>قاربت على الإنتهاء</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[11px] font-black font-mono ${
              stockFilter === "low_stock"
                ? "bg-white text-warning"
                : "bg-warning-light text-warning"
            }`}
          >
            {lowStockCount}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              stockFilter === "low_stock"
                ? "bg-white animate-ping"
                : "bg-gray-300"
            }`}
          />
        </button>
      </div>

      {stockFilter !== "all" && (
        <button
          type="button"
          onClick={() => onStockFilterChange("all")}
          className="inline-flex items-center gap-1.5 text-xs font-black text-muted hover:text-danger transition cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>إلغاء التصفية وعرض جميع الكتب</span>
        </button>
      )}
    </div>
  );
}
