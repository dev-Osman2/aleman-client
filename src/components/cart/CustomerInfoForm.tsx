"use client";

import Alert from "@/src/components/ui/Alert";
import { CustomerInfoFormProps } from "@/src/types";
import { useCustomerInfo } from "./hooks/useCustomerInfo";
import CustomerHeader from "./components/CustomerHeader";
import CustomerInputs from "./components/CustomerInputs";
import DeliveryMethodSelector from "./components/DeliveryMethodSelector";
import CustomerNotesInput from "./components/CustomerNotesInput";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import PaymentInstructionCard from "./components/PaymentInstructionCard";
import TransferNumberInput from "./components/TransferNumberInput";
import SubmitOrderButton from "./components/SubmitOrderButton";

export default function CustomerInfoForm({
  name,
  setName,
  phone,
  setPhone,
  address,
  setAddress,
  notes,
  setNotes,
  isPickup,
  setIsPickup,
  tableNumber,
  paymentMethod,
  setPaymentMethod,
  transferNumber,
  setTransferNumber,
  loading,
  error,
  isCartEmpty,
  finalTotal,
  onSubmit,
}: CustomerInfoFormProps) {
  const isDineIn = Boolean(tableNumber);
  useCustomerInfo({ phone, setTransferNumber });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 pt-1" dir="rtl">
      {error && <Alert message={error} />}

      <CustomerHeader isDineIn={isDineIn} tableNumber={tableNumber} />

      <CustomerInputs
        isDineIn={isDineIn}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
      />

      {!isDineIn && (
        <DeliveryMethodSelector
          isPickup={isPickup}
          setIsPickup={setIsPickup}
          address={address}
          setAddress={setAddress}
          isDineIn={isDineIn}
        />
      )}

      <CustomerNotesInput notes={notes} setNotes={setNotes} />

      <div className="flex flex-col gap-3 pt-1">
        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        <PaymentInstructionCard
          paymentMethod={paymentMethod}
          finalTotal={finalTotal}
        />

        <TransferNumberInput
          transferNumber={transferNumber}
          setTransferNumber={setTransferNumber}
        />
      </div>

      <SubmitOrderButton loading={loading} disabled={isCartEmpty} />
    </form>
  );
}
