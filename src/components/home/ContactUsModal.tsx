"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  MessageCircle,
  Send,
  MessageSquarePlus,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "01080859921";
const WHATSAPP_URL = process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/201080859921";
const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/+201080859921";

export default function ContactUsModal({
  isOpen,
  onClose,
}: ContactUsModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { token, isLoading: isAuthLoading } = useAuth();

  if (!isOpen) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setLoading(true);
    setErrorMsg("");

    if (isAuthLoading) {
      setErrorMsg("جار التحقق من تسجيل الدخول، يرجى المحاولة بعد لحظات.");
      setLoading(false);
      return;
    }

    if (!token) {
      setErrorMsg("يرجى تسجيل الدخول أولاً لإرسال رأيك أو طلب توفير كتاب.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/orders/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: customerPhone.trim(),
          message: feedback.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "تعذر إرسال المقترح، حاول مرة أخرى.");
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setFeedback("");
        setCustomerName("");
        setCustomerPhone("");
        setSubmitted(false);
      }, 3500);
    } catch {
      setErrorMsg("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-3xl p-6 md:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto text-right text-body leading-relaxed animate-in fade-in zoom-in-95 duration-200 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full bg-surface-subtle hover:bg-surface-hover text-sub transition cursor-pointer"
        >
          ✕
        </button>

        <div className="border-b border-border-subtle pb-4 mb-5">
          <h2 className="text-xl md:text-2xl font-black text-primary mb-1.5 flex items-center gap-2">
            <span>📞</span> تواصل مع مكتبة الإيمان
          </h2>
          <p className="text-xs md:text-sm text-sub">
            يسعدنا دائماً تواصلكم معنا للاستفسار عن الكتب والطبعات أو متابعة
            طلباتكم، كما نرحب بمقترحاتكم لتطوير خدمات المكتبة.
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <h3 className="text-xs font-extrabold text-muted uppercase">
            قنوات التواصل المباشر
          </h3>

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:flex-1 w-full flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-success-light hover:bg-success-light/80 border border-success-border/80 text-success transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xs">واتساب</span>
              <span className="font-mono font-bold text-xs text-success dir-ltr">
                {CONTACT_PHONE}
              </span>
            </a>

            <a
              href={`tel:${CONTACT_PHONE}`}
              className="sm:flex-1 w-full flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-primary-light hover:bg-primary-subtle/80 border border-primary/25 text-primary-hover transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <PhoneCall className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xs">اتصال هاتفي</span>
              <span className="font-mono font-bold text-xs text-primary dir-ltr">
                {CONTACT_PHONE}
              </span>
            </a>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:flex-1 w-full flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-info-light hover:bg-info-light/80 border border-info-border/80 text-info transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-info text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
                <Send className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xs">تلجرام</span>
              <span className="font-mono font-bold text-xs text-info dir-ltr">
                {CONTACT_PHONE}
              </span>
            </a>
          </div>
        </div>

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
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-3">
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

        <button
          onClick={onClose}
          className="w-full mt-5 bg-surface-subtle hover:bg-surface-hover text-sub py-2.5 rounded-xl font-bold text-sm transition cursor-pointer"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}