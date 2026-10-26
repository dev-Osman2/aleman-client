import React from "react";
import Image from "next/image";
import { Plus, Check, Hash } from "lucide-react";
import { Product } from "@/src/types";

interface CashierBookCardProps {
  book: Product;
  inCartItem?: { cartQuantity: number };
  onAddToCart: (book: Product) => void;
}

export default function CashierBookCard({
  book,
  inCartItem,
  onAddToCart,
}: CashierBookCardProps) {
  const isAvailable = book.quantity > 0;

  return (
    <div
      onClick={() => {
        if (isAvailable) onAddToCart(book);
      }}
      className={`group bg-white rounded-2xl border p-3 flex flex-col justify-between transition-all duration-150 select-none h-full ${
        isAvailable
          ? "cursor-pointer hover:border-primary hover:shadow-md border-border/80 active:scale-[0.98]"
          : "opacity-60 cursor-not-allowed border-border/60"
      } ${inCartItem ? "ring-2 ring-primary/30 border-primary" : ""}`}
    >
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-surface-soft mb-2.5">
        <Image
          src={book.image}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/120x160/f1f5f9/0f172a?text=?";
          }}
        />

        {book.quantity > 0 && (
          <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
            <Hash className="w-2.5 h-2.5" />
            <span>{book.quantity}</span>
          </span>
        )}

        {inCartItem && (
          <span className="absolute bottom-2 left-2 bg-primary text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md">
            {inCartItem.cartQuantity}
          </span>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-black">
            نفد المخزون
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 text-right flex-1 justify-between">
        <div>
          <h4 className="text-xs sm:text-sm font-black text-heading line-clamp-2 leading-tight">
            {book.title}
          </h4>
          {book.author && (
            <p className="text-[11px] text-muted truncate mt-0.5">
              {book.author}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border-subtle mt-2">
          <span className="text-sm font-black text-primary">
            {Number(book.price).toFixed(2)} ج
          </span>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable) onAddToCart(book);
            }}
            className="w-7 h-7 rounded-lg bg-primary-light text-primary hover:bg-primary hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40"
            title="إضافة للسلة"
          >
            {inCartItem ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
