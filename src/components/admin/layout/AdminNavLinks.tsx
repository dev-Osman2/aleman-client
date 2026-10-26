import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ClipboardList,
  Calculator,
  BarChart3,
  Users,
} from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  { name: "الكاشير", href: "/lib/cashier", icon: Calculator },
  { name: "الطلبات", href: "/lib/orders", icon: ClipboardList },
  { name: "الكتب", href: "/lib/products", icon: BookOpen },
  { name: "سجل العملاء", href: "/lib/users", icon: Users },
  { name: "التقارير والمبيعات", href: "/lib/orders-summary", icon: BarChart3 },
];

interface AdminNavLinksProps {
  pathname: string;
}

export default function AdminNavLinks({ pathname }: AdminNavLinksProps) {
  return (
    <nav className="hidden lg:flex items-center gap-1.5">
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/lib/products"
            ? pathname.startsWith("/lib/products")
            : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-white text-primary shadow-xs"
                : "text-white/90 hover:bg-white/15 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
