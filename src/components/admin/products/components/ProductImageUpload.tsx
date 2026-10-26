"use client";

import React, { useState } from "react";
import {
  CloudUpload,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import ProductImagePreviewCard from "./ProductImagePreviewCard";

interface ProductImageUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imagePreview: string;
  setImagePreview: (val: string) => void;
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  uploadError?: string | null;
}

export default function ProductImageUpload({
  fileInputRef,
  imagePreview,
  setImagePreview,
  onFileSelect,
  isUploading = false,
  uploadError = null,
}: ProductImageUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);

  return (
    <div className="flex flex-col gap-3" dir="rtl">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-heading flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-primary" />
          <span>غلاف الكتاب</span>
          <span className="text-danger">*</span>
        </label>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          <span>
            {showUrlInput ? "إخفاء إدخال الرابط" : "إدخال رابط مباشر للصورة"}
          </span>
        </button>
      </div>

      {showUrlInput && (
        <div className="relative">
          <input
            type="url"
            value={imagePreview}
            onChange={(e) => setImagePreview(e.target.value)}
            disabled={isUploading}
            placeholder="https://res.cloudinary.com/..."
            className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-xs sm:text-sm text-body focus:outline-none focus:border-primary transition"
          />
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-danger-light border border-danger-border rounded-xl text-xs font-bold text-danger flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
          <span>{uploadError}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelect(file);
            e.target.value = "";
          }
        }}
        className="hidden"
      />

      <div
        onClick={() => {
          if (!isUploading) fileInputRef.current?.click();
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (isUploading) return;
          const file = e.dataTransfer.files?.[0];
          if (file) onFileSelect(file);
        }}
        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all relative flex flex-col items-center justify-center min-h-[160px] ${
          isUploading
            ? "border-primary/50 bg-primary-light/30 cursor-wait"
            : "border-border hover:border-primary bg-surface-soft/60 hover:bg-primary-light/20 cursor-pointer"
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center gap-2.5 py-3 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shadow-xs">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
            <p className="text-xs sm:text-sm font-black text-primary">
              جاري رفع الغلاف إلى Cloudinary...
            </p>
            <p className="text-[11px] text-muted-light font-medium">
              يتم حفظ الصورة واستخراج الرابط الآمن (secure_url)
            </p>
          </div>
        ) : imagePreview ? (
          <ProductImagePreviewCard
            imagePreview={imagePreview}
            onRemove={() => setImagePreview("")}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shadow-xs">
              <CloudUpload className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-black text-heading">
              اسحب وأفلت غلاف الكتاب هنا، أو اضغط للاختيار
            </p>
            <p className="text-[11px] text-muted-light font-medium">
              يتم الرفع سحابياً ومباشرة إلى Cloudinary (JPG, webp, WebP)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
