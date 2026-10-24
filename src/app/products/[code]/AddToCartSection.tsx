'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/src/context/CartContext';
import { ShoppingBag, Check, Plus, Minus } from 'lucide-react';

interface AddToCartProps {
  book: {
    id: string;
    code: string;
    title: string;
    price: number;
    image: string;
    quantity: number; // المخزون المتاح
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
      quantity
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
    <div className="flex flex-row items-center gap-3 w-full max-w-md pt-4">
      {/* زر الإضافة إلى السلة */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || added}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white transition-all shadow-md active:scale-95 ${
          isOutOfStock
            ? 'bg-gray-400 cursor-not-allowed'
            : added
            ? 'bg-emerald-600'
            : 'bg-teal-600 hover:bg-teal-700'
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            <span>تمت الإضافة بنجاح!</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            <span>
              {isOutOfStock
                ? 'نفد من المخزون'
                : `إضافة إلى السلة (${price * quantity} ج.م)`}
            </span>
          </>
        )}
      </button>

      {/* عداد الكمية */}
      <div className="flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl px-2 py-1.5 min-w-[120px]">
        <button
          type="button"
          onClick={handleIncrement}
          disabled={isOutOfStock || quantity >= availableQuantity}
          className="p-1 rounded-lg hover:bg-white text-gray-700 disabled:opacity-30 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
        <span className="font-bold text-gray-800 text-lg px-2 select-none">
          {quantity}
        </span>
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isOutOfStock || quantity <= 1}
          className="p-1 rounded-lg hover:bg-white text-gray-700 disabled:opacity-30 transition"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}