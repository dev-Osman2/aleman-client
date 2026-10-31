"use client";

import React, { useState, useRef } from "react";
import { Camera, Trash2, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "@/src/lib/cloudinary";

interface UserAvatarUploadProps {
  currentImage?: string | null;
  onImageUploaded: (url: string | null) => void;
  disabled?: boolean;
  label?: string;
  subLabel?: string;
  isOptional?: boolean;
}

export default function UserAvatarUpload({
  currentImage,
  onImageUploaded,
  disabled = false,
  label = "الصورة الشخصية",
  subLabel = "صيغ JPG, PNG أو WebP (اختياري)",
  isOptional = false,
}: UserAvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // تحديث المعاينة إذا تغير currentImage من الخارج
  React.useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)");
      return;
    }

    // معاينة سريعة أثناء الرفع
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    const loadingToast = toast.loading("جاري رفع الصورة الشخصية...");

    try {
      const secureUrl = await uploadImageToCloudinary(file);
      setPreview(secureUrl);
      onImageUploaded(secureUrl);
      toast.dismiss(loadingToast);
      toast.success("تم رفع الصورة بنجاح");
    } catch (err: any) {
      console.error("Failed to upload avatar:", err);
      toast.dismiss(loadingToast);
      toast.error(err.message || "تعذر رفع الصورة");
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded(null);
    toast.info("تمت إزالة الصورة");
  };

  return (
    <div className="flex flex-col gap-2.5" dir="rtl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-heading flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-primary" />
          <span>{label}</span>
          {isOptional && (
            <span className="text-muted-light font-medium text-[11px]">
              (اختياري)
            </span>
          )}
        </label>
      </div>

      <div className="p-4 bg-surface-soft/80 border border-border/80 rounded-2xl flex items-center gap-4">
        {/* الصورة الدائرية */}
        <div
          onClick={() => {
            if (!disabled && !uploading) fileInputRef.current?.click();
          }}
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary-light border-2 border-dashed border-primary/30 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer group transition-all ${
            disabled || uploading
              ? "opacity-60 cursor-not-allowed"
              : "hover:border-primary hover:shadow-xs active:scale-95"
          }`}
          title="اضغط لاختيار صورة"
        >
          {uploading ? (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white gap-1 z-10">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            </div>
          ) : preview ? (
            <img
              src={preview}
              alt="معاينة الصورة"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-primary/70 group-hover:text-primary transition">
              <User className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          )}

          {!uploading && (
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-black">
              تغيير
            </div>
          )}
        </div>

        {/* تفاصيل وأزرار التحكم */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <p className="text-xs text-muted font-medium truncate">{subLabel}</p>

          <div className="flex flex-wrap items-center gap-2 mt-1">
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-primary-light border border-border hover:border-primary/30 text-heading hover:text-primary font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-3.5 h-3.5 text-primary" />
              <span>{preview ? "تغيير الصورة" : "رفع صورة"}</span>
            </button>

            {preview && (
              <button
                type="button"
                disabled={disabled || uploading}
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            )}
          </div>
        </div>

        {/* مدخل الملف المخفي */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          disabled={disabled || uploading}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

