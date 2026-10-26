export * from "./auth";
export * from "./order";
export * from "./cart";

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