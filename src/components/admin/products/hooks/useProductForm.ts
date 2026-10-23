"use client";

import { useState, useRef } from "react";
import { Product } from "@/src/types";
import { resizeImageFile } from "@/src/lib/imageUtils";

export const AVAILABLE_SIZES = ["صغير", "وسط", "كبير"] as const;
export type SizeName = (typeof AVAILABLE_SIZES)[number];

export interface SizeConfig {
  enabled: boolean;
  price: string;
}

export interface UseProductFormProps {
  initialData?: Product | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (payload: Record<string, any>) => Promise<void>;
}

export function useProductForm({ initialData, onSubmit }: UseProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "المشويات على الفحم");
  const [price, setPrice] = useState<string>(
    initialData?.price !== undefined ? String(initialData.price) : "",
  );
  const [oldPrice, setOldPrice] = useState<string>(
    initialData?.oldPrice ? String(initialData.oldPrice) : "",
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "");

  const [sizesState, setSizesState] = useState<Record<SizeName, SizeConfig>>(() => {
    const map: Record<SizeName, SizeConfig> = {
      صغير: { enabled: false, price: "" },
      وسط: { enabled: false, price: "" },
      كبير: { enabled: false, price: "" },
    };
    if (initialData?.sizes && Array.isArray(initialData.sizes)) {
      for (const s of initialData.sizes) {
        if (map[s.name as SizeName]) {
          map[s.name as SizeName] = { enabled: true, price: String(s.price) };
        }
      }
    }
    return map;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      const base64 = await resizeImageFile(file);
      setImagePreview(base64);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل في معالجة الصورة");
    }
  };

  const toggleSize = (sizeName: SizeName) => {
    setSizesState((prev) => ({
      ...prev,
      [sizeName]: { ...prev[sizeName], enabled: !prev[sizeName].enabled },
    }));
  };

  const updateSizePrice = (sizeName: SizeName, val: string) => {
    setSizesState((prev) => ({
      ...prev,
      [sizeName]: { ...prev[sizeName], enabled: true, price: val },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("يرجى إدخال اسم الوجبة");
      return;
    }

    const activeSizes = AVAILABLE_SIZES.filter(
      (sz) => sizesState[sz].enabled && sizesState[sz].price.trim() !== "",
    ).map((sz) => ({
      name: sz,
      price: Number(sizesState[sz].price),
    }));

    const basePrice =
      price.trim() !== ""
        ? Number(price)
        : activeSizes.length > 0
          ? activeSizes[0].price
          : NaN;

    if (isNaN(basePrice) || basePrice < 0) {
      setError("يرجى إدخال السعر الحالي للوجبة");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        category,
        price: basePrice,
        oldPrice: oldPrice.trim() !== "" ? Number(oldPrice) : null,
        description: description.trim(),
        image: imagePreview,
        sizes: activeSizes,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء حفظ الوجبة");
    } finally {
      setLoading(false);
    }
  };

  return {
    fileInputRef,
    name,
    setName,
    category,
    setCategory,
    price,
    setPrice,
    oldPrice,
    setOldPrice,
    description,
    setDescription,
    imagePreview,
    setImagePreview,
    sizesState,
    loading,
    error,
    handleFileSelect,
    toggleSize,
    updateSizePrice,
    handleSubmit,
  };
}
