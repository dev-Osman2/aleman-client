"use client";

import React from "react";
import { Product } from "@/src/types";
import { Loader2, AlertCircle } from "lucide-react";
import { useProductForm } from "./hooks/useProductForm";
import ProductImageUpload from "./components/ProductImageUpload";
import ProductBasicInfo from "./components/ProductBasicInfo";
import ProductPricingInputs from "./components/ProductPricingInputs";
import ProductSizesSelector from "./components/ProductSizesSelector";
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
}: ProductFormProps) {
  const form = useProductForm({ initialData, onSubmit });

  return (
    <form onSubmit={form.handleSubmit} className="flex flex-col gap-5" dir="rtl">
      {form.error && (
        <div className="p-3.5 bg-danger-light border border-danger-border text-danger rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{form.error}</span>
        </div>
      )}

      <ProductImageUpload
        fileInputRef={form.fileInputRef}
        imagePreview={form.imagePreview}
        setImagePreview={form.setImagePreview}
        onFileSelect={form.handleFileSelect}
      />

      <ProductBasicInfo
        name={form.name}
        setName={form.setName}
        category={form.category}
        setCategory={form.setCategory}
      />

      <ProductPricingInputs
        price={form.price}
        setPrice={form.setPrice}
        oldPrice={form.oldPrice}
        setOldPrice={form.setOldPrice}
      />

      <ProductSizesSelector
        sizesState={form.sizesState}
        onToggleSize={form.toggleSize}
        onUpdateSizePrice={form.updateSizePrice}
      />

      <ProductDescriptionInput
        description={form.description}
        setDescription={form.setDescription}
      />

      <button
        type="submit"
        disabled={form.loading}
        className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-black py-3.5 rounded-xl shadow-md shadow-primary/25 flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer"
      >
        {form.loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري رفع الصورة وحفظ الوجبة...</span>
          </>
        ) : (
          <span>
            {initialData ? "حفظ تعديلات الوجبة" : "إضافة الوجبة لقائمة الطعام"}
          </span>
        )}
      </button>
    </form>
  );
}
