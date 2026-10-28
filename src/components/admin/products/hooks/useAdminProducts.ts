import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Product } from "@/src/types";
import { filterAdminProducts } from "./productsFilterHelper";
import { fetchBooksApi, saveBookApi, deleteBookApi } from "./adminProductsApi";

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "out_of_stock" | "low_stock">("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const list = await fetchBooksApi();
      setProducts(list);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      toast.error("تعذر جلب قائمة الكتب من السيرفر");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleSaveProduct = async (payload: Record<string, unknown>) => {
    const isEditing = Boolean(editingProduct);
    const savedBook = await saveBookApi(payload, editingProduct?.id);

    if (isEditing) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct!.id ? savedBook : p)));
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
      const data = await deleteBookApi(deletingProductId);
      if (data.success) {
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

  const filteredProducts = useMemo(() => {
    return filterAdminProducts(products, stockFilter, activeCategory, searchQuery);
  }, [products, stockFilter, activeCategory, searchQuery]);

  const stats = useMemo(() => {
    const totalTitles = products.length;
    const totalStock = products.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
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

  return {
    products,
    loading,
    setLoading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    stockFilter,
    setStockFilter,
    modalOpen,
    setModalOpen,
    editingProduct,
    setEditingProduct,
    deletingProductId,
    setDeletingProductId,
    isDeleting,
    fetchProducts,
    handleSaveProduct,
    confirmDeleteProduct,
    filteredProducts,
    stats,
  };
}
