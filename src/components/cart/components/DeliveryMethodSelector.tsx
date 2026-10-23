"use client";

import { Truck, Store, MapPin } from "lucide-react";

interface DeliveryMethodSelectorProps {
  isPickup: boolean;
  setIsPickup: (val: boolean) => void;
  address: string;
  setAddress: (val: string) => void;
  isDineIn: boolean;
}

export default function DeliveryMethodSelector({
  isPickup,
  setIsPickup,
  address,
  setAddress,
  isDineIn,
}: DeliveryMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => setIsPickup(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer border active:scale-[0.98] ${
            !isPickup
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 ring-2 ring-primary/20"
              : "bg-surface-subtle/80 text-muted-light border-border/90 hover:bg-surface-hover/60 hover:text-sub shadow-none"
          }`}
        >
          <Truck
            className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
              !isPickup ? "scale-110 text-white" : "text-muted-light"
            }`}
          />
          <span>توصيل للمنازل</span>
        </button>

        <button
          type="button"
          onClick={() => setIsPickup(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer border active:scale-[0.98] ${
            isPickup
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 ring-2 ring-primary/20"
              : "bg-surface-subtle/80 text-muted-light border-border/90 hover:bg-surface-hover/60 hover:text-sub shadow-none"
          }`}
        >
          <Store
            className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
              isPickup ? "scale-110 text-white" : "text-muted-light"
            }`}
          />
          <div className="flex flex-col items-start leading-tight">
            <span>الإستلام من الفرع</span>
            <span
              className={`text-[9px] font-medium transition-colors duration-300 ${
                isPickup ? "text-primary-subtle" : "text-muted-light"
              }`}
            >
              (بدون رسوم توصيل)
            </span>
          </div>
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${
          !isPickup
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div>
          <label className="flex items-center gap-1 text-xs font-bold text-sub mb-1.5">
            <span>العنوان التفصيلي</span>
            <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-light">
              <MapPin className="w-4 h-4" />
            </span>
            <input
              type="text"
              required={!isPickup && !isDineIn}
              tabIndex={isPickup ? -1 : 0}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: شارع الجمهورية - بجوار..."
              className="w-full pr-9 pl-3 py-2.5 bg-surface-soft/70 border border-border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
