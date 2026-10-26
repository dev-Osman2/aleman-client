/* eslint-disable @next/next/no-img-element */ import { Product } from "@/src/types";
import { Pencil, Trash2, Hash, Layers } from "lucide-react";
import ProductStockBadge from "./ProductStockBadge";

interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductTableRow({
  product,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const qty = Number(product.quantity || 0);
  const isOutOfStock = qty <= 0;
  const hasDiscount = Boolean(
    product.oldPrice && product.oldPrice > product.price,
  );
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.oldPrice) - Number(product.price)) /
          Number(product.oldPrice)) *
          100,
      )
    : 0;

  return (
    <tr
      className={`transition-colors hover:bg-primary-light/15 ${
        isOutOfStock ? "bg-surface-soft/40" : ""
      }`}
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={
                product.image ||
                "https://placehold.co/100x140/f1f5f9/0f172a?text=?"
              }
              alt={product.title}
              className="w-14 h-20 rounded-xl object-cover border border-border/80 shadow-xs bg-surface-subtle"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/100x140/f1f5f9/0f172a?text=?";
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

            <h3
              className="font-black text-heading text-sm sm:text-base truncate leading-snug"
              title={product.title}
            >
              {product.title}
            </h3>

            {product.publisher && (
              <span className="text-[11px] text-muted-light font-medium truncate">
                دار النشر: {product.publisher}
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="py-4 px-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-surface-subtle text-sub border border-border">
          <Layers className="w-3 h-3 text-primary" />
          <span>{product.category}</span>
        </span>
      </td>

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

      <td className="py-4 px-4 text-center">
        <div className="inline-flex flex-col items-center gap-1">
          <ProductStockBadge quantity={qty} />
        </div>
      </td>

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
}
