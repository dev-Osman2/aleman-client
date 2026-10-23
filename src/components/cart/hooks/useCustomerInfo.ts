"use client";

import { useEffect } from "react";

interface UseCustomerInfoProps {
  phone: string;
  setTransferNumber: (val: string) => void;
}

export function useCustomerInfo({ phone, setTransferNumber }: UseCustomerInfoProps) {
  useEffect(() => {
    if (phone) {
      setTransferNumber(phone);
    }
  }, [phone, setTransferNumber]);
}
