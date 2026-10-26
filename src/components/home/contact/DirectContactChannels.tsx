import React from "react";
import { MessageCircle, PhoneCall, Send } from "lucide-react";

interface DirectContactChannelsProps {
  contactPhone: string;
  whatsappUrl: string;
  telegramUrl: string;
}

export default function DirectContactChannels({
  contactPhone,
  whatsappUrl,
  telegramUrl,
}: DirectContactChannelsProps) {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <h3 className="text-xs font-extrabold text-muted uppercase">
        قنوات التواصل المباشر
      </h3>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sm:flex-1 w-full flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-success-light hover:bg-success-light/80 border border-success-border/80 text-success transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xs">واتساب</span>
          <span className="font-mono font-bold text-xs text-success dir-ltr">
            {contactPhone}
          </span>
        </a>

        <a
          href={`tel:${contactPhone}`}
          className="sm:flex-1 w-full flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-primary-light hover:bg-primary-subtle/80 border border-primary/25 text-primary-hover transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
            <PhoneCall className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xs">اتصال هاتفي</span>
          <span className="font-mono font-bold text-xs text-primary dir-ltr">
            {contactPhone}
          </span>
        </a>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sm:flex-1 w-full flex flex-col items-center justify-center gap-1.5 p-4 rounded-2xl bg-info-light hover:bg-info-light/80 border border-info-border/80 text-info transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-info text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
            <Send className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xs">تلجرام</span>
          <span className="font-mono font-bold text-xs text-info dir-ltr">
            {contactPhone}
          </span>
        </a>
      </div>
    </div>
  );
}
