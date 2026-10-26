"use client";

import { useState, useRef } from "react";
import { Product } from "@/src/types";
import { uploadImageToCloudinary } from "@/src/lib/cloudinary";
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
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setImageUploading(true);
    setUploadError(null);
    setError(null);

    try {
      const secureUrl = await uploadImageToCloudinary(file);
      setImage(secureUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "فشل في رفع صورة الغلاف إلى Cloudinary";
      setUploadError(message);
      setError(message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (imageUploading) {
      setError("يرجى الانتظار لحين اكتمال رفع صورة الغلاف إلى Cloudinary");
      return;
    }
    if (!code.trim()) return setError("يرجى إدخال كود الكتاب المميز");
    if (!title.trim()) return setError("يرجى إدخال عنوان الكتاب");
    if (!category.trim()) return setError("يرجى اختيار قسم الكتاب");

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) return setError("يرجى إدخال سعر بيع صحيح للكتاب");

    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity < 0) return setError("يرجى إدخال كمية مخزون صحيحة (0 أو أكثر)");

    if (!description.trim()) return setError("يرجى كتابة نبذة مختصرة عن الكتاب");
    if (!image.trim()) return setError("يرجى إدخال رابط صورة غلاف الكتاب أو رفعها إلى Cloudinary");

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
    imageUploading,
    uploadError,
    error,
    handleFileSelect,
    handleSubmit,
  };
}
