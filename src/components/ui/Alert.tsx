"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface AlertProps {
  type?: "error" | "success" | "info";
  message: string;
  className?: string;
}

export default function Alert({
  type = "error",
  message,
  className = "",
}: AlertProps) {
  const styles = {
    error: "bg-danger-light/90 border-danger-border text-danger",
    success: "bg-success-light/90 border-success-border text-success",
    info: "bg-info-light/90 border-info-border text-info",
  }[type];

  const Icon = {
    error: <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-info shrink-0 mt-0.5" />,
  }[type];

  return (
    <div
      className={`p-3.5 border rounded-2xl text-xs flex items-start gap-2.5 shadow-2xs animate-in fade-in duration-200 text-right ${styles} ${className}`}
      dir="rtl"
    >
      {Icon}
      <p className="font-bold leading-relaxed flex-1">{message}</p>
    </div>
  );
}
