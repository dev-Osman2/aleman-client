import Header from "@/src/components/layout/Header";
import CheckoutForm from "@/src/components/cart/CheckoutForm";
import QuickServicesBar from "@/src/components/home/QuickServicesBar";
import MobileCheckoutFloatingButton from "@/src/components/cart/MobileCheckoutFloatingButton";
import HomeCatalog from "@/src/components/home/HomeCatalog";
import { fetchCatalogBooks } from "@/src/lib/api/booksApi";
import { redirect } from "next/navigation";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const requestedCategory = params.category?.trim();

  // تحويل ?category=all تلقائياً إلى الرابط الأساسي النظيف /
  if (requestedCategory === "all") {
    redirect("/");
  }

  const allProducts = await fetchCatalogBooks();

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-6" dir="rtl">
        <HomeCatalog
          initialProducts={allProducts}
          initialCategory={requestedCategory || null}
          sidebar={<CheckoutForm />}
        />
      </main>
      <QuickServicesBar />
      <MobileCheckoutFloatingButton />
    </>
  );
}


