"use client";

import { useState } from "react";
import { ShoppingBag, Check, Plus, Minus } from "lucide-react";
import { Product } from "@/src/types";
import { useCart } from "@/src/context/CartContext";

export default function AddToCartSection({ book }: { book: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isAvailable = book.quantity > 0;

  if (!isAvailable) {
    return (
      <div className="w-full py-4 text-center rounded-2xl bg-gray-100 text-gray-500 font-extrabold text-sm border border-gray-200">
        هذا الكتاب غير متوفر حالياً في المخزن
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(book, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* التحكم في الكمية */}
      <div className="flex items-center justify-between border border-gray-200 rounded-2xl px-4 py-2.5 bg-gray-50 sm:w-36">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(book.quantity, q + 1))}
          className="p-1 text-heading hover:text-primary transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>

        <span className="font-extrabold text-base text-heading">{quantity}</span>

        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="p-1 text-heading hover:text-primary transition-colors active:scale-95"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* زر إضافة إلى السلة */}
      <button
        type="button"
        onClick={handleAddToCart}
        className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-extrabold text-white transition-all shadow-xs active:scale-98 ${
          isAdded ? "bg-green-600" : "bg-primary hover:opacity-95"
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5" />
            <span>تمت الإضافة للسلة بنجاح</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5" />
            <span>إضافة إلى السلة ({book.price * quantity} ج.م)</span>
          </>
        )}
      </button>
    </div>
  );
}