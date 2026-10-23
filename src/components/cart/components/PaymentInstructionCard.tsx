"use client";

import { ExternalLink } from "lucide-react";
import {
  INSTAPAY_LINK,
  VODAFONE_CASH_DISPLAY,
  VODAFONE_CASH_LINK,
} from "@/src/constants/payment";
import { CartPaymentMethod } from "@/src/types";

interface PaymentInstructionCardProps {
  paymentMethod: CartPaymentMethod;
  finalTotal: number;
}

export default function PaymentInstructionCard({
  paymentMethod,
  finalTotal,
}: PaymentInstructionCardProps) {
  const isInstapay = paymentMethod === "instapay";
  const link = isInstapay ? INSTAPAY_LINK : `tel:*9*7*${VODAFONE_CASH_DISPLAY}*${finalTotal}#`;
  const subtitle = isInstapay
    ? "اضغط هنا للتحويل مباشرة عبر تطبيق إنستاباي:"
    : "رقم محفظة فودافون كاش للتحويل (اضغط للدفع السريع):";

  return (
    <div className="flex flex-col gap-3">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-primary-light/90 hover:bg-primary-subtle/80 border border-primary/30 rounded-xl p-3 text-center transition-all group shadow-2xs"
      >
        <p className="text-[11px] text-sub font-bold mb-1">{subtitle}</p>
        <div className="inline-flex items-center justify-center gap-1.5 font-extrabold text-primary text-sm sm:text-base font-mono dir-ltr group-hover:underline">
          <span>{VODAFONE_CASH_DISPLAY}</span>
          <ExternalLink className="w-4 h-4 shrink-0" />
        </div>
      </a>
    </div>
  );
}
