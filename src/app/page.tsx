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
const LATEST_CATEGORY = "latest";
const ALL_CATEGORY = "all";

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
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const allProducts = await getProducts();

  const requestedCategory = params.category?.trim() || LATEST_CATEGORY;
  const currentCategory = requestedCategory;
  const latestPage = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);

  const isLatestBooks = currentCategory === LATEST_CATEGORY;
  const isAllBooks = currentCategory === "all";
  const displayedProducts = isLatestBooks
    ? allProducts
        .filter((product) => product.quantity > 0)
        .sort((a, b) => {
          const discountA =
            a.oldPrice && a.oldPrice > a.price
              ? a.oldPrice - a.price
              : 0;
          const discountB =
            b.oldPrice && b.oldPrice > b.price
              ? b.oldPrice - b.price
              : 0;

          return (
            discountB - discountA ||
            a.price - b.price ||
            a.quantity - b.quantity
          );
        })
    : currentCategory && !isAllBooks
      ? allProducts.filter((p) => (p.category ?? "").trim() === currentCategory)
      : allProducts;

  const categoriesWithProducts = Array.from(
    new Set([
      ...CATEGORIES,
      ...displayedProducts.map((p) => p.category?.trim()),
    ]),
  )
    .filter((category): category is string => Boolean(category))
    .map((category) => ({
      slug: category,
      name: getCategoryLabel(category),
      products: displayedProducts.filter(
        (p) => p.category?.trim() === category,
      ),
    }))
    .filter((group) => group.products.length > 0);

  const latestProductsByCategory = isLatestBooks
    ? categoriesWithProducts.map((group) => ({
        ...group,
        products: group.products.slice(0, latestPage * 6),
      }))
    : categoriesWithProducts;
  const hasMoreLatestBooks = isLatestBooks
    ? categoriesWithProducts.some(
        (group) => group.products.length > latestPage * 9,
      )
    : false;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6" dir="rtl">
        <HomeCategoryBar currentCategory={currentCategory} />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-7/12 min-w-0">
            <div className="mb-5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary fill-primary/15" />
                  <h1 className="text-xl md:text-2xl font-black text-heading">
                    {isLatestBooks
                      ? "أحدث الكتب"
                      : isAllBooks
                      ? "جميع الكتب"
                      : currentCategory
                      ? `قسم: ${getCategoryLabel(currentCategory)}`
                      : "إصدارات ومؤلفات مكتبة الإيمان"}
                  </h1>
                </div>
                <span className="text-xs md:text-sm text-muted font-medium block mt-1">
                  تصفح مجموعتنا الكاملة واطلب نسختك لتصلك حتى باب المنزل
                </span>
              </div>

              {currentCategory && currentCategory !== ALL_CATEGORY && currentCategory !== LATEST_CATEGORY && (
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
                {latestProductsByCategory.map((group) => (
                  <section key={group.slug}>
                    {categoriesWithProducts.length > 1 && !isLatestBooks && (
                      <h2 className="mb-4 border-r-4 border-primary pr-3 text-lg font-black text-heading">
                        {group.name} ({group.products.length})
                      </h2>
                    )}
                    <div className="flex flex-wrap gap-4 md:gap-5 items-stretch">
                      {group.products.map((product) => (
                        <div
                          key={product.id}
                          className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] flex flex-col"
                        >
                          <ProductCard
                            product={product}
                            showStockBadge={isLatestBooks}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {hasMoreLatestBooks && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={`/?category=latest&page=${latestPage + 1}`}
                  scroll={false}
                  className="rounded-2xl bg-primary px-6 py-3 text-sm font-extrabold text-white shadow-xs transition hover:bg-primary-hover active:scale-95"
                >
                  اكتشف المزيد
                </Link>
              </div>
            )}
          </div>

          <div className="w-full lg:w-5/12 min-w-0 lg:sticky lg:top-20 self-start">
            <CheckoutForm />
          </div>
        </div>
      </main>
      <QuickServicesBar />
      <MobileCheckoutFloatingButton />
    </>
  );
}
