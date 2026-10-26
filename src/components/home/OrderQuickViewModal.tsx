"use client";

import React from "react";
import {
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import OrderDetailsInfo from "./order-quick-view/OrderDetailsInfo";
import OrderItemsList from "./order-quick-view/OrderItemsList";
import OrderPricingBreakdown from "./order-quick-view/OrderPricingBreakdown";
import { TrackedOrder, TrackedOrderItem } from "./order-quick-view/types";

export type { TrackedOrder, TrackedOrderItem };

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
    0,
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
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
        >
          ✕
        </button>

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

          <div
            className={`mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-extrabold ${statusInfo.bg}`}
          >
            {statusInfo.icon}
            <span>حالة الطلب: {statusInfo.label}</span>
          </div>
        </div>

        <OrderDetailsInfo order={order} paymentLabel={paymentLabel} />

        <OrderItemsList
          items={order.items}
          totalBooksCount={totalBooksCount}
        />

        <OrderPricingBreakdown order={order} />

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
