/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Product } from "@/src/types";

interface SearchResultsListProps {
  products: Product[];
  query: string;
  onSelectProduct: (product: Product) => void;
}

export default function SearchResultsList({
  products,
  query,
  onSelectProduct,
}: SearchResultsListProps) {
  if (products.length > 0) {
    return (
      <div className="mt-2.5 flex flex-col gap-1 divide-y divide-border-subtle max-h-72 overflow-y-auto custom-scrollbar pt-1">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onSelectProduct(product)}
            className="w-full text-right flex items-center gap-2.5 p-2 rounded-xl hover:bg-primary-light transition-colors group cursor-pointer"
          >
            <div className="relative w-9 h-12 rounded-md overflow-hidden bg-gray-50 border border-border-subtle shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain p-0.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/72x96/f0fdfa/0fa396?text=؟";
                }}
              />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-xs sm:text-sm font-bold text-heading group-hover:text-primary truncate transition-colors">
                {product.title}
              </p>
              {product.author && (
                <span className="text-[11px] text-muted truncate block">
                  {product.author}
                </span>
              )}
              <span className="text-xs font-black text-primary block mt-0.5">
                {product.price} ج.م
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  }

  if (query.trim()) {
    return (
      <p className="text-center text-xs text-muted py-4 font-medium">
        لا توجد نتائج مطابقة لهذا البحث
      </p>
    );
  }

  return null;
}
