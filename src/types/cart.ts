import { Product } from "./index";

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalPrice: number;
  deliveryFee: number;
  totalPrice: number;
}