"use client";

import { Send, Loader2 } from "lucide-react";

interface SubmitOrderButtonProps {
  loading: boolean;
  disabled: boolean;
}

export default function SubmitOrderButton({
  loading,
  disabled,
}: SubmitOrderButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full bg-primary hover:bg-primary-hover text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>جاري إرسال الطلب...</span>
        </>
      ) : (
        <>
          <Send className="w-4 h-4" />
          <span>تأكيد وإرسال الطلب</span>
        </>
      )}
    </button>
  );
}
