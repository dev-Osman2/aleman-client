"use client";

import { FileText, Wallet } from "lucide-react";

interface CashierCartSummaryProps {
  notes: string;
  setNotes: (val: string) => void;
  totalPrice: number;
}

export default function CashierCartSummary({
  notes,
  setNotes,
  totalPrice,
}: CashierCartSummaryProps) {
  return (
    <div className="bg-surface-soft/90 rounded-2xl p-4 flex flex-col gap-2.5 border border-border-subtle text-xs sm:text-sm">
      <div>
        <label className="flex items-center gap-1 text-xs font-bold text-sub mb-1.5">
          <FileText className="w-3.5 h-3.5 text-muted-light" />
          <span>ملاحظات إضافية (اختياري)</span>
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="مثال: بدون بصل، صوص إضافي ..."
          className="w-full p-3 bg-white border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary transition-all resize-none"
        />
      </div>

      <div className="bg-primary-light/90 border border-primary/20 rounded-xl p-3 flex justify-between items-center pt-3">
        <span className="font-extrabold text-primary text-sm sm:text-base flex items-center gap-1.5">
          <Wallet className="w-4 h-4" />
          <span>الإجمالي النهائي:</span>
        </span>
        <span className="text-xl font-black text-primary">
          {totalPrice} ج
        </span>
      </div>
    </div>
  );
}
