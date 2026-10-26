"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartContextType, Product } from "@/src/types";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "aleman_cart";
const DEFAULT_DELIVERY_FEE = 20;

function toFiniteNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function getCartItemKey(id?: string, size?: string): string {
  if (!id) return String(Math.random());
  return size ? `${id}-${size}` : id;
}

function normalizeCartItem(item: unknown): CartItem | null {
  if (!item || typeof item !== "object") return null;

  const candidate = item as Partial<CartItem>;
  const quantity = Math.max(0, toFiniteNumber(candidate.quantity));
  const price = Math.max(0, toFiniteNumber(candidate.price));
  const cartQuantity = Math.min(
    quantity,
    Math.max(1, toFiniteNumber(candidate.cartQuantity, 1)),
  );

  if (
    typeof candidate.id !== "string" ||
    !candidate.id ||
    !quantity ||
    !cartQuantity
  ) {
    return null;
  }

  return {
    ...candidate,
    price,
    quantity,
    cartQuantity,
  } as CartItem;
}

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
          setCart(
            parsed
              .map(normalizeCartItem)
              .filter((item): item is CartItem => item !== null),
          );
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
    const availableQuantity = Math.max(0, toFiniteNumber(product.quantity));
    const price = Math.max(0, toFiniteNumber(product.price));
    const requestedQuantity = Math.max(1, toFiniteNumber(quantity, 1));

    if (!availableQuantity) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        const updated = [...prev];
        const currentQty = Math.max(
          0,
          toFiniteNumber(updated[existingIndex].cartQuantity),
        );

        const nextQty = Math.min(
          availableQuantity,
          currentQty + requestedQuantity,
        );

        updated[existingIndex] = {
          ...updated[existingIndex],
          cartQuantity: nextQty,
          price,
          quantity: availableQuantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          ...product,
          price,
          quantity: availableQuantity,
          cartQuantity: Math.min(availableQuantity, requestedQuantity),
        },
      ];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    const nextQuantity = toFiniteNumber(quantity);

    if (nextQuantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.id === bookId) {
          return {
            ...item,
            cartQuantity: Math.min(
              Math.max(0, toFiniteNumber(item.quantity)),
              nextQuantity,
            ),
          };
        }
        return item;
      }),
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
    (sum, item) =>
      sum +
      toFiniteNumber(item.price) *
        Math.max(0, toFiniteNumber(item.cartQuantity)),
    0,
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
