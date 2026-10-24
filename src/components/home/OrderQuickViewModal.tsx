"use client";

import React from "react";
import Image from "next/image";
import {
  Package,
  MapPin,
  CreditCard,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
} from "lucide-react";

export interface TrackedOrderItem {
  id: string;
  quantity: number;
  priceAtBuy: number;
  orderId: number;
  bookId: string;
  book: {
    code: string;
    title: string;
    image: string;
  };
}

export interface TrackedOrder {
  id: number;
  address: string;
  notes?: string | null;
  paymentMethod: "INSTAPAY" | "VODAFONE_CASH" | string;
  transferNumber: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | string;
  createdAt: string;
  userId: string;
  items: TrackedOrderItem[];
}

interface OrderQuickViewModalProps {
  order: TrackedOrder | null;
  onClose: () => void;
}

export default function OrderQuickViewModal({
  order,
  onClose,
}: OrderQuickViewModalProps) {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return {
          label: "مؤكد - جاري التجهيز والشحن",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        };
      case "CANCELLED":
        return {
          label: "طلب ملغي",
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <XCircle className="w-4 h-4 text-rose-600" />,
        };
      case "PENDING":
      default:
        return {
          label: "قيد المراجعة والانتظار",
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Clock className="w-4 h-4 text-amber-600" />,
        };
    }
  };

  const statusInfo = getStatusBadge(order.status);

  const formattedDate = new Date(order.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const paymentLabel =
    order.paymentMethod === "INSTAPAY"
      ? "إنستاباي (InstaPay)"
      : order.paymentMethod === "VODAFONE_CASH"
      ? "فودافون كاش (Vodafone Cash)"
      : order.paymentMethod;

  const totalBooksCount = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-3xl p-6 md:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto text-right text-body animate-in fade-in zoom-in-95 duration-200 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
        >
          ✕
        </button>

        {/* رأس النافذة ورقم الطلب */}
        <div className="border-b border-gray-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-gray-900">
                تفاصيل الطلب #{order.id}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* شارة حالة الطلب */}
          <div
            className={`mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-extrabold ${statusInfo.bg}`}
          >
            {statusInfo.icon}
            <span>حالة الطلب: {statusInfo.label}</span>
          </div>
        </div>

        {/* معلومات التوصيل والدفع */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">
          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-500 font-bold mb-1">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>عنوان التوصيل</span>
            </div>
            <p className="font-bold text-gray-800 wrap-break-word">
              {order.address}
            </p>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-500 font-bold mb-1">
              <CreditCard className="w-4 h-4 text-teal-600" />
              <span>طريقة الدفع والتحويل</span>
            </div>
            <p className="font-bold text-gray-800">{paymentLabel}</p>
            <p className="text-gray-500 mt-0.5 font-mono dir-ltr text-right">
              رقم التحويل: {order.transferNumber}
            </p>
          </div>

          {order.notes && (
            <div className="sm:col-span-2 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-1">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>ملاحظات على الطلب</span>
              </div>
              <p className="text-gray-700 font-medium">{order.notes}</p>
            </div>
          )}
        </div>

        {/* قائمة الكتب داخل الطلب مع Scroll-Y */}
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
            {order.items.map((item) => (
              <div
                key={item.id}
                className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                    <Image
                      src={item.book?.image || "/logo.png"}
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
                        الكمية: <strong className="text-gray-800">{item.quantity}</strong> × {item.priceAtBuy} ج.م
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

        {/* ملخص الحساب */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-gray-600">
            <span>قيمة الكتب:</span>
            <span className="font-bold text-gray-800">{order.subtotal} ج.م</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>رسوم التوصيل:</span>
            <span className="font-bold text-gray-800">{order.deliveryFee} ج.م</span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm sm:text-base">
            <span className="font-extrabold text-gray-900">الإجمالي النهائي:</span>
            <span className="font-black text-lg text-teal-700">{order.total} ج.م</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-extrabold text-sm transition cursor-pointer"
        >
          إغلاق النافذة
        </button>
      </div>
    </div>
  );
}