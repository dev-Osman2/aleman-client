import { useState } from "react";
import { getAdminToken } from "@/src/lib/cookies";
import { PrintedOrderSnapshot } from "../CashierThermalReceipt";

interface CartItemType {
  id: string;
  title: string;
  code: string;
  price: number | string;
  cartQuantity: number;
}

export function useCashierOrder(
  cart: CartItemType[],
  subtotalPrice: number,
  clearCart: () => void,
) {
  const [notes, setNotes] = useState("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "card" | "instapay">(
    "cash",
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [lastReceipt, setLastReceipt] = useState<PrintedOrderSnapshot | null>(
    null,
  );

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  const handlePrintAndSubmit = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (cart.length === 0) {
      setErrorMsg("سلة الكاشير فارغة، يرجى إضافة كتاب واحد على الأقل");
      return;
    }

    setSubmitting(true);

    try {
      const token = getAdminToken();

      const payload = {
        address: "بيع مباشر من مقر المكتبة (كاشير)",
        notes: notes.trim() || `طلب كاشير - طريقة الدفع: ${paymentMode}`,
        paymentMethod:
          paymentMode === "instapay" ? "INSTAPAY" : "VODAFONE_CASH",
        transferNumber:
          paymentMode === "cash"
            ? "نقدي - كاشير المكتبة"
            : paymentMode === "card"
              ? "بطاقة دفع - كاشير المكتبة"
              : "تحويل فوري - كاشير المكتبة",
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

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "تعذر تسجيل طلب البيع");
      }

      const createdOrder = data.data;

      const receiptData: PrintedOrderSnapshot = {
        orderNumber: createdOrder?.id || "فوري",
        createdAt: new Date().toLocaleString("ar-EG"),
        paymentMethod: paymentMode,
        items: cart.map((item) => ({
          name: item.title,
          code: item.code,
          quantity: item.cartQuantity,
          price: Number(item.price),
        })),
        totalPrice: Number(subtotalPrice || 0),
      };

      setLastReceipt(receiptData);
      setSuccessMsg(
        `تم إتمام البيع بنجاح للطلب #${receiptData.orderNumber} وخصم المخزون`,
      );
      clearCart();
      setNotes("");

      setTimeout(() => {
        window.print();
      }, 200);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تسجيل الطلب بالسيرفر",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetOrder = () => {
    clearCart();
    setNotes("");
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  return {
    notes,
    setNotes,
    paymentMode,
    setPaymentMode,
    submitting,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    lastReceipt,
    handlePrintAndSubmit,
    resetOrder,
  };
}
