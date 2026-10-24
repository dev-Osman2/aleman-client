import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowRight, BookOpen, CheckCircle2, Hash, Layers, User } from "lucide-react";
import Header from "@/src/components/layout/Header";
import { Product } from "@/src/types";
import { getCategoryLabel } from "@/src/constants/categories";
import AddToCartSection from "./AddToCartSection";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// دالة جلب الكتاب عبر الكود
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

// إنشاء بيانات السيو (Metadata) تلقائياً
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

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl" dir="rtl">
        {/* زر الرجوع */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:underline transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى قائمة الكتب</span>
          </Link>
        </div>

        {/* حاوية تفاصيل الكتاب */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white rounded-3xl border border-border-subtle p-6 md:p-8 shadow-xs">
          
          {/* صورة الغلاف */}
          <div className="md:col-span-5 flex items-center justify-center bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="relative w-full aspect-[3/4] max-w-[320px]">
              <Image
                src={book.image}
                alt={book.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-contain rounded-lg drop-shadow-md"
              />
            </div>
          </div>

          {/* معلومات وبيانات الكتاب */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* شارة القسم وكود الكتاب */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3.5 py-1 text-xs font-extrabold text-primary">
                  <Layers className="w-3.5 h-3.5" />
                  {getCategoryLabel(book.category)}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                  <Hash className="w-3.5 h-3.5" />
                  كود #{book.code}
                </span>
              </div>

              {/* العنوان */}
              <h1 className="text-2xl md:text-3xl font-black text-heading leading-snug">
                {book.title}
              </h1>

              {/* المؤلف */}
              <div className="flex items-center gap-2 text-sm text-muted font-bold">
                <User className="w-4 h-4 text-primary" />
                <span>المؤلف:</span>
                <span className="text-body font-extrabold">
                  {book.author || "غير محدد"}
                </span>
              </div>

              {/* السعر والتوفر في المخزن */}
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div>
                  <span className="text-xs text-muted block mb-0.5 font-bold">السعر</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-black text-primary">
                      {book.price} <span className="text-sm font-bold">ج.م</span>
                    </span>
                    {book.oldPrice && (
                      <span className="text-sm line-through text-gray-400 font-bold">
                        {book.oldPrice} ج.م
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3.5 py-1.5 text-xs font-extrabold text-green-700">
                      <CheckCircle2 className="w-4 h-4" />
                      متوفر ({book.quantity} نسخة)
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-3.5 py-1.5 text-xs font-extrabold text-red-600">
                      نفد من المخزون
                    </span>
                  )}
                </div>
              </div>

              {/* نبذة عن الكتاب */}
              <div className="space-y-2 pt-2">
                <h2 className="flex items-center gap-2 text-base font-extrabold text-heading">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>نبذة عن الكتاب</span>
                </h2>
                <p className="text-sm md:text-base text-body leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                  {book.fullDescription || book.description}
                </p>
              </div>
            </div>

            {/* قسم الإضافة إلى السلة */}
            <div className="pt-4 border-t border-gray-100">
              <AddToCartSection book={book} />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}