import { Phone, MapPin, CreditCard, Check, X } from "lucide-react";
import { SummaryOrder, OrderItem } from "./types";

export type { SummaryOrder, OrderItem };

interface OrderCardProps {
  order: SummaryOrder;
  onStatusChange: (
    orderId: string,
    status: "confirmed" | "cancelled",
  ) => Promise<void>;
  onTogglePayment: (
    orderId: string,
    currentPaidStatus: boolean,
  ) => Promise<void>;
}

export default function OrderCard({
  order,
  onStatusChange,
  onTogglePayment,
}: OrderCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-border/90 shadow-sm p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow w-full md:w-[calc(50%-0.5rem)]">
      <div className="flex items-start justify-between gap-2 border-b border-border-subtle pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-extrabold text-info bg-info-light px-2.5 py-1 rounded-lg">
              #{order.orderNumber}
            </span>
            <h3 className="font-bold text-heading text-sm">
              {order.customerName}
            </h3>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted">
            <span className="flex items-center gap-1 font-mono dir-ltr">
              <Phone className="w-3.5 h-3.5 text-muted-light" />
              {order.phoneNumber}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-muted-light" />
              {order.pickupFromAssociation ? "استلام من المقر" : order.address}
            </span>
          </div>
        </div>

        <span
          className={`text-[11px] font-extrabold px-3 py-1 rounded-lg shrink-0 ${
            order.status === "confirmed"
              ? "bg-success-light text-success border border-success-border"
              : order.status === "cancelled"
                ? "bg-danger-light text-danger border border-danger-border"
                : "bg-warning-light text-warning border border-warning-border"
          }`}
        >
          {order.status === "confirmed"
            ? "مؤكد"
            : order.status === "cancelled"
              ? "ملغي"
              : "قيد المراجعة"}
        </span>
      </div>

      <div className="bg-surface-soft rounded-2xl p-3 flex flex-col gap-1.5 max-h-32 overflow-y-auto custom-scrollbar text-xs">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sub">
            <span className="font-medium truncate max-w-[65%]">
              {item.name}
            </span>
            <span className="font-bold font-mono">
              {item.quantity} × {item.unitPrice} ج
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
        <div>
          <span className="text-[10px] text-muted-light block font-bold">
            المبلغ الإجمالي
          </span>
          <span className="text-base font-black text-heading font-mono">
            {order.totalAmount} ج
          </span>
        </div>

        <div className="flex items-center gap-2 bg-surface-soft px-3 py-1.5 rounded-xl border border-border">
          <CreditCard
            className={`w-4 h-4 ${order.isPaid ? "text-success" : "text-muted-light"}`}
          />
          <span
            className={`text-xs font-bold ${order.isPaid ? "text-success" : "text-muted"}`}
          >
            {order.isPaid ? "تم الدفع" : "لم يُدفع"}
          </span>
          <label className="relative inline-flex cursor-pointer items-center mr-1">
            <input
              type="checkbox"
              checked={Boolean(order.isPaid)}
              onChange={() => onTogglePayment(order._id, Boolean(order.isPaid))}
              className="peer sr-only"
            />
            <span className="h-5 w-9 rounded-full bg-surface-hover transition-colors peer-checked:bg-success"></span>
            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4"></span>
          </label>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => onStatusChange(order._id, "confirmed")}
          disabled={order.status === "confirmed"}
          className="flex-1 py-2 bg-success hover:bg-success disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>تأكيد</span>
        </button>

        <button
          type="button"
          onClick={() => onStatusChange(order._id, "cancelled")}
          disabled={order.status === "cancelled"}
          className="py-2 bg-danger hover:bg-danger disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>إلغاء</span>
        </button>
      </div>
    </div>
  );
}
