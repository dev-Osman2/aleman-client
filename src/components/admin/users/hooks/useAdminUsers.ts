import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { adminFetch } from "@/src/lib/adminFetch";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "with_orders" | "no_orders"
  >("all");
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminFetch("/admin/users");

      if (!res.ok) {
        throw new Error("تعذر جلب سجل العملاء من الخادم");
      }

      const json = await res.json();
      const list: AdminUserRecord[] = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
          ? json.data
          : [];
      setUsers(list);
    } catch (err: unknown) {
      console.error("Failed to fetch admin users:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تحميل بيانات العملاء",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCopyPhone = async (phone: string) => {
    if (!phone) return;
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      toast.success(`تم نسخ الرقم ${phone}`);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch {
      toast.error("تعذر نسخ رقم الهاتف");
    }
  };

  const analytics = useMemo(() => {
    const totalUsers = users.length;
    const usersWithOrders = users.filter(
      (u) => (u._count?.orders || 0) > 0,
    ).length;
    const totalOrdersPlaced = users.reduce(
      (sum, u) => sum + (u._count?.orders || 0),
      0,
    );
    const usersWithoutOrders = totalUsers - usersWithOrders;

    return {
      totalUsers,
      usersWithOrders,
      totalOrdersPlaced,
      usersWithoutOrders,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const orderCount = user._count?.orders || 0;
      if (activeFilter === "with_orders" && orderCount === 0) return false;
      if (activeFilter === "no_orders" && orderCount > 0) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      const name = (user.name || "").toLowerCase();
      const phone = (user.phone || "").toLowerCase();
      const email = (user.email || "").toLowerCase();

      return name.includes(q) || phone.includes(q) || email.includes(q);
    });
  }, [users, activeFilter, searchQuery]);

  return {
    users,
    loading,
    setLoading,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    copiedPhone,
    handleCopyPhone,
    fetchUsers,
    analytics,
    filteredUsers,
  };
}
