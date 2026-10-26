import React from "react";
import { Clock, CheckCircle2, XCircle, CreditCard } from "lucide-react";

interface SummaryStatusAndPaymentProps {
  confirmedCount: number;
  pendingCount: number;
  cancelledCount: number;
  instapayCount: number;
  vodafoneCount: number;
}

export default function SummaryStatusAndPayment({
  confirmedCount,
  pendingCount,
  cancelledCount,
  instapayCount,
  vodafoneCount,
}: SummaryStatusAndPaymentProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 bg-white rounded-3xl border border-border/80 p-6 flex flex-col gap-4 shadow-2xs">
        <h2 className="text-base font-black text-heading flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>توزيع حالات الطلبات الحالية</span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-success-light/60 border border-success-border rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center text-success mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="block text-xs font-bold text-success">
              مؤكد ومكتمل
            </span>
            <span className="text-xl font-black text-heading mt-1 block">
              {confirmedCount}
            </span>
          </div>

          <div className="flex-1 bg-warning-light/60 border border-warning-border rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center text-warning mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <span className="block text-xs font-bold text-warning">
              قيد المراجعة
            </span>
            <span className="text-xl font-black text-heading mt-1 block">
              {pendingCount}
            </span>
          </div>

          <div className="flex-1 bg-danger-light/60 border border-danger-border rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center text-danger mb-1">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="block text-xs font-bold text-danger">
              طلبات ملغاة
            </span>
            <span className="text-xl font-black text-heading mt-1 block">
              {cancelledCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-border/80 p-6 flex flex-col gap-4 shadow-2xs">
        <h2 className="text-base font-black text-heading flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <span>طرق الدفع المستخدمة</span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-surface-soft border border-border rounded-2xl p-4 text-right flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-muted">
                إنستاباي (InstaPay)
              </span>
              <span className="text-xl font-black text-heading mt-1 block">
                {instapayCount} طلب
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-black text-xs font-mono">
              IP
            </div>
          </div>

          <div className="flex-1 bg-surface-soft border border-border rounded-2xl p-4 text-right flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-muted">
                فودافون كاش
              </span>
              <span className="text-xl font-black text-heading mt-1 block">
                {vodafoneCount} طلب
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-danger-light text-danger flex items-center justify-center font-black text-xs font-mono">
              VF
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
