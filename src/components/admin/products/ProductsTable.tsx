"use client";

import { Product } from "@/src/types";
import { Pencil, Trash2 } from "lucide-react";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleAvailability: (product: Product) => void;
  togglingId?: string | null;
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  onToggleAvailability,
  togglingId,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-border/80 py-16 text-center text-muted-light font-bold text-sm">
        لا توجد وجبات مطابقة للعرض في هذا القسم حالياً.
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-2xs"
      dir="rtl"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-right border-collapse">
          <thead>
            <tr className="bg-primary-light border-b border-primary-light/80 text-sub text-xs sm:text-sm font-extrabold">
              <th className="py-4 px-6 w-[36%]">الوجبة</th>
              <th className="py-4 px-4 text-center w-[34%]">الأحجام والأسعار</th>
              <th className="py-4 px-4 text-center w-[16%]">حالة التوفر</th>
              <th className="py-4 px-6 text-left w-[14%]">الإجراءات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle">
            {products.map((product) => {
              const isAvailable = product.isActive !== false;
              const isToggling = togglingId === product._id;
              const hasSizes =
                Array.isArray(product.sizes) && product.sizes.length > 0;

              return (
                <tr
                  key={product._id}
                  className={`transition-colors hover:bg-primary-light/20 ${
                    !isAvailable ? "bg-surface-soft/60" : ""
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          product.image ||
                          "https://placehold.co/120x90/fff7ed/D55304?text=?"
                        }
                        alt={product.name}
                        className="w-20 h-14 sm:w-24 sm:h-16 rounded-2xl object-cover border border-border/80 shrink-0 bg-primary-light/50 shadow-2xs"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/120x90/fff7ed/D55304?text=?";
                        }}
                      />
                      <div className="min-w-0 flex flex-col gap-1">
                        <h3 className="font-black text-heading text-sm sm:text-base truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-light font-medium line-clamp-1">
                          {product.description || product.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center">
                      {hasSizes ? (
                        <div className="flex items-center gap-2.5 w-max">
                          {(["صغير", "وسط", "كبير"] as const).map(
                            (sizeName) => {
                              const sz = product.sizes?.find(
                                (s) => s.name?.trim() === sizeName,
                              );

                              if (!sz) {
                                return (
                                  <div key={sizeName} className="w-[88px]" />
                                );
                              }

                              return (
                                <div
                                  key={sizeName}
                                  className="bg-primary-light/90 border border-primary-light rounded-2xl px-3 py-2 text-center w-[88px]"
                                >
                                  <span className="block text-[11px] font-bold text-muted mb-0.5">
                                    {sz.name}
                                  </span>
                                  <span className="block text-xs sm:text-sm font-black text-heading">
                                    {Number(sz.price).toFixed(2)} ج
                                  </span>

                                  {sizeName === "صغير" && product.oldPrice ? (
                                    <span className="block text-[10px] text-muted-light line-through">
                                      {Number(product.oldPrice).toFixed(2)} ج
                                    </span>
                                  ) : null}
                                </div>
                              );
                            },
                          )}
                        </div>
                      ) : (
                        <div className="bg-primary-light/90 border border-primary-light rounded-2xl px-4 py-2 text-center min-w-[95px]">
                          <span className="block text-[11px] font-bold text-muted mb-0.5">
                            عادي
                          </span>
                          <span className="block text-xs sm:text-sm font-black text-heading">
                            {Number(product.price).toFixed(2)} ج
                          </span>
                          {product.oldPrice ? (
                            <span className="block text-[10px] text-muted-light line-through">
                              {Number(product.oldPrice).toFixed(2)} ج
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center justify-center gap-2.5">
                      <button
                        type="button"
                        disabled={isToggling}
                        onClick={() => onToggleAvailability(product)}
                        className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer disabled:opacity-50 ${
                          isAvailable ? "bg-success" : "bg-warning"
                        }`}
                        title={
                          isAvailable
                            ? "اضغط لإيقاف الوجبة مؤقتاً"
                            : "اضغط لتفعيل الوجبة"
                        }
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-all ${
                            isAvailable ? "left-0.5" : "right-0.5"
                          }`}
                        />
                      </button>

                      <span
                        className={`text-xs font-extrabold min-w-[65px] text-right ${
                          isAvailable ? "text-success" : "text-warning"
                        }`}
                      >
                        {isAvailable ? "متوفر للطلب" : "نفد مؤقتاً"}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="w-9 h-9 rounded-xl bg-primary-light hover:bg-primary-subtle text-primary flex items-center justify-center transition cursor-pointer"
                        title="تعديل الوجبة"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(product._id)}
                        className="w-9 h-9 rounded-xl bg-danger-light hover:bg-danger-light text-danger flex items-center justify-center transition cursor-pointer"
                        title="حذف الوجبة"
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
