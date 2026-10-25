"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  FileText,
  CreditCard,
  Smartphone,
  Send,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Plus,
  Minus,
  ShoppingBag,
  User as UserIcon,
  Phone as PhoneIcon,
  BookOpen,
} from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import { PaymentMethod } from "@/src/types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
const INSTAPAY_NUMBER = "01080859921";
const VODAFONE_CASH_NUMBER = "01080859921";

export default function CheckoutForm() {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    clearCart,
    subtotalPrice,
    deliveryFee,
    totalPrice,
  } = useCart();
  const { user, token, updateUser } = useAuth();

  // الحقول مع تهيئة الاسم ورقم الهاتف من حساب المستخدم كقيم افتراضية قابلة للتعديل
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("INSTAPAY");
  const [transferNumber, setTransferNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

  // تحديث القيم الافتراضية عند تحميل بيانات المستخدم
  useEffect(() => {
    if (user) {
      setName((prev) => (prev ? prev : user.name || ""));
      setPhone((prev) => (prev ? prev : user.phone || ""));
    }
  }, [user]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // إذا لم يكن المستخدم مسجلاً يتم توجيهه إلى صفحة إنشاء الحساب
    if (!user || !token) {
      router.push("/register");
      return;
    }

    if (cart.length === 0) {
      setErrorMsg("سلة المشتريات فارغة، أضف كتاباً واحداً على الأقل");
      return;
    }

    if (!name.trim() || !phone.trim() || !address.trim() || !transferNumber.trim()) {
      setErrorMsg("يرجى إدخال الاسم، رقم الهاتف، العنوان التفصيلي، والرقم المحول منه");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim() || undefined,
        paymentMethod,
        transferNumber: transferNumber.trim(),
        items: cart.map((item) => ({
          bookId: item.id,
          quantity: item.cartQuantity,
        })),
      };

      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "فشل في تسجيل الطلب");
      }

      setSuccessOrderId(json.data.id);
      clearCart();
      setAddress("");
      setNotes("");
      setTransferNumber("");

      // إذا حدث تعديل على الاسم أو الهاتف، نحدث البيانات في حالة المصادقة محلياً
      if (user && (name.trim() !== user.name || phone.trim() !== user.phone)) {
        updateUser({ name: name.trim(), phone: phone.trim() });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="order-summary"
      className="bg-white rounded-3xl border border-border-subtle p-5 sm:p-6 shadow-xs flex flex-col gap-5 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar"
      dir="rtl"
    >
      {/* ترويسة الصندوق */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-black text-heading">ملخص الطلب</h3>
        </div>
        <span className="text-xs font-extrabold text-primary bg-primary-light px-2.5 py-1 rounded-full">
          {cart.length} كتاب
        </span>
      </div>

      {/* رسالة نجاح الطلب */}
      {successOrderId && (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center space-y-1 shrink-0">
          <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
          <p className="text-sm font-black text-green-800">
            تم تسجيل طلبك بنجاح! رقم الطلب: #{successOrderId}
          </p>
          <p className="text-xs text-green-700">
            يمكنك متابعة حالة طلبك برقم الهاتف ({phone || user?.phone}) ورقم الطلب.
          </p>
        </div>
      )}

      {/* عرض عناصر السلة مع صورة كل كتاب وزري الإضافة والحذف */}
      {cart.length === 0 ? (
        <div className="text-center py-8 text-muted text-sm font-medium shrink-0">
          سلة الكتب فارغة حالياً، اختر كتبك المفضلة وأضفها للسلة.
        </div>
      ) : (
        <div className="flex flex-col gap-3 shrink-0">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 bg-gray-50 p-2.5 sm:p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors shrink-0"
            >
              {/* صورة غلاف الكتاب */}
              <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-white border border-gray-200/80 shrink-0 shadow-2xs flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/100x140/f1f5f9/0f172a?text=كتاب";
                    }}
                  />
                ) : (
                  <BookOpen className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* بيانات الكتاب */}
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-extrabold text-heading truncate">
                  {item.title}
                </p>
                <p className="text-xs text-primary font-bold mt-0.5">
                  {item.price * item.cartQuantity} ج.م{" "}
                  <span className="text-muted font-normal text-[11px]">
                    ({item.price} ج.م للنسخة)
                  </span>
                </p>
              </div>

              {/* أزرار زيادة وتقليل الكمية */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                  className="p-1 rounded-lg bg-white border border-gray-200 hover:border-primary text-heading transition-colors cursor-pointer"
                  title="زيادة الكمية"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-extrabold text-heading">
                  {item.cartQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                  className="p-1 rounded-lg bg-white border border-gray-200 hover:border-red-500 hover:text-red-500 text-heading transition-colors cursor-pointer"
                  title="تقليل الكمية"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* حساب الإجمالي = إجمالي المنتجات + التوصيل */}
      {cart.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs md:text-sm border border-gray-100 shrink-0">
          <div className="flex justify-between text-muted font-bold">
            <span>إجمالي الكتب:</span>
            <span>{subtotalPrice} ج.م</span>
          </div>
          <div className="flex justify-between text-muted font-bold">
            <span>رسوم التوصيل:</span>
            <span>{deliveryFee} ج.م</span>
          </div>
          <div className="flex justify-between text-base font-black text-heading border-t border-gray-200 pt-2">
            <span>الإجمالي الكلي:</span>
            <span className="text-primary">{totalPrice} ج.م</span>
          </div>
        </div>
      )}

      {/* تنبيه حالة الحساب لغير المسجلين */}
      {!user && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-amber-800 shrink-0">
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>لابد من تسجيل حساب أولاً قبل إرسال الطلب</span>
          </div>
          <Link
            href="/register"
            className="shrink-0 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-amber-700"
          >
            سجل الآن
          </Link>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-600 shrink-0">
          {errorMsg}
        </div>
      )}

      {/* نموذج الشحن والدفع */}
      <form onSubmit={handleOrderSubmit} className="flex flex-col gap-4 shrink-0">
        {/* 1. الاسم الكامل (افتراضي من الحساب وقابل للتعديل) */}
        <div>
          <label className="block text-xs font-extrabold text-heading mb-1.5">
            الاسم الكامل <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسم المستلم بالكامل..."
              className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none transition-colors"
            />
            <UserIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
          </div>
        </div>

        {/* 2. رقم الهاتف (افتراضي من الحساب وقابل للتعديل) */}
        <div>
          <label className="block text-xs font-extrabold text-heading mb-1.5">
            رقم الهاتف للتواصل <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="مثال: 01012345678"
              className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none transition-colors"
            />
            <PhoneIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
          </div>
        </div>

        {/* 3. العنوان التفصيلي */}
        <div>
          <label className="block text-xs font-extrabold text-heading mb-1.5">
            العنوان التفصيلي <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مثال: شارع الجمهورية - بجوار..."
              className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none transition-colors"
            />
            <MapPin className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
          </div>
        </div>

        {/* 4. ملاحظات إضافية (اختياري) */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-extrabold text-heading mb-1.5">
            <FileText className="w-3.5 h-3.5 text-muted" />
            <span>ملاحظات إضافية (اختياري)</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثال: الاتصال قبل الوصول، تسليم الطلب في المساء..."
            className="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:border-primary focus:outline-none resize-none transition-colors"
          />
        </div>

        {/* 5. طريقة الدفع (باستخدام flex-box بدون grid) */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-extrabold text-heading mb-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>طريقة الدفع</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("INSTAPAY")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
                paymentMethod === "INSTAPAY"
                  ? "border-primary bg-primary-light/40 text-primary shadow-xs"
                  : "border-gray-200 text-heading hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMethod === "INSTAPAY"
                    ? "border-primary"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "INSTAPAY" && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </span>
              <span>إنستاباي (InstaPay)</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("VODAFONE_CASH")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
                paymentMethod === "VODAFONE_CASH"
                  ? "border-primary bg-primary-light/40 text-primary shadow-xs"
                  : "border-gray-200 text-heading hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMethod === "VODAFONE_CASH"
                    ? "border-primary"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === "VODAFONE_CASH" && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </span>
              <span>فودافون كاش</span>
            </button>
          </div>
        </div>

        {/* 6. صندوق رقم التحويل */}
        <div className="rounded-2xl bg-primary-light/50 border border-primary/20 p-4 text-center space-y-1.5">
          <p className="text-xs font-extrabold text-heading">
            {paymentMethod === "INSTAPAY"
              ? "اضغط هنا للتحويل أو انسخ رقم إنستاباي:"
              : "رقم محفظة فودافون كاش للتحويل:"}
          </p>
          <div className="inline-flex items-center gap-2 text-base md:text-lg font-black text-primary tracking-wider">
            <span>
              {paymentMethod === "INSTAPAY"
                ? INSTAPAY_NUMBER
                : VODAFONE_CASH_NUMBER}
            </span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>

        {/* 7. الرقم الذي حولت منه المبلغ */}
        <div>
          <label className="block text-xs font-extrabold text-heading mb-1.5">
            الرقم الذي حولت منه المبلغ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={transferNumber}
              onChange={(e) => setTransferNumber(e.target.value)}
              placeholder="اكتب الرقم أو حساب إنستاباي المحول منه..."
              className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none transition-colors"
            />
            <Smartphone className="w-4 h-4 text-primary absolute right-3.5 top-3.5" />
          </div>
          <span className="block text-[11px] text-muted mt-1">
            يرجى كتابة الرقم المحول منه لتأكيد طلبك وتجهيز الكتب فوراً
          </span>
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:opacity-95 py-4 text-sm md:text-base font-black text-white shadow-sm transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>
            {isSubmitting
              ? "جاري تسجيل الطلب..."
              : !user
                ? "سجل حسابك لإتمام الطلب"
                : "تأكيد وإرسال الطلب"}
          </span>
        </button>
      </form>
    </div>
  );
}
