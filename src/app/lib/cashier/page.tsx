"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CashierTopBar from "@/src/components/admin/cashier/CashierTopBar";
import CashierCartPanel from "@/src/components/admin/cashier/CashierCartPanel";
import CashierThermalReceipt from "@/src/components/admin/cashier/CashierThermalReceipt";
import CashierOrderWatcher from "@/src/components/admin/cashier/CashierOrderWatcher";
import CashierBookList from "@/src/components/admin/cashier/CashierBookList";
import { useCashierOrder } from "@/src/components/admin/cashier/hooks/useCashierOrder";
import { useCart } from "@/src/context/CartContext";
import { Product } from "@/src/types";

function CashierContent() {
  const { cart, addToCart, clearCart, subtotalPrice } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get("category")?.trim() || null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    notes,
    setNotes,
    paymentMode,
    setPaymentMode,
    submitting,
    errorMsg,
    successMsg,
    lastReceipt,
    handlePrintAndSubmit,
    resetOrder,
  } = useCashierOrder(cart, subtotalPrice, clearCart);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch(`${apiUrl}/books`);
        if (res.ok) {
          const json = await res.json();
          const list: Product[] = Array.isArray(json)
            ? json
            : Array.isArray(json.data)
              ? json.data
              : [];
          setProducts(list);
        }
      } catch (err) {
        console.error("Failed to load products for cashier:", err);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchBooks();
  }, [apiUrl]);

  const displayedProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list.filter((product) => {
      if (currentCategory && (product.category ?? "").trim() !== currentCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        (product.title || "").toLowerCase().includes(q) ||
        (product.code || "").toLowerCase().includes(q) ||
        (product.author || "").toLowerCase().includes(q) ||
        (product.category || "").toLowerCase().includes(q)
      );
    });
  }, [products, currentCategory, searchQuery]);

  return (
    <>
      <CashierOrderWatcher />

      <div className="print:hidden flex flex-col gap-5" dir="rtl">
        <CashierTopBar
          currentCategory={currentCategory}
          onSelectCategory={(cat) =>
            router.push(cat ? `/lib/cashier?category=${encodeURIComponent(cat)}` : "/lib/cashier")
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-7/12">
            <CashierBookList
              loading={loadingProducts}
              books={displayedProducts}
              cart={cart}
              onAddToCart={(b) => addToCart(b, 1)}
            />
          </div>

          <div className="w-full lg:w-5/12 lg:sticky lg:top-20">
            <CashierCartPanel
              notes={notes}
              setNotes={setNotes}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              submitting={submitting}
              errorMsg={errorMsg}
              successMsg={successMsg}
              onPrintAndSubmit={handlePrintAndSubmit}
              onResetCart={resetOrder}
            />
          </div>
        </div>
      </div>

      <CashierThermalReceipt receipt={lastReceipt} />
    </>
  );
}

export default function CashierPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface-soft text-muted text-sm font-bold">
          جاري تحميل شاشة الكاشير...
        </div>
      }
    >
      <CashierContent />
    </Suspense>
  );
}
