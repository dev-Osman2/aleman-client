"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminToken, setAdminUser } from "@/src/lib/cookies";
import {
  Lock,
  LogIn,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { User } from "@/src/types";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const triggerShake = () => {
    setShake(false);
    setTimeout(() => setShake(true), 10);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("يرجى إدخال البريد الإلكتروني أو رقم الهاتف");
      triggerShake();
      return;
    }

    if (!password) {
      setError("يرجى إدخال كلمة المرور");
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message ||
            "بيانات الدخول غير صحيحة، تأكد من الإيميل/الهاتف وكلمة المرور",
        );
        triggerShake();
        return;
      }

      const authData = data.data || data;
      const token = authData.token;
      const user: User | undefined = authData.user;

      if (!token) {
        setError("تعذر الحصول على رمز الجلسة من الخادم");
        triggerShake();
        return;
      }

      if (!user || user.role !== "ADMIN") {
        setError("عذراً، هذا الحساب لا يملك صلاحيات وصول لوحة الإدارة");
        triggerShake();
        return;
      }

      setAdminToken(token);
      setAdminUser(user);

      router.replace("/lib/orders");
    } catch (err) {
      console.error("Login request failed:", err);
      setError("تعذر الاتصال بالسيرفر، تأكد من تشغيل خادم الباك إند");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-dark relative overflow-hidden p-4 selection:bg-primary-light selection:text-primary"
      dir="rtl"
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary-hover/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

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

        {error && (
          <div className="p-3.5 bg-danger-light border border-danger-border text-danger rounded-2xl text-xs font-extrabold flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-extrabold text-sub mb-2">
              البريد الإلكتروني أو رقم الهاتف
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                <UserIcon
                  className={`w-4 h-4 transition-colors ${
                    error ? "text-danger" : "text-primary"
                  }`}
                />
              </span>

              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (error) setError("");
                }}
                placeholder="010xxxxxxx أو admin@aleman.com"
                className={`w-full pr-10 pl-4 py-3.5 bg-surface-soft border rounded-2xl text-sm font-bold text-body focus:bg-white focus:outline-none transition-all ${
                  error
                    ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/15"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/15"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-sub mb-2">
              كلمة المرور السرية
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                <Lock
                  className={`w-4 h-4 transition-colors ${
                    error ? "text-danger" : "text-primary"
                  }`}
                />
              </span>

              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                placeholder="أدخل كلمة المرور الخاصة بحساب الإدارة..."
                className={`w-full pr-10 pl-11 py-3.5 bg-surface-soft border rounded-2xl text-sm font-bold text-body focus:bg-white focus:outline-none transition-all ${
                  error
                    ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/15"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/15"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-light hover:text-primary transition cursor-pointer"
                tabIndex={-1}
                aria-label={
                  showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-l from-primary to-primary-hover hover:from-primary-hover hover:to-primary-hover disabled:opacity-60 text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق من الصلاحيات الأمنية...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول للوحة الإدارة</span>
              </>
            )}
          </button>
        </form>

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
