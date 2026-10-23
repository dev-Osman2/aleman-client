/* eslint-disable @next/next/no-img-element */
"use client";

import { CartItem } from "@/src/types";

interface CartItemRowProps {
  item: CartItem;
  onZoomImage: (item: { src: string; name: string }) => void;
  onUpdateQuantity: (id: string, qty: number, size?: string) => void;
}

export default function CartItemRow({
  item,
  onZoomImage,
  onUpdateQuantity,
}: CartItemRowProps) {
  const price = Number(item.price || 0);
  const qty = Number(item.cartQuantity || 0);

  return (
    <div className="py-3 flex justify-between items-center gap-3 text-xs sm:text-sm">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div
          className="relative w-12 h-12 rounded-xl overflow-hidden bg-primary-light/50 border border-border/80 shrink-0 cursor-pointer group"
          onClick={() => onZoomImage({ src: item.image, name: item.name })}
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/100x100/fff7ed/D55304?text=?";
            }}
          />
        </div>

        <div className="flex-1 min-w-0 text-right">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-bold text-body truncate">{item.name}</p>
            {item.selectedSize && (
              <span className="inline-block text-[10px] font-extrabold bg-primary-light text-primary border border-primary/25 px-1.5 py-0.5 rounded-md">
                {item.selectedSize}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted mt-0.5">
            الكمية: <span className="font-extrabold text-primary">{qty}</span> × {price} ج
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-surface-soft border border-border rounded-lg px-1.5 py-0.5">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item._id, item.cartQuantity + 1, item.selectedSize)}
            className="w-5 h-5 rounded bg-primary text-white text-xs font-bold flex items-center justify-center cursor-pointer"
          >
            +
          </button>
          <span className="px-1.5 text-xs font-extrabold text-primary">
            {item.cartQuantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item._id, item.cartQuantity - 1, item.selectedSize)}
            className="w-5 h-5 rounded bg-white border border-border text-sub text-xs font-bold flex items-center justify-center cursor-pointer"
          >
            -
          </button>
        </div>

        <div>
          <span className="font-extrabold text-heading text-xs sm:text-sm min-w-[65px] text-left">
            {price * item.cartQuantity} ج
          </span>
        </div>
      </div>
    </div>
  );
}
