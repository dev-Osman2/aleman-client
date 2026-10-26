import React, { RefObject } from "react";
import { Search, X } from "lucide-react";
import { Product } from "@/src/types";
import SearchResultsList from "./SearchResultsList";

interface SearchDropdownProps {
  wrapperRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  className?: string;
  filteredProducts: Product[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearQuery: () => void;
  onSelectProduct: (p: Product) => void;
  onFocus: () => void;
}

export default function SearchDropdown({
  wrapperRef,
  inputRef,
  query,
  className,
  filteredProducts,
  onInputChange,
  onClearQuery,
  onSelectProduct,
  onFocus,
}: SearchDropdownProps) {
  return (
    <div
      ref={wrapperRef}
      dir="rtl"
      className={
        className ||
        "absolute top-full left-[-48px] sm:left-0 mt-2 z-50 w-[calc(100vw-1.5rem)] sm:w-80 md:w-96 max-w-sm rounded-2xl bg-white p-2.5 sm:p-3 text-body shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150"
      }
    >
      <div className="relative flex items-center border-2 border-primary rounded-full px-3.5 py-1.5 sm:py-2 bg-white transition-all focus-within:ring-2 focus-within:ring-primary/20 shadow-2xs">
        <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary shrink-0 ml-2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={onInputChange}
          onFocus={onFocus}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filteredProducts.length > 0) {
              e.preventDefault();
              onSelectProduct(filteredProducts[0]);
            }
          }}
          placeholder="ابحث عن منتج..."
          className="w-full text-right text-xs sm:text-sm text-heading placeholder:text-muted/60 outline-none bg-transparent font-medium"
        />
        {query && (
          <button
            type="button"
            onClick={onClearQuery}
            className="p-1 text-muted hover:text-heading transition-colors cursor-pointer mr-1"
            aria-label="مسح البحث"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <SearchResultsList
        products={filteredProducts}
        query={query}
        onSelectProduct={onSelectProduct}
      />
    </div>
  );
}
