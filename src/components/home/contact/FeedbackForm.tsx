import React from "react";
import { MessageSquarePlus, AlertCircle, CheckCircle2, Send, Loader2 } from "lucide-react";

interface FeedbackFormProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  feedback: string;
  setFeedback: (f: string) => void;
  loading: boolean;
  errorMsg: string;
  submitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FeedbackForm({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  feedback,
  setFeedback,
  loading,
  errorMsg,
  submitted,
  onSubmit,
}: FeedbackFormProps) {
  return (
    <div className="bg-surface-soft border border-border/80 rounded-2xl p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquarePlus className="w-5 h-5 text-primary" />
        <h3 className="font-extrabold text-heading text-sm md:text-base">
          إبداء رأيك أو طلب توفير كتاب
        </h3>
      </div>

      {errorMsg && (
        <div className="mb-3 p-3 bg-danger-light border border-danger-border text-danger rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {submitted ? (
        <div className="bg-success-light border border-success-border text-success rounded-xl p-4 text-center flex flex-col gap-1.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
          <p className="font-extrabold text-sm">
            شكراً لك! وصلت رسالتك الآن إلى إدارة مكتبة الإيمان.
          </p>
          <p className="text-xs text-success">
            نسعد دائماً بخدمتكم وتوفير الكتب التي تبحثون عنها.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-sub mb-1">
                الاسم (اختياري)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="مثال: أحمد محمد"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary transition"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-bold text-sub mb-1">
                رقم الهاتف (اختياري)
              </label>
              <input
                type="tel"
                maxLength={11}
                inputMode="numeric"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary transition text-left dir-ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sub mb-1">
              مقترحك أو اسم الكتاب الذي تود توفيره{" "}
              <span className="text-primary">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="اكتب هنا رأيك في خدمات المكتبة أو أسماء الكتب التي ترغب في توفيرها..."
              className="w-full p-3 bg-white border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white py-3 rounded-xl font-extrabold text-xs sm:text-sm transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>إرسال الرأي والمقترح</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
