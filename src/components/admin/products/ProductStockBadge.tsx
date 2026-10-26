import React from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface ProductStockBadgeProps {
  quantity: number;
}

export default function ProductStockBadge({ quantity }: ProductStockBadgeProps) {
  const isOutOfStock = quantity <= 0;
  const isLowStock = quantity > 0 && quantity <= 5;

  if (isOutOfStock) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-black text-danger bg-danger-light px-3 py-1 rounded-full border border-danger-border">
        <XCircle className="w-3.5 h-3.5" />
        <span>نفد من المخزن</span>
      </span>
    );
  }

  if (isLowStock) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-black text-warning bg-warning-light px-3 py-1 rounded-full border border-warning-border">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>متبقي {quantity} نسخ</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-black text-success bg-success-light px-3 py-1 rounded-full border border-success-border">
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>متوفر ({quantity})</span>
    </span>
  );
}
