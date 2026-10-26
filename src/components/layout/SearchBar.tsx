"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Product } from "@/src/types";
import { useSearchProducts } from "./search/useSearchProducts";
import SearchDropdown from "./search/SearchDropdown";

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

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;

  const { filteredProducts } = useSearchProducts(query);

  const clearCategoryFilter = useCallback(() => {
    if (typeof window === "undefined") return;
    const currentParams = new URLSearchParams(window.location.search);
    if (!currentParams.has("category")) return;
    currentParams.delete("category");
    const qs = currentParams.toString();
    const basePath = pathname || window.location.pathname || "/";
    setTimeout(() => {
      router.replace(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
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
    if (!isOpen) return;
    clearCategoryFilter();

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if ((target as HTMLElement)?.closest?.("[data-search-trigger]")) return;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) handleClose();
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose, clearCategoryFilter]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  const handleSelectProduct = (product: Product) => {
    handleClose();
    router.push(`/products/${product.code}`);
  };

  const dropdownNode = isOpen && (
    <SearchDropdown
      wrapperRef={wrapperRef}
      inputRef={inputRef}
      query={query}
      className={className}
      filteredProducts={filteredProducts}
      onInputChange={(e) => {
        setQuery(e.target.value);
        if (e.target.value.trim()) clearCategoryFilter();
      }}
      onClearQuery={() => setQuery("")}
      onSelectProduct={handleSelectProduct}
      onFocus={clearCategoryFilter}
    />
  );

  if (isControlled) return dropdownNode || null;

  return (
    <div className="relative">
      <button
        type="button"
        data-search-trigger="true"
        onClick={() => {
          const nextState = !isOpen;
          setInternalIsOpen(nextState);
          setQuery("");
          if (nextState) clearCategoryFilter();
        }}
        className={`p-2.5 rounded-xl transition cursor-pointer ${
          isOpen ? "bg-white/30" : "bg-white/20 hover:bg-white/30"
        }`}
        aria-label="Search"
      >
        <Search size={20} className="text-white" />
      </button>
      {dropdownNode}
    </div>
  );
}
