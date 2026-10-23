"use client";

import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/src/types";
import { getCartItemKey } from "@/src/context/CartContext";
import CashierCartItemRow from "./CashierCartItemRow";

interface CashierCartItemListProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number, size?: string) => void;
  onRemove: (id: string, size?: string) => void;
}

export default function CashierCartItemList({
  cart,
  onUpdateQuantity,
  onRemove,
}: CashierCartItemListProps) {
  if (cart.length === 0) {
    return (
      <div className="py-8 text-center text-muted-light flex flex-col gap-2">
        <ShoppingCart className="w-7 h-7 mx-auto text-muted-light" />
        <p className="text-xs font-medium">لم يتم تحديد أي وجبة بعد.</p>
      </div>
    );
  }

  return (
    <div className="max-h-64 overflow-y-auto divide-y divide-border-subtle pr-1 custom-scrollbar">
      {cart.map((item) => {
        const itemKey =
          item.cartItemId || getCartItemKey(item._id, item.selectedSize);
        return (
          <CashierCartItemRow
            key={itemKey}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
}
