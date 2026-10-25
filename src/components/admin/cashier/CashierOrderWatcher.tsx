"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAdminToken } from "@/src/lib/cookies";
import { Order } from "@/src/types";

export default function CashierOrderWatcher() {
  const seenOrderIds = useRef<Set<number>>(new Set());
  const initialized = useRef(false);
  const router = useRouter();

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  useEffect(() => {
    const checkNewCustomerOrders = async () => {
      try {
        const token = getAdminToken();
        if (!token) return;

        const res = await fetch(`${apiUrl}/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;
        const json = await res.json();
        const orders: Order[] = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
          ? json.data
          : [];

        if (!initialized.current) {
          orders.forEach((o) => seenOrderIds.current.add(o.id));
          initialized.current = true;
          return;
        }

        for (const order of orders) {
          if (!seenOrderIds.current.has(order.id)) {
            seenOrderIds.current.add(order.id);

            toast.info(`طلب شراء جديد #${order.id}`, {
              description: `العميل: ${order.user?.name || "عميل"} — إجمالي: ${order.total} ج.م`,
              duration: 8000,
              action: {
                label: "عرض الطلبات",
                onClick: () => router.push("/lib/orders"),
              },
            });
          }
        }
      } catch (err) {
        console.debug("Watcher poll skipped:", err);
      }
    };

    checkNewCustomerOrders();
    const interval = setInterval(checkNewCustomerOrders, 12000);
    return () => clearInterval(interval);
  }, [apiUrl, router]);

  return null;
}
