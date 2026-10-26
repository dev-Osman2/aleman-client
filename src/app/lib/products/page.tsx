"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Product } from "@/src/types";
import { getAdminToken } from "@/src/lib/cookies";
import { CATEGORY_TABS, getCategoryLabel } from "@/src/constants/categories";
import ProductsHeader from "@/src/components/admin/products/ProductsHeader";
import ProductsTable from "@/src/components/admin/products/ProductsTable";
import ProductFormModal from "@/src/components/admin/products/ProductFormModal";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import {
  Search,
  Loader2,
  BookOpen,
  Boxes,
  AlertTriangle,
  RefreshCw,
  PackageX,
  X,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<
    "all" | "out_of_stock" | "low_stock"
  >("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/products`);
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : [];
        setProducts(list);
      }
    } catch (err) {
      console.error("Failed to fetch books:", err);
      toast.error("تعذر جلب قائمة الكتب من السيرفر");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveProduct = async (payload: Record<string, unknown>) => {
    const token = getAdminToken();
    const isEditing = Boolean(editingProduct);
    const url = isEditing
      ? `${apiUrl}/admin/books/${editingProduct!.id}`
      : `${apiUrl}/admin/books`;
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "تعذر حفظ بيانات الكتاب");
    }

    const savedBook: Product = data.data;

    if (isEditing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct!.id ? savedBook : p)),
      );
      toast.success("تم تحديث بيانات الكتاب بنجاح");
    } else {
      setProducts((prev) => [savedBook, ...prev]);
      toast.success("تمت إضافة الكتاب الجديد للمكتبة بنجاح");
    }

    setModalOpen(false);
    setEditingProduct(null);
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProductId) return;
    setIsDeleting(true);

    try {
      const token = getAdminToken();
      const res = await fetch(`${apiUrl}/admin/books/${deletingProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deletingProductId));
        toast.success("تم حذف الكتاب نهائياً من المكتبة");
        setDeletingProductId(null);
      } else {
        toast.error(
          data.message ||
            "لا يمكن حذف هذا الكتاب لوجود طلبات سابقة مرتبطة به، يرجى تصفير كمية المخزون بدلاً من الحذف.",
        );
      }
    } catch (err) {
      console.error("Failed to delete book:", err);
      toast.error("حدث خطأ في الاتصال أثناء محاولة حذف الكتاب");
    } finally {
      setIsDeleting(false);
    }
  };

  const normalizeText = (text: string) => {
    return (text || "")
      .toLowerCase()
      .replace(/[إأآا]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/[\u064B-\u065F]/g, "")
      .trim();
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const qty = Number(product.quantity || 0);

      // تصفية حالة المخزون
      if (stockFilter === "out_of_stock" && qty > 0) {
        return false;
      }
      if (stockFilter === "low_stock" && (qty <= 0 || qty > 5)) {
        return false;
      }

      const prodCat = (product.category || "").trim();
      const resolvedProdCat = getCategoryLabel(prodCat) || prodCat;
      const resolvedActiveCat =
        getCategoryLabel(activeCategory) || activeCategory;

      const normProdCat = normalizeText(resolvedProdCat);
      const normActiveCat = normalizeText(resolvedActiveCat);

      const matchesCategory =
        activeCategory === "all"
          ? true
          : normProdCat === normActiveCat ||
            normProdCat.includes(normActiveCat) ||
            normActiveCat.includes(normProdCat);

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = normalizeText(searchQuery);

      return (
        normalizeText(product.title || "").includes(q) ||
        normalizeText(product.code || "").includes(q) ||
        normalizeText(product.author || "").includes(q) ||
        normalizeText(product.publisher || "").includes(q) ||
        normalizeText(product.description || "").includes(q) ||
        normProdCat.includes(q)
      );
    });
  }, [products, stockFilter, activeCategory, searchQuery]);

  const stats = useMemo(() => {
    const totalTitles = products.length;
    const totalStock = products.reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0,
    );
    const lowStock = products.filter((item) => {
      const q = Number(item.quantity || 0);
      return q > 0 && q <= 5;
    }).length;
    const outOfStock = products.filter((item) => {
      const q = Number(item.quantity || 0);
      return q <= 0;
    }).length;

    return { totalTitles, totalStock, lowStock, outOfStock };
  }, [products]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <ProductsHeader
        onAddClick={() => {
          setEditingProduct(null);
          setModalOpen(true);
        }}
      />

      {/* كروت الإحصائيات مع كارت الكتب التي نفذت من المخزون وكارت قاربت على الانتهاء */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setStockFilter("all")}
          className={`bg-white rounded-2xl border p-5 flex items-center justify-between text-right transition-all cursor-pointer shadow-2xs ${
            stockFilter === "all"
              ? "border-primary/50 ring-2 ring-primary/20"
              : "border-border/80 hover:border-primary/40"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-muted">
                إجمالي عناوين الكتب
              </span>
              <p className="text-2xl font-black text-heading mt-0.5">
                {stats.totalTitles}{" "}
                <span className="text-xs font-semibold text-muted">عنوان</span>
              </p>
            </div>
          </div>
        </button>

        <div className="bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-success-light text-success flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-muted">
              إجمالي النسخ بالمخزن
            </span>
            <p className="text-2xl font-black text-heading mt-0.5">
              {stats.totalStock}{" "}
              <span className="text-xs font-semibold text-muted">نسخة</span>
            </p>
          </div>
        </div>

        {/* كارت الكتب التي قاربت على الإنتهاء (قابل للنقر للتصفية) */}
        <button
          type="button"
          onClick={() =>
            setStockFilter((prev) => (prev === "low_stock" ? "all" : "low_stock"))
          }
          className={`bg-white rounded-2xl border p-5 flex items-center justify-between text-right transition-all cursor-pointer shadow-2xs ${
            stockFilter === "low_stock"
              ? "border-warning ring-2 ring-warning/30 bg-warning-light/15"
              : "border-border/80 hover:border-warning/40"
          }`}
          title="اضغط لتصفية الكتب التي قاربت على الانتهاء"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-warning-light text-warning flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-muted">
                  كتب قاربت على الإنتهاء
                </span>
                {stockFilter === "low_stock" && (
                  <span className="text-[10px] bg-warning text-white font-extrabold px-1.5 py-0.5 rounded-full">
                    مُفعّل
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-heading mt-0.5">
                {stats.lowStock}{" "}
                <span className="text-xs font-semibold text-muted">كتاب</span>
              </p>
            </div>
          </div>
        </button>

        {/* كارت الكتب التي نفذت من المخزون (قابل للنقر للتصفية) */}
        <button
          type="button"
          onClick={() =>
            setStockFilter((prev) =>
              prev === "out_of_stock" ? "all" : "out_of_stock",
            )
          }
          className={`bg-white rounded-2xl border p-5 flex items-center justify-between text-right transition-all cursor-pointer shadow-2xs ${
            stockFilter === "out_of_stock"
              ? "border-danger ring-2 ring-danger/30 bg-danger-light/15"
              : "border-border/80 hover:border-danger/40"
          }`}
          title="اضغط لتصفية الكتب التي نفذت من المخزون"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-danger-light text-danger flex items-center justify-center shrink-0">
              <PackageX className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-muted">
                  كتب نفدت من المخزون
                </span>
                {stockFilter === "out_of_stock" && (
                  <span className="text-[10px] bg-danger text-white font-extrabold px-1.5 py-0.5 rounded-full">
                    مُفعّل
                  </span>
                )}
              </div>
              <p className="text-2xl font-black text-heading mt-0.5">
                {stats.outOfStock}{" "}
                <span className="text-xs font-semibold text-muted">كتاب</span>
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* أزرار الـ Toggle لتصفية المخزون */}
      <div className="bg-white rounded-2xl border border-border/80 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-muted ml-1">
            تصفية المخزون السريعة:
          </span>

          <button
            type="button"
            onClick={() => setStockFilter("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              stockFilter === "all"
                ? "bg-heading text-white shadow-2xs"
                : "bg-surface-subtle text-sub hover:text-heading hover:bg-surface-hover"
            }`}
          >
            عرض الكل ({products.length})
          </button>

          {/* زر Toggle للكتب التي نفذت من المخزون */}
          <button
            type="button"
            onClick={() =>
              setStockFilter((prev) =>
                prev === "out_of_stock" ? "all" : "out_of_stock",
              )
            }
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
              stockFilter === "out_of_stock"
                ? "bg-danger text-white border-danger shadow-xs shadow-danger/25"
                : "bg-white text-sub border-border/80 hover:border-danger/40 hover:text-danger"
            }`}
          >
            <PackageX className="w-4 h-4 shrink-0" />
            <span>نفدت من المخزون</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[11px] font-black font-mono ${
                stockFilter === "out_of_stock"
                  ? "bg-white text-danger"
                  : "bg-danger-light text-danger"
              }`}
            >
              {stats.outOfStock}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                stockFilter === "out_of_stock"
                  ? "bg-white animate-ping"
                  : "bg-gray-300"
              }`}
            />
          </button>

          {/* زر Toggle للكتب التي قاربت على الإنتهاء */}
          <button
            type="button"
            onClick={() =>
              setStockFilter((prev) =>
                prev === "low_stock" ? "all" : "low_stock",
              )
            }
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
              stockFilter === "low_stock"
                ? "bg-warning text-white border-warning shadow-xs shadow-warning/25"
                : "bg-white text-sub border-border/80 hover:border-warning/40 hover:text-warning"
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>قاربت على الإنتهاء</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[11px] font-black font-mono ${
                stockFilter === "low_stock"
                  ? "bg-white text-warning"
                  : "bg-warning-light text-warning"
              }`}
            >
              {stats.lowStock}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                stockFilter === "low_stock"
                  ? "bg-white animate-ping"
                  : "bg-gray-300"
              }`}
            />
          </button>
        </div>

        {stockFilter !== "all" && (
          <button
            type="button"
            onClick={() => setStockFilter("all")}
            className="inline-flex items-center gap-1.5 text-xs font-black text-muted hover:text-danger transition cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>إلغاء التصفية وعرض جميع الكتب</span>
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-sub border-border/90 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0">
          <div className="relative w-full lg:w-72 shrink-0">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعنوان، الكود، أو المؤلف..."
              className="w-full bg-white border border-border/90 rounded-2xl py-2.5 pr-10 pl-4 text-xs sm:text-sm text-body focus:outline-none focus:border-primary transition"
            />
          </div>

          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              await fetchProducts();
              toast.success("تم تحديث قائمة المخزون والكتب بنجاح");
            }}
            title="تحديث قائمة المخزون الآن"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border/90 hover:border-primary hover:text-primary rounded-2xl text-xs sm:text-sm font-extrabold text-sub transition cursor-pointer shadow-2xs shrink-0"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`}
            />
            <span className="hidden sm:inline">تحديث المخزون</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-border/80 py-24 flex flex-col items-center justify-center gap-3 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-bold">
            جاري تحميل قائمة الكتب والمخزون...
          </span>
        </div>
      ) : (
        <ProductsTable
          products={filteredProducts}
          stockFilter={stockFilter}
          onResetStockFilter={() => setStockFilter("all")}
          onEdit={(product) => {
            setEditingProduct(product);
            setModalOpen(true);
          }}
          onDelete={(productId) => setDeletingProductId(productId)}
        />
      )}

      <ProductFormModal
        isOpen={modalOpen}
        editingProduct={editingProduct}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
      />

      <ConfirmModal
        isOpen={Boolean(deletingProductId)}
        title="حذف كتاب من المتجر"
        message="هل أنت متأكد من حذف هذا الكتاب نهائياً من قاعدة بيانات مكتبة الإيمان؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="نعم، احذف الكتاب"
        cancelText="إلغاء وتراجع"
        variant="danger"
        loading={isDeleting}
        onConfirm={confirmDeleteProduct}
        onCancel={() => setDeletingProductId(null)}
      />
    </div>
  );
}
