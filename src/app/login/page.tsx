"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Lock, UserCheck, ArrowRight } from "lucide-react";
import Header from "@/src/components/layout/Header";
import { useAuth } from "@/src/context/AuthContext";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
console.log("API URL is:", apiUrl);

export default function LoginPage() {
  const router = useRouter();
  const { saveAuthSession } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "بيانات الدخول غير صحيحة");
      }

      // حفظ التوكن وبيانات المستخدم في الجلسة
      saveAuthSession(json.data.token, json.data.user);

      // إذا كان الحساب للأدمن يمكن توجيهه للوحة التحكم أو للصفحة الرئيسية
      router.push("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container mx-auto h-[82vh] px-4 py-10 max-w-md" dir="rtl">
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-primary hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى المتجر</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-border-subtle p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-heading">تسجيل الدخول</h1>
              <p className="text-xs text-muted mt-0.5">
                أدخل بريدك الإلكتروني أو رقم هاتفك للمتابعة
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-extrabold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* البريد الإلكتروني أو رقم الهاتف */}
            <div>
              <label className="block text-xs font-extrabold text-heading mb-1.5">
                البريد الإلكتروني أو رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="010xxxxxxxx أو name@example.com"
                  className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none"
                />
                <UserCheck className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-xs font-extrabold text-heading mb-1.5">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-2xl bg-primary hover:opacity-95 py-3.5 text-sm font-black text-white shadow-sm transition-all disabled:opacity-50 active:scale-98"
            >
              {loading ? "جاري تسجيل الدخول..." : "دخول"}
            </button>
          </form>

          {/* رابط الانتقال لصفحة إنشاء حساب جديد */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs font-bold text-muted">
            ليس لديك حساب في المكتبة؟{" "}
            <Link href="/register" className="text-primary font-extrabold hover:underline">
              أنشئ حساباً جديداً الآن
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}