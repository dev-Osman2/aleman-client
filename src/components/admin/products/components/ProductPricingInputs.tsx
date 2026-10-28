"use client";
import { DollarSign, Tag, Boxes } from "lucide-react";

interface ProductPricingInputsProps {
  price: string;
  setPrice: (val: string) => void;
  oldPrice: string;
  setOldPrice: (val: string) => void;
  quantity: string;
  setQuantity: (val: string) => void;
}

export default function ProductPricingInputs({
  price,
  setPrice,
  oldPrice,
  setOldPrice,
  quantity,
  setQuantity,
}: ProductPricingInputsProps) {
  return (
    <div className="flex flex-wrap gap-4" dir="rtl">
      <div className="w-full sm:w-[calc(33.333%-0.75rem)]">
        <label className="block text-xs font-extrabold text-heading mb-1.5">
          سعر البيع الحالي (ج) <span className="text-danger">*</span>
        </label>
        <div className="relative flex items-center">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
            <DollarSign className="w-4 h-4" />
          </span>
          <input
            type="number"
            step="1"
            min={1}
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="120"
            className="w-full pr-10 pl-10 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
          />
          <span className="absolute left-3 text-muted text-xs font-bold pointer-events-none">
            ج
          </span>
        </div>
      </div>

      <div className="w-full sm:w-[calc(33.333%-0.75rem)]">
        <label className="block text-xs font-extrabold text-heading mb-1.5">
          السعر السابق قبل الخصم
        </label>
        <div className="relative flex items-center">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
            <Tag className="w-4 h-4" />
          </span>
          <input
            type="number"
            step="1"
            min={0}
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            placeholder="150"
            className="w-full pr-10 pl-10 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
          />
          <span className="absolute left-3 text-muted text-xs font-bold pointer-events-none">
            ج
          </span>
        </div>
      </div>

      <div className="w-full sm:w-[calc(33.333%-0.75rem)]">
        <label className="block text-xs font-extrabold text-heading mb-1.5">
          الكمية المتوفرة في المخزن <span className="text-danger">*</span>
        </label>
        <div className="relative flex items-center">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
            <Boxes className="w-4 h-4" />
          </span>
          <input
            type="number"
            step="1"
            min={0}
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="30"
            className="w-full pr-10 pl-12 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
          />
          <span className="absolute left-3 text-muted text-xs font-bold pointer-events-none">
            نسخة
          </span>
        </div>
      </div>
    </div>
  );
}
