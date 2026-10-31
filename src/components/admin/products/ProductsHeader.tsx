"use client";

import { useRef } from "react";
import { Plus, BookPlus, Download, Upload, Loader2 } from "lucide-react";

interface ProductsHeaderProps {
  onAddClick: () => void;
  onExportClick: () => void;
  onFileSelect: (file: File) => void;
  isExporting?: boolean;
}

export default function ProductsHeader({
  onAddClick,
  onExportClick,
  onFileSelect,
  isExporting = false,
}: ProductsHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      // تصفير القيمة حتى يمكن اختيار نفس الملف مجدداً إذا رغب المستخدم
      e.target.value = "";
    }
  };

  return (
    <div
      className="bg-white rounded-3xl border border-border/80 p-6 sm:p-7 flex flex-col xl:flex-row xl:items-center justify-between gap-5 shadow-xs"
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
          إضافة الكتب الجديدة، تحديد الأسعار والكميات المتاحة في المخزن، وإدارة
          بيانات النشر والتأليف
        </p>
      </div>

      {/* Buttons Group */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          disabled={isExporting}
          onClick={onExportClick}
          className="bg-primary hover:bg-primary-hover disabled:opacity-70 text-white font-extrabold px-5 py-3.5 rounded-2xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0"
          title="تصدير جميع الكتب إلى ملف Excel (.xlsx)"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
          ) : (
            <Download className="w-4 h-4 stroke-[2.5]" />
          )}
          <span>تنزيل الكتب</span>
        </button>

        {/* رفع الكتب Excel */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary hover:bg-primary-hover text-white font-extrabold px-5 py-3.5 rounded-2xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0"
          title="رفع واستيراد الكتب من ملف Excel (.xlsx)"
        >
          <Upload className="w-4 h-4 stroke-[2.5]" />
          <span>رفع الكتب</span>
        </button>

        {/* مدخل ملف Excel المخفي */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={handleFileInputChange}
        />
        <button
          type="button"
          onClick={onAddClick}
          className="bg-primary hover:bg-primary-hover text-white font-extrabold px-5 py-3.5 rounded-2xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>إضافة كتاب جديد للمكتبة</span>
        </button>
      </div>
    </div>
  );
}
