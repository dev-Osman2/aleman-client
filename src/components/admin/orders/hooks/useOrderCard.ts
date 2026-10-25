"use client";

import { useState } from "react";
import { Order } from "@/src/types";

interface UseOrderCardProps {
  order: Order;
  updatingId?: number | string | null;
}

export function useOrderCard({
  order,
  updatingId,
}: UseOrderCardProps) {
  const isBusy = updatingId === order.id;

  const [showCustomerNote, setShowCustomerNote] = useState(false);
  const [showAdminNote, setShowAdminNote] = useState(false);
  const [adminNoteText, setAdminNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const hasCustomerNote = Boolean(order.notes && order.notes.trim() !== "");
  const hasSavedAdminNote = false;

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
    setShowAdminNote(false);
  };

  const handleCancelNote = () => {
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
    handleSaveNote,
    handleCancelNote,
  };
}
