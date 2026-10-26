"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import Header from "@/src/components/layout/Header";
import { useAuth } from "@/src/context/AuthContext";
import { registerSchema } from "@/src/lib/validation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
console.log("API URL is:", apiUrl);

export default function RegisterPage() {
  const router = useRouter();
  const { saveAuthSession } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationResult = registerSchema.safeParse({
      name,
      phone,
      email,
      password,
    });

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues?.[0];
      setError(firstIssue?.message || "يرجى التحقق من صحة البيانات المدخلة");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.message ||
            "تعذر إنشاء الحساب، تأكد من عدم تكرار الهاتف أو الإيميل",
        );
      }

      saveAuthSession(json.data.token, json.data.user);

      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main
        className="flex-1 container mx-auto px-4 py-10 max-w-md flex flex-col justify-center"
        dir="rtl"
      >
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
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-heading">
                إنشاء حساب جديد
              </h1>
              <p className="text-xs text-muted mt-0.5">
                سجل حسابك في مكتبة الإيمان لإتمام طلبات الكتب بسهولة
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-extrabold text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-heading mb-1.5">
                الاسم بالكامل <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: عثمان طاهر"
                  className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none"
                />
                <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-heading mb-1.5">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  maxLength={11}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none text-right dir-ltr"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-heading mb-1.5">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-heading mb-1.5">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 أحرف أو أرقام على الأقل"
                  className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-11 text-sm focus:border-primary focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 hover:text-primary transition cursor-pointer"
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
              className="w-full mt-2 rounded-2xl bg-primary hover:opacity-95 py-3.5 text-sm font-black text-white shadow-sm transition-all disabled:opacity-50 active:scale-98"
            >
              {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs font-bold text-muted">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="text-primary font-extrabold hover:underline"
            >
              سجل دخولك من هنا
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
