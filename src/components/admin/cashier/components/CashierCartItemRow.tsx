/* eslint-disable @next/next/no-img-element */
"use client";

import { Trash2 } from "lucide-react";
import { CartItem } from "@/src/types";

interface CashierCartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number, size?: string) => void;
  onRemove: (id: string, size?: string) => void;
}

export default function CashierCartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CashierCartItemRowProps) {
  const price = Number(item.price || 0);

  return (
    <div className="py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 rounded-xl object-cover border border-border shrink-0 bg-surface-soft"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/80x80/fff7ed/D55304?text=?";
          }}
        />
        <div className="min-w-0 flex-1 text-right">
          <p className="font-extrabold text-body text-xs sm:text-sm truncate">
            {item.name}
          </p>
          {item.selectedSize && (
            <span className="text-[11px] text-muted font-bold">
              ({item.selectedSize})
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-surface-soft border border-border rounded-lg px-1.5 py-0.5">
          <button
            type="button"
            onClick={() =>
              onUpdateQuantity(item._id, item.cartQuantity + 1, item.selectedSize)
            }
            className="w-5 h-5 rounded bg-primary text-white text-xs font-bold flex items-center justify-center cursor-pointer"
          >
            +
          </button>
          <span className="px-1.5 text-xs font-extrabold text-primary">
            {item.cartQuantity}
          </span>
          <button
            type="button"
            onClick={() =>
              onUpdateQuantity(item._id, item.cartQuantity - 1, item.selectedSize)
            }
            className="w-5 h-5 rounded bg-white border border-border text-sub text-xs font-bold flex items-center justify-center cursor-pointer"
          >
            -
          </button>
        </div>

        <span className="font-extrabold text-heading text-xs sm:text-sm min-w-[65px] text-left">
          {price * item.cartQuantity} ج
        </span>

        <button
          type="button"
          onClick={() => onRemove(item._id, item.selectedSize)}
          className="text-danger hover:text-danger p-1 transition cursor-pointer"
          title="حذف الصنف"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
