"use client";

import { useState, useEffect } from "react";
import { Order } from "@/src/types";
import { getAdminToken } from "@/src/lib/cookies";
import { toast } from "sonner";

interface UseOrderCardProps {
  order: Order;
  updatingId?: number | string | null;
  onUpdateAdminNote?: (orderId: number, note: string) => Promise<boolean>;
}

export function useOrderCard({
  order,
  updatingId,
  onUpdateAdminNote,
}: UseOrderCardProps) {
  const isBusy = updatingId === order.id;

  const [showCustomerNote, setShowCustomerNote] = useState(false);
  const [showAdminNote, setShowAdminNote] = useState(false);
  const [adminNote, setadminNote] = useState(order.adminNote || "");
  const [savedNote, setSavedNote] = useState(order.adminNote || "");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    setadminNote(order.adminNote || "");
    setSavedNote(order.adminNote || "");
  }, [order.adminNote]);

  const hasCustomerNote = Boolean(order.notes && order.notes.trim() !== "");
  const hasSavedAdminNote = Boolean(savedNote && savedNote.trim() !== "");

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      let success = false;
      if (onUpdateAdminNote) {
        success = await onUpdateAdminNote(order.id, adminNote);
      } else {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
        const token = getAdminToken();
        const res = await fetch(`${apiUrl}/admin/orders/${order.id}/note`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ adminNote }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("تم حفظ ملاحظة الأدمن بنجاح");
          success = true;
        } else {
          toast.error(data.message || "تعذر حفظ الملاحظة");
        }
      }

      if (success) {
        setSavedNote(adminNote);
        setShowAdminNote(false);
      }
    } catch (err) {
      console.error("Failed to save admin note:", err);
      toast.error("حدث خطأ أثناء حفظ ملاحظة الأدمن");
    } finally {
      setSavingNote(false);
    }
  };

  const handleCancelNote = () => {
    setadminNote(savedNote);
    setShowAdminNote(false);
  };

  return {
    isBusy,
    showCustomerNote,
    setShowCustomerNote,
    showAdminNote,
    setShowAdminNote,
    adminNote,
    setadminNote,
    savingNote,
    hasCustomerNote,
    hasSavedAdminNote,
    formattedDate,
    handleSaveNote,
    handleCancelNote,
  };
}
