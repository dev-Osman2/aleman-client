import React from "react";
import Image from "next/image";
import { Truck, ShieldCheck, Award } from "lucide-react";
import { Product } from "@/src/types";

interface ProductImageGalleryProps {
  book: Product;
  discountPercent: number | null;
  isAvailable: boolean;
}

export default function ProductImageGallery({
  book,
  discountPercent,
  isAvailable,
}: ProductImageGalleryProps) {
  return (
    <div className="w-full lg:w-5/12 min-w-0 flex flex-col gap-4">
      <div className="group relative flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100/70 rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-2xs overflow-hidden">
        <div className="relative w-full aspect-[3/4] max-w-[280px]">
          <Image
            src={book.image}
            alt={book.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 350px"
            className="object-contain rounded-xl drop-shadow-md group-hover:scale-102 transition-transform duration-300"
          />
        </div>

        {discountPercent && (
          <span className="absolute top-4 left-4 rounded-full bg-red-500 text-white font-black text-xs px-2.5 py-1 shadow-md">
            خصم {discountPercent}%
          </span>
        )}

        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
            <span className="rounded-2xl bg-red-600 text-white text-sm font-black px-4 py-2 shadow-lg">
              نفد من المخزون حالياً
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5 bg-gray-50/80 rounded-2xl p-4 border border-gray-100 text-xs font-bold text-sub">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-primary shrink-0" />
          <span>شحن وتوصيل سريع حتى باب البيت</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>دفع آمن عند الاستلام أو عبر إنستاباي وفودافون كاش</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Award className="w-4 h-4 text-primary shrink-0" />
          <span>نسخة أصلية ومضمونة من دار النشر المعتمدة</span>
        </div>
      </div>
    </div>
  );
}
