import { User as UserIcon, ShieldCheck } from "lucide-react";
import { User } from "@/src/types";

interface AdminUserProfileBadgeProps {
  user: User;
}

export default function AdminUserProfileBadge({
  user,
}: AdminUserProfileBadgeProps) {
  return (
    <div className="p-3.5 bg-surface-soft border border-border rounded-2xl flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
        <UserIcon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-black text-heading truncate">
            {user.name}
          </span>
          <span className="bg-primary-light text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-primary/20 shrink-0 flex items-center gap-0.5">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span>ADMIN</span>
          </span>
        </div>
        <span className="text-[11px] text-muted truncate block">
          {user.email || user.phone}
        </span>
      </div>
    </div>
  );
}
