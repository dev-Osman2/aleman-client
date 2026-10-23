import Link from "next/link";
import { UtensilsCrossed, ArrowRight, Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-[91vh] bg-lightBg flex items-center justify-center p-4 select-none"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-border-subtle text-center overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary-subtle/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary-subtle/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-3xl bg-primary-light border border-primary-light text-primary shadow-xs">
          <UtensilsCrossed className="w-11 h-11" />
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-white p-1.5 rounded-full shadow-xs">
            <Flame className="w-4 h-4 fill-white" />
          </span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-black text-primary tracking-tight mb-2">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-black text-heading mb-3">
          عذراً.. هذه الصفحة غير موجودة!
        </h2>

        <p className="text-muted text-xs sm:text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          يبدو أن الرابط الذي طلبته غير صحيح أو تم نقله. لا تقلق، يمكنك العودة
          إلى قائمة الطعام واختيار وجبتك المفضلة من المشويات والمأكولات الطازجة.
        </p>

        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-primary/20 transition-all duration-150 active:scale-95 cursor-pointer"
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>

        <div className="mt-10 pt-5 border-t border-border-subtle text-[11px] text-muted-light font-bold">
          مطعم السرايا — أشهى المأكولات والمشويات
        </div>
      </div>
    </div>
  );
}
