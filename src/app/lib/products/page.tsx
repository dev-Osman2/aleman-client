"use client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import ProductsHeader from "@/src/components/admin/products/ProductsHeader";
import ProductsTable from "@/src/components/admin/products/ProductsTable";
import ProductFormModal from "@/src/components/admin/products/ProductFormModal";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import ProductsStatCards from "@/src/components/admin/products/ProductsStatCards";
import ProductsStockFilterBar from "@/src/components/admin/products/ProductsStockFilterBar";
import ProductsFilterTabs from "@/src/components/admin/products/ProductsFilterTabs";
import ExcelImportModal from "@/src/components/admin/products/ExcelImportModal";
import { useAdminProducts } from "@/src/components/admin/products/hooks/useAdminProducts";
import { useExcelBooks } from "@/src/components/admin/products/hooks/useExcelBooks";

export default function AdminProductsPage() {
  const {
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
  } = useAdminProducts();

  const {
    isExporting,
    isImportModalOpen,
    selectedFile,
    previewLoading,
    isImporting,
    previewData,
    handleExportExcel,
    handleSelectFile,
    handleConfirmImport,
    handleCloseModal,
  } = useExcelBooks();

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <ProductsHeader
        onAddClick={() => {
          setEditingProduct(null);
          setModalOpen(true);
        }}
        onExportClick={handleExportExcel}
        onFileSelect={handleSelectFile}
        isExporting={isExporting}
      />

      <ProductsStatCards
        stats={stats}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
      />

      <ProductsStockFilterBar
        totalCount={products.length}
        outOfStockCount={stats.outOfStock}
        lowStockCount={stats.lowStock}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
      />

      <ProductsFilterTabs
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
        onRefresh={async () => {
          setLoading(true);
          await fetchProducts();
          toast.success("تم تحديث قائمة المخزون والكتب بنجاح");
        }}
      />

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

      <ExcelImportModal
        isOpen={isImportModalOpen}
        onClose={handleCloseModal}
        selectedFile={selectedFile}
        loading={previewLoading}
        isImporting={isImporting}
        previewData={previewData}
        onConfirm={() => handleConfirmImport(fetchProducts)}
      />

      <ConfirmModal
        isOpen={Boolean(deletingProductId)}
        title="حذف كتاب من المتجر"
        message="هل أنت متأكد من حذف هذا الكتاب نهائياً من قاعدة بيانات دار الإيمان؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="احذف الكتاب"
        cancelText="إلغاء وتراجع"
        variant="danger"
        loading={isDeleting}
        onConfirm={confirmDeleteProduct}
        onCancel={() => setDeletingProductId(null)}
      />
    </div>
  );
}
