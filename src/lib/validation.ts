import { z } from "zod";


export const EGYPTIAN_PHONE_REGEX = /^01[0125][0-9]{8}$/;

export const PHONE_ERROR_MESSAGE =
  "يجب أن يتكون رقم الهاتف من 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015";

export const egyptianPhoneSchema = z
  .string()
  .trim()
  .min(1, "رقم الهاتف مطلوب")
  .regex(EGYPTIAN_PHONE_REGEX, PHONE_ERROR_MESSAGE);

export const optionalEgyptianPhoneSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || EGYPTIAN_PHONE_REGEX.test(val),
    PHONE_ERROR_MESSAGE,
  );

export function isValidEgyptianPhone(phone: string): boolean {
  if (!phone) return false;
  return egyptianPhoneSchema.safeParse(phone.trim()).success;
}

export function validatePhone(phone: string): {
  isValid: boolean;
  error?: string;
} {
  const result = egyptianPhoneSchema.safeParse(phone ? phone.trim() : "");
  if (!result.success) {
    const errorMsg =
      result.error.issues?.[0]?.message ||
      PHONE_ERROR_MESSAGE;
    return {
      isValid: false,
      error: errorMsg,
    };
  }
  return { isValid: true };
}

export function validateOptionalPhone(phone?: string | null): {
  isValid: boolean;
  error?: string;
} {
  if (!phone || !phone.trim()) {
    return { isValid: true };
  }
  return validatePhone(phone);
}

export const orderCheckoutSchema = z.object({
  name: z.string().trim().min(2, "يرجى إدخال الاسم الكامل (حرفين على الأقل)"),
  phone: egyptianPhoneSchema,
  address: z.string().trim().min(3, "يرجى إدخال عنوان التوصيل بالتفصيل"),
  transferNumber: z
    .string()
    .trim()
    .min(3, "يرجى إدخال الرقم أو الحساب المحول منه لتأكيد الدفع"),
  notes: z.string().optional(),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "يرجى إدخال اسمك الكامل"),
  phone: egyptianPhoneSchema,
  email: z.string().trim().email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z.string().min(6, "كلمة المرور يجب ألا تقل عن 6 أحرف"),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, "يرجى إدخال الاسم الكامل"),
  phone: egyptianPhoneSchema,
});

export const feedbackSchema = z.object({
  customerName: z.string().trim().optional(),
  phone: optionalEgyptianPhoneSchema,
  message: z.string().trim().min(3, "يرجى كتابة رسالتك أو مقترحك (3 أحرف على الأقل)"),
});

