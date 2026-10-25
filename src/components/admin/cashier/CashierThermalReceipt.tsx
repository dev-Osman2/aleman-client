/* eslint-disable @next/next/no-img-element */
"use client";

import { BookOpen } from "lucide-react";

export interface PrintedOrderSnapshot {
  orderNumber: number | string;
  createdAt: string;
  paymentMethod: "cash" | "card" | "instapay";
  items: {
    name: string;
    code?: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
}

export default function CashierThermalReceipt({
  receipt,
}: {
  receipt: PrintedOrderSnapshot | null;
}) {
  if (!receipt) return null;

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0mm !important;
          }
          html,
          body {
            width: 80mm !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
        }
      `}</style>

      <div
        className="hidden print:block w-[80mm] max-w-[80mm] mx-auto p-[6mm] box-border text-black bg-white font-sans text-xs"
        dir="rtl"
      >
        <div className="flex items-start justify-between border-b border-dashed border-black pb-2 mb-2">
          <div className="text-right">
            <h2 className="text-base font-black leading-tight">مكتبة الإيمان</h2>
            <p className="text-[11px] font-medium text-gray-700">للكتب والمطبوعات الإسلامية</p>
            <p className="text-[11px] font-bold mt-1">
              إيصال بيع مباشر #{receipt.orderNumber}
            </p>
            <p className="text-[10px] text-gray-600">{receipt.createdAt}</p>
          </div>

          <div className="w-10 h-10 border border-black rounded-lg flex items-center justify-center p-1">
            <BookOpen className="w-6 h-6 text-black" />
          </div>
        </div>

        <table className="w-full text-right border-b border-dashed border-black pb-2 mb-2 text-[11px]">
          <thead>
            <tr className="border-b border-black">
              <th className="py-1">الكتاب</th>
              <th className="py-1 text-center">الكمية</th>
              <th className="py-1 text-left">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item, idx) => (
              <tr key={idx} className="border-b border-dotted border-gray-300">
                <td className="py-1 font-bold">
                  {item.name}
                  {item.code ? ` (#${item.code})` : ""}
                </td>
                <td className="py-1 text-center font-mono">{item.quantity}</td>
                <td className="py-1 text-left font-bold font-mono">
                  {(item.price * item.quantity).toFixed(2)} ج
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col gap-1 text-xs font-bold pb-2 border-b border-dashed border-black">
          <div className="flex justify-between text-sm font-black">
            <span>الإجمالي المطلوب:</span>
            <span>{Number(receipt.totalPrice).toFixed(2)} ج.م</span>
          </div>
          <div className="flex justify-between text-[11px] text-gray-700">
            <span>طريقة الدفع:</span>
            <span>
              {receipt.paymentMethod === "cash"
                ? "نقدي (كاش)"
                : receipt.paymentMethod === "card"
                  ? "بطاقة دفع إلكتروني"
                  : "إنستاباي / محفظة"}
            </span>
          </div>
        </div>

        <div className="text-center pt-2 text-[10px] text-gray-600 font-medium">
          <p>شكراً لزيارتكم مكتبة الإيمان</p>
          <p>نسعد بخدمتكم دائماً</p>
        </div>
      </div>
    </>
  );
}
