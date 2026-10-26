export type PaymentMethod =
  | "INSTAPAY"
  | "VODAFONE_CASH"
  | "instapay"
  | "vodafone_cash";

export type CartPaymentMethod = PaymentMethod;

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface OrderItem {
  id: string;
  quantity: number;
  priceAtBuy: number;
  orderId: number;
  bookId: string;
  book?: {
    code: string;
    title: string;
    image: string;
    price?: number;
  };
}

export interface Order {
  id: number;
  address: string;
  notes: string | null;
  adminNote?: string | null;
  paymentMethod: PaymentMethod;
  transferNumber: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  userId: string;
  user?: {
    name: string;
    phone: string;
    email?: string;
  };
  items: OrderItem[];
}

export interface CreateOrderItemInput {
  bookId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  address: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  transferNumber: string;
  items: CreateOrderItemInput[];
}
