import { Search } from "lucide-react";

interface OrderTrackFormProps {
  orderNumber: string;
  setOrderNumber: (val: string) => void;
  loading: boolean;
  errorMsg: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function OrderTrackForm({
  orderNumber,
  setOrderNumber,
  loading,
  errorMsg,
  onSubmit,
}: OrderTrackFormProps) {
  return (
    <div className="mt-5 pt-4 border-t border-border-subtle animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="bg-success-light/50 border border-success-border/90 rounded-3xl p-6 max-w-lg mx-auto shadow-xs">
        <div className="flex items-center justify-between text-success font-extrabold text-sm mb-4">
          <span>تفاصيل طلبك</span>
          <span className="text-xs text-success font-bold">
            استعلام مباشر عن حالة الطلب
          </span>
        </div>

        {errorMsg && (
          <div className="bg-danger-light text-danger text-xs p-3 rounded-xl border border-danger-border mb-4 font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-sub mb-1.5 text-right">
              رقم الطلب <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              required
              min={1}
              placeholder="أدخل رقم الطلب (مثال: 2)"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white border border-success-border/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-success/40 text-right text-body placeholder:text-muted-light transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-success hover:bg-success/90 text-white py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-xs disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "جاري البحث..." : "عرض تفاصيل الطلب"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
