/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

interface OrderQuickViewModalProps {
  order: any | null;
  onClose: () => void;
}

export default function OrderQuickViewModal({
  order,
  onClose,
}: OrderQuickViewModalProps) {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="bg-success-light text-success px-3 py-1 rounded-full text-xs font-extrabold">
            مؤكد / قيد التحضير بالمطبخ
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-danger-light text-danger px-3 py-1 rounded-full text-xs font-extrabold">
            ملغي
          </span>
        );
      default:
        return (
          <span className="bg-warning-light text-warning px-3 py-1 rounded-full text-xs font-extrabold">
            قيد الانتظار والمراجعة
          </span>
        );
    }
  };

  const phoneDisplay = order.phone || order.phoneNumber || "غير محدد";
  const addressDisplay =
    order.orderType === "dine_in"
      ? `صالة المطعم - ترابيزة رقم (${order.tableNumber})`
      : order.orderType === "pickup"
        ? "الاستلام من الفرع"
        : order.address || "غير محدد";

  const deliveryFee = Number(order.deliveryFee ?? 0);
  const subtotal = Number(order.subtotal ?? 0);
  const totalPrice = Number(
    order.totalPrice ?? order.totalAmount ?? subtotal + deliveryFee,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative text-right animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-subtle hover:bg-surface-hover text-sub transition cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4 pl-10">
          <h3 className="text-lg font-black text-body">
            تفاصيل الطلب:{" "}
            <span className="text-primary">#{order.orderNumber}</span>
          </h3>
          {getStatusBadge(order.status)}
        </div>

        <div className="bg-primary-light/50 border border-primary-light p-4 rounded-2xl mb-4 flex flex-col gap-2 text-xs md:text-sm text-sub">
          <p>
            <strong>الاسم:</strong> {order.customerName || "عميل السرايا"}
          </p>
          <p>
            <strong>الهاتف:</strong>{" "}
            <span className="font-mono">{phoneDisplay}</span>
          </p>
          <p>
            <strong>العنوان / المكان:</strong> {addressDisplay}
          </p>
          {order.paymentReceipt && (
            <p>
              <strong>الرقم المحول منه:</strong>{" "}
              <span className="font-mono text-primary font-bold">
                {order.paymentReceipt}
              </span>
            </p>
          )}
          {order.notes && (
            <p>
              <strong>ملاحظاتك:</strong> {order.notes}
            </p>
          )}
          {order.adminNote && (
            <p className="text-primary">
              <strong>ملاحظات المطعم:</strong> {order.adminNote}
            </p>
          )}
        </div>

        <h4 className="font-extrabold text-sm text-body mb-2">
          الوجبات المطلوبة:
        </h4>
        <div className="max-h-52 overflow-y-auto flex flex-col gap-2 mb-4 pr-1 custom-scrollbar">
          {order.items?.map((item: any, idx: number) => {
            const unitPrice = Number(item.price ?? item.unitPrice ?? 0);
            const qty = Number(item.quantity ?? 1);
            const lineTotal = unitPrice * qty;

            return (
              <div
                key={idx}
                className="flex justify-between items-center bg-surface-soft/80 p-3 rounded-xl border border-border/70 text-xs md:text-sm"
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-body">{item.name}</span>
                  {item.size && (
                    <span className="text-[11px] font-bold bg-primary-subtle text-primary px-2 py-0.5 rounded-md">
                      {item.size}
                    </span>
                  )}
                </div>
                <span className="text-sub shrink-0 font-medium">
                  {qty} × {unitPrice.toFixed(2)} ={" "}
                  <strong className="text-heading font-extrabold">
                    {lineTotal.toFixed(2)} ج
                  </strong>
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border-subtle pt-3 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-sub text-xs md:text-sm">
            <span>مجموع الوجبات:</span>
            <span className="font-bold">{subtotal.toFixed(2)} ج</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between text-sub text-xs md:text-sm">
              <span>رسوم التوصيل:</span>
              <span className="font-bold">{deliveryFee.toFixed(2)} ج</span>
            </div>
          )}
          <div className="flex justify-between font-black text-base text-heading pt-1">
            <span>الإجمالي النهائي:</span>
            <span className="text-primary">{totalPrice.toFixed(2)} ج</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-extrabold text-sm transition cursor-pointer"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}
