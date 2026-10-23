"use client";

import { Order } from "@/src/types";
import { useOrderCard } from "./hooks/useOrderCard";
import OrderCardHeader from "./components/OrderCardHeader";
import OrderCardMeta from "./components/OrderCardMeta";
import OrderCardNotes from "./components/OrderCardNotes";
import OrderCardItemsList from "./components/OrderCardItemsList";
import OrderCardFooter from "./components/OrderCardFooter";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (
    orderId: string,
    newStatus: "pending" | "confirmed" | "cancelled",
  ) => Promise<void>;
  onTogglePayment: (orderId: string, currentPaid: boolean) => Promise<void>;
  onUpdateAdminNote: (orderId: string, adminNote: string) => Promise<void>;
  updatingId?: string | null;
}

export default function OrderCard({
  order,
  onUpdateStatus,
  onTogglePayment,
  onUpdateAdminNote,
  updatingId,
}: OrderCardProps) {
  const card = useOrderCard({
    order,
    onUpdateAdminNote,
    updatingId,
  });

  return (
    <div
      className="h-full bg-white rounded-3xl border transition-all p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs border-white"
      dir="rtl"
    >
      <div className="flex flex-col gap-3">
        <OrderCardHeader order={order} />

        <OrderCardMeta
          order={order}
          formattedDate={card.formattedDate}
        />

        <OrderCardNotes
          notes={order.notes}
          hasCustomerNote={card.hasCustomerNote}
          showCustomerNote={card.showCustomerNote}
          setShowCustomerNote={card.setShowCustomerNote}
          hasSavedAdminNote={card.hasSavedAdminNote}
          showAdminNote={card.showAdminNote}
          setShowAdminNote={card.setShowAdminNote}
          adminNoteText={card.adminNoteText}
          setAdminNoteText={card.setAdminNoteText}
          savingNote={card.savingNote}
          onSaveNote={card.handleSaveNote}
          onCancelNote={card.handleCancelNote}
        />

        <OrderCardItemsList items={order.items} />
      </div>

      <OrderCardFooter
        order={order}
        isBusy={card.isBusy}
        paymentLabel={card.getPaymentLabel()}
        onTogglePayment={onTogglePayment}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
}
