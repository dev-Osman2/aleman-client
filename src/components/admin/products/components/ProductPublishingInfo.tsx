"use client";

import React from "react";
import { Building2, FileText } from "lucide-react";

interface ProductPublishingInfoProps {
  publisher: string;
  setPublisher: (val: string) => void;
  pagesCount: string;
  setPagesCount: (val: string) => void;
}

export default function ProductPublishingInfo({
  publisher,
  setPublisher,
  pagesCount,
  setPagesCount,
}: ProductPublishingInfoProps) {
  return (
    <div className="flex flex-wrap gap-4" dir="rtl">
      {/* دار النشر */}
      <div className="w-full sm:w-[calc(50%-0.5rem)]">
        <label className="block text-xs font-extrabold text-heading mb-1.5">
          دار النشر والتوزيع
        </label>
        <div className="relative flex items-center">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
            <Building2 className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            placeholder="مثال: دار ابن الجوزي / دار الفكر العربي"
            className="w-full pr-10 pl-4 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {/* عدد الصفحات */}
      <div className="w-full sm:w-[calc(50%-0.5rem)]">
        <label className="block text-xs font-extrabold text-heading mb-1.5">
          عدد الصفحات
        </label>
        <div className="relative flex items-center">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
            <FileText className="w-4 h-4" />
          </span>
          <input
            type="number"
            min={1}
            value={pagesCount}
            onChange={(e) => setPagesCount(e.target.value)}
            placeholder="مثال: 240"
            className="w-full pr-10 pl-14 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
          />
          <span className="absolute left-3 text-muted text-xs font-bold pointer-events-none">
            صفحة
          </span>
        </div>
      </div>
    </div>
  );
}
