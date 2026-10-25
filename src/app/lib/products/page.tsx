"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Product } from "@/src/types";
import { getAdminToken } from "@/src/lib/cookies";
import { CATEGORY_TABS } from "@/src/constants/categories";
import ProductsHeader from "@/src/components/admin/products/ProductsHeader";
import ProductsTable from "@/src/components/admin/products/ProductsTable";
import ProductFormModal from "@/src/components/admin/products/ProductFormModal";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import { Search, Loader2, BookOpen, Boxes, AlertTriangle } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

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

  // حفظ أو تعديل الكتاب عبر مسارات الأدمن
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
        prev.map((p) => (p.id === editingProduct!.id ? savedBook : p))
      );
      toast.success("تم تحديث بيانات الكتاب بنجاح");
    } else {
      setProducts((prev) => [savedBook, ...prev]);
      toast.success("تمت إضافة الكتاب الجديد للمكتبة بنجاح");
    }

    setModalOpen(false);
    setEditingProduct(null);
  };

  // تأكيد وحذف كتاب من النظام
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
            "لا يمكن حذف هذا الكتاب لوجود طلبات سابقة مرتبطة به، يرجى تصفير كمية المخزون بدلاً من الحذف."
        );
      }
    } catch (err) {
      console.error("Failed to delete book:", err);
      toast.error("حدث خطأ في الاتصال أثناء محاولة حذف الكتاب");
    } finally {
      setIsDeleting(false);
    }
  };

  // تصفية الكتب حسب القسم وبحث النص
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all"
          ? true
          : (product.category || "").trim() === activeCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        (product.title || "").toLowerCase().includes(q) ||
        (product.code || "").toLowerCase().includes(q) ||
        (product.author || "").toLowerCase().includes(q) ||
        (product.publisher || "").toLowerCase().includes(q) ||
        (product.description || "").toLowerCase().includes(q) ||
        (product.category || "").toLowerCase().includes(q)
      );
    });
  }, [products, activeCategory, searchQuery]);

  // إحصائيات سريعة للكتب
  const stats = useMemo(() => {
    const totalTitles = products.length;
    const totalStock = products.reduce(
      (acc, item) => acc + Number(item.quantity || 0),
      0
    );
    const lowOrOutStock = products.filter(
      (item) => Number(item.quantity || 0) <= 5
    ).length;

    return { totalTitles, totalStock, lowOrOutStock };
  }, [products]);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* ترويسة الصفحة وزر الإضافة */}
      <ProductsHeader
        onAddClick={() => {
          setEditingProduct(null);
          setModalOpen(true);
        }}
      />

      {/* بطاقات الإحصائيات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-muted">إجمالي عناوين الكتب</span>
            <p className="text-2xl font-black text-heading mt-0.5">
              {stats.totalTitles}{" "}
              <span className="text-xs font-semibold text-muted">عنوان</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-success-light text-success flex items-center justify-center shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-muted">إجمالي النسخ بالمخزن</span>
            <p className="text-2xl font-black text-heading mt-0.5">
              {stats.totalStock}{" "}
              <span className="text-xs font-semibold text-muted">نسخة</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border/80 p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-warning-light text-warning flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-muted">كتب قاربت أو نفدت</span>
            <p className="text-2xl font-black text-heading mt-0.5">
              {stats.lowOrOutStock}{" "}
              <span className="text-xs font-semibold text-muted">كتاب</span>
            </p>
          </div>
        </div>
      </div>

      {/* شريط الأقسام وحقل البحث */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* تبويبات الأقسام */}
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

        {/* حقل البحث */}
        <div className="relative w-full lg:w-80 shrink-0">
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
      </div>

      {/* جدول الكتب أو مؤشر التحميل */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-border/80 py-24 flex flex-col items-center justify-center gap-3 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-bold">جاري تحميل قائمة الكتب والمخزون...</span>
        </div>
      ) : (
        <ProductsTable
          products={filteredProducts}
          onEdit={(product) => {
            setEditingProduct(product);
            setModalOpen(true);
          }}
          onDelete={(productId) => setDeletingProductId(productId)}
        />
      )}

      {/* نافذة إضافة / تعديل الكتاب */}
      <ProductFormModal
        isOpen={modalOpen}
        editingProduct={editingProduct}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
      />

      {/* نافذة تأكيد الحذف */}
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
