import React from "react";
import { BookOpen } from "lucide-react";
import { Product } from "@/src/types";
import CashierBookCard from "./CashierBookCard";

interface CashierBookListProps {
  loading: boolean;
  books: Product[];
  cart: Array<{ id: string; cartQuantity: number }>;
  onAddToCart: (book: Product) => void;
}

export default function CashierBookList({
  loading,
  books,
  cart,
  onAddToCart,
}: CashierBookListProps) {
  if (loading) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-border text-muted-light text-sm font-bold flex flex-col items-center justify-center gap-2">
        <BookOpen className="w-8 h-8 text-primary animate-pulse" />
        <span>جاري تحميل كتب الكاشير...</span>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-border text-muted-light text-sm font-bold">
        لا توجد كتب مطابقة في هذا القسم حالياً.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {books.map((book) => {
        const inCartItem = cart.find((c) => c.id === book.id);
        return (
          <div
            key={book.id}
            className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.7rem)] flex flex-col"
          >
            <CashierBookCard
              book={book}
              inCartItem={inCartItem}
              onAddToCart={onAddToCart}
            />
          </div>
        );
      })}
    </div>
  );
}
