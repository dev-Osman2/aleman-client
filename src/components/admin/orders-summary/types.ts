export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SummaryOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  notes?: string;
  pickupFromAssociation: boolean;
  deliveryFee: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled";
  isPaid: boolean;
  items: OrderItem[];
  createdAt: string;
}
