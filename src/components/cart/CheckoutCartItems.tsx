/* eslint-disable @next/next/no-img-element */ import {
  Plus,
  Minus,
  BookOpen,
} from "lucide-react";
import { CartItem } from "@/src/types";

interface CheckoutCartItemsProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
}

export default function CheckoutCartItems({
  cart,
  onUpdateQuantity,
}: CheckoutCartItemsProps) {
  if (cart.length === 0) {
    return (
      <div className="text-center py-8 text-muted text-sm font-medium shrink-0">
        سلة الكتب فارغة حالياً، اختر كتبك المفضلة وأضفها للسلة.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 shrink-0">
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-3 bg-gray-50 p-2.5 sm:p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors shrink-0"
        >
          <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-white border border-gray-200/80 shrink-0 shadow-2xs flex items-center justify-center">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/100x140/f1f5f9/0f172a?text=?";
                }}
              />
            ) : (
              <BookOpen className="w-5 h-5 text-gray-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-extrabold text-heading truncate">
              {item.title}
            </p>
            <p className="text-xs text-primary font-bold mt-0.5">
              {item.price * item.cartQuantity} ج.م{" "}
              <span className="text-muted font-normal text-[11px]">
                ({item.price} ج.م للنسخة)
              </span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.cartQuantity + 1)}
              className="p-1 rounded-lg bg-white border border-gray-200 hover:border-primary text-heading transition-colors cursor-pointer"
              title="زيادة الكمية"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-extrabold text-heading">
              {item.cartQuantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.cartQuantity - 1)}
              className="p-1 rounded-lg bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 text-heading transition-colors cursor-pointer"
              title="تقليل الكمية"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
