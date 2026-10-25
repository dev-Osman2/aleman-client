/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { CloudUpload, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

interface ProductImageUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  imagePreview: string;
  setImagePreview: (val: string) => void;
  onFileSelect: (file: File) => void;
}

export default function ProductImageUpload({
  fileInputRef,
  imagePreview,
  setImagePreview,
  onFileSelect,
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
          <span>{showUrlInput ? "إخفاء إدخال الرابط" : "إدخال رابط مباشر للصورة"}</span>
        </button>
      </div>

      {/* حقل الرابط المباشر في حال رغب المشرف بوضع رابط خارجي للغلاف */}
      {showUrlInput && (
        <div className="relative">
          <input
            type="url"
            value={imagePreview}
            onChange={(e) => setImagePreview(e.target.value)}
            placeholder="https://example.com/book-cover.jpg"
            className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-xs sm:text-sm text-body focus:outline-none focus:border-primary transition"
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) onFileSelect(file);
        }}
        className="border-2 border-dashed border-border hover:border-primary bg-surface-soft/60 hover:bg-primary-light/20 rounded-2xl p-5 text-center cursor-pointer transition-all relative flex flex-col items-center justify-center min-h-[160px]"
      >
        {imagePreview ? (
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={imagePreview}
                alt="معاينة غلاف الكتاب"
                className="h-32 w-24 object-cover rounded-xl border border-border shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/120x160/e2e8f0/475569?text=خطأ+في+الرابط";
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagePreview("");
                }}
                className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-danger text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-danger-hover transition"
                title="إزالة الغلاف"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-right flex flex-col gap-1">
              <span className="text-xs font-black text-heading">
                تم تجهيز غلاف الكتاب بنجاح
              </span>
              <span className="text-[11px] text-muted-light font-medium">
                اضغط هنا لتغيير الصورة أو اسحب ملفاً جديداً
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center shadow-xs">
              <CloudUpload className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm font-black text-heading">
              اسحب وأفلت غلاف الكتاب هنا، أو اضغط للاختيار
            </p>
            <p className="text-[11px] text-muted-light font-medium">
              يدعم صور JPG و PNG والروابط المباشرة
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
