"use client";

import { useCart} from "@/src/context/CartContext";
import { ShoppingCart } from "lucide-react";
import CartItemRow from "./components/CartItemRow";

interface CartItemListProps {
  onZoomImage: (item: { src: string; name: string }) => void;
}

export default function CartItemList({ onZoomImage }: CartItemListProps) {
  const { cart, updateQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <div className="py-7 text-center text-muted-light flex flex-col gap-2 border-b border-border-subtle">
        <ShoppingCart className="w-7 h-7 mx-auto text-muted-light stroke-[1.75]" />
        <p className="text-xs font-medium">
          لم تقم باختيار أي وجبة بعد، أضف وجباتك من القائمة.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-60 overflow-y-auto divide-y divide-border-subtle pr-1 custom-scrollbar">
      {cart.map((item) => {
        const itemKey = item.cartItemId || getCartItemKey(item._id, item.selectedSize);
        return (
          <CartItemRow
            key={itemKey}
            item={item}
            onZoomImage={onZoomImage}
            onUpdateQuantity={updateQuantity}
          />
        );
      })}
    </div>
  );
}
