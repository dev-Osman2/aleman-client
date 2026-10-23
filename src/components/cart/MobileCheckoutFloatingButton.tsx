"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/src/context/CartContext";

export default function MobileCheckoutFloatingButton() {
  const { cart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSummaryInView, setIsSummaryInView] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const summaryElement = document.getElementById("order-summary");
    if (!summaryElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSummaryInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(summaryElement);

    return () => observer.disconnect();
  }, [mounted]);

  const isVisible = mounted && cart.length > 0 && !isSummaryInView;

  const handleScrollToSummary = () => {
    const summaryElement = document.getElementById("order-summary");
    if (summaryElement) {
      summaryElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={handleScrollToSummary}
      className={`fixed bottom-16 left-0 z-40 lg:hidden text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-r-xl shadow-md border-y border-r border-white/20 bg-success/80 hover:bg-success backdrop-blur-xs active:scale-95 cursor-pointer transition-all duration-300 ease-in-out ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      aria-label="الانتقال إلى ملخص الحساب والدفع"
    >
      ملخص الطلب
    </button>
  );
}
