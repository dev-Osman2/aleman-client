"use client";

import { useRouter } from "next/navigation";
import CashierCategoryBar from "@/src/components/admin/cashier/CashierCategoryBar";

interface HomeCategoryBarProps {
  currentCategory: string | null;
  currentTable?: string;
}

export default function HomeCategoryBar({
  currentCategory,
  currentTable,
}: HomeCategoryBarProps) {
  const router = useRouter();

  const handleCategoryTabClick = (category: string | null) => {
    const params = new URLSearchParams();

    if (currentTable) {
      params.set("table", currentTable);
    }

    if (category) {
      params.set("category", category);
    }

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  return (
    <CashierCategoryBar
      currentCategory={currentCategory}
      onSelectCategory={handleCategoryTabClick}
    />
  );
}