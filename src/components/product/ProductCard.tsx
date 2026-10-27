"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { Product } from "@/src/types";
import { getCategoryLabel } from "@/src/constants/categories";
import { useCart } from "@/src/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.quantity > 0;
  const [imgError, setImgError] = useState(false);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  const cartItem = cart.find((item) => item.id === product.id);
  const currentQty = cartItem ? cartItem.cartQuantity : 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImgError(false);
  }, [product.image]);

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAvailable || currentQty >= product.quantity) return;

    if (currentQty === 0) {
      addToCart(product, 1);
    } else {
      updateQuantity(product.id, currentQty + 1);
    }
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentQty <= 0) return;

    if (currentQty === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, currentQty - 1);
    }
  };

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-border-subtle shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 h-full w-full">
      <Link href={`/products/${product.code}`} className="flex flex-col flex-1">
        <div className="relative aspect-[3/4] w-full bg-gray-50 overflow-hidden shrink-0">
          {!imgError && product.image?.trim() ? (
            <Image
              src={product.image}
              alt={product.title}
              loading="lazy"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-light/70">
              <span className="text-5xl font-black text-primary/40 select-none">
                ؟
              </span>
            </div>
          )}

          <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-primary shadow-xs border border-gray-100 z-10">
            {getCategoryLabel(product.category)}
          </span>

          {!isAvailable && (
            <span className="absolute inset-0 m-auto flex items-center justify-center bg-black/60 text-white font-extrabold text-sm rounded-xl h-10 w-32 shadow-lg z-10">
              نفد من المخزون
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col gap-1.5 flex-1 justify-between" dir="rtl">
          <div>
            <h3 className="text-sm md:text-base font-extrabold text-heading line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.5rem] md:min-h-[2.75rem] flex items-center">
              {product.title}
            </h3>

            {product.author && (
              <div className="flex items-center gap-1.5 text-xs text-muted mt-1.5">
                <User className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="line-clamp-1">{product.author}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div
        className="px-4 pb-4 pt-2 border-t border-gray-50 flex flex-col md:flex-row  items-center justify-between gap-2 mt-auto"
        dir="rtl"
      >
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-black text-primary">
            {product.price}
          </span>
          <span className="text-xs font-bold text-muted">ج.م</span>
          {product.oldPrice && (
            <span className="text-xs line-through text-gray-400 mr-1">
              {product.oldPrice} ج.م
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-1 bg-surface-soft border border-border/80 rounded-xl p-0.5 shrink-0"
          dir="rtl"
        >
          <button
            type="button"
            onClick={handleIncrease}
            disabled={!isAvailable || currentQty >= product.quantity}
            aria-label="زيادة الكمية"
            className="w-7 h-7 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-primary/40 text-white font-bold text-sm flex items-center justify-center transition active:scale-95 disabled:cursor-not-allowed cursor-pointer shadow-2xs select-none"
          >
            +
          </button>

          <span className="w-7 text-center font-extrabold text-xs text-body select-none">
            {currentQty}
          </span>

          <button
            type="button"
            onClick={handleDecrease}
            disabled={currentQty === 0}
            aria-label="إنقاص الكمية"
            className="w-7 h-7 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-primary/40 text-white font-bold text-sm flex items-center justify-center transition active:scale-95 disabled:cursor-not-allowed cursor-pointer shadow-2xs select-none"
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}
