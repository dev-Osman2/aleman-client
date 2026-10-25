/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Product } from "@/src/types";

function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase("ar")
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .trim();
}

interface SearchBarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function SearchBar({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  className,
}: SearchBarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const clearCategoryFilter = useCallback(() => {
    if (typeof window === "undefined") return;

    const currentParams = new URLSearchParams(window.location.search);
    if (!currentParams.has("category")) return;

    currentParams.delete("category");
    const qs = currentParams.toString();
    const basePath = pathname || window.location.pathname || "/";
    const targetUrl = qs ? `${basePath}?${qs}` : basePath;

    // نستخدم setTimeout لضمان انتهاء دورة الرندر الحالية في React قبل تحديث الراوتر
    setTimeout(() => {
      router.replace(targetUrl, { scroll: false });
    }, 0);
  }, [router, pathname]);

  const handleClose = useCallback(() => {
    if (isControlled) {
      externalOnClose?.();
    } else {
      setInternalIsOpen(false);
    }
    setQuery("");
  }, [isControlled, externalOnClose]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/products`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.products)
            ? data.products
            : [];
          setProducts(list);
        }
      } catch (err) {
        console.error("Failed to load products in SearchBar:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // إلغاء تحديد القسم عند بدء/فتح البحث ليتمكن المستخدم من الوصول لجميع المنتجات
    clearCategoryFilter();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isTrigger = (target as HTMLElement)?.closest?.("[data-search-trigger]");
      if (isTrigger) return;

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target)
      ) {
        handleClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose, clearCategoryFilter]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      clearCategoryFilter();
    }
  };

  const filteredProducts = query.trim()
    ? products
        .filter((item) => {
          const q = normalizeSearchText(query);
          const matchTitle = normalizeSearchText(item.title || "").includes(q);
          const matchAuthor = normalizeSearchText(item.author || "").includes(q);
          const matchCategory = normalizeSearchText(item.category || "").includes(q);
          return matchTitle || matchAuthor || matchCategory;
        })
        .slice(0, 6)
    : [];

  const handleSelectProduct = (product: Product) => {
    handleClose();
    router.push(`/products/${product.code}`);
  };

  const searchDropdown = isOpen && (
    <div
      ref={wrapperRef}
      dir="rtl"
      className={
        className ||
        "absolute top-full left-[-48px] sm:left-0 mt-2 z-50 w-[calc(100vw-1.5rem)] sm:w-80 md:w-96 max-w-sm rounded-2xl bg-white p-2.5 sm:p-3 text-body shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150"
      }
    >
      {/* حقل البحث الدائري (Pill) بألوان الموقع المتناسقة */}
      <div className="relative flex items-center border-2 border-primary rounded-full px-3.5 py-1.5 sm:py-2 bg-white transition-all focus-within:ring-2 focus-within:ring-primary/20 shadow-2xs">
        <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-primary shrink-0 ml-2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={clearCategoryFilter}
          onKeyDown={(e) => {
            if (e.key === "Enter" && filteredProducts.length > 0) {
              e.preventDefault();
              handleSelectProduct(filteredProducts[0]);
            }
          }}
          placeholder="ابحث عن منتج..."
          className="w-full text-right text-xs sm:text-sm text-heading placeholder:text-muted/60 outline-none bg-transparent font-medium"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="p-1 text-muted hover:text-heading transition-colors cursor-pointer mr-1"
            aria-label="مسح البحث"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* قائمة المنتجات المطابقة للبحث */}
      {filteredProducts.length > 0 && (
        <div className="mt-2.5 flex flex-col gap-1 divide-y divide-border-subtle max-h-72 overflow-y-auto custom-scrollbar pt-1">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => handleSelectProduct(product)}
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
      )}

      {query.trim() && filteredProducts.length === 0 && (
        <p className="text-center text-xs text-muted py-4 font-medium">
          لا توجد نتائج مطابقة لهذا البحث
        </p>
      )}
    </div>
  );

  if (isControlled) {
    if (!isOpen) return null;
    return searchDropdown;
  }

  return (
    <div className="relative">
      <button
        type="button"
        data-search-trigger="true"
        onClick={() => {
          const nextState = !isOpen;
          setInternalIsOpen(nextState);
          setQuery("");
          if (nextState) {
            clearCategoryFilter();
          }
        }}
        className={`p-2.5 rounded-xl transition cursor-pointer ${
          isOpen ? "bg-white/30" : "bg-white/20 hover:bg-white/30"
        }`}
        aria-label="Search"
      >
        <Search size={20} className="text-white" />
      </button>

      {searchDropdown}
    </div>
  );
}
