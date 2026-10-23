 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminToken } from "@/src/lib/cookies";
import {
  Lock,
  LogIn,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
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
    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/resto/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "كلمة المرور غير صحيحة، حاول مرة أخرى");
        triggerShake();
        return;
      }

      setAdminToken(data.token);
      router.replace("/resto/orders");
    } catch {
      setError("تعذر الاتصال بالسيرفر، تأكد من تشغيل الخادم");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[91vh] flex items-center justify-center bg-dark relative overflow-hidden p-4"
      dir="rtl"
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-warning/15 blur-3xl pointer-events-none" />

      <div
        className={`w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-primary-subtle/40 p-7 sm:p-9 flex flex-col gap-6 relative z-10 ${
          shake ? "animate-shake border-danger-border" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold bg-primary-light text-primary px-3 py-1 rounded-full border border-primary/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>بوابة الإدارة المعتمدة</span>
          </span>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-bold text-muted-light hover:text-primary transition"
          >
            <span>الموقع الرئيسي</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>

        <div className="text-center flex flex-col gap-2.5 pt-1">
          <div className="w-22 h-22 rounded-3xl bg-gradient-to-br from-primary to-primary-hover p-0.5 mx-auto shadow-lg shadow-primary/25">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center p-2">
              <img
                src="/logo.png"
                alt="مطعم السرايا"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          <h1 className="text-2xl font-black text-heading tracking-tight">
            مطعم السرايا
          </h1>
          <p className="text-xs sm:text-sm text-muted font-medium">
            لوحة تحكم المشرف ونقطة بيع الكاشير (POS)
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-danger-light border border-danger-border text-danger rounded-2xl text-xs font-extrabold flex items-center gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-extrabold text-sub mb-2">
              كلمة مرور المشرف / الكاشير
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
                placeholder="أدخل كلمة المرور السرية..."
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
            className="w-full bg-gradient-to-l from-primary to-primary-hover hover:from-primary-hover hover:to-primary-hover disabled:opacity-60 text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق من الصلاحية...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول للنظام</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
