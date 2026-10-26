import { Order } from "@/src/types";
import { OrderFilterStatus } from "../OrderFilterTabs";

export function calculateOrderCounts(orders: Order[]) {
  return {
    all: orders.length,
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };
}

export function filterAdminOrdersList(
  orders: Order[],
  activeFilter: OrderFilterStatus,
  searchQuery: string,
): Order[] {
  return orders.filter((order) => {
    const matchesTab =
      activeFilter === "all" ? true : order.status === activeFilter;

    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.trim().toLowerCase();
    const matchOrderNum = String(order.id).includes(q);
    const matchName = (order.user?.name || "").toLowerCase().includes(q);
    const matchPhone = (order.user?.phone || "").includes(q);
    const matchAddress = (order.address || "").toLowerCase().includes(q);
    const matchTransfer = (order.transferNumber || "")
      .toLowerCase()
      .includes(q);

    return (
      matchOrderNum ||
      matchName ||
      matchPhone ||
      matchAddress ||
      matchTransfer
    );
  });
}
