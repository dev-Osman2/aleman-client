"use client";

import { Product } from "@/src/types";
import ProductForm from "./ProductForm";
import { X, BookOpen } from "lucide-react";

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (payload: Record<string, any>) => Promise<void>;
}

export default function ProductFormModal({
  isOpen,
  editingProduct,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h2 className="text-xl sm:text-2xl font-black text-heading">
                {editingProduct
                  ? "تعديل بيانات الكتاب"
                  : "إضافة كتاب جديد للمكتبة"}
              </h2>
              <p className="text-xs sm:text-sm text-muted font-medium mt-0.5">
                {editingProduct
                  ? `تعديل أسعار وبيانات: ${editingProduct.title}`
                  : "إدراج كتاب جديد في كتالوج دار الإيمان وتحديد كمية المخزون"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="w-9 h-9 rounded-full bg-surface-subtle hover:bg-surface-hover text-sub flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ProductForm
          initialData={editingProduct}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
