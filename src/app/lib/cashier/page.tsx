/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CashierCategoryBar from "@/src/components/admin/cashier/CashierCategoryBar";
import CashierCartPanel from "@/src/components/admin/cashier/CashierCartPanel";
import CashierThermalReceipt, {
  PrintedOrderSnapshot,
} from "@/src/components/admin/cashier/CashierThermalReceipt";
import CashierOrderWatcher from "@/src/components/admin/cashier/CashierOrderWatcher";
import { useCart } from "@/src/context/CartContext";
import { getAdminToken } from "@/src/lib/cookies";
import { Product } from "@/src/types";
import { Plus, Search, BookOpen, Hash, Check } from "lucide-react";

function CashierContent() {
  const { cart, addToCart, clearCart, subtotalPrice } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get("category")?.trim() || null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "card" | "instapay">(
    "cash"
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastReceipt, setLastReceipt] = useState<PrintedOrderSnapshot | null>(
    null
  );

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch(`${apiUrl}/products`);
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

  // تصفية الكتب حسب القسم وبحث النص
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

  const handleCategoryTabClick = (category: string | null) => {
    if (category) {
      router.push(`/lib/cashier?category=${encodeURIComponent(category)}`);
    } else {
      router.push("/lib/cashier");
    }
  };

  const handlePrintAndSubmit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (cart.length === 0) {
      setErrorMsg("سلة الكاشير فارغة، يرجى إضافة كتاب واحد على الأقل");
      return;
    }

    setSubmitting(true);

    try {
      const token = getAdminToken();

      const payload = {
        address: "بيع مباشر من مقر المكتبة (كاشير)",
        notes: notes.trim() || `طلب كاشير - طريقة الدفع: ${paymentMode}`,
        paymentMethod: paymentMode === "instapay" ? "INSTAPAY" : "VODAFONE_CASH",
        transferNumber:
          paymentMode === "cash"
            ? "نقدي - كاشير المكتبة"
            : paymentMode === "card"
            ? "بطاقة دفع - كاشير المكتبة"
            : "تحويل فوري - كاشير المكتبة",
        items: cart.map((item) => ({
          bookId: item.id,
          quantity: item.cartQuantity,
        })),
      };

      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "تعذر تسجيل طلب البيع");
      }

      const createdOrder = data.data;

      const receiptData: PrintedOrderSnapshot = {
        orderNumber: createdOrder?.id || "فوري",
        createdAt: new Date().toLocaleString("ar-EG"),
        paymentMethod: paymentMode,
        items: cart.map((item) => ({
          name: item.title,
          code: item.code,
          quantity: item.cartQuantity,
          price: Number(item.price),
        })),
        totalPrice: Number(subtotalPrice || 0),
      };

      setLastReceipt(receiptData);
      setSuccessMsg(`تم إتمام البيع بنجاح للطلب #${receiptData.orderNumber} وخصم المخزون`);
      clearCart();
      setNotes("");

      // استدعاء نافذة الطباعة الحرارية بعد ثوانٍ بسيطة لضمان اكتمال الرندر
      setTimeout(() => {
        window.print();
      }, 200);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الطلب بالسيرفر"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CashierOrderWatcher />

      <div className="print:hidden flex flex-col gap-5" dir="rtl">
        {/* شريط الأقسام والبحث السريع */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CashierCategoryBar
              currentCategory={currentCategory}
              onSelectCategory={handleCategoryTabClick}
            />
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث سريع بالعنوان أو الكود..."
              className="w-full bg-white border border-border/90 rounded-2xl py-2.5 pr-10 pl-4 text-xs sm:text-sm text-body focus:outline-none focus:border-primary transition"
            />
          </div>
        </div>

        {/* جسم الشاشة: شبكة الكتب + سلة الكاشير */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* شبكة عرض الكتب للكاشير */}
          <div className="w-full lg:w-7/12">
            {loadingProducts ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-border text-muted-light text-sm font-bold flex flex-col items-center justify-center gap-2">
                <BookOpen className="w-8 h-8 text-primary animate-pulse" />
                <span>جاري تحميل كتب الكاشير...</span>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-border text-muted-light text-sm font-bold">
                لا توجد كتب مطابقة في هذا القسم حالياً.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {displayedProducts.map((book) => {
                  const inCartItem = cart.find((c) => c.id === book.id);
                  const isAvailable = book.quantity > 0;

                  return (
                    <div
                      key={book.id}
                      onClick={() => {
                        if (isAvailable) addToCart(book, 1);
                      }}
                      className={`group bg-white rounded-2xl border p-3 flex flex-col justify-between transition-all duration-150 select-none ${
                        isAvailable
                          ? "cursor-pointer hover:border-primary hover:shadow-md border-border/80 active:scale-[0.98]"
                          : "opacity-60 cursor-not-allowed border-border/60"
                      } ${inCartItem ? "ring-2 ring-primary/30 border-primary" : ""}`}
                    >
                      {/* الغلاف والكود */}
                      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-surface-soft mb-2.5">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/120x160/f1f5f9/0f172a?text=غلاف";
                          }}
                        />

                        {book.code && (
                          <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Hash className="w-2.5 h-2.5" />
                            <span>{book.code}</span>
                          </span>
                        )}

                        {inCartItem && (
                          <span className="absolute bottom-2 left-2 bg-primary text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                            {inCartItem.cartQuantity}
                          </span>
                        )}

                        {!isAvailable && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-black">
                            نفد المخزون
                          </div>
                        )}
                      </div>

                      {/* عنوان الكتاب والمؤلف والسعر */}
                      <div className="flex flex-col gap-1 text-right flex-1 justify-between">
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-heading line-clamp-2 leading-tight">
                            {book.title}
                          </h4>
                          {book.author && (
                            <p className="text-[11px] text-muted truncate mt-0.5">
                              {book.author}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border-subtle mt-2">
                          <span className="text-sm font-black text-primary">
                            {Number(book.price).toFixed(2)} ج
                          </span>

                          <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAvailable) addToCart(book, 1);
                            }}
                            className="w-7 h-7 rounded-lg bg-primary-light text-primary hover:bg-primary hover:text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40"
                            title="إضافة للسلة"
                          >
                            {inCartItem ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* لوحة سلة الكاشير والدفع */}
          <div className="w-full lg:w-5/12">
            <CashierCartPanel
              notes={notes}
              setNotes={setNotes}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              submitting={submitting}
              errorMsg={errorMsg}
              successMsg={successMsg}
              onPrintAndSubmit={handlePrintAndSubmit}
              onResetCart={() => {
                clearCart();
                setNotes("");
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
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
