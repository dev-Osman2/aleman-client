import React from "react";
import { Search } from "lucide-react";

interface UsersFilterBarProps {
  activeFilter: "all" | "with_orders" | "no_orders";
  setActiveFilter: (filter: "all" | "with_orders" | "no_orders") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  totalUsers: number;
  usersWithOrders: number;
  usersWithoutOrders: number;
}

export default function UsersFilterBar({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  totalUsers,
  usersWithOrders,
  usersWithoutOrders,
}: UsersFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
            activeFilter === "all"
              ? "bg-primary text-white border-primary shadow-xs"
              : "bg-white text-sub border-border/90 hover:border-primary/40 hover:text-primary"
          }`}
        >
          جميع العملاء ({totalUsers})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("with_orders")}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
            activeFilter === "with_orders"
              ? "bg-primary text-white border-primary shadow-xs"
              : "bg-white text-sub border-border/90 hover:border-primary/40 hover:text-primary"
          }`}
        >
          أصحاب الطلبات ({usersWithOrders})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("no_orders")}
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer border ${
            activeFilter === "no_orders"
              ? "bg-primary text-white border-primary shadow-xs"
              : "bg-white text-sub border-border/90 hover:border-primary/40 hover:text-primary"
          }`}
        >
          بدون طلبات ({usersWithoutOrders})
        </button>
      </div>

      <div className="relative w-full sm:w-80 shrink-0">
        <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث بالاسم، الهاتف، أو الإيميل..."
          className="w-full bg-white border border-border/90 rounded-2xl py-2.5 pr-10 pl-4 text-xs sm:text-sm text-body focus:outline-none focus:border-primary transition"
        />
      </div>
    </div>
  );
}
