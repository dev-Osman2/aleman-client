import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  getAdminToken,
  removeAdminToken,
  setAdminUser,
  getAdminUser,
} from "@/src/lib/cookies";
import { User } from "@/src/types";

export function useAdminAuthSession() {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  const verifyAdminSession = useCallback(
    async (token: string) => {
      try {
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Session invalid");
        }

        const json = await res.json();
        const user: User | undefined = json.data?.user || json.user;

        if (!user || user.role !== "ADMIN") {
          removeAdminToken();
          toast.error("عذراً، هذا الحساب لا يملك صلاحيات وصول لوحة الإدارة");
          router.replace("/");
          return false;
        }

        setAdminUser(user);
        setCurrentUser(user);
        return true;
      } catch {
        const cachedUser = getAdminUser();
        if (cachedUser && cachedUser.role === "ADMIN") {
          setCurrentUser(cachedUser);
          return true;
        }

        removeAdminToken();
        return false;
      }
    },
    [apiUrl, router],
  );

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = getAdminToken();

      if (pathname === "/lib") {
        if (token) {
          const isValidAdmin = await verifyAdminSession(token);
          if (isValidAdmin && isMounted) {
            router.replace("/lib/products");
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
    toast.success("تم تسجيل الخروج بنجاح");
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
