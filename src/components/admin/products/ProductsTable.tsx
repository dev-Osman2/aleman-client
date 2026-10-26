"use client";

import { Product } from "@/src/types";
import ProductsTableEmptyState from "./ProductsTableEmptyState";
import ProductTableRow from "./ProductTableRow";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  stockFilter?: "all" | "out_of_stock" | "low_stock";
  onResetStockFilter?: () => void;
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  stockFilter = "all",
  onResetStockFilter,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <ProductsTableEmptyState
        stockFilter={stockFilter}
        onResetStockFilter={onResetStockFilter}
      />
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
              <th className="py-4 px-6 w-[32%]">الكتاب</th>
              <th className="py-4 px-4 w-[15%]">القسم</th>
              <th className="py-4 px-4 text-center w-[13%]">السعر والخصم</th>
              <th className="py-4 px-4 text-center w-[12%]">المخزون المتوفر</th>
              <th className="py-4 px-6 text-left w-[10%]">الإجراءات</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle">
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
