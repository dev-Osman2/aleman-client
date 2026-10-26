/**
 * Cloudinary Direct Upload Service
 * يقوم برفع الصور مباشرة إلى Cloudinary باستخدام Upload Preset غير الموقع (Unsigned)
 * ويعيد رابط الصورة الآمن النهائي (secure_url).
 */

export interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  error?: {
    message: string;
  };
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!file) {
    throw new Error("لم يتم تحديد أي ملف للرفع");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("الملف المحدد ليس صورة صالحة. يرجى اختيار ملف بصيغة (JPG, PNG, WebP).");
  }

  const MAX_SIZE_MB = 10;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`حجم الصورة كبير جداً. الحد الأقصى المسموح به هو ${MAX_SIZE_MB} ميجابايت.`);
  }

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dhtsox7zq";
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "aleman_preset";

  if (!cloudName || !uploadPreset) {
    throw new Error("بيانات إعدادات Cloudinary غير متوفرة في متغيرات البيئة.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data: CloudinaryUploadResponse = await response.json();

    if (!response.ok || data.error) {
      const errorDetail = data.error?.message || "فشل رفع الصورة إلى Cloudinary";
      throw new Error(`خطأ أثناء الرفع: ${errorDetail}`);
    }

    if (!data.secure_url) {
      throw new Error("لم يتم استلام رابط آمن (secure_url) من خادم Cloudinary.");
    }

    return data.secure_url;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("تعذر الاتصال بخدمة Cloudinary. يرجى التحقق من اتصال الإنترنت.");
  }
}
