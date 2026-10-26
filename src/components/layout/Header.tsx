"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import SearchBar from "./SearchBar";
import MenuBar from "./MenuBar";
import HeaderAuthButtons from "./HeaderAuthButtons";

export default function Header() {
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className="sticky top-0 z-40 bg-primary text-white shadow-md"
      dir="rtl"
    >
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2 sm:gap-3 min-w-0"
        >
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-white p-1.5 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src="/logo.png"
              alt="مكتبة الإيمان"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight leading-none truncate">
              مكتبة الإيمان
            </h1>
            <p className="hidden sm:block text-[11px] md:text-xs text-white/85 font-medium mt-1 truncate">
              خير جليس في الزمان كتاب
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <HeaderAuthButtons user={user} />

          <div className="relative">
            <button
              type="button"
              data-search-trigger="true"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="بحث"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer ${
                isSearchOpen
                  ? "bg-white text-primary shadow-xs"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
            >
              <Search className="h-5 w-5" />
            </button>

            {isSearchOpen && (
              <SearchBar
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="القائمة"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className="absolute bottom-0 right-0 h-0.75 bg-[#F0FDFA] transition-[width] duration-100 ease-out z-50"
        style={{ width: `${scrollProgress}%` }}
      />

      <MenuBar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
