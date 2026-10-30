"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Product } from "@/src/types";
import { CATEGORIES, getCategoryLabel } from "@/src/constants/categories";

const LATEST_CATEGORY = "latest";
const ALL_CATEGORY = "all";
const LATEST_ITEMS_PER_PAGE = 6;

export interface UseBookFilterProps {
  initialProducts: Product[];
  initialCategory?: string | null;
}

export function useBookFilter({
  initialProducts,
  initialCategory,
}: UseBookFilterProps) {
  const [currentCategory, setCurrentCategory] = useState<string | null>(() => {
    if (!initialCategory || initialCategory === ALL_CATEGORY) return null;
    return initialCategory;
  });

  const [latestPage, setLatestPage] = useState<number>(1);

  // تحديث التصنيف عند الضغط على أزرار التصفح للأمام/الخلف في المتصفح
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get("category")?.trim() || null;
      const page = Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1);
      setCurrentCategory(!cat || cat === ALL_CATEGORY ? null : cat);
      setLatestPage(page);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // المزامنة مع التغيير في الخاصية initialCategory إذا تغيرت من الخارج
  useEffect(() => {
    if (initialCategory !== undefined) {
      setCurrentCategory(!initialCategory || initialCategory === ALL_CATEGORY ? null : initialCategory);
    }
  }, [initialCategory]);

  // تغيير التصنيف وتحديث الرابط فورياً في المتصفح بدون طلب شبكة
  const selectCategory = useCallback((category: string | null) => {
    const normalized = !category || category === ALL_CATEGORY ? null : category.trim();
    setCurrentCategory(normalized);
    setLatestPage(1);

    if (typeof window !== "undefined") {
      const nextUrl = normalized
        ? normalized === LATEST_CATEGORY
          ? "/?category=latest"
          : `/?category=${encodeURIComponent(normalized)}`
        : "/";

      window.history.pushState(null, "", nextUrl);
    }
  }, []);

  const resetFilter = useCallback(() => {
    selectCategory(null);
  }, [selectCategory]);

  const loadMoreLatest = useCallback(() => {
    setLatestPage((prev) => prev + 1);
  }, []);

  const isLatestBooks = currentCategory === LATEST_CATEGORY;
  const isAllBooks = !currentCategory || currentCategory === ALL_CATEGORY;

  // 1. تصفية وترتيب المنتجات داخل الذاكرة بـ useMemo
  const displayedProducts = useMemo(() => {
    if (isLatestBooks) {
      return [...initialProducts]
        .filter((product) => product.quantity > 0)
        .sort((a, b) => {
          const discountA =
            a.oldPrice && a.oldPrice > a.price ? a.oldPrice - a.price : 0;
          const discountB =
            b.oldPrice && b.oldPrice > b.price ? b.oldPrice - b.price : 0;

          return (
            discountB - discountA ||
            a.price - b.price ||
            a.quantity - b.quantity
          );
        });
    }

    if (currentCategory && !isAllBooks) {
      return initialProducts.filter(
        (p) => (p.category ?? "").trim() === currentCategory
      );
    }

    return initialProducts;
  }, [initialProducts, currentCategory, isLatestBooks, isAllBooks]);

  // 2. تجميع الكتب حسب التصنيفات
  const categoriesWithProducts = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set([
        ...CATEGORIES,
        ...displayedProducts.map((p) => p.category?.trim()),
      ])
    ).filter((category): category is string => Boolean(category));

    return uniqueCategories
      .map((category) => ({
        slug: category,
        name: getCategoryLabel(category),
        products: displayedProducts.filter(
          (p) => p.category?.trim() === category
        ),
      }))
      .filter((group) => group.products.length > 0);
  }, [displayedProducts]);

  // 3. تطبيق ترقيم الصفحات لقسم "أحدث الكتب"
  const latestProductsByCategory = useMemo(() => {
    if (!isLatestBooks) return categoriesWithProducts;
    return categoriesWithProducts.map((group) => ({
      ...group,
      products: group.products.slice(0, latestPage * LATEST_ITEMS_PER_PAGE),
    }));
  }, [isLatestBooks, categoriesWithProducts, latestPage]);

  // 4. التحقق من توفر المزيد من الكتب في أحدث الكتب
  const hasMoreLatestBooks = useMemo(() => {
    if (!isLatestBooks) return false;
    return categoriesWithProducts.some(
      (group) => group.products.length > latestPage * LATEST_ITEMS_PER_PAGE
    );
  }, [isLatestBooks, categoriesWithProducts, latestPage]);

  // 5. العنوان المعروض
  const title = useMemo(() => {
    if (isLatestBooks) return "أحدث الكتب";
    if (isAllBooks) return "جميع الكتب";
    if (currentCategory) return `قسم: ${getCategoryLabel(currentCategory)}`;
    return "إصدارات ومؤلفات مكتبة الإيمان";
  }, [isLatestBooks, isAllBooks, currentCategory]);

  const canResetFilter = Boolean(currentCategory && currentCategory !== LATEST_CATEGORY);

  return {
    currentCategory,
    isLatestBooks,
    isAllBooks,
    title,
    canResetFilter,
    displayedProducts,
    categoriesWithProducts,
    latestProductsByCategory,
    hasMoreLatestBooks,
    latestPage,
    selectCategory,
    resetFilter,
    loadMoreLatest,
  };
}

