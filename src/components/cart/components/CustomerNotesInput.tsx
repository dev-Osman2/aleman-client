"use client";

import { FileText } from "lucide-react";

interface CustomerNotesInputProps {
  notes: string;
  setNotes: (val: string) => void;
}

export default function CustomerNotesInput({
  notes,
  setNotes,
}: CustomerNotesInputProps) {
  return (
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
        className="w-full p-3 bg-surface-soft/70 border border-border rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-primary transition-all resize-none"
      />
    </div>
  );
}
