"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  getAdminToken,
  removeAdminToken,
  setAdminUser,
  getAdminUser,
} from "@/src/lib/cookies";
import AdminHeader from "@/src/components/admin/layout/AdminHeader";
import AdminSidebar from "@/src/components/admin/layout/AdminSidebar";
import SearchBar from "@/src/components/layout/SearchBar";
import { BookOpen, Loader2, ShieldCheck } from "lucide-react";
import { User } from "@/src/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
  const isCashierPage = pathname === "/lib/cashier";

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
    setDrawerOpen(false);
    setCurrentUser(null);
    setAuthorized(false);
    toast.success("تم تسجيل الخروج بنجاح");
    router.replace("/");
  };

  if (checking) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-dark text-white p-4"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary animate-pulse">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 shadow-md">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جاري التحقق من الصلاحيات الأمنية...</span>
          </div>
          <p className="text-xs text-muted-light">
            مكتبة الإيمان - بوابة الإدارة المركزية
          </p>
        </div>
      </div>
    );
  }

  if (pathname === "/lib") {
    return <>{children}</>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-surface-soft flex flex-col print:bg-white print:min-h-0 text-body selection:bg-primary-light selection:text-primary"
      dir="rtl"
    >
      <AdminHeader
        isCashierPage={isCashierPage}
        currentUser={currentUser}
        onOpenMenu={() => setDrawerOpen(true)}
        onLogout={handleLogout}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <AdminSidebar
        isOpen={drawerOpen}
        pathname={pathname}
        currentUser={currentUser}
        onClose={() => setDrawerOpen(false)}
        onLogout={handleLogout}
      />

      {isCashierPage && (
        <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      )}

      <main className="flex-1 container mx-auto px-4 py-6 print:p-0 print:m-0 print:max-w-none">
        {children}
      </main>
    </div>
  );
}
