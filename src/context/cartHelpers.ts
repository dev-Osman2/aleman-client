import { CartItem } from "@/src/types";



export const CART_STORAGE_KEY = "aleman_cart";

export function toFiniteNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function getCartItemKey(id?: string, size?: string): string {
  if (!id) return String(Math.random());
  return size ? `${id}-${size}` : id;
}

export function normalizeCartItem(item: unknown): CartItem | null {
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
