"use client";

import React from "react";
import { Package, Settings } from "lucide-react";

interface ProfileTabsNavProps {
  activeTab: "orders" | "settings";
  ordersCount: number;
  onTabChange: (tab: "orders" | "settings") => void;
}

export default function ProfileTabsNav({
  activeTab,
  ordersCount,
  onTabChange,
}: ProfileTabsNavProps) {
  return (
    <div className="flex items-center gap-3 border-b border-border/80 pb-3">
      <button
        type="button"
        onClick={() => onTabChange("orders")}
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
          activeTab === "orders"
            ? "bg-primary text-white border-primary shadow-xs"
            : "bg-white text-sub border-border/80 hover:border-primary/40 hover:text-primary"
        }`}
      >
        <Package className="w-4 h-4" />
        <span>سجل طلباتي ({ordersCount})</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("settings")}
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
          activeTab === "settings"
            ? "bg-primary text-white border-primary shadow-xs"
            : "bg-white text-sub border-border/80 hover:border-primary/40 hover:text-primary"
        }`}
      >
        <Settings className="w-4 h-4" />
        <span>إعدادات الحساب</span>
      </button>
    </div>
  );
}
