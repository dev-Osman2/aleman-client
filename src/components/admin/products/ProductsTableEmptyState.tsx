import { BookOpen, CheckCircle2 } from "lucide-react";

interface ProductsTableEmptyStateProps {
  stockFilter?: "all" | "out_of_stock" | "low_stock";
  onResetStockFilter?: () => void;
}

export default function ProductsTableEmptyState({
  stockFilter = "all",
  onResetStockFilter,
}: ProductsTableEmptyStateProps) {
  const isOutOfStockFilter = stockFilter === "out_of_stock";
  const isLowStockFilter = stockFilter === "low_stock";

  return (
    <div
      className="bg-white rounded-3xl border border-border/80 py-20 text-center flex flex-col items-center justify-center gap-3 shadow-2xs"
      dir="rtl"
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
          isOutOfStockFilter || isLowStockFilter
            ? "bg-success-light text-success"
            : "bg-surface-subtle text-muted"
        }`}
      >
        {isOutOfStockFilter || isLowStockFilter ? (
          <CheckCircle2 className="w-8 h-8 text-success" />
        ) : (
          <BookOpen className="w-8 h-8 text-muted-light" />
        )}
      </div>
      <p className="text-heading font-black text-base">
        {isOutOfStockFilter
          ? "رائع! لا توجد أي كتب نفدت من المخزون حالياً"
          : isLowStockFilter
            ? "المخزون بحالة جيدة، لا توجد كتب قاربت على الانتهاء"
            : "لا توجد كتب مطابقة للعرض حالياً"}
      </p>
      <p className="text-muted text-xs max-w-sm">
        {isOutOfStockFilter
          ? "جميع الكتب في المكتبة متوفرة ولديها رصيد بالمخزن."
          : isLowStockFilter
            ? "جميع الكتب المتوفرة رصيدها أعلى من 5 نسخ بالمخزن."
            : "لم يتم العثور على أي كتب في هذا القسم أو باستخدام كلمة البحث الحالية، يمكنك إضافة كتاب جديد للبدء."}
      </p>
      {stockFilter !== "all" && onResetStockFilter && (
        <button
          type="button"
          onClick={onResetStockFilter}
          className="mt-2 px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary-hover transition cursor-pointer shadow-xs"
        >
          عرض جميع الكتب بالمخزن
        </button>
      )}
    </div>
  );
}
