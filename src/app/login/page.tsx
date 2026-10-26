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

      saveAuthSession(json.data.token, json.data.user);

      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] sm:min-h-[91vh] flex flex-col bg-gray-50/40">
      <Header />

      <main
        className="flex-1 w-full flex flex-col justify-center items-center lg:items-start bg-[url('/phone.webp')] lg:bg-[url('/login.webp')] bg-cover bg-top lg:bg-center bg-no-repeat px-4 sm:px-6 lg:pr-16 xl:pr-24 pt-32 pb-12 sm:py-10"
        dir="rtl"
      >
        <div className="w-full max-w-md">
          <div className="mb-5">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-primary bg-white/85 hover:bg-primary-light/50 border border-gray-200/80 hover:border-primary/30 px-3.5 py-2 rounded-2xl shadow-xs transition-all duration-200 active:scale-95"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>العودة إلى المتجر</span>
            </Link>
          </div>

          <div className="bg-white/95 backdrop-blur-xs rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <LogIn className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-heading">
                  تسجيل الدخول
                </h1>
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
              <div>
                <label className="block text-xs font-extrabold text-heading mb-1.5">
                  البريد الإلكتروني أو رقم الهاتف
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="010xxxxxxxx أو name@example.com"
                    className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none bg-white"
                  />
                  <UserCheck className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
                </div>
              </div>

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
                    className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none bg-white"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-2xl bg-primary hover:opacity-95 py-3.5 text-sm font-black text-white shadow-sm transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
              >
                {loading ? "جاري تسجيل الدخول..." : "دخول"}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs font-bold text-muted">
              ليس لديك حساب في المكتبة؟
              <Link
                href="/register"
                className="text-primary font-extrabold hover:underline"
              >
                أنشئ حساباً جديداً الآن
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
