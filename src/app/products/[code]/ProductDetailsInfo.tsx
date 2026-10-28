import {
  Layers,
  Hash,
  User,
  Building2,
  FileText,
  BookOpen,
} from "lucide-react";
import { Product } from "@/src/types";

interface ProductDetailsInfoProps {
  book: Product;
  categoryLabel: string;
  isAvailable: boolean;
}

export default function ProductDetailsInfo({
  book,
  categoryLabel,
  isAvailable,
}: ProductDetailsInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3.5 py-1 text-xs font-extrabold text-primary border border-primary/20">
          <Layers className="w-3.5 h-3.5" />
          {categoryLabel}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-heading leading-snug">
        {book.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
        {book.author && (
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 text-sub">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>المؤلف:</span>
            <strong className="text-heading">{book.author}</strong>
          </div>
        )}

        {book.publisher && (
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 text-sub">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>دار النشر:</span>
            <strong className="text-heading">{book.publisher}</strong>
          </div>
        )}

        {book.pagesCount && (
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 text-sub">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>الصفحات:</span>
            <strong className="text-heading">{book.pagesCount} صفحة</strong>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50/90 rounded-2xl p-4 sm:p-5 border border-gray-100">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted font-bold">السعر الحالي:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">
              {book.price}
            </span>
            <span className="text-sm font-extrabold text-heading">ج</span>

            {book.oldPrice && (
              <span className="text-sm line-through text-gray-400 font-bold mr-2">
                {book.oldPrice} ج
              </span>
            )}
          </div>
        </div>

        <div>
          {isAvailable ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-extrabold text-emerald-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>متوفر({book.quantity} نسخة)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3.5 py-1.5 text-xs font-extrabold text-red-600">
              نفد من المخزون
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <h2 className="flex items-center gap-2 text-sm font-black text-heading">
          <BookOpen className="w-4 h-4 text-primary" />
          <span>نبذة ومحتوى الكتاب:</span>
        </h2>
        <div className="text-xs sm:text-sm text-sub leading-relaxed bg-gray-50/60 p-4 sm:p-5 rounded-2xl border border-gray-100">
          <p className="whitespace-pre-line">
            {book.description || "لا يوجد وصف إضافي متوفر لهذا الكتاب حالياً."}
          </p>
        </div>
      </div>
    </div>
  );
}
