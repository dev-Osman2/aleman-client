"use client";

import React, { useEffect, useState } from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User } from "@/src/types";
import AdminNavLinks from "./AdminNavLinks";

interface AdminHeaderProps {
  isCashierPage?: boolean;
  currentUser?: User | null;
  onOpenMenu: () => void;
  onLogout: () => void;
  onOpenSearch?: () => void;
}

export default function AdminHeader({
  onOpenMenu,
}: AdminHeaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll =
        window.scrollY || document.documentElement.scrollTop;

      if (totalScroll > 0) {
        const progress = (currentScroll / totalScroll) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className="sticky top-0 z-40 bg-primary text-white shadow-md print:hidden transition-colors"
      dir="rtl"
    >
      <div className="container mx-auto sm:px-4 py-2.5 sm:py-3 sm:h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center p-2 shadow-sm transition-transform group-hover:scale-105">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white p-1.5 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/logo.png"
                  alt="مكتبة الإيمان"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="leading-tight text-right">
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base sm:text-lg tracking-tight">
                  مكتبة الإيمان
                </h1>
                <span className="bg-white/20 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>لوحة الإدارة</span>
                </span>
              </div>
              <p className="text-[11px] text-primary-subtle font-medium hidden sm:block">
                إدارة الكتب، الطلبات، الكاشير والمبيعات
              </p>
            </div>
          </div>
        </div>

        <AdminNavLinks pathname={pathname} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onOpenMenu}
            title="القائمة"
            aria-label="القائمة الجانبية"
            className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className="absolute bottom-0 right-0 h-0.75 bg-white transition-[width] duration-100 ease-out z-50"
        style={{ width: `${scrollProgress}%` }}
      />
    </header>
  );
}
