"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, UserPlus, LogOut, UserCheck } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import SearchBar from "./SearchBar";
import MenuBar from "./MenuBar";

export default function Header() {
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 bg-primary text-white shadow-md"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* الشعار واسم المكتبة (يمين الهيدر) */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-2xl bg-white p-1.5 shadow-xs flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="مكتبة الإيمان"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight leading-none">
              مكتبة الإيمان
            </h1>
            <p className="text-[11px] md:text-xs text-white/85 font-medium mt-1">
              خير جليس في الزمان كتاب
            </p>
          </div>
        </Link>

        {/* أزرار البحث والحساب والقائمة (يسار الهيدر) */}
        <div className="flex items-center gap-2">
          {/* زر إنشاء حساب / تسجيل دخول (أو اسم المستخدم إذا كان مسجلاً) */}
          {!user && (
            <div className="flex items-center gap-1.5">
              <Link
                href="/register"
                className="flex items-center gap-1.5 bg-white text-primary hover:bg-white/90 font-extrabold text-xs px-3 py-2.5 rounded-xl shadow-xs transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>إنشاء حساب</span>
              </Link>
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-3 py-2.5 rounded-xl transition-all"
              >
                <span>دخول</span>
              </Link>
            </div>
          )}

          {/* زر البحث */}
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            aria-label="بحث"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* زر القائمة الجانبية */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="القائمة"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* شريط البحث المنسدل */}
      {isSearchOpen && (
        <div className="border-t border-white/15 bg-primary-dark/95 px-4 py-3">
          <SearchBar onClose={() => setIsSearchOpen(false)} />
        </div>
      )}

      {/* القائمة الجانبية */}
      <MenuBar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
