import { User, Phone, Mail, Settings, Trash2, Loader2 } from "lucide-react";
import UserAvatarUpload from "@/src/components/ui/UserAvatarUpload";

interface ProfileSettingsTabProps {
  editName: string;
  setEditName: (name: string) => void;
  editPhone: string;
  setEditPhone: (phone: string) => void;
  editImage: string | null;
  setEditImage: (image: string | null) => void;
  userEmail?: string;
  savingProfile: boolean;
  onUpdateProfile: (e: React.FormEvent) => void;
  onOpenDeleteModal: () => void;
}

export default function ProfileSettingsTab({
  editName,
  setEditName,
  editPhone,
  setEditPhone,
  editImage,
  setEditImage,
  userEmail,
  savingProfile,
  onUpdateProfile,
  onOpenDeleteModal,
}: ProfileSettingsTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-border/80 p-6 sm:p-8 shadow-xs flex flex-col gap-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border-subtle">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-base sm:text-lg font-black text-heading">
            تحديث البيانات الشخصية
          </h2>
        </div>

        <form onSubmit={onUpdateProfile} className="flex flex-col gap-5">
          {/* تعديل الصورة الشخصية */}
          <UserAvatarUpload
            currentImage={editImage}
            onImageUploaded={setEditImage}
            disabled={savingProfile}
            label="تعديل الصورة الشخصية"
            subLabel="اختر صورة جديدة لملفك الشخصي أو قم بإزالتها"
          />

          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-[calc(50%-0.5rem)]">
              <label className="block text-xs font-extrabold text-heading mb-1.5">
                الاسم الكامل <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className="w-full pr-10 pl-4 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>

            <div className="w-full sm:w-[calc(50%-0.5rem)]">
              <label className="block text-xs font-extrabold text-heading mb-1.5">
                رقم الهاتف (المستخدم لتسجيل الدخول والتوصيل)
                <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  maxLength={11}
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full pr-10 pl-4 py-3 bg-white border border-border rounded-xl text-sm font-bold text-body focus:outline-none focus:border-primary transition dir-ltr text-right"
                />
              </div>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-xs font-extrabold text-heading mb-1.5">
              البريد الإلكتروني (معرف الحساب)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-muted-light">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                disabled
                value={userEmail || ""}
                className="w-full pr-10 pl-4 py-3 bg-surface-soft border border-border rounded-xl text-sm font-bold text-muted cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-muted-light mt-1 block">
              البريد الإلكتروني مرتبط بحسابك الأمني ولا يمكن تعديله يدوياً.
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-primary hover:bg-primary-hover text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري حفظ التعديلات...</span>
                </>
              ) : (
                <span>حفظ التعديلات</span>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-danger-border/80 p-6 sm:p-8 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-danger-border/50">
          <Trash2 className="w-5 h-5 text-danger" />
          <h3 className="text-base sm:text-lg font-black text-danger">
            حذف الحساب نهائياً
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-muted font-medium leading-relaxed">
          عند حذف حسابك، سيتم مسح كافة بياناتك وسجل طلباتك وجلسات تسجيل الدخول
          بالكامل من قاعدة بيانات دار الإيمان. هذا الإجراء نهائي ولا يمكن
          استرجاع الحساب بعد تأكيده.
        </p>

        <div className="pt-2 flex justify-start">
          <button
            type="button"
            onClick={onOpenDeleteModal}
            className="bg-danger hover:bg-danger text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs transition active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف الحساب نهائياً</span>
          </button>
        </div>
      </div>
    </div>
  );
}
