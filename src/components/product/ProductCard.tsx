"use client";

import Image from "next/image";
import Link from "next/link";
import { User, ShoppingBag } from "lucide-react";
import { Product } from "@/src/types";
import { getCategoryLabel } from "@/src/constants/categories";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.quantity > 0;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-border-subtle shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200">
      {/* رابط لصفحة تفاصيل الكتاب */}
      <Link href={`/products/${product.code}`} className="flex flex-col flex-1">
        {/* غلاف الكتاب */}
        <div className="relative aspect-[3/4] w-full bg-gray-50 overflow-hidden p-4">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />

          {/* شارة القسم */}
          <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-primary shadow-xs border border-gray-100">
            {getCategoryLabel(product.category)}
          </span>

          {!isAvailable && (
            <span className="absolute inset-0 m-auto flex items-center justify-center bg-black/60 text-white font-extrabold text-sm rounded-xl h-10 w-32 shadow-lg">
              نفد من المخزون
            </span>
          )}
        </div>

        {/* بيانات الكتاب */}
        <div className="p-4 flex flex-col gap-1.5 flex-1" dir="rtl">
          <span className="text-[11px] text-muted font-bold">كود #{product.code}</span>
          <h3 className="text-sm md:text-base font-extrabold text-heading line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {product.author && (
            <div className="flex items-center gap-1.5 text-xs text-muted mt-auto pt-1">
              <User className="w-3.5 h-3.5 text-primary" />
              <span className="line-clamp-1">{product.author}</span>
            </div>
          )}
        </div>
      </Link>

      {/* شريط السعر والإضافة */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-50 flex items-center justify-between" dir="rtl">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-black text-primary">{product.price}</span>
          <span className="text-xs font-bold text-muted">ج.م</span>
          {product.oldPrice && (
            <span className="text-xs line-through text-gray-400 mr-1">
              {product.oldPrice} ج.م
            </span>
          )}
        </div>

        <Link
          href={`/books/${product.code}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-light hover:bg-primary text-primary hover:text-white text-xs font-extrabold transition-colors"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>تفاصيل</span>
        </Link>
      </div>
    </div>
  );
}