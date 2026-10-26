import React from "react";
import { Mail, Calendar, PackageCheck, Copy, Check } from "lucide-react";
import { AdminUserRecord } from "./hooks/useAdminUsers";

interface UsersTableProps {
  users: AdminUserRecord[];
  copiedPhone: string | null;
  onCopyPhone: (phone: string) => void;
}

export default function UsersTable({
  users,
  copiedPhone,
  onCopyPhone,
}: UsersTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-border/80 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-right border-collapse">
          <thead>
            <tr className="bg-surface-soft border-b border-border/80 text-sub text-xs font-extrabold">
              <th className="py-4 px-6 w-[28%]">الاسم والصفة</th>
              <th className="py-4 px-4 w-[24%]">رقم الهاتف</th>
              <th className="py-4 px-4 w-[24%]">البريد الإلكتروني</th>
              <th className="py-4 px-4 text-center w-[12%]">عدد الطلبات</th>
              <th className="py-4 px-6 text-left w-[12%]">تاريخ التسجيل</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle">
            {users.map((user, i) => {
              const ordersCount = user._count?.orders || 0;
              const formattedDate = new Date(
                user.createdAt,
              ).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-primary-light/10"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-black text-sm flex items-center justify-center shrink-0">
                        {/* {user.name ? user.name.trim().charAt(0) : "ع"} */}
                        {i+1}
                      </div>
                      <div className="min-w-0">
                        <span className="font-extrabold text-heading text-sm block truncate">
                          {user.name || "عميل بدون اسم"}
                        </span>
                        <span className="text-[11px] font-bold text-muted-light block">
                          عميل مسجل
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-heading dir-ltr">
                        {user.phone || "—"}
                      </span>
                      {user.phone && (
                        <button
                          type="button"
                          onClick={() => onCopyPhone(user.phone)}
                          title="نسخ رقم الهاتف"
                          className="text-muted hover:text-primary transition cursor-pointer p-1 rounded-md hover:bg-surface-subtle"
                        >
                          {copiedPhone === user.phone ? (
                            <Check className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 opacity-60" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div
                      className="flex items-center gap-1.5 text-xs text-sub truncate"
                      title={user.email}
                    >
                      <Mail className="w-3.5 h-3.5 text-muted-light shrink-0" />
                      <span className="truncate">{user.email || "—"}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black ${
                        ordersCount > 0
                          ? "bg-success-light text-success border border-success-border"
                          : "bg-surface-subtle text-muted border border-border"
                      }`}
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>{ordersCount} طلب</span>
                    </span>
                  </td>

                  <td className="py-4 px-6 text-left">
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted font-medium">
                      <Calendar className="w-3.5 h-3.5 text-muted-light" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
