import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Hash,
  Layers,
  User,
  Truck,
  ShieldCheck,
  Award,
  ChevronLeft,
  Building2,
  FileText,
} from "lucide-react";
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
  const categoryLabel = getCategoryLabel(book.category);

  // حساب نسبة الخصم إن وُجد سعر قديم
  const discountPercent =
    book.oldPrice && book.oldPrice > book.price
      ? Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100)
      : null;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-5xl" dir="rtl">
        {/* مسار التنقل (Breadcrumbs) وزر الرجوع */}
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

        {/* بطاقة تفاصيل الكتاب الرئيسية باستخدام Flexbox بدون Grid */}
        <div className="bg-white rounded-3xl border border-border-subtle p-5 sm:p-7 md:p-8 shadow-xs flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          
          {/* العمود الأيمن: غلاف الكتاب والضمانات */}
          <div className="w-full lg:w-5/12 min-w-0 flex flex-col gap-4">
            {/* صندوق عرض الغلاف */}
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

              {/* شارة الخصم إن وجد */}
              {discountPercent && (
                <span className="absolute top-4 left-4 rounded-full bg-red-500 text-white font-black text-xs px-2.5 py-1 shadow-md">
                  خصم {discountPercent}%
                </span>
              )}

              {/* شارة نفاد المخزون */}
              {!isAvailable && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
                  <span className="rounded-2xl bg-red-600 text-white text-sm font-black px-4 py-2 shadow-lg">
                    نفد من المخزون حالياً
                  </span>
                </div>
              )}
            </div>

            {/* بطاقات المزايا والضمانات */}
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

          {/* العمود الأيسر: بيانات وتفاصيل الكتاب وزر الإضافة للسلة */}
          <div className="w-full lg:w-7/12 min-w-0 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              
              {/* شارات القسم والكود */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3.5 py-1 text-xs font-extrabold text-primary border border-primary/20">
                  <Layers className="w-3.5 h-3.5" />
                  {categoryLabel}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                  <Hash className="w-3.5 h-3.5" />
                  {book.code}
                </span>
              </div>

              {/* عنوان الكتاب */}
              <h1 className="text-2xl sm:text-3xl font-black text-heading leading-snug">
                {book.title}
              </h1>

              {/* بطاقات البيانات الوصفية (المؤلف، الناشر، الصفحات) */}
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

              {/* بطاقة السعر والتوفر */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50/90 rounded-2xl p-4 sm:p-5 border border-gray-100">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted font-bold">السعر الحالي:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary">
                      {book.price}
                    </span>
                    <span className="text-sm font-extrabold text-heading">ج.م</span>

                    {book.oldPrice && (
                      <span className="text-sm line-through text-gray-400 font-bold mr-2">
                        {book.oldPrice} ج.م
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-extrabold text-emerald-700 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>متوفر في المخزن ({book.quantity} نسخة)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3.5 py-1.5 text-xs font-extrabold text-red-600">
                      نفد من المخزون
                    </span>
                  )}
                </div>
              </div>

              {/* نبذة عن الكتاب */}
              <div className="flex flex-col gap-2 pt-2">
                <h2 className="flex items-center gap-2 text-sm font-black text-heading">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>نبذة ومحتوى الكتاب:</span>
                </h2>
                <div className="text-xs sm:text-sm text-sub leading-relaxed bg-gray-50/60 p-4 sm:p-5 rounded-2xl border border-gray-100">
                  <p className="whitespace-pre-line">
                    {book.fullDescription || book.description || "لا يوجد وصف إضافي متوفر لهذا الكتاب حالياً."}
                  </p>
                </div>
              </div>
            </div>

            {/* قسم الإضافة إلى السلة التفاعلي مع تنبيه Sonner */}
            <div className="pt-2 border-t border-gray-100">
              <AddToCartSection book={book} />
            </div>

          </div>
        </div>
      </main>
    </>
  );
}