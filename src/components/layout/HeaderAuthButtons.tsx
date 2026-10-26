"use client";

import Link from "next/link";
import { User, UserPlus } from "lucide-react";
import { User as UserType } from "@/src/types";

interface HeaderAuthButtonsProps {
  user: UserType | null;
}

export default function HeaderAuthButtons({ user }: HeaderAuthButtonsProps) {
  if (!user) {
    return (
      <div className="flex items-center gap-1.5">
        <Link
          href="/login"
          title="تسجيل الدخول / حسابي"
          className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-2.5 sm:px-3 text-white transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <User className="h-5 w-5 shrink-0" />
          <span className="hidden sm:inline text-xs font-extrabold">حسابي</span>
        </Link>
        <Link
          href="/register"
          className="hidden sm:flex items-center gap-1.5 bg-white text-primary hover:bg-white/90 font-extrabold text-xs px-3 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>حساب جديد</span>
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/profile"
      title={`الملف الشخصي: ${user.name}`}
      aria-label={`الملف الشخصي: ${user.name}`}
      className="flex h-10 max-w-40 items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-2.5 sm:px-3 text-white transition-all cursor-pointer shadow-xs active:scale-95"
    >
      <User className="h-5 w-5 shrink-0" />
      <span className="hidden max-w-24 truncate text-xs font-extrabold sm:inline">
        {user.name}
      </span>
    </Link>
  );
}
