"use client";

import React from "react";
import DirectContactChannels from "./contact/DirectContactChannels";
import FeedbackForm from "./contact/FeedbackForm";
import { useFeedbackForm } from "./contact/useFeedbackForm";

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "01080859921";
const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/201080859921";
const TELEGRAM_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/+201080859921";

export default function ContactUsModal({
  isOpen,
  onClose,
}: ContactUsModalProps) {
  const {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    feedback,
    setFeedback,
    loading,
    errorMsg,
    submitted,
    handleFeedbackSubmit,
  } = useFeedbackForm();

  if (!isOpen) return null;

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

        <DirectContactChannels
          contactPhone={CONTACT_PHONE}
          whatsappUrl={WHATSAPP_URL}
          telegramUrl={TELEGRAM_URL}
        />

        <FeedbackForm
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          feedback={feedback}
          setFeedback={setFeedback}
          loading={loading}
          errorMsg={errorMsg}
          submitted={submitted}
          onSubmit={handleFeedbackSubmit}
        />

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