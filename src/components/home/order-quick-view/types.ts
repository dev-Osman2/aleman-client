export interface TrackedOrderItem {
  id: string;
  quantity: number;
  priceAtBuy: number;
  orderId: number;
  bookId: string;
  book: {
    code: string;
    title: string;
    image: string;
  };
}

export interface TrackedOrder {
  id: number;
  address: string;
  notes?: string | null;
  paymentMethod: "INSTAPAY" | "VODAFONE_CASH" | string;
  transferNumber: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
  createdAt: string;
  userId: string;
  items: TrackedOrderItem[];
}
