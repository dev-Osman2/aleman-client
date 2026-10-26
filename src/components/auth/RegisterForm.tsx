import React, { useState } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function RegisterForm({
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        className="w-full mt-2 rounded-2xl bg-primary hover:opacity-95 py-3.5 text-sm font-black text-white shadow-sm transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
      >
        {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
      </button>
    </form>
  );
}
