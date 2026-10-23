"use client";

import React from "react";

interface ProductPricingInputsProps {
  price: string;
  setPrice: (val: string) => void;
  oldPrice: string;
  setOldPrice: (val: string) => void;
}

export default function ProductPricingInputs({
  price,
  setPrice,
  oldPrice,
  setOldPrice,
}: ProductPricingInputsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 w-full">
        <label className="block text-xs font-extrabold text-body mb-1.5">
          السعر الحالي (ج) <span className="text-primary">*</span>
        </label>
        <div className="relative flex items-center">
          <input
            type="number"
            step="1"
            min={0}
            max={999}
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="65"
            className="w-full pr-4 pl-12 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
          />
          <span className="absolute left-3 text-muted text-xs font-bold">
            ج
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-muted mb-1.5">
          السعر القديم (اختياري)
        </label>
        <div className="relative flex items-center">
          <input
            type="number"
            step="1"
            min={0}
            max={999}
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            placeholder="80"
            className="w-full pr-4 pl-12 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
          />
          <span className="absolute left-3 text-muted text-xs font-bold">
            ج
          </span>
        </div>
      </div>
    </div>
  );
}
