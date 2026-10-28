import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  getAdminToken,
  removeAdminToken,
  setAdminUser,
} from "@/src/lib/cookies";
import { getApiUrl } from "@/src/lib/apiUrl";
import { User } from "@/src/types";

export function useAdminAuthSession() {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const apiUrl = getApiUrl();

  const verifyAdminSession = useCallback(
    async (token: string): Promise<boolean> => {
      try {
        const res = await fetch(`${apiUrl}/admin/verify`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          removeAdminToken();
          return false;
        }

        const json = await res.json();
        const user: User | undefined = json.data?.user || json.user;

        if (!user || user.role !== "ADMIN") {
          removeAdminToken();
          toast.error("عذراً، هذا الحساب لا يملك صلاحيات وصول لوحة الإدارة");
          router.replace("/lib");
          return false;
        }

        setAdminUser(user);
        setCurrentUser(user);
        return true;
      } catch (err) {
        console.error("Admin verification error:", err);

        removeAdminToken();
        return false;
      }
    },
    [apiUrl, router],
  );

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const isLoginRoute = pathname === "/lib" || pathname === "/lib/";
      const token = getAdminToken();

      if (isLoginRoute) {
        if (token) {
          const isValidAdmin = await verifyAdminSession(token);
          if (isValidAdmin && isMounted) {
            router.replace("/lib/orders");
            return;
          }
        }

        if (isMounted) {
          setAuthorized(true);
          setChecking(false);
        }
        return;
      }

      if (!token) {
        if (isMounted) {
          setAuthorized(false);
          setChecking(false);
          router.replace("/lib");
        }
        return;
      }

      const isValid = await verifyAdminSession(token);
      if (isMounted) {
        if (isValid) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.replace("/lib");
        }
        setChecking(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, verifyAdminSession]);

  const handleLogout = () => {
    removeAdminToken();
    setCurrentUser(null);
    setAuthorized(false);
    toast.success("تم تسجيل الخروج من لوحة الإدارة بنجاح");
    router.replace("/");
  };

  return {
    authorized,
    checking,
    currentUser,
    handleLogout,
    pathname,
  };
}
