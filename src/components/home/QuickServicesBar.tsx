"use client";

import { useState } from "react";
import { Compass } from "lucide-react";
import AboutUsModal from "./AboutUsModal";
import OrderQuickViewModal, { TrackedOrder } from "./OrderQuickViewModal";
import ContactUsModal from "./ContactUsModal";
import { useAuth } from "@/src/context/AuthContext";
import QuickServiceButtons from "./quick-services/QuickServiceButtons";
import OrderTrackForm from "./quick-services/OrderTrackForm";

export default function QuickServicesBar() {
  const [activeAccordion, setActiveAccordion] = useState<"none" | "track">(
    "none"
  );
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [viewingOrder, setViewingOrder] = useState<TrackedOrder | null>(null);
  const { token, isLoading: isAuthLoading } = useAuth();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  const toggleTrackAccordion = () => {
    setErrorMsg("");
    setOrderNumber("");
    setActiveAccordion((prev) => (prev === "track" ? "none" : "track"));
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanOrder = orderNumber.trim();
    if (!cleanOrder) {
      setErrorMsg("يرجى إدخال رقم الطلب.");
      return;
    }

    if (isAuthLoading) {
      setErrorMsg("جار التحقق من تسجيل الدخول، يرجى المحاولة بعد لحظات.");
      return;
    }

    if (!token) {
      setErrorMsg("يرجى تسجيل الدخول أولاً للاستعلام عن طلباتك.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/orders/my-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMsg(
          result.message || "تعذر جلب بيانات الطلب، يرجى المحاولة مجدداً."
        );
        return;
      }

      const ordersList: TrackedOrder[] = Array.isArray(result.data)
        ? result.data
        : [];

      const matchedOrder = ordersList.find(
        (o) => Number(o.id) === Number(cleanOrder)
      );

      if (!matchedOrder) {
        setErrorMsg(`لا يوجد طلب مسجل في حسابك برقم (#${cleanOrder}).`);
        return;
      }

      setViewingOrder(matchedOrder);
      setActiveAccordion("none");
    } catch {
      setErrorMsg("تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-3" dir="rtl">
      <div className="bg-white border border-border/70 rounded-3xl p-6 md:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-primary" />
          <h2 className="font-extrabold text-heading">خدمات سريعة</h2>
        </div>

        <QuickServiceButtons
          onOpenAbout={() => setIsAboutOpen(true)}
          onToggleTrack={toggleTrackAccordion}
          isTrackActive={activeAccordion === "track"}
          onOpenContact={() => setIsContactOpen(true)}
        />

        {activeAccordion === "track" && (
          <OrderTrackForm
            orderNumber={orderNumber}
            setOrderNumber={setOrderNumber}
            loading={loading}
            errorMsg={errorMsg}
            onSubmit={handleTrackSubmit}
          />
        )}
      </div>

      <AboutUsModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
      <ContactUsModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <OrderQuickViewModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
      />
    </section>
  );
}