"use client";

import React, { createContext, useContext } from "react";
import { CartContextType } from "@/src/types";
import { useCartState } from "./useCartState";

export { getCartItemKey } from "./cartHelpers";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cartState = useCartState();

  return (
    <CartContext.Provider value={cartState}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
