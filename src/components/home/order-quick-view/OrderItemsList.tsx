import Image from "next/image";
import { BookOpen } from "lucide-react";
import { TrackedOrderItem } from "../OrderQuickViewModal";

interface OrderItemsListProps {
  items: TrackedOrderItem[];
  totalBooksCount: number;
}

export default function OrderItemsList({
  items,
  totalBooksCount,
}: OrderItemsListProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>الكتب المطلوبة</span>
        </h3>
        <span className="text-xs bg-teal-50 text-teal-700 font-bold px-2.5 py-0.5 rounded-full">
          إجمالي النسخ: {totalBooksCount}
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto pr-1 pl-2 divide-y divide-gray-100 border border-gray-100 rounded-2xl p-3 bg-white custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                <Image
                  src={item.book?.image || "/logo.webp"}
                  alt={item.book?.title || "غلاف الكتاب"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1">
                  {item.book?.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-mono">
                    كود: {item.book?.code}
                  </span>
                  <span className="text-xs text-gray-500">
                    الكمية:
                    <strong className="text-gray-800">{item.quantity}</strong> ×
                    {item.priceAtBuy} ج.م
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left shrink-0">
              <span className="font-extrabold text-sm text-teal-700">
                {item.quantity * item.priceAtBuy} ج.م
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
