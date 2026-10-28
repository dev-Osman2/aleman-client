"use client";

import { ShieldCheck, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import AdminLoginForm from "@/src/components/admin/auth/AdminLoginForm";
import { useAdminLogin } from "@/src/components/admin/auth/useAdminLogin";

export default function AdminLoginPage() {
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    error,
    setError,
    loading,
    shake,
    handleLogin,
  } = useAdminLogin();

  return (
    <div
      className="flex-1 w-full flex flex-col justify-center items-center lg:items-start bg-[url('/adminPhone.webp')] lg:bg-[url('/admin.webp')] bg-cover bg-top lg:bg-center bg-no-repeat px-4 sm:px-6 lg:pr-16 xl:pr-24 pt-32 pb-12 sm:py-10"
      dir="rtl"
    >
      <div
        className={`w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-primary-subtle/50 p-7 sm:p-9 flex flex-col gap-6 relative z-10 transition-transform ${
          shake ? "animate-shake border-danger-border" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold bg-primary-light text-primary px-3 py-1.5 rounded-full border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>بوابة الإدارة المعتمدة</span>
          </span>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-light hover:text-primary transition group"
          >
            <span>المتجر الرئيسي</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:-translate-x-0.5" />
          </Link>
        </div>

        <div className="text-center flex flex-col items-center gap-3 pt-1">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-primary-hover to-dark p-0.5 shadow-xl shadow-primary/20">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center p-2 text-primary">
              <BookOpen className="w-10 h-10" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black text-heading tracking-tight">
              مكتبة الإيمان
            </h1>
            <p className="text-xs sm:text-sm text-muted font-medium">
              لوحة تحكم المشرف ونظام إدارة الكتب والمبيعات
            </p>
          </div>
        </div>

        <AdminLoginForm
          identifier={identifier}
          setIdentifier={setIdentifier}
          password={password}
          setPassword={setPassword}
          loading={loading}
          error={error}
          setError={setError}
          onSubmit={handleLogin}
        />

        <div className="pt-2 border-t border-border-subtle/80 text-center">
          <p className="text-[11px] text-muted flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>نظام محمي ومشفر بالكامل - مخصص للمشرفين فقط</span>
          </p>
        </div>
      </div>
    </div>
  );
}
