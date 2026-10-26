"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import OrderCard, { SummaryOrder } from "./OrderCard";

interface OrderTableProps {
  orders: SummaryOrder[];
  loading: boolean;
  onStatusChange: (
    orderId: string,
    status: "confirmed" | "cancelled",
  ) => Promise<void>;
  onTogglePayment: (
    orderId: string,
    currentPaidStatus: boolean,
  ) => Promise<void>;
}

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled";

export default function OrderTable({
  orders,
  loading,
  onStatusChange,
  onTogglePayment,
}: OrderTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      order.customerName.toLowerCase().includes(query) ||
      order.phoneNumber.includes(query) ||
      order.orderNumber.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "الكل", count: counts.all },
            { key: "pending", label: "قيد الانتظار", count: counts.pending },
            { key: "confirmed", label: "مؤكد", count: counts.confirmed },
            { key: "cancelled", label: "ملغي", count: counts.cancelled },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as StatusFilter)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                statusFilter === tab.key
                  ? "bg-info text-white shadow-md shadow-indigo-600/20"
                  : "bg-white text-sub hover:bg-surface-subtle border border-border"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  statusFilter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-surface-subtle text-muted"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، الهاتف، أو رقم الطلب..."
            className="w-full pr-10 pl-3 py-2.5 bg-white border border-border rounded-xl text-xs sm:text-sm focus:outline-none focus:border-primary shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-light font-bold text-sm">
          جاري تحميل الطلبات...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-border text-muted-light font-bold text-sm">
          لا توجد طلبات مطابقة لمعايير البحث
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onStatusChange={onStatusChange}
              onTogglePayment={onTogglePayment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
