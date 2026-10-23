/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { CloudUpload, X } from "lucide-react";

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
  return (
    <div>
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
        className="border-2 border-dashed border-border hover:border-primary bg-surface-soft/40 hover:bg-primary-light/20 rounded-2xl p-6 text-center cursor-pointer transition-all relative"
      >
        {imagePreview ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="معاينة الوجبة"
                className="h-32 w-48 object-cover rounded-2xl border border-border shadow-sm"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagePreview("");
                }}
                className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-danger text-white flex items-center justify-center shadow-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs font-bold text-primary">
              اضغط لتغيير صورة الوجبة (تُرفع تلقائياً إلى Cloudinary)
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="w-14 h-14 rounded-full bg-primary-light text-primary flex items-center justify-center">
              <CloudUpload className="w-7 h-7" />
            </div>
            <p className="text-sm font-black text-body">
              اسحب وأفلت صورة الوجبة هنا
            </p>
            <p className="text-xs text-muted-light font-medium">
              أو اضغط لاختيار ملف من جهازك
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
