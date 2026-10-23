/* eslint-disable @next/next/no-img-element */
"use client";

export interface AggregatedSummaryItem {
  name: string;
  image?: string;
  ordersCount: number;
  totalQty: number;
  totalPrice: number;
}

interface SummaryDesktopTableProps {
  items: AggregatedSummaryItem[];
}

export default function SummaryDesktopTable({
  items,
}: SummaryDesktopTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-right border-collapse text-sm">
        <thead>
          <tr className="bg-surface-soft border-b border-border text-muted text-xs font-bold">
            <th className="py-4 px-6">اسم المنتج</th>
            <th className="py-4 px-6 text-center">عدد الطلبات</th>
            <th className="py-4 px-6 text-center">إجمالي الكمية المطلوبة</th>
            <th className="py-4 px-6 text-left">إجمالي القيمة</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle text-sub">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-surface-soft/70 transition-colors">
              <td className="py-4 px-6 font-bold text-heading flex items-center gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl object-cover border border-border bg-surface-soft shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
                <span>{item.name}</span>
              </td>
              <td className="py-4 px-6 text-center font-bold text-muted font-mono">
                {item.ordersCount}
              </td>
              <td className="py-4 px-6 text-center font-black text-info font-mono text-base">
                {item.totalQty}
              </td>
              <td className="py-4 px-6 text-left font-bold font-mono text-heading">
                {item.totalPrice.toFixed(2)} ج
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
