import { Order, OrderStatus } from "@/src/types";
import { adminFetch } from "@/src/lib/adminFetch";

export async function fetchAdminOrdersApi(): Promise<Order[]> {
  const res = await adminFetch("/admin/orders");
  if (!res.ok) throw new Error("تعذر جلب سجل الطلبات");
  const json = await res.json();
  return Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];
}

export async function updateOrderStatusApi(
  orderId: number,
  status: OrderStatus
): Promise<Order> {
  const res = await adminFetch(`/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "تعذر تحديث حالة الطلب");
  }
  return data.data;
}

export async function updateAdminNoteApi(
  orderId: number,
  adminNote: string
): Promise<string> {
  const res = await adminFetch(`/admin/orders/${orderId}/note`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adminNote }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "تعذر حفظ ملاحظة الأدمن");
  }
  return data.data?.adminNote ?? adminNote;
}
