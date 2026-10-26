import {
  User as UserIcon,
  Phone as PhoneIcon,
  MapPin,
  FileText,
} from "lucide-react";

interface CheckoutCustomerInputsProps {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}

export default function CheckoutCustomerInputs({
  name,
  setName,
  phone,
  setPhone,
  address,
  setAddress,
  notes,
  setNotes,
}: CheckoutCustomerInputsProps) {
  return (
    <>
      <div>
        <label className="block text-xs font-extrabold text-heading mb-1.5">
          الاسم الكامل <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المستلم بالكامل..."
            className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none transition-colors"
          />
          <UserIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-heading mb-1.5">
          رقم الهاتف للتواصل <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            required
            maxLength={11}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="مثال: 01012345678"
            className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none transition-colors text-right dir-ltr"
          />
          <PhoneIcon className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-heading mb-1.5">
          العنوان التفصيلي <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="مثال: شارع الجمهورية - بجوار..."
            className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-4 text-sm focus:border-primary focus:outline-none transition-colors"
          />
          <MapPin className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-1.5 text-xs font-extrabold text-heading mb-1.5">
          <FileText className="w-3.5 h-3.5 text-muted" />
          <span>ملاحظات إضافية (اختياري)</span>
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="مثال: الاتصال قبل الوصول، تسليم الطلب في المساء..."
          className="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:border-primary focus:outline-none resize-none transition-colors"
        />
      </div>
    </>
  );
}
