"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartContextType, Product } from "@/src/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "aleman_cart";
const DEFAULT_DELIVERY_FEE = 20;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCart(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load cart from localStorage:", err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.quantity <= 0) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = updated[existingIndex].cartQuantity;
        // ضمان عدم تجاوز الكمية المتوفرة في مخزون المكتبة
        const nextQty = Math.min(product.quantity, currentQty + quantity);

        updated[existingIndex] = {
          ...updated[existingIndex],
          cartQuantity: nextQty,
          price: product.price,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...product,
          cartQuantity: Math.min(product.quantity, quantity),
        },
      ];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === bookId) {
          return {
            ...item,
            cartQuantity: Math.min(item.quantity, quantity),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear cart from localStorage:", err);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  const subtotalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.cartQuantity,
    0
  );

  const deliveryFee = cart.length > 0 ? DEFAULT_DELIVERY_FEE : 0;
  const totalPrice = subtotalPrice + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalPrice,
        deliveryFee,
        totalPrice,
      }}
    >
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