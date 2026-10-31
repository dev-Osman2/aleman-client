import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";
import { profileUpdateSchema } from "@/src/lib/validation";
import { useProfileOrders } from "./useProfileOrders";

export function useProfile() {
  const router = useRouter();
  const { user, token, isLoading: authLoading, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");

  const { orders, ordersLoading, fetchMyOrders, orderStats } =
    useProfileOrders(token);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editImage, setEditImage] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
      setEditImage(user.image || null);
    }
  }, [user]);

  // تحديث الصورة الشخصية فورياً في قاعدة البيانات عند رفع صورة جديدة أو حذفها
  const handleAvatarChange = async (newImageUrl: string | null) => {
    setEditImage(newImageUrl);
    if (!token) return;

    setSavingAvatar(true);
    try {
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: newImageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const savedUrl =
          data.data?.image !== undefined ? data.data.image : newImageUrl;
        setEditImage(savedUrl);
        updateUser({
          image: savedUrl,
        });

        if (savedUrl) {
          toast.success("تم تحديث وحفظ صورتك الشخصية بنجاح");
        } else {
          toast.success("تم حذف صورتك الشخصية بنجاح");
        }
      } else {
        toast.error(data.message || "تعذر حفظ الصورة");
      }
    } catch (err) {
      console.error("Failed to update avatar:", err);
      toast.error("حدث خطأ أثناء حفظ الصورة في الخادم");
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const validationResult = profileUpdateSchema.safeParse({
      name: editName,
      phone: editPhone,
      image: editImage,
    });

    if (!validationResult.success) {
      const firstIssue = validationResult.error.issues?.[0];
      toast.error(
        firstIssue?.message || "يرجى التحقق من صحة البيانات المدخلة",
      );
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim(),
          image: editImage,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        updateUser({
          name: editName.trim(),
          phone: editPhone.trim(),
          image: data.data?.image !== undefined ? data.data.image : editImage,
        });
        toast.success("تم تحديث بيانات ملفك الشخصي بنجاح");
      } else {
        toast.error(data.message || "تعذر حفظ التعديلات");
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    if (!token) return;

    setIsDeletingAccount(true);
    try {
      const res = await fetch(`${apiUrl}/auth/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("تم حذف حسابك بنجاح، نتمنى لك التوفيق");
        logout();
        setShowDeleteModal(false);
        router.push("/");
      } else {
        toast.error(data.message || "تعذر حذف الحساب في الوقت الحالي");
      }
    } catch (err) {
      console.error("Failed to delete account:", err);
      toast.error("حدث خطأ أثناء محاولة حذف الحساب");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح");
    router.push("/");
  };

  return {
    user,
    authLoading,
    activeTab,
    setActiveTab,
    orders,
    ordersLoading,
    fetchMyOrders,
    orderStats,
    editName,
    setEditName,
    editPhone,
    setEditPhone,
    editImage,
    setEditImage,
    savingProfile,
    savingAvatar,
    handleAvatarChange,
    handleUpdateProfile,
    showDeleteModal,
    setShowDeleteModal,
    isDeletingAccount,
    handleConfirmDeleteAccount,
    handleLogout,
  };
}
