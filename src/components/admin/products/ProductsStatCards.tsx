import { BookOpen, Boxes, AlertTriangle, PackageX } from "lucide-react";

interface ProductsStatCardsProps {
  stats: {
    totalTitles: number;
    totalStock: number;
    lowStock: number;
    outOfStock: number;
  };
  stockFilter: "all" | "out_of_stock" | "low_stock";
  onStockFilterChange: (filter: "all" | "out_of_stock" | "low_stock") => void;
}

export default function ProductsStatCards({
  stats,
  stockFilter,
  onStockFilterChange,
}: ProductsStatCardsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        type="button"
        onClick={() => onStockFilterChange("all")}
        className={`w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] bg-white rounded-2xl border p-5 flex items-center justify-between text-right transition-all cursor-pointer shadow-2xs ${
          stockFilter === "all"
            ? "border-primary/50 ring-2 ring-primary/20"
            : "border-border/80 hover:border-primary/40"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted">
              إجمالي عناوين الكتب
            </span>
            <p className="text-2xl font-black text-heading mt-0.5">
              {stats.totalTitles}{" "}
              <span className="text-xs font-semibold text-muted">عنوان</span>
            </p>
          </div>
        </div>
      </button>

      <div className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-success-light text-success flex items-center justify-center shrink-0">
          <Boxes className="w-6 h-6" />
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-muted">
            إجمالي النسخ بالمخزن
          </span>
          <p className="text-2xl font-black text-heading mt-0.5">
            {stats.totalStock}{" "}
            <span className="text-xs font-semibold text-muted">نسخة</span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          onStockFilterChange(stockFilter === "low_stock" ? "all" : "low_stock")
        }
        className={`w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] bg-white rounded-2xl border p-5 flex items-center justify-between text-right transition-all cursor-pointer shadow-2xs ${
          stockFilter === "low_stock"
            ? "border-warning ring-2 ring-warning/30 bg-warning-light/15"
            : "border-border/80 hover:border-warning/40"
        }`}
        title="اضغط لتصفية الكتب التي قاربت على الانتهاء"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-warning-light text-warning flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-muted">
                كتب قاربت على الإنتهاء
              </span>
              {stockFilter === "low_stock" && (
                <span className="text-[10px] bg-warning text-white font-extrabold px-1.5 py-0.5 rounded-full">
                  مُفعّل
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-heading mt-0.5">
              {stats.lowStock}{" "}
              <span className="text-xs font-semibold text-muted">كتاب</span>
            </p>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() =>
          onStockFilterChange(
            stockFilter === "out_of_stock" ? "all" : "out_of_stock",
          )
        }
        className={`w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] bg-white rounded-2xl border p-5 flex items-center justify-between text-right transition-all cursor-pointer shadow-2xs ${
          stockFilter === "out_of_stock"
            ? "border-danger ring-2 ring-danger/30 bg-danger-light/15"
            : "border-border/80 hover:border-danger/40"
        }`}
        title="اضغط لتصفية الكتب التي نفذت من المخزون"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-danger-light text-danger flex items-center justify-center shrink-0">
            <PackageX className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-muted">
                كتب نفدت من المخزون
              </span>
              {stockFilter === "out_of_stock" && (
                <span className="text-[10px] bg-danger text-white font-extrabold px-1.5 py-0.5 rounded-full">
                  مُفعّل
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-heading mt-0.5">
              {stats.outOfStock}{" "}
              <span className="text-xs font-semibold text-muted">كتاب</span>
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
