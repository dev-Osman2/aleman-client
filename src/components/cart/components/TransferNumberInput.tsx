"use client";

import { Smartphone } from "lucide-react";

interface TransferNumberInputProps {
  transferNumber: string;
  setTransferNumber: (val: string) => void;
}

export default function TransferNumberInput({
  transferNumber,
  setTransferNumber,
}: TransferNumberInputProps) {
  return (
    <div>
      <label className="flex items-center gap-1 text-xs font-bold text-sub mb-1.5">
        <span>الرقم الذي حولت منه المبلغ</span>
        <span className="text-primary">*</span>
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-light">
          <Smartphone className="w-4 h-4 text-primary" />
        </span>
        <input
          type="tel"
          required
          value={transferNumber}
          minLength={11}
          maxLength={11}
          inputMode="numeric"
          onChange={(e) => setTransferNumber(e.target.value)}
          placeholder="اكتب الرقم أو حساب إنستاباي المحول منه..."
          className="w-full pr-9 pl-3 py-2.5 bg-white border border-primary/40 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-left dir-ltr"
        />
      </div>
      <p className="text-[10px] text-muted-light mt-1">
        يرجى كتابة الرقم المحول منه لتأكيد طلبك فوراً في المطبخ
      </p>
    </div>
  );
}
