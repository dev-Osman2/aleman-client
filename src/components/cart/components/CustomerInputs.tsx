"use client";

import { User, Phone } from "lucide-react";

interface CustomerInputsProps {
  isDineIn: boolean;
  name: string;
  setName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
}

export default function CustomerInputs({
  isDineIn,
  name,
  setName,
  phone,
  setPhone,
}: CustomerInputsProps) {
  return (
    <>
      <div>
        <label className="flex items-center gap-1 text-xs font-bold text-sub mb-1.5">
          <span>الاسم الكامل</span>
          {!isDineIn ? (
            <span className="text-primary">*</span>
          ) : (
            <span className="text-[10px] font-normal text-muted-light">(اختياري)</span>
          )}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-light">
            <User className="w-4 h-4" />
          </span>
          <input
            type="text"
            required={!isDineIn}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: أحمد محمد"
            className="w-full pr-9 pl-3 py-2.5 bg-surface-soft/70 border border-border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-1 text-xs font-bold text-sub mb-1.5">
          <span>رقم الهاتف</span>
          {!isDineIn ? (
            <span className="text-primary">*</span>
          ) : (
            <span className="text-[10px] font-normal text-muted-light">(اختياري)</span>
          )}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-light">
            <Phone className="w-3.5 h-3.5" />
          </span>
          <input
            type="tel"
            required={!isDineIn}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            minLength={11}
            maxLength={11}
            inputMode="numeric"
            placeholder="01xxxxxxxxx"
            className="w-full pr-9 pl-3 py-2.5 bg-surface-soft/70 border border-border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-primary transition-all text-left dir-ltr"
          />
        </div>
      </div>
    </>
  );
}
