import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import { PaymentMethod } from "@/src/types";
import { orderCheckoutSchema } from "@/src/lib/validation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export function useCheckoutForm() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user, token, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("INSTAPAY");
  const [transferNumber, setTransferNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      setName((prev) => (prev ? prev : user.name || ""));
      setPhone((prev) => (prev ? prev : user.phone || ""));
    }
  }, [user]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!user || !token) {
      router.push("/register");
      return;
    }

    if (cart.length === 0) {
      setErrorMsg("سلة المشتريات فارغة، أضف كتاباً واحداً على الأقل");
      return;
    }

    const validationResult = orderCheckoutSchema.safeParse({
      name,
      phone,
      address,
      transferNumber,
      notes,
    });

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues?.[0];
      setErrorMsg(
        firstIssue?.message || "يرجى التحقق من صحة البيانات ورقم الهاتف",
      );
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

      if (user && (name.trim() !== user.name || phone.trim() !== user.phone)) {
        updateUser({ name: name.trim(), phone: phone.trim() });
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "حدث خطأ أثناء إرسال الطلب",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    cart,
    name,
    setName,
    phone,
    setPhone,
    address,
    setAddress,
    notes,
    setNotes,
    paymentMethod,
    setPaymentMethod,
    transferNumber,
    setTransferNumber,
    isSubmitting,
    errorMsg,
    successOrderId,
    handleOrderSubmit,
  };
}
