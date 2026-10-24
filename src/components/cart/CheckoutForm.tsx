"use client";

import { useState } from "react";
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
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
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
    removeFromCart,
    clearCart,
    subtotalPrice,
    deliveryFee,
    totalPrice,
  } = useCart();
  const { user, token } = useAuth();

  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("INSTAPAY");
  const [transferNumber, setTransferNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

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

    if (!address.trim() || !transferNumber.trim()) {
      setErrorMsg("يرجى إدخال العنوان التفصيلي والرقم المحول منه");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  // bg-white rounded-3xl" 
  return (
    <div  id="order-summary"
        className="bg-white rounded-  border border-border-subtle p-5 md:p-6 shadow-xs sm:p-6 sticky top-24 flex flex-col gap-5 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto custom-scrollbar"
        dir="rtl">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
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
        <div className="mb-5 rounded-2xl bg-green-50 border border-green-200 p-4 text-center space-y-1">
          <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
          <p className="text-sm font-black text-green-800">
            تم تسجيل طلبك بنجاح! رقم الطلب: #{successOrderId}
          </p>
          <p className="text-xs text-green-700">
            يمكنك متابعة حالة طلبك برقم الهاتف ({user?.phone}) ورقم الطلب.
          </p>
        </div>
      )}

      {/* عرض عناصر السلة مع الإضافة أو الحذف */}
      {cart.length === 0 ? (
        <div className="text-center py-8 text-muted text-sm font-medium">
          سلة الكتب فارغة حالياً، اختر كتبك المفضلة وأضفها للسلة.
        </div>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto pl-1 mb-5">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-extrabold text-heading truncate">
                  {item.title}
                </p>
                <p className="text-xs text-primary font-bold">
                  {item.price * item.cartQuantity} ج.م ({item.price} ج.م للنسخة)
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                  className="p-1 rounded-lg bg-white border border-gray-200 hover:border-primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-extrabold">
                  {item.cartQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                  className="p-1 rounded-lg bg-white border border-gray-200 hover:border-primary"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg mr-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* حساب الإجمالي = إجمالي المنتجات + التوصيل 20 */}
      {cart.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs md:text-sm mb-5 border border-gray-100">
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

      {/* تنبيه حالة الحساب */}
      {!user ? (
        <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-amber-800">
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
      ) : (
        <div className="mb-5 rounded-2xl bg-primary-light/60 border border-primary/20 p-3 text-xs font-bold text-heading flex items-center justify-between">
          <span>الطلب باسم: <strong className="text-primary">{user.name}</strong></span>
          <span className="text-muted">{user.phone}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-600">
          {errorMsg}
        </div>
      )}

      {/* نموذج الشحن والدفع المطابق للصورة */}
      <form onSubmit={handleOrderSubmit} className="space-y-4">
        {/* 1. العنوان التفصيلي */}
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
              className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none"
            />
            <MapPin className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
          </div>
        </div>

        {/* 2. ملاحظات إضافية (اختياري) */}
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
            className="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:border-primary focus:outline-none resize-none"
          />
        </div>

        {/* 3. طريقة الدفع */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-extrabold text-heading mb-2">
            <CreditCard className="w-4 h-4 text-primary" />
            <span>طريقة الدفع</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("INSTAPAY")}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border text-xs md:text-sm font-extrabold transition-all ${
                paymentMethod === "INSTAPAY"
                  ? "border-primary bg-primary-light/30 text-primary"
                  : "border-gray-200 text-heading hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  paymentMethod === "INSTAPAY" ? "border-primary" : "border-gray-300"
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
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border text-xs md:text-sm font-extrabold transition-all ${
                paymentMethod === "VODAFONE_CASH"
                  ? "border-primary bg-primary-light/30 text-primary"
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

        {/* صندوق رقم التحويل */}
        <div className="rounded-2xl bg-primary-light/40 border border-primary/20 p-4 text-center space-y-1.5">
          <p className="text-xs font-extrabold text-heading">
            {paymentMethod === "INSTAPAY"
              ? "اضغط هنا للتحويل مباشرة عبر تطبيق إنستاباي:"
              : "رقم محفظة فودافون كاش للتحويل:"}
          </p>
          <div className="inline-flex items-center gap-2 text-base md:text-lg font-black text-primary tracking-wider">
            <span>
              {paymentMethod === "INSTAPAY" ? INSTAPAY_NUMBER : VODAFONE_CASH_NUMBER}
            </span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>

        {/* 4. الرقم الذي حولت منه المبلغ */}
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
              className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none"
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
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary hover:opacity-95 py-4 text-sm md:text-base font-black text-white shadow-sm transition-all disabled:opacity-50 active:scale-98"
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