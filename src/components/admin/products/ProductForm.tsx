"use client";
import { Product } from "@/src/types";
import { Loader2, AlertCircle, Save, X } from "lucide-react";
import { useProductForm } from "./hooks/useProductForm";
import ProductImageUpload from "./components/ProductImageUpload";
import ProductBasicInfo from "./components/ProductBasicInfo";
import ProductPublishingInfo from "./components/ProductPublishingInfo";
import ProductPricingInputs from "./components/ProductPricingInputs";
import ProductDescriptionInput from "./components/ProductDescriptionInput";

interface ProductFormProps {
  initialData?: Product | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (payload: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const form = useProductForm({ initialData, onSubmit });

  return (
    <form
      onSubmit={form.handleSubmit}
      className="flex flex-col gap-5"
      dir="rtl"
    >
      {form.error && (
        <div className="p-3.5 bg-danger-light border border-danger-border text-danger rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
          <span>{form.error}</span>
        </div>
      )}

      <ProductImageUpload
        fileInputRef={form.fileInputRef}
        imagePreview={form.image}
        setImagePreview={form.setImage}
        onFileSelect={form.handleFileSelect}
        isUploading={form.imageUploading}
        uploadError={form.uploadError}
      />

      <ProductBasicInfo
        code={form.code}
        setCode={form.setCode}
        title={form.title}
        setTitle={form.setTitle}
        author={form.author}
        setAuthor={form.setAuthor}
        category={form.category}
        setCategory={form.setCategory}
      />

      <ProductPricingInputs
        price={form.price}
        setPrice={form.setPrice}
        oldPrice={form.oldPrice}
        setOldPrice={form.setOldPrice}
        quantity={form.quantity}
        setQuantity={form.setQuantity}
      />

      <ProductPublishingInfo
        publisher={form.publisher}
        setPublisher={form.setPublisher}
        pagesCount={form.pagesCount}
        setPagesCount={form.setPagesCount}
      />

      <ProductDescriptionInput
        description={form.description}
        setDescription={form.setDescription}
        fullDescription={form.fullDescription}
        setFullDescription={form.setFullDescription}
      />

      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <button
          type="submit"
          disabled={form.loading || form.imageUploading}
          className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-black py-3.5 rounded-xl shadow-md shadow-primary/25 flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer"
        >
          {form.loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري حفظ بيانات الكتاب في المتجر...</span>
            </>
          ) : form.imageUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري رفع الغلاف إلى Cloudinary...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>
                {initialData
                  ? "حفظ تعديلات الكتاب"
                  : "إضافة الكتاب للمكتبة والمخزون"}
              </span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={form.loading || form.imageUploading}
          className="px-5 py-3.5 bg-surface-soft hover:bg-surface-hover text-sub font-bold rounded-xl text-sm transition cursor-pointer flex items-center gap-1.5"
        >
          <X className="w-4 h-4" />
          <span>إلغاء</span>
        </button>
      </div>
    </form>
  );
}
