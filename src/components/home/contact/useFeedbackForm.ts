"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { feedbackSchema } from "@/src/lib/validation";

export function useFeedbackForm() {
  const { user, token } = useAuth();
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || "");
      if (!customerPhone) setCustomerPhone(user.phone || "");
    }
  }, [user, customerName, customerPhone]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const validationResult = feedbackSchema.safeParse({
      customerName,
      phone: customerPhone,
      message: feedback,
    });

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues?.[0];
      setErrorMsg(firstIssue?.message || "يرجى التحقق من صحة البيانات المدخلة");
      return;
    }

    setLoading(true);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${apiUrl}/orders/feedback`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          customerName: customerName.trim() || user?.name || undefined,
          phone: customerPhone.trim() || user?.phone || undefined,
          message: feedback.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "تعذر إرسال المقترح، حاول مرة أخرى.");
        return;
      }

      setSubmitted(true);
      setTimeout(() => {
        setFeedback("");
        if (!user) {
          setCustomerName("");
          setCustomerPhone("");
        }
        setSubmitted(false);
      }, 3500);
    } catch {
      setErrorMsg("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    feedback,
    setFeedback,
    loading,
    errorMsg,
    submitted,
    handleFeedbackSubmit,
  };
}
