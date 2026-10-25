"use client";

import { Order, OrderStatus } from "@/src/types";
import { useOrderCard } from "./hooks/useOrderCard";
import OrderCardHeader from "./components/OrderCardHeader";
import OrderCardMeta from "./components/OrderCardMeta";
import OrderCardNotes from "./components/OrderCardNotes";
import OrderCardItemsList from "./components/OrderCardItemsList";
import OrderCardFooter from "./components/OrderCardFooter";

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (
    orderId: number,
    newStatus: OrderStatus,
  ) => Promise<void>;
  onUpdateAdminNote?: (
    orderId: number,
    adminNote: string,
  ) => Promise<boolean>;
  updatingId?: number | string | null;
}

export default function OrderCard({
  order,
  onUpdateStatus,
  onUpdateAdminNote,
  updatingId,
}: OrderCardProps) {
  const card = useOrderCard({
    order,
    updatingId,
    onUpdateAdminNote,
  });

  return (
    <div
      className="h-full bg-white rounded-3xl border transition-all p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-xs border-border/80 hover:shadow-md"
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
          adminNote={card.adminNote}
          setadminNote={card.setadminNote}
          savingNote={card.savingNote}
          onSaveNote={card.handleSaveNote}
          onCancelNote={card.handleCancelNote}
        />

        <OrderCardItemsList items={order.items || []} />
      </div>

      <OrderCardFooter
        order={order}
        isBusy={card.isBusy}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
}
