import React, { useState } from "react";
import { Lock, LogIn, AlertCircle, Loader2, Eye, EyeOff, User as UserIcon } from "lucide-react";

interface AdminLoginFormProps {
  identifier: string;
  setIdentifier: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  error: string;
  setError: (err: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminLoginForm({
  identifier,
  setIdentifier,
  password,
  setPassword,
  loading,
  error,
  setError,
  onSubmit,
}: AdminLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3.5 bg-danger-light border border-danger-border text-danger rounded-2xl text-xs font-extrabold flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

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
            aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
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
  );
}
