// ==========================================
// 1. الثوابت والأنواع الأساسية (Enums) من Prisma Schema
// ==========================================
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

// ==========================================
// 2. أنواع المستخدم والمصادقة (User & Better Auth)
// ==========================================
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

// البيانات الراجعة عند تسجيل الدخول أو إنشاء حساب (/api/auth/login & /api/auth/register)
export interface AuthData {
  token: string;
  user: User;
  redirect?: boolean;
}

// البيانات المرسلة عند إنشاء حساب جديد
export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}

// البيانات المرسلة عند تسجيل الدخول
export interface LoginPayload {
  email: string;
  password: string;
}

// البيانات المرسلة عند تحديث الملف الشخصي (/api/auth/profile)
export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
}

// ==========================================
// 3. أنواع الكتب (Book / Product)
// ==========================================
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

// اسم بديل (Alias) حتى تتمكن من استخدام Book أو Product في أي مكون بحرية
export type Book = Product;

// ==========================================
// 4. أنواع الطلبات وعناصر الطلب (Order & OrderItem)
// ==========================================
export interface OrderItem {
  id: string;
  quantity: number;
  priceAtBuy: number;
  orderId: number;
  bookId: string;
  // تفاصيل الكتاب المضمنة عند جلب الطلب من الـ API
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
  paymentMethod: PaymentMethod;
  transferNumber: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  userId: string;
  // بيانات صاحب الطلب (تظهر في مسارات الأدمن)
  user?: {
    name: string;
    phone: string;
    email?: string;
  };
  items: OrderItem[];
}

// البيانات المرسلة من الفرونت إند عند إتمام الطلب (POST /api/orders)
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

// ==========================================
// 5. غلاف استجابة السيرفر الموحد (API Response Envelope)
// ==========================================
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