import { ShieldCheck, Phone, Mail, Calendar, LogOut } from "lucide-react";

interface ProfileHeaderCardProps {
  user: {
    name?: string;
    phone?: string;
    email?: string;
    image?: string | null;
    role?: string;
    createdAt?: string;
  };
  image?: string | null;
  onLogout: () => void;
}

export default function ProfileHeaderCard({
  user,
  image,
  onLogout,
}: ProfileHeaderCardProps) {
  const userImage = image || user.image;

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "عضو مميز";

  return (
    <div className="bg-white rounded-3xl border border-border/80 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-primary text-white font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 shadow-md shadow-primary/20 overflow-hidden">
          {userImage ? (
            <img
              src={userImage}
              alt={user.name || "صورة المستخدم"}
              className="w-full h-full object-cover"
            />
          ) : user.name ? (
            user.name.trim().charAt(0)
          ) : (
            "ع"
          )}
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-heading truncate">
              {user.name}
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-full border border-primary/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {user.role === "ADMIN" ? "مدير المكتبة" : "عميل مسجل"}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-medium mt-0.5">
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-muted-light" />
              <span className="font-mono dir-ltr">{user.phone}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-muted-light" />
              <span>{user.email}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-muted-light" />
              <span>انضم في: {joinDate}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onLogout}
          className="bg-surface-subtle hover:bg-danger-light text-sub hover:text-danger border border-border hover:border-danger-border font-bold text-xs sm:text-sm px-4 py-2.5 rounded-2xl flex items-center gap-2 transition cursor-pointer active:scale-95 shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
