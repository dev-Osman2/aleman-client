"use client";

import React from "react";
import { Check } from "lucide-react";
import {
  AVAILABLE_SIZES,
  SizeName,
  SizeConfig,
} from "../hooks/useProductForm";

interface ProductSizesSelectorProps {
  sizesState: Record<SizeName, SizeConfig>;
  onToggleSize: (sz: SizeName) => void;
  onUpdateSizePrice: (sz: SizeName, val: string) => void;
}

export default function ProductSizesSelector({
  sizesState,
  onToggleSize,
  onUpdateSizePrice,
}: ProductSizesSelectorProps) {
  return (
    <div className="bg-primary-light/70 border border-primary-light rounded-2xl p-4 flex flex-col gap-3">
      <label className="block text-xs font-extrabold text-body">
        أحجام الوجبة (اختياري)
      </label>

      <div className="flex gap-3">
        {AVAILABLE_SIZES.map((sz) => {
          const active = sizesState[sz].enabled;
          return (
            <div key={sz} className="flex-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onToggleSize(sz)}
                className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-white text-primary border-primary/40 hover:bg-primary-light"
                }`}
              >
                {active ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-primary" />
                )}
                <span>{sz}</span>
              </button>

              <div className="relative flex items-center">
                <input
                  type="number"
                  step="1"
                  min={0}
                  max={999}
                  value={sizesState[sz].price}
                  onChange={(e) => onUpdateSizePrice(sz, e.target.value)}
                  placeholder={
                    sz === "صغير" ? "50" : sz === "وسط" ? "75" : "90"
                  }
                  className="w-full px-3 py-2 bg-white border border-border rounded-xl text-xs sm:text-sm font-bold text-body focus:outline-none focus:border-primary"
                />
                <span className="absolute left-1.5 bg-surface-subtle text-muted text-[10px] font-bold px-1.5 py-0.5 rounded">
                  ج
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
