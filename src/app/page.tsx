import ProductCard from "@/src/components/product/ProductCard";
import Header from "@/src/components/layout/Header";
import CheckoutForm from "@/src/components/cart/CheckoutForm";
import { Product } from "@/src/types";
import Link from "next/link";
import QuickServicesBar from "@/src/components/home/QuickServicesBar";
import { BookOpen } from "lucide-react";
import HomeCategoryBar from "@/src/components/home/HomeCategoryBar";
import { CATEGORIES, getCategoryLabel } from "@/src/constants/categories";
import MobileCheckoutFloatingButton from "../components/cart/MobileCheckoutFloatingButton";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${apiUrl}/products`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("فشل في جلب قائمة الكتب");

    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const allProducts = await getProducts();

  const currentCategory = params.category?.trim() || null;

  const displayedProducts = currentCategory
    ? allProducts.filter((p) => (p.category ?? "").trim() === currentCategory)
    : allProducts;

  const categoriesWithProducts = Array.from(
    new Set([
      ...CATEGORIES,
      ...displayedProducts.map((p) => p.category?.trim()),
    ])
  )
    .filter((category): category is string => Boolean(category))
    .map((category) => ({
      slug: category,
      name: getCategoryLabel(category),
      products: displayedProducts.filter((p) => p.category?.trim() === category),
    }))
    .filter((group) => group.products.length > 0);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6" dir="rtl">
        <HomeCategoryBar currentCategory={currentCategory} />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* قسم استعراض الكتب */}
          <div className="w-full lg:w-7/12">
            <div className="mb-5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary fill-primary/15" />
                  <h1 className="text-xl md:text-2xl font-black text-heading">
                    {currentCategory
                      ? `قسم: ${getCategoryLabel(currentCategory)}`
                      : "إصدارات ومؤلفات مكتبة الإيمان"}
                  </h1>
                </div>
                <span className="text-xs md:text-sm text-muted font-medium block mt-1">
                  تصفح مجموعتنا الكاملة واطلب نسختك لتصلك حتى باب المنزل
                </span>
              </div>

              {currentCategory && (
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary-light hover:bg-primary-subtle border border-primary/25 rounded-full transition-all duration-150 active:scale-95 shadow-xs"
                >
                  <span>عرض الكل</span>
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] leading-none">
                    ✕
                  </span>
                </Link>
              )}
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center text-muted-light py-16 bg-white rounded-2xl border border-border-subtle">
                لا توجد كتب متاحة في هذا القسم حالياً.
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                {categoriesWithProducts.map((group) => (
                  <section key={group.slug}>
                    {categoriesWithProducts.length > 1 && (
                      <h2 className="mb-4 border-r-4 border-primary pr-3 text-lg font-black text-heading">
                        {group.name} ({group.products.length})
                      </h2>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                      {group.products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          {/* لوحة إتمام الشراء السريع */}
          <div className="sticky top-20 w-full lg:w-5/12">
            <CheckoutForm />
          </div>
        </div>
      </main>
      <QuickServicesBar />
      <MobileCheckoutFloatingButton />
    </>
  );
}