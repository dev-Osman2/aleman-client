/* eslint-disable @next/next/no-img-element */
import React from "react";
import { X, CheckCircle2 } from "lucide-react";

interface ProductImagePreviewCardProps {
  imagePreview: string;
  onRemove: () => void;
}

export default function ProductImagePreviewCard({
  imagePreview,
  onRemove,
}: ProductImagePreviewCardProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative group">
        <img
          src={imagePreview}
          alt="معاينة غلاف الكتاب"
          className="h-32 w-24 object-cover rounded-xl border border-border shadow-md bg-white"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/120x160/e2e8f0/475569?text=خطأ+في+الرابط";
          }}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-danger text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-danger-hover transition"
          title="إزالة الغلاف"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-right flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1 text-xs font-black text-success">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          <span>تم تجهيز غلاف الكتاب بنجاح</span>
        </span>
        <span
          className="text-[11px] text-muted-light font-mono truncate max-w-xs dir-ltr text-right"
          title={imagePreview}
        >
          {imagePreview.startsWith("http") ? imagePreview : "صورة مرفوعة"}
        </span>
        <span className="text-[11px] text-muted-light font-medium">
          اضغط هنا لتغيير الصورة أو اسحب ملفاً جديداً
        </span>
      </div>
    </div>
  );
}
