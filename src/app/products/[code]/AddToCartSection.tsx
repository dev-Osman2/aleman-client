"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCart } from "@/src/context/CartContext";
import { ShoppingBag, Check, Plus, Minus } from "lucide-react";

interface AddToCartProps {
  book: {
    id: string;
    code: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
  };
}

export default function AddToCartSection({ book }: AddToCartProps) {
  const price = Number.isFinite(Number(book.price)) ? Number(book.price) : 0;
  const availableQuantity = Number.isFinite(Number(book.quantity))
    ? Math.max(0, Number(book.quantity))
    : 0;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const resetAddedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    return () => {
      if (resetAddedTimer.current) {
        clearTimeout(resetAddedTimer.current);
      }
    };
  }, []);

  const handleIncrement = () => {
    if (quantity < availableQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (availableQuantity <= 0) return;

    addToCart(
      {
        id: book.id,
        code: book.code,
        title: book.title,
        description: "",
        fullDescription: null,
        price,
        oldPrice: null,
        quantity: availableQuantity,
        category: "",
        image: book.image,
        author: null,
        publisher: null,
        pagesCount: null,
        createdAt: "",
      },
      quantity,
    );

    setAdded(true);
    if (resetAddedTimer.current) {
      clearTimeout(resetAddedTimer.current);
    }
    resetAddedTimer.current = setTimeout(() => {
      setAdded(false);
      resetAddedTimer.current = null;
    }, 1500);
  };

  const isOutOfStock = availableQuantity <= 0;

  return (
  <div className="flex flex-row items-center gap-2.5 sm:gap-3.5 w-full max-w-full sm:max-w-md lg:max-w-lg pt-4">
    {/* زر الإضافة إلى السلة */}
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isOutOfStock || added}
      className={`flex-1 flex items-center justify-center gap-2 h-11 sm:h-12 lg:h-13 px-3 sm:px-6 rounded-xl font-bold text-white transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer whitespace-nowrap ${
        isOutOfStock
          ? "bg-muted/40 text-muted cursor-not-allowed shadow-none"
          : added
            ? "bg-success hover:bg-success-hover shadow-success/20 shadow-md"
            : "bg-primary hover:bg-primary-hover shadow-primary/25 shadow-md"
      }`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-xs sm:text-sm lg:text-base">تمت الإضافة بنجاح!</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-xs sm:text-sm lg:text-base">
            {isOutOfStock ? "نفد من المخزون" : "أضف إلى السلة"}
          </span>
        </>
      )}
    </button>

    {/* محدد الكمية */}
    <div className="flex items-center justify-between border border-border bg-surface-soft rounded-xl px-1.5 sm:px-2.5 h-11 sm:h-12 lg:h-13 min-w-[105px] sm:min-w-[125px] lg:min-w-[140px] shrink-0 shadow-sm">
      <button
        type="button"
        onClick={handleIncrement}
        disabled={isOutOfStock || quantity >= availableQuantity}
        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover text-heading active:scale-95 disabled:opacity-25 transition-all cursor-pointer"
        aria-label="زيادة الكمية"
      >
        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      <span className="font-bold text-heading text-sm sm:text-base lg:text-lg px-1 sm:px-2 select-none tabular-nums">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleDecrement}
        disabled={isOutOfStock || quantity <= 1}
        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-surface-hover text-heading active:scale-95 disabled:opacity-25 transition-all cursor-pointer"
        aria-label="تقليل الكمية"
      >
        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  </div>
);
}
