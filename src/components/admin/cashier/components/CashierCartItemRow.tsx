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
  const itemId = item.id || (item as any)._id;
  const itemTitle = item.title || (item as any).name || "كتاب";

  return (
    <div className="py-3 flex items-center justify-between gap-3" dir="rtl">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <img
          src={item.image || "https://placehold.co/80x80/f1f5f9/0f172a?text=?"}
          alt={itemTitle}
          className="w-12 h-14 rounded-xl object-cover border border-border shrink-0 bg-surface-soft shadow-xs"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/80x80/f1f5f9/0f172a?text=?";
          }}
        />
        <div className="min-w-0 flex-1 text-right">
          <p className="font-extrabold text-heading text-xs sm:text-sm truncate">
            {itemTitle}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px] text-primary font-bold">
              {price} ج
            </span>
            {item.code && (
              <span className="text-[10px] text-muted-light font-mono">
                #{item.code}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-surface-soft border border-border rounded-lg px-1.5 py-0.5">
          <button
            type="button"
            onClick={() =>
              onUpdateQuantity(
                itemId,
                item.cartQuantity + 1,
                (item as any).selectedSize,
              )
            }
            className="w-5 h-5 rounded bg-primary text-white text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-primary-hover transition"
            title="زيادة الكمية"
          >
            +
          </button>
          <span className="px-1.5 text-xs font-extrabold text-primary">
            {item.cartQuantity}
          </span>
          <button
            type="button"
            onClick={() =>
              onUpdateQuantity(
                itemId,
                item.cartQuantity - 1,
                (item as any).selectedSize,
              )
            }
            className="w-5 h-5 rounded bg-white border border-border text-sub text-xs font-bold flex items-center justify-center cursor-pointer hover:bg-surface-subtle transition"
            title="تقليل الكمية"
          >
            -
          </button>
        </div>

        <span className="font-extrabold text-heading text-xs sm:text-sm min-w-[70px] text-left">
          {price * item.cartQuantity} ج
        </span>

        <button
          type="button"
          onClick={() => onRemove(itemId, (item as any).selectedSize)}
          className="text-danger hover:text-danger-hover p-1 transition cursor-pointer"
          title="حذف من السلة"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
