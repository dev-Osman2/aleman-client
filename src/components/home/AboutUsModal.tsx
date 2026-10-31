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
            <span>📚</span> عن دار الإيمان
          </h2>
          <p className="text-sm text-sub leading-relaxed">
            وجهتكم المعرفية الأولى لاقتناء أمهات الكتب الإسلامية، العلمية،
            والثقافية بأفضل الطبعات المعتمدة. صُممت هذه المنصة لتسهيل تجربة تصفح
            الكتب وطلبها إلكترونياً، مع تغليفها بعناية وتوصيلها لباب منزلك بأعلى
            معايير الجودة والسرعة.
          </p>
        </div>

        <div className="flex flex-col gap-5 text-sm">
          <div>
            <h3 className="font-extrabold text-heading flex items-center gap-2 mb-1.5 text-base">
              <span>✨</span> رؤيتنا ورسالتنا
            </h3>
            <p className="text-sub leading-relaxed">
              نشر العلم الشرعي والمعرفة الأصيلة وتيسير وصول الكتاب لكل قارئ
              وباحث بأسعار تنافسية وخدمة شحن موثوقة وسريعة لجميع المحافظات.
            </p>
          </div>

          <div className="bg-warning-light/70 border border-warning-border/70 p-4 rounded-2xl">
            <h3 className="font-extrabold text-heading flex items-center gap-2 mb-2 text-base">
              <span>📍</span> المقر ومواعيد العمل
            </h3>
            <ul className="flex flex-col gap-1.5 text-xs md:text-sm text-sub">
              <li>
                • <strong>استقبال الطلبات عبر الموقع:</strong> متاح على مدار 24
                ساعة طوال أيام الأسبوع.
              </li>
              <li>
                • <strong>مواعيد تجهيز وشحن الطلبات:</strong> يومياً من الساعة
                9:00 صباحاً وحتى 9:00 مساءً.
              </li>
              <li>
                • <strong>خدمة التوصيل:</strong> شحن سريع وآمن مع تغليف محكم
                لحماية الكتب أثناء النقل.
              </li>
            </ul>
          </div>

          <div className="bg-primary-light/60 border border-primary/20 p-4 rounded-2xl">
            <h3 className="font-extrabold text-primary-hover flex items-center gap-2 mb-2 text-base">
              <span>🛒</span> كيف تطلب كتبك عبر المنصة؟
            </h3>
            <ol className="flex flex-col gap-2 text-xs md:text-sm text-body list-decimal list-inside">
              <li>
                <strong>اختر كتبك:</strong> تصفح الأقسام أو ابحث بعنوان الكتاب
                أو كوده، وحدد الكمية المطلوبة وأضفها للسلة.
              </li>
              <li>
                <strong>أكّد الدفع والشحن:</strong> سجّل دخولك، أدخل عنوان
                التوصيل، وحوّل القيمة عبر إنستاباي (InstaPay) أو فودافون كاش مع
                كتابة الرقم المحول منه.
              </li>
              <li>
                <strong>احفظ رقم الطلب:</strong> بعد إرسال الطلب، احتفظ برقم
                الطلب لتتمكن من الاستعلام عن حالته عبر قسم «تتبع طلبك».
              </li>
            </ol>
          </div>

          <div className="bg-primary-light border border-primary/20 p-4 rounded-2xl">
            <h3 className="font-extrabold text-primary-hover flex items-center gap-2 mb-2 text-base">
              <span>📲</span> كيفية تثبيت تطبيق المكتبة؟
            </h3>
            <ol className="flex flex-col gap-2 text-xs md:text-sm text-body list-decimal list-inside">
              <li>الضغط على الثلاث نقاط في أعلى المتصفح.</li>
              <li>
                الضغط على <strong>«التثبيت وإنشاء اختصار»</strong> (أو «إضافة
                إلى الشاشة الرئيسية»).
              </li>
              <li>
                الضغط على <strong>«تثبيت»</strong> للوصول السريع للمكتبة.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-extrabold text-heading flex items-center gap-2 mb-2 text-base">
              <span>⚠️</span> ضوابط وسياسة الطلب والشحن
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs md:text-sm text-sub">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>مراجعة وتأكيد الطلب:</strong> يتم مراجعة التحويل وحجز
                  النسخ من المخزون فور إتمام الطلب وتغليفها للشحن.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>الاستفسار أو الإلغاء:</strong> في حال الرغبة بأي تعديل
                  أو إلغاء للطلب، يُرجى التواصل المباشر مع إدارة المكتبة عبر
                  واتساب أو الهاتف.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>متابعة الطلب:</strong> يمكنك إدخال رقم الطلب في قسم
                  «تتبع طلبك» بالصفحة الرئيسية لمعرفة حالة طلبك وتفاصيل الكتب
                  المطلوبة.
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
