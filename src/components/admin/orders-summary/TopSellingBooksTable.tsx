/* eslint-disable @next/next/no-img-element */ import { Flame } from "lucide-react";
import { SoldBookStat } from "./hooks/useOrdersSummary";

interface TopSellingBooksTableProps {
  books: SoldBookStat[];
}

export default function TopSellingBooksTable({
  books,
}: TopSellingBooksTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-2xs">
      <div className="p-6 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          <h2 className="text-base font-black text-heading">
            الكتب الأكثر مبيعاً وطلباً في المتجر
          </h2>
        </div>
        <span className="text-xs font-extrabold text-muted">
          إجمالي {books.length} كتاب مباع
        </span>
      </div>

      {books.length === 0 ? (
        <div className="py-14 text-center text-muted-light font-bold text-sm">
          لا توجد مبيعات مؤكدة بعد لعرض إحصائيات الكتب الأكثر طلباً.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-surface-soft text-sub text-xs font-extrabold border-b border-border">
                <th className="py-3.5 px-6 w-12">#</th>
                <th className="py-3.5 px-6">عنوان الكتاب</th>
                <th className="py-3.5 px-6 text-center">كود الكتاب</th>
                <th className="py-3.5 px-6 text-center">النسخ المباعة</th>
                <th className="py-3.5 px-6 text-left">إجمالي الإيراد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-xs sm:text-sm">
              {books.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-primary-light/10 transition-colors"
                >
                  <td className="py-3.5 px-6 font-black text-primary">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-heading flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-8 h-10 rounded-md object-cover border border-border shadow-2xs"
                      />
                    )}
                    <span>{item.title}</span>
                  </td>
                  <td className="py-3.5 px-6 text-center font-mono font-bold text-muted">
                    #{item.code}
                  </td>
                  <td className="py-3.5 px-6 text-center font-black text-heading">
                    {item.totalQty} نسخة
                  </td>
                  <td className="py-3.5 px-6 text-left font-black text-success">
                    {item.totalRevenue} ج
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
