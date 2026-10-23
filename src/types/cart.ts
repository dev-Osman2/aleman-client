export type CartPaymentMethod = "instapay" | "vodafone_cash";

export interface CustomerFormData {
  name: string;
  phone: string;
  address: string;
  notes: string;
  isPickup: boolean;
  paymentMethod: CartPaymentMethod;
  transferNumber: string;
}

export interface CustomerInfoFormProps {
  name: string;
  setName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  isPickup: boolean;
  setIsPickup: (val: boolean) => void;
  tableNumber?: string | null;
  paymentMethod: CartPaymentMethod;
  setPaymentMethod: (val: CartPaymentMethod) => void;
  transferNumber: string;
  setTransferNumber: (val: string) => void;
  loading: boolean;
  error: string | null;
  isCartEmpty: boolean;
  onSubmit: (e: React.FormEvent) => void;
  finalTotal: number;
}
