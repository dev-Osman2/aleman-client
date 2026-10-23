"use client";

import { AlertTriangle, Trash2, Loader2, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "تأكيد الحذف",
  cancelText = "إلغاء",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      dir="rtl"
      onClick={onCancel}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-border-subtle relative text-right animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-surface-subtle hover:bg-surface-hover text-muted flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDanger
                ? "bg-danger-light text-danger border border-danger-border"
                : "bg-warning-light text-primary border border-primary-light"
            }`}
          >
            {isDanger ? (
              <Trash2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div className="gap-1.5 flex-1 pt-0.5">
            <h3 className="text-base sm:text-lg font-black text-heading">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-muted font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-border-subtle">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface-hover text-sub font-extrabold text-xs sm:text-sm transition cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-60 ${
              isDanger
                ? "bg-danger hover:bg-danger shadow-rose-600/20"
                : "bg-primary hover:bg-primary-hover shadow-primary/20"
            }`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}