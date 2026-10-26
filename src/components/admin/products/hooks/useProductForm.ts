"use client";

import { useState, useRef } from "react";
import { Product } from "@/src/types";
import { resizeImageFile } from "@/src/lib/imageUtils";
import { CATEGORIES } from "@/src/constants/categories";

export interface UseProductFormProps {
  initialData?: Product | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (payload: Record<string, any>) => Promise<void>;
}

export function useProductForm({ initialData, onSubmit }: UseProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [code, setCode] = useState(initialData?.code ? String(initialData.code) : "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [publisher, setPublisher] = useState(initialData?.publisher || "");
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [price, setPrice] = useState<string>(
    initialData?.price !== undefined ? String(initialData.price) : ""
  );
  const [oldPrice, setOldPrice] = useState<string>(
    initialData?.oldPrice ? String(initialData.oldPrice) : ""
  );
  const [quantity, setQuantity] = useState<string>(
    initialData?.quantity !== undefined ? String(initialData.quantity) : "1"
  );
  const [pagesCount, setPagesCount] = useState<string>(
    initialData?.pagesCount ? String(initialData.pagesCount) : ""
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [fullDescription, setFullDescription] = useState(initialData?.fullDescription || "");
  const [image, setImage] = useState<string>(initialData?.image || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      const base64 = await resizeImageFile(file);
      setImage(base64);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "فشل في معالجة صورة الغلاف");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    
    if (!code.trim()) {
      setError("يرجى إدخال كود الكتاب المميز");
      return;
    }

    if (!title.trim()) {
      setError("يرجى إدخال عنوان الكتاب");
      return;
    }

    if (!category.trim()) {
      setError("يرجى اختيار قسم الكتاب");
      return;
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("يرجى إدخال سعر بيع صحيح للكتاب");
      return;
    }

    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
      setError("يرجى إدخال كمية مخزون صحيحة (0 أو أكثر)");
      return;
    }

    if (!description.trim()) {
      setError("يرجى كتابة نبذة مختصرة عن الكتاب");
      return;
    }

    if (!image.trim()) {
      setError("يرجى إدخال رابط صورة غلاف الكتاب أو رفعها");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        code: code.trim(),
        title: title.trim(),
        author: author.trim() || null,
        publisher: publisher.trim() || null,
        category: category.trim(),
        price: Math.round(parsedPrice),
        oldPrice: oldPrice.trim() !== "" ? Math.round(Number(oldPrice)) : null,
        quantity: Math.round(parsedQuantity),
        pagesCount: pagesCount.trim() !== "" ? Math.round(Number(pagesCount)) : null,
        description: description.trim(),
        fullDescription: fullDescription.trim() || null,
        image: image.trim(),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء حفظ بيانات الكتاب");
    } finally {
      setLoading(false);
    }
  };

  return {
    fileInputRef,
    code,
    setCode,
    title,
    setTitle,
    author,
    setAuthor,
    publisher,
    setPublisher,
    category,
    setCategory,
    price,
    setPrice,
    oldPrice,
    setOldPrice,
    quantity,
    setQuantity,
    pagesCount,
    setPagesCount,
    description,
    setDescription,
    fullDescription,
    setFullDescription,
    image,
    setImage,
    loading,
    error,
    handleFileSelect,
    handleSubmit,
  };
}
