"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ArrowRight } from "lucide-react";
import Header from "@/src/components/layout/Header";
import { useAuth } from "@/src/context/AuthContext";
import { registerSchema } from "@/src/lib/validation";
import RegisterForm from "@/src/components/auth/RegisterForm";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export default function RegisterPage() {
  const router = useRouter();
  const { saveAuthSession } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);

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
      image: image || undefined,
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
          image: image ? image.trim() : undefined,
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
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء الاتصال بالسيرفر",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/40">
      <Header />

      <main
        className="flex-1 w-full flex flex-col justify-center items-center lg:items-start bg-[url('/phone.webp')] lg:bg-[url('/login.webp')] bg-cover bg-top lg:bg-center bg-no-repeat px-4 sm:px-6 lg:pr-16 xl:pr-24 pt-32 pb-12 sm:py-10"
        dir="rtl"
      >
        <div className="w-full max-w-md">
          <div className="mb-5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-primary bg-white/80 hover:bg-primary-light/50 border border-gray-200 hover:border-primary/30 px-3.5 py-2 rounded-2xl shadow-2xs transition-all duration-200 active:scale-95"
            >
              <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>العودة إلى المتجر</span>
            </Link>
          </div>

          <div className="bg-white/95 backdrop-blur-xs rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-heading">
                  إنشاء حساب جديد
                </h1>
                <p className="text-xs text-muted mt-0.5">
                  سجل حسابك في دار الإيمان لإتمام طلبات الكتب بسهولة
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-extrabold text-red-600">
                {error}
              </div>
            )}

            <RegisterForm
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              image={image || undefined}
              setImage={setImage}
              loading={loading}
              onSubmit={handleRegister}
            />

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
        </div>
      </main>
    </div>
  );
}
