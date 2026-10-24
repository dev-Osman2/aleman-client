"use client";

import { useState } from "react";
import {
  Headset,
  Info,
  CheckCircle2,
  ChevronDown,
  Compass,
  Search,
} from "lucide-react";
import AboutUsModal from "./AboutUsModal";
import OrderQuickViewModal, { TrackedOrder } from "./OrderQuickViewModal";
import ContactUsModal from "./ContactUsModal";
import { useAuth } from "@/src/context/AuthContext";

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

        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="md:flex-1 w-full h-14 bg-primary-light hover:bg-primary-subtle border border-primary/20 text-primary-hover rounded-2xl px-5 flex items-center justify-start gap-2.5 font-extrabold text-sm transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Info className="w-4 h-4" />
            </div>
            <span>عن مكتبة الإيمان</span>
          </button>

          <button
            type="button"
            onClick={toggleTrackAccordion}
            className="md:flex-1 w-full h-14 bg-success-light hover:bg-success-light border border-success-border/60 text-success rounded-2xl px-5 flex items-center justify-between font-extrabold text-sm transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-success/10 flex items-center justify-center text-success">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span>تتبع طلبك</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-success transition-transform duration-300 ${
                activeAccordion === "track" ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            className="md:flex-1 w-full h-14 bg-info-light hover:bg-info-light border border-info-border/70 text-info rounded-2xl px-5 flex items-center justify-between font-extrabold text-sm transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-info/10 flex items-center justify-center text-info">
                <Headset className="w-4 h-4" />
              </div>
              <span>تواصل معنا وشاركنا رأيك</span>
            </div>
            <span className="text-[11px] bg-info/10 text-info px-2.5 py-0.5 rounded-full font-bold">
              دعم وآراء
            </span>
          </button>
        </div>

        {activeAccordion === "track" && (
          <div className="mt-5 pt-4 border-t border-border-subtle animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="bg-success-light/50 border border-success-border/90 rounded-3xl p-6 max-w-lg mx-auto shadow-xs">
              <div className="flex items-center justify-between text-success font-extrabold text-sm mb-4">
                <span>تفاصيل طلبك</span>
                <span className="text-xs text-success font-bold">
                  استعلام مباشر عن حالة الطلب
                </span>
              </div>

              {errorMsg && (
                <div className="bg-danger-light text-danger text-xs p-3 rounded-xl border border-danger-border mb-4 font-bold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleTrackSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-sub mb-1.5 text-right">
                    رقم الطلب <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    placeholder="أدخل رقم الطلب (مثال: 2)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-success-border/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-success/40 text-right text-body placeholder:text-muted-light transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-success hover:bg-success/90 text-white py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-xs disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? "جاري البحث..." : "عرض تفاصيل الطلب"}</span>
                </button>
              </form>
            </div>
          </div>
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