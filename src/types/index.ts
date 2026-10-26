


export type Role = "CUSTOMER" | "ADMIN";

export type PaymentMethod = "INSTAPAY" | "VODAFONE_CASH" | "instapay" | "vodafone_cash";
export type CartPaymentMethod = PaymentMethod;

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface MealSize {
  name: string;
  price: number;
}

export interface CustomerInfoFormProps {
  name: string;
  setName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  isPickup: boolean;
  setIsPickup: (val: boolean) => void;
  tableNumber?: string | null;
  paymentMethod: any;
  setPaymentMethod: (val: any) => void;
  transferNumber: string;
  setTransferNumber: (val: string) => void;
  loading: boolean;
  error: string | null;
  isCartEmpty: boolean;
  finalTotal: number;
  onSubmit: (e: React.FormEvent) => void;
  errors?: Record<string, string>;
}




export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  expiresAt: string;
  token: string;
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface AuthData {
  token: string;
  user: User;
  redirect?: boolean;
}


export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}


export interface LoginPayload {
  email: string;
  password: string;
}


export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}




export interface Product {
  id: string;
  code: string;
  title: string;
  description: string;
  fullDescription: string | null;
  price: number;
  oldPrice: number | null;
  quantity: number;
  category: string;
  image: string;
  author: string | null;
  publisher: string | null;
  pagesCount: number | null;
  createdAt: string;
}


export type Book = Product;




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




export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
  pagination?: PaginationMeta;
}

export * from "./cart";