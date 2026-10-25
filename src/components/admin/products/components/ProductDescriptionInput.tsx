"use client";

import React from "react";
import { AlignLeft, FileText } from "lucide-react";

interface ProductDescriptionInputProps {
  description: string;
  setDescription: (val: string) => void;
  fullDescription: string;
  setFullDescription: (val: string) => void;
}

export default function ProductDescriptionInput({
  description,
  setDescription,
  fullDescription,
  setFullDescription,
}: ProductDescriptionInputProps) {
  return (
    <div className="flex flex-col gap-4" dir="rtl">
      {/* النبذة المختصرة */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-extrabold text-heading flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-primary" />
            <span>النبذة المختصرة عن الكتاب</span>
            <span className="text-danger">*</span>
          </label>
          <span className="text-[11px] font-mono text-muted-light">
            {description.length}/300 حرف
          </span>
        </div>
        <textarea
          rows={2}
          maxLength={300}
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="نبذة سريعة تلخص فكرة وموضوع الكتاب (تظهر في بطاقات المتجر السريعة)..."
          className="w-full p-3.5 bg-white border border-border rounded-xl text-xs sm:text-sm text-body focus:outline-none focus:border-primary resize-none transition"
        />
      </div>

      {/* الوصف الشامل والفهرس */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-extrabold text-heading flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>الوصف التفصيلي وفهرس الموضوعات</span>
            <span className="text-muted-light font-normal">(اختياري)</span>
          </label>
          <span className="text-[11px] font-mono text-muted-light">
            {fullDescription.length}/2000 حرف
          </span>
        </div>
        <textarea
          rows={4}
          maxLength={2000}
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          placeholder="مقدمة الكتاب، تفاصيل الأبواب والفصول، وما يتميز به هذا الإصدار..."
          className="w-full p-3.5 bg-white border border-border rounded-xl text-xs sm:text-sm text-body focus:outline-none focus:border-primary resize-none transition custom-scrollbar"
        />
      </div>
    </div>
  );
}
