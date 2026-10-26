import Link from "next/link";
import { RefreshCw, Loader2, BookOpen, ChevronLeft } from "lucide-react";
import { Order } from "@/src/types";
import ProfileOrderItem from "./ProfileOrderItem";

interface ProfileOrdersListProps {
  orders: Order[];
  loading: boolean;
  onRefresh: () => void;
}

export default function ProfileOrdersList({
  orders,
  loading,
  onRefresh,
}: ProfileOrdersListProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-heading">
          قائمة طلبات الكتب السابقة
        </h2>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary hover:text-primary-hover bg-primary-light px-3 py-1.5 rounded-xl border border-primary/20 transition cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
          <span>تحديث</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-border/80 py-20 flex flex-col items-center justify-center gap-3 text-muted">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-bold">جاري تحميل قائمة طلباتك...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-border/80 py-16 px-6 text-center flex flex-col items-center justify-center gap-3 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-surface-subtle text-muted flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted-light" />
          </div>
          <h3 className="font-black text-base text-heading">
            لم تقم بتسجيل أي طلبات حتى الآن
          </h3>
          <p className="text-xs text-muted max-w-sm">
            تصفح مجموعتنا الواسعة من كتب العقيدة والفقه والتفسير واطلب كتبك
            المفضلة لتصلك مباشرة.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition active:scale-95"
          >
            <span>تصفح الكتب واطلب الآن</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <ProfileOrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
