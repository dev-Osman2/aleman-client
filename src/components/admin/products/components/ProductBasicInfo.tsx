"use client";

import React from "react";
import { CATEGORIES } from "@/src/constants/categories";

interface ProductBasicInfoProps {
  name: string;
  setName: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
}

export default function ProductBasicInfo({
  name,
  setName,
  category,
  setCategory,
}: ProductBasicInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 w-full">
        <label className="block text-xs font-extrabold text-body mb-1.5">
          اسم الوجبة <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="سندوتش كفتة مشوية"
          className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm text-body focus:outline-none focus:border-primary transition"
        />
      </div>

      <div className="flex-1 w-full">
        <label className="block text-xs font-extrabold text-body mb-1.5">
          القسم <span className="text-primary">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
