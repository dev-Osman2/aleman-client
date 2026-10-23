"use client";

import React from "react";

interface ProductDescriptionInputProps {
  description: string;
  setDescription: (val: string) => void;
}

export default function ProductDescriptionInput({
  description,
  setDescription,
}: ProductDescriptionInputProps) {
  return (
    <div>
      <label className="block text-xs font-extrabold text-body mb-1.5">
        وصف الوجبة والمكونات{" "}
        <span className="text-muted-light font-normal">(اختياري)</span>
      </label>
      <div className="relative">
        <textarea
          rows={3}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="مثال: كفتة مشوية على الفحم مع الطحينة والخضار الطازجة..."
          className="w-full p-3.5 bg-white border border-border rounded-2xl text-xs sm:text-sm text-body focus:outline-none focus:border-primary resize-none"
        />
        <span className="absolute bottom-2.5 left-3 text-[11px] font-mono text-muted-light">
          {description.length}/500
        </span>
      </div>
    </div>
  );
}
