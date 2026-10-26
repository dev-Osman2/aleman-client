import { Order, OrderStatus } from "@/src/types";
import { getAdminToken } from "@/src/lib/cookies";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export async function fetchAdminOrdersApi(): Promise<Order[]> {
  const token = getAdminToken();
  const res = await fetch(`${apiUrl}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("تعذر جلب سجل الطلبات");
  const json = await res.json();
  return Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];
}

export async function updateOrderStatusApi(orderId: number, status: OrderStatus): Promise<Order> {
  const token = getAdminToken();
  const res = await fetch(`${apiUrl}/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "تعذر تحديث حالة الطلب");
  }
  return data.data;
}

export async function updateAdminNoteApi(orderId: number, adminNote: string): Promise<string> {
  const token = getAdminToken();
  const res = await fetch(`${apiUrl}/admin/orders/${orderId}/note`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ adminNote }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "تعذر حفظ ملاحظة الأدمن");
  }
  return data.data?.adminNote ?? adminNote;
}
