export const EGYPTIAN_PHONE_REGEX = /^01(0|1|2|5)[0-9]{8}$/;

export function isValidEgyptianPhone(phone: string): boolean {
  return EGYPTIAN_PHONE_REGEX.test(phone.trim());
}

export function validateCustomerInfo(params: {
  isDineIn: boolean;
  name: string;
  phone: string;
  isPickup: boolean;
  address: string;
  transferNumber: string;
}): string | null {
  const { isDineIn, name, phone, isPickup, address, transferNumber } = params;

  if (!isDineIn) {
    if (!name.trim()) {
      return "يرجى إدخال الاسم الكامل";
    }
    if (!isValidEgyptianPhone(phone)) {
      return "أدخل رقم هاتف صحيح مكون من 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015";
    }
    if (!isPickup && !address.trim()) {
      return "يرجى إدخال عنوان التوصيل بالتفصيل";
    }
  } else if (phone.trim() && !isValidEgyptianPhone(phone)) {
    return "رقم الهاتف المدخل غير صحيح، يجب أن يتكون من 11 رقماً";
  }

  if (!transferNumber.trim()) {
    return "يرجى إدخال الرقم الذي حولت منه المبلغ لتأكيد الدفع";
  }

  return null;
}
