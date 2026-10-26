"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminToken, setAdminUser } from "@/src/lib/cookies";
import { User } from "@/src/types";

export function useAdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

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
          data.message || "بيانات الدخول غير صحيحة، تأكد من الإيميل/الهاتف وكلمة المرور",
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

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    error,
    setError,
    loading,
    shake,
    handleLogin,
  };
}
