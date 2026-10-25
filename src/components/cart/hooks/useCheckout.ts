"use client";

import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/src/context/CartContext";
import { DEFAULT_DELIVERY_FEE } from "@/src/constants/payment";
import { validateCustomerInfo } from "@/src/lib/validation";
import { CartPaymentMethod } from "@/src/types";

export function useCheckout(tableNumber: string | null) {
  const { cart, clearCart, subtotalPrice } = useCart();
  const isDineIn = Boolean(tableNumber);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isPickup, setIsPickup] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<CartPaymentMethod>("instapay");
  const [transferNumber, setTransferNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(
    null,
  );
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  const totalPrice = Number(subtotalPrice || 0);
  const deliveryFee = isDineIn || isPickup ? 0 : DEFAULT_DELIVERY_FEE;
  const finalTotal = totalPrice + deliveryFee;

  useEffect(() => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    fetch(`${apiUrl}/lib/store-status`)
      .then((r) => r.json())
      .then(
        (d) =>
          typeof d.isStoreOpen === "boolean" && setIsStoreOpen(d.isStoreOpen),
      )
      .catch(() => {});
  }, []);

  const resetFormFields = useCallback(() => {
    clearCart();
    setName("");
    setPhone("");
    setAddress("");
    setNotes("");
    setIsPickup(false);
    setPaymentMethod("instapay");
    setTransferNumber("");
  }, [clearCart]);

  const handleNewOrder = () => {
    setSuccessOrderNumber(null);
    resetFormFields();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (cart.length === 0)
      return setError("الرجاء اختيار وجبة واحدة على الأقل قبل إرسال الطلب");

    const validationError = validateCustomerInfo({
      isDineIn,
      name,
      phone,
      isPickup,
      address,
      transferNumber,
    });
    if (validationError) return setError(validationError);

    setLoading(true);
    const orderType = isDineIn ? "dine_in" : isPickup ? "pickup" : "delivery";
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          tableNumber: isDineIn ? tableNumber : "",
          customerName:
            name.trim() ||
            (isDineIn ? `عميل صالة - ترابيزة ${tableNumber}` : "عميل السرايا"),
          phone: phone.trim(),
          address: isDineIn
            ? `صالة المطعم - ترابيزة ${tableNumber}`
            : isPickup
              ? "الاستلام من الفرع"
              : address.trim(),
          notes: notes.trim(),
          paymentMethod,
          paymentReceipt: transferNumber.trim(),
          transferNumber: transferNumber.trim(),
          items: cart.map((i) => ({
            productId: i._id,
            name: i.name,
            size: i.selectedSize || "",
            quantity: i.cartQuantity,
            price: i.price,
            image: i.image,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "تعذر إرسال الطلب");

      setSubmittedPhone(
        phone.trim() ||
          (isDineIn ? `ترابيزة #${tableNumber}` : transferNumber.trim()),
      );
      setSuccessOrderNumber(String(data.orderNumber || data._id || ""));
      resetFormFields();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء الاتصال بالسيرفر",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    isDineIn,
    name,
    setName,
    phone,
    setPhone,
    address,
    setAddress,
    notes,
    setNotes,
    isPickup,
    setIsPickup,
    paymentMethod,
    setPaymentMethod,
    transferNumber,
    setTransferNumber,
    loading,
    error,
    successOrderNumber,
    submittedPhone,
    isStoreOpen,
    totalPrice,
    deliveryFee,
    finalTotal,
    handleNewOrder,
    handleSubmit,
  };
}
