import { CreditCard, ExternalLink, Smartphone } from "lucide-react";
import { PaymentMethod } from "@/src/types";
import { INSTAPAY_LINK, VODAFONE_CASH_DISPLAY } from "@/src/constants/payment";

interface CheckoutPaymentSectionProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  transferNumber: string;
  setTransferNumber: (num: string) => void;
  totalPrice: number;
}

export default function CheckoutPaymentSection({
  paymentMethod,
  setPaymentMethod,
  transferNumber,
  setTransferNumber,
  totalPrice,
}: CheckoutPaymentSectionProps) {
  const isInstapay =
    paymentMethod === "INSTAPAY" || (paymentMethod as string) === "instapay";
  const link = isInstapay
    ? INSTAPAY_LINK
    : `tel:*9*7*${VODAFONE_CASH_DISPLAY}*${totalPrice}#`;
  const subtitle = isInstapay
    ? "اضغط هنا للتحويل مباشرة عبر تطبيق إنستاباي:"
    : "اضغط هنا للتحويل مباشرة عبر محفظة كاش:";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="flex items-center gap-1.5 text-xs font-extrabold text-heading mb-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <span>طريقة الدفع</span>
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod("INSTAPAY")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              paymentMethod === "INSTAPAY"
                ? "border-primary bg-primary-light/40 text-primary shadow-xs"
                : "border-gray-200 text-heading hover:bg-gray-50"
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                paymentMethod === "INSTAPAY"
                  ? "border-primary"
                  : "border-gray-300"
              }`}
            >
              {paymentMethod === "INSTAPAY" && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </span>
            <span>إنستاباي (InstaPay)</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("VODAFONE_CASH")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              paymentMethod === "VODAFONE_CASH"
                ? "border-primary bg-primary-light/40 text-primary shadow-xs"
                : "border-gray-200 text-heading hover:bg-gray-50"
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                paymentMethod === "VODAFONE_CASH"
                  ? "border-primary"
                  : "border-gray-300"
              }`}
            >
              {paymentMethod === "VODAFONE_CASH" && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </span>
            <span>فودافون كاش</span>
          </button>
        </div>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl bg-primary-light/50 hover:bg-primary-subtle/80 border border-primary/20 hover:border-primary/40 p-4 text-center space-y-1.5 transition-all group shadow-2xs cursor-pointer"
      >
        <p className="text-xs font-extrabold text-heading">{subtitle}</p>
        <div className="inline-flex items-center justify-center gap-2 text-base md:text-lg font-black text-primary tracking-wider group-hover:underline">
          <span className="font-mono dir-ltr">{VODAFONE_CASH_DISPLAY}</span>
          <ExternalLink className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
        </div>
      </a>

      <div>
        <label className="block text-xs font-extrabold text-heading mb-1.5">
          الرقم الذي حولت منه المبلغ <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            maxLength={11}
            required
            value={transferNumber}
            onChange={(e) => setTransferNumber(e.target.value)}
            placeholder="اكتب الرقم أو حساب إنستاباي المحول منه..."
            className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none transition-colors"
          />
          <Smartphone className="w-4 h-4 text-primary absolute right-3.5 top-3.5" />
        </div>
        <span className="block text-[11px] text-muted mt-1">
          يرجى كتابة الرقم المحول منه لتأكيد طلبك وتجهيز الكتب فوراً
        </span>
      </div>
    </div>
  );
}
