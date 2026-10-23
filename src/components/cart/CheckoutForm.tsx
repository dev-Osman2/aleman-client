"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Receipt } from "lucide-react";
import CartItemList from "./CartItemList";
import OrderPricingSummary from "./OrderPricingSummary";
import CustomerInfoForm from "./CustomerInfoForm";
import OrderSuccessCard from "./OrderSuccessCard";
import StoreClosedAlert from "./components/StoreClosedAlert";
import ImageModal from "@/src/components/product/ImageModal";
import { useCheckout } from "./hooks/useCheckout";

function CheckoutFormContent() {
  const searchParams = useSearchParams();
  const tableNumber = searchParams.get("table")?.trim() || null;
  const checkout = useCheckout(tableNumber);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; name: string } | null>(null);

  if (checkout.successOrderNumber) {
    return (
      <OrderSuccessCard
        phoneNumber={checkout.submittedPhone}
        orderNumber={checkout.successOrderNumber}
        onReset={checkout.handleNewOrder}
      />
    );
  }

  return (
    <>
      <div
        id="order-summary"
        className="bg-white rounded-2xl shadow-xs border border-border/80 p-5 sm:p-6 sticky top-24 flex flex-col gap-5 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto custom-scrollbar"
        dir="rtl"
      >
        <div className="flex items-center gap-2 text-heading border-b border-border-subtle pb-3">
          <Receipt className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-extrabold">ملخص الطلب والحساب</h3>
        </div>

        {!checkout.isStoreOpen && <StoreClosedAlert />}

        <CartItemList onZoomImage={setZoomedImage} />

        <OrderPricingSummary
          totalPrice={checkout.totalPrice}
          deliveryFee={checkout.deliveryFee}
          isPickup={checkout.isPickup}
          isDineIn={checkout.isDineIn}
          finalTotal={checkout.finalTotal}
        />

        <CustomerInfoForm
          name={checkout.name}
          setName={checkout.setName}
          phone={checkout.phone}
          setPhone={checkout.setPhone}
          address={checkout.address}
          setAddress={checkout.setAddress}
          notes={checkout.notes}
          setNotes={checkout.setNotes}
          isPickup={checkout.isPickup}
          setIsPickup={checkout.setIsPickup}
          tableNumber={tableNumber}
          paymentMethod={checkout.paymentMethod}
          setPaymentMethod={checkout.setPaymentMethod}
          transferNumber={checkout.transferNumber}
          setTransferNumber={checkout.setTransferNumber}
          loading={checkout.loading}
          error={checkout.error}
          isCartEmpty={checkout.cart.length === 0 || !checkout.isStoreOpen}
          onSubmit={checkout.handleSubmit}
          finalTotal={checkout.finalTotal}
        />
      </div>

      {zoomedImage && (
        <ImageModal
          isOpen={Boolean(zoomedImage)}
          imageSrc={zoomedImage.src}
          imageAlt={zoomedImage.name}
          onClose={() => setZoomedImage(null)}
        />
      )}
    </>
  );
}

export default function CheckoutForm() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-2xl border border-border/80 p-6 text-center text-muted-light text-xs">
          جاري تحميل السلة...
        </div>
      }
    >
      <CheckoutFormContent />
    </Suspense>
  );
}
