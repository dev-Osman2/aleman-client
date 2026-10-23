"use client";

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto text-right text-body leading-relaxed animate-in fade-in zoom-in-95 duration-200 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full bg-surface-subtle hover:bg-surface-hover text-sub transition cursor-pointer"
        >
          ✕
        </button>

        <div className="border-b border-border-subtle pb-4 mb-5">
          <h2 className="text-xl md:text-2xl font-black text-primary mb-2 flex items-center gap-2">
            <span>🍽️</span> عن مطعم السرايا
          </h2>
          <p className="text-sm text-sub leading-relaxed">
            وجهتكم الأولى لأشهى المأكولات والمشويات الطازجة المحضرة بأجود أنواع
            اللحوم والمكونات البلدية 100%. صُممت هذه المنصة لتسهيل تجربة الطلب
            السريع والدفع المباشر، وتوصيل وجباتكم ساخنة وطازجة بأعلى معايير
            الجودة والنظافة.
          </p>
        </div>

        <div className="flex flex-col gap-5 text-sm">
          <div>
            <h3 className="font-extrabold text-heading flex items-center gap-2 mb-1.5 text-base">
              <span>✨</span> رؤيتنا وشغفنا
            </h3>
            <p className="text-sub leading-relaxed">
              تقديم المذاق الشرقي الأصيل بلمسة عصرية، والجمع بين الطعم الغني
              وسرعة الخدمة والأسعار التنافسية لضمان تجربة طعام لا تُنسى لكل
              أفراد العائلة.
            </p>
          </div>

          <div className="bg-warning-light/70 border border-warning-border/70 p-4 rounded-2xl">
            <h3 className="font-extrabold text-heading flex items-center gap-2 mb-2 text-base">
              <span>📍</span> المقر ومواعيد العمل
            </h3>
            <ul className="flex flex-col gap-1.5 text-xs md:text-sm text-sub">
              <li>
                • <strong>مواعيد العمل:</strong> يومياً من الساعة 6:00 صباحا
                وحتى 2:00 ظهراً.
              </li>
              <li>
                • <strong>العنوان:</strong> الأقصر/العوامية (ميدان الصنايع)
                بجوار القرعاني .
              </li>
              <li>
                • <strong>خدمة التوصيل:</strong> تغطية سريعة لجميع المناطق
                المحيطة طوال ساعات العمل.
              </li>
            </ul>
          </div>

          <div className="bg-primary-light/60 border border-primary/20 p-4 rounded-2xl">
            <h3 className="font-extrabold text-primary-hover flex items-center gap-2 mb-2 text-base">
              <span>🛒</span> كيف تطلب عبر المنصة؟
            </h3>
            <ol className="flex flex-col gap-2 text-xs md:text-sm text-body list-decimal list-inside">
              <li>
                <strong>اختر وجبتك:</strong> تصفح قائمة المشويات والمشروبات وحدد
                الحجم والكمية، ثم أضف ملاحظاتك الخاصة.
              </li>
              <li>
                <strong>أكّد الدفع:</strong> حوّل القيمة عبر إنستاباي (InstaPay)
                أو فودافون كاش، واكتب رقمك المحول منه لتأكيد الطلب فوراً.
              </li>
              <li>
                <strong>احفظ رقم الطلب:</strong> بعد الإرسال، احتفظ برقم الطلب
                لتتمكن من معرفة حالته عبر قسم «تتبع طلبك».
              </li>
            </ol>
          </div>

          <div className="bg-primary-light border border-primary/20 p-4 rounded-2xl">
            <h3 className="font-extrabold text-primary-hover flex items-center gap-2 mb-2 text-base">
              <span>📲</span> كيفية تثبيت التطبيق؟
            </h3>
            <ol className="flex flex-col gap-2 text-xs md:text-sm text-body list-decimal list-inside">
              <li>الضغط على الثلاث نقاط التي في أعلى المتصفح.</li>
              <li>
                النزول والضغط على <strong>«التثبيت وإنشاء اختصار»</strong> (أو
                «إضافة إلى الشاشة الرئيسية»).
              </li>
              <li>
                الضغط على <strong>«تثبيت»</strong>.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-extrabold text-heading flex items-center gap-2 mb-2 text-base">
              <span>⚠️</span> ضوابط وسياسة الطلب والتجهيز
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs md:text-sm text-sub">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>طزاجة التحضير:</strong> نبدأ في تجهيز وجبتك فور إتمام
                  عملية التحويل وتأكيدها لضمان وصول المشويات ساخنة وطازجة من
                  الشواية مباشرة.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>تعديل أو إلغاء الطلب:</strong> نظراً لسرعة تجهيز
                  الطعام، يُرجى التواصل الفوري مع الإدارة هاتفياً أو عبر واتساب
                  في حال الرغبة بالتعديل قبل بدء طهي الوجبة.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>متابعة الطلب:</strong> رقم هاتفك ورقم الطلب هما وسيلتك
                  الأساسية لتتبع حالة استلام وتجهيز الوجبة خطوة بخطوة حتى وصول
                  مندوب التوصيل.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-extrabold text-sm transition shadow-xs cursor-pointer"
        >
          فهمت ذلك
        </button>
      </div>
    </div>
  );
}
