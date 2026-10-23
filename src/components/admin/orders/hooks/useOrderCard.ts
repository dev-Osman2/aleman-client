"use client";

import { useState } from "react";
import { Order } from "@/src/types";

interface UseOrderCardProps {
  order: Order;
  onUpdateAdminNote: (orderId: string, adminNote: string) => Promise<void>;
  updatingId?: string | null;
}

export function useOrderCard({
  order,
  onUpdateAdminNote,
  updatingId,
}: UseOrderCardProps) {
  const isBusy = updatingId === order._id;
  const adminNote = (order as Order & { adminNote?: string }).adminNote || "";

  const [showCustomerNote, setShowCustomerNote] = useState(false);
  const [showAdminNote, setShowAdminNote] = useState(false);
  const [adminNoteText, setAdminNoteText] = useState(adminNote);
  const [savingNote, setSavingNote] = useState(false);

  const hasCustomerNote = Boolean(order.notes && order.notes.trim() !== "");
  const hasSavedAdminNote = Boolean(adminNote.trim() !== "");

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const getPaymentLabel = () => {
    if (order.paymentMethod === "instapay") return "InstaPay";
    if (order.paymentMethod === "vodafone_cash") return "فودافون كاش";
    return "كاش";
  };

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      await onUpdateAdminNote(order._id, adminNoteText.trim());
      setShowAdminNote(false);
    } finally {
      setSavingNote(false);
    }
  };

  const handleCancelNote = () => {
    setAdminNoteText(order.adminNote || "");
    setShowAdminNote(false);
  };

  return {
    isBusy,
    showCustomerNote,
    setShowCustomerNote,
    showAdminNote,
    setShowAdminNote,
    adminNoteText,
    setAdminNoteText,
    savingNote,
    hasCustomerNote,
    hasSavedAdminNote,
    formattedDate,
    getPaymentLabel,
    handleSaveNote,
    handleCancelNote,
  };
}
