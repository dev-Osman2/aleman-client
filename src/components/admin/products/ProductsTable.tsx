/* eslint-disable @next/next/no-img-element */
"use client";

import { Product } from "@/src/types";
import { Pencil, Trash2, Hash, BookOpen, Layers, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-border/80 py-20 text-center flex flex-col items-center justify-center gap-3 shadow-2xs">
        <div className="w-16 h-16 rounded-2xl bg-surface-subtle text-muted flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-muted-light" />
        </div>
        <p className="text-heading font-black text-base">لا توجد كتب مطابقة للعرض حالياً</p>
        <p className="text-muted text-xs max-w-sm">
          لم يتم العثور على أي كتب في هذا القسم أو باستخدام كلمة البحث الحالية، يمكنك إضافة كتاب جديد للبدء.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-2xs"
      dir="rtl"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-right border-collapse">
          <thead>
            <tr className="bg-surface-soft border-b border-border/80 text-sub text-xs font-extrabold">
              <th className="py-4 px-6 w-[34%]">الكتاب والمؤلف</th>
              <th className="py-4 px-4 w-[16%]">القسم</th>
              <th className="py-4 px-4 text-center w-[16%]">السعر والخصم</th>
              <th className="py-4 px-4 text-center w-[14%]">المخزون المتوفر</th>
              <th className="py-4 px-4 text-center w-[10%]">بيانات النشر</th>
              <th className="py-4 px-6 text-left w-[10%]">الإجراءات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle">
            {products.map((product) => {
              const qty = Number(product.quantity || 0);
              const isOutOfStock = qty <= 0;
              const isLowStock = qty > 0 && qty <= 5;
              const hasDiscount = Boolean(
                product.oldPrice && product.oldPrice > product.price
              );
              const discountPercent = hasDiscount
                ? Math.round(
                    ((Number(product.oldPrice) - Number(product.price)) /
                      Number(product.oldPrice)) *
                      100
                  )
                : 0;

              return (
                <tr
                  key={product.id}
                  className={`transition-colors hover:bg-primary-light/15 ${
                    isOutOfStock ? "bg-surface-soft/40" : ""
                  }`}
                >
                  {/* الغلاف + العنوان + الكود + المؤلف */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={
                            product.image ||
                            "https://placehold.co/100x140/f1f5f9/0f172a?text=كتاب"
                          }
                          alt={product.title}
                          className="w-14 h-20 rounded-xl object-cover border border-border/80 shadow-xs bg-surface-subtle"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/100x140/f1f5f9/0f172a?text=كتاب";
                          }}
                        />
                        {hasDiscount && (
                          <span className="absolute -top-1.5 -right-1.5 bg-danger text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                            %{discountPercent}-
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-extrabold text-primary bg-primary-light px-2 py-0.5 rounded-md border border-primary/20 shrink-0">
                            <Hash className="w-3 h-3" />
                            <span>{product.code}</span>
                          </span>
                        </div>

                        <h3 className="font-black text-heading text-sm sm:text-base truncate leading-snug">
                          {product.title}
                        </h3>

                        <p className="text-xs text-muted font-medium truncate">
                          {product.author ? `المؤلف: ${product.author}` : "المؤلف: غير محدد"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* القسم */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-surface-subtle text-sub border border-border">
                      <Layers className="w-3 h-3 text-primary" />
                      <span>{product.category}</span>
                    </span>
                  </td>

                  {/* السعر والخصم */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm sm:text-base font-black text-heading">
                        {Number(product.price).toFixed(2)} ج.م
                      </span>
                      {product.oldPrice ? (
                        <span className="text-xs text-muted-light line-through font-semibold">
                          {Number(product.oldPrice).toFixed(2)} ج.م
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* المخزون */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-danger bg-danger-light px-3 py-1 rounded-full border border-danger-border">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>نفد من المخزن</span>
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-warning bg-warning-light px-3 py-1 rounded-full border border-warning-border">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>متبقي {qty} نسخ</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-success bg-success-light px-3 py-1 rounded-full border border-success-border">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>متوفر ({qty})</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* بيانات النشر */}
                  <td className="py-4 px-4 text-center">
                    <div className="text-xs text-muted flex flex-col items-center gap-0.5">
                      <span className="font-semibold truncate max-w-[110px]" title={product.publisher || ""}>
                        {product.publisher || "—"}
                      </span>
                      {product.pagesCount && (
                        <span className="text-[11px] text-muted-light font-mono">
                          {product.pagesCount} ص
                        </span>
                      )}
                    </div>
                  </td>

                  {/* الإجراءات */}
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="w-9 h-9 rounded-xl bg-primary-light hover:bg-primary-subtle text-primary flex items-center justify-center transition cursor-pointer shadow-2xs"
                        title="تعديل بيانات وسعر الكتاب"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        className="w-9 h-9 rounded-xl bg-danger-light hover:bg-danger-light text-danger flex items-center justify-center transition cursor-pointer shadow-2xs"
                        title="حذف الكتاب من المكتبة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
