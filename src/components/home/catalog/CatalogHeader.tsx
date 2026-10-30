import { BookOpen } from "lucide-react";

interface CatalogHeaderProps {
  title: string;
  canResetFilter: boolean;
  onResetFilter: () => void;
}

export default function CatalogHeader({
  title,
  canResetFilter,
  onResetFilter,
}: CatalogHeaderProps) {
  return (
    <div className="mb-5 flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary fill-primary/15" />
          <h1 className="text-xl md:text-2xl font-black text-heading">
            {title}
          </h1>
        </div>
        <span className="text-xs md:text-sm text-muted font-medium block mt-1">
          تصفح مجموعتنا الكاملة واطلب نسختك لتصلك حتى باب المنزل
        </span>
      </div>

      {canResetFilter && (
        <button
          type="button"
          onClick={onResetFilter}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary-light hover:bg-primary-subtle border border-primary/25 rounded-full transition-all duration-150 active:scale-95 shadow-xs cursor-pointer"
        >
          <span>الكل</span>
          <span className="w-4 h-4 flex items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] leading-none">
            ✕
          </span>
        </button>
      )}
    </div>
  );
}

