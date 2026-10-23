"use client";

export default function StoreClosedAlert() {
  return (
    <div className="p-4 bg-danger-light border border-danger-border rounded-2xl text-right flex flex-col gap-1">
      <p className="text-xs sm:text-sm font-black text-danger">
        🔴 المطعم مغلق حالياً
      </p>
      <p className="text-xs text-danger font-medium">
        عذراً، لا يمكن إرسال طلبات جديدة في وقت إغلاق المطعم. <br />
        مواعيد العمل يومياً من 6:00 صباحا حتى 2:00 ظهراً.
      </p>
    </div>
  );
}
