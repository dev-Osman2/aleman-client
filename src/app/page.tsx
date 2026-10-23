import ProductCard from "@/src/components/product/ProductCard";
import Header from "@/src/components/layout/Header";
import CheckoutForm from "@/src/components/cart/CheckoutForm";
import { Product } from "@/src/types";
import Link from "next/link";
import QuickServicesBar from "@/src/components/home/QuickServicesBar";
import { Flame, UtensilsCrossed } from "lucide-react";
import HomeCategoryBar from "@/src/components/home/HomeCategoryBar";
import { CATEGORIES } from "@/src/constants/categories";
import MobileCheckoutFloatingButton from "../components/cart/MobileCheckoutFloatingButton";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("فشل في جلب قائمة الطعام");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; table?: string }>;
}) {
  const params = await searchParams;
  const allProducts = await getProducts();

  const currentCategory = params.category?.trim() || null;
  const currentTable = params.table?.trim() || undefined;

  const displayedProducts = currentCategory
    ? allProducts.filter((p) => (p.category ?? "").trim() === currentCategory)
    : allProducts;

  const categoriesWithProducts = Array.from(
    new Set([
      ...CATEGORIES,
      ...displayedProducts.map((product) => product.category?.trim()),
    ]),
  )
    .filter((category): category is string => Boolean(category))
    .map((category) => ({
      name: category,
      products: displayedProducts.filter(
        (product) => product.category?.trim() === category,
      ),
    }))
    .filter((group) => group.products.length > 0);

  const clearFilterHref = currentTable ? `/?table=${currentTable}` : "/";

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-4">
        <HomeCategoryBar
          currentCategory={currentCategory}
          currentTable={currentTable}
        />

        {currentTable && (
          <div className="mb-5 flex items-center justify-between rounded-2xl bg-primary-light border border-primary/30 px-4 py-3 text-primary shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-heading">
                  ترابيزة رقم ({currentTable})
                </p>
                <p className="text-xs text-sub">
                  اختر وجباتك وسيتم تحضيرها <br /> وتقديمها لترابيزتك مباشرة
                </p>
              </div>
            </div>
            <span className="rounded-full bg-primary px-3.5 py-1 text-xs font-extrabold text-white">
              ترابيزة #{currentTable}
            </span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-7/12">
            <div className="mb-4 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-primary fill-primary/15" />
                  <h2 className="text-lg md:text-xl font-extrabold text-heading">
                    {currentCategory
                      ? `وجبات وسندوتشات - ${currentCategory}`
                      : "وجبات وسندوتشات - المشويات"}
                  </h2>
                </div>
                <span className="text-xs md:text-sm text-muted font-medium block mt-0.5">
                  اختر وجبتك المفضلة وأضفها لطلبك
                </span>
              </div>

              {currentCategory && (
                <Link
                  href={clearFilterHref}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary-light hover:bg-primary-subtle border border-primary/25 rounded-full transition-all duration-150 active:scale-95 shadow-xs"
                >
                  <span>إلغاء التصفية</span>
                  <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] leading-none">
                    ✕
                  </span>
                </Link>
              )}
            </div>

            {displayedProducts.length === 0 ? (
              <div className="text-center text-muted-light py-16 bg-white rounded-2xl border border-border-subtle">
                لا توجد وجبات متاحة في هذا القسم حالياً.
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {categoriesWithProducts.map((group) => (
                  <section key={group.name}>
                    {categoriesWithProducts.length > 1 && (
                      <h3 className="mb-3 border-r-4 border-primary pr-3 text-base font-extrabold text-body">
                        {group.name}
                      </h3>
                    )}
                    <div className="flex flex-wrap gap-5 sm:gap-6 w-full">
                      {group.products.map((product) => (
                        <div
                          key={product._id}
                          className="w-full sm:w-[calc(50%-0.75rem)] flex flex-col"
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

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
