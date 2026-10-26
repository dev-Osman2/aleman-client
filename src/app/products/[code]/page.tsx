import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowRight, ChevronLeft } from "lucide-react";
import Header from "@/src/components/layout/Header";
import { Product } from "@/src/types";
import { getCategoryLabel } from "@/src/constants/categories";
import AddToCartSection from "./AddToCartSection";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetailsInfo from "./ProductDetailsInfo";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getBookByCode(code: string): Promise<Product | null> {
  try {
    const res = await fetch(`${apiUrl}/products/${code}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const book = await getBookByCode(code);

  if (!book) return { title: "الكتاب غير موجود | مكتبة الإيمان" };

  return {
    title: `${book.title} | مكتبة الإيمان`,
    description: book.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const book = await getBookByCode(code);

  if (!book) {
    notFound();
  }

  const isAvailable = book.quantity > 0;
  const categoryLabel = getCategoryLabel(book.category);

  const discountPercent =
    book.oldPrice && book.oldPrice > book.price
      ? Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100)
      : null;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-5xl" dir="rtl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <nav className="flex items-center gap-1.5 text-xs font-bold text-muted">
            <Link href="/" className="hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-gray-300" />
            <Link
              href={`/?category=${encodeURIComponent(book.category)}`}
              className="hover:text-primary transition-colors"
            >
              {categoryLabel}
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-heading truncate max-w-[200px] sm:max-w-xs">
              {book.title}
            </span>
          </nav>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold text-primary bg-primary-light hover:bg-primary-subtle border border-primary/20 transition-all active:scale-95 shadow-2xs"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للكتب</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-border-subtle p-5 sm:p-7 md:p-8 shadow-xs flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          <ProductImageGallery
            book={book}
            discountPercent={discountPercent}
            isAvailable={isAvailable}
          />

          <div className="w-full lg:w-7/12 min-w-0 flex flex-col gap-6">
            <ProductDetailsInfo
              book={book}
              categoryLabel={categoryLabel}
              isAvailable={isAvailable}
            />

            <div className="pt-2 border-t border-gray-100">
              <AddToCartSection book={book} />
            </div>
          </div>
        </div>

        {book.fullDescription && (
          <div className="mt-8 bg-white rounded-3xl border border-border-subtle p-5 sm:p-7 md:p-8 shadow-xs">
            <h2 className="text-lg font-black text-heading mb-4">
              الوصف الكامل للكتاب
            </h2>
            <div className="text-sm text-sub leading-relaxed whitespace-pre-line">
              {book.fullDescription}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
