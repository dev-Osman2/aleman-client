import { Product } from "@/src/types";
import { getCategoryLabel } from "@/src/constants/categories";

export function normalizeArabicText(text: string): string {
  return (text || "")
    .toLowerCase()
    .replace(/[إأآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\u064B-\u065F]/g, "")
    .trim();
}

export function filterAdminProducts(
  products: Product[],
  stockFilter: "all" | "out_of_stock" | "low_stock",
  activeCategory: string,
  searchQuery: string,
): Product[] {
  return products.filter((product) => {
    const qty = Number(product.quantity || 0);

    if (stockFilter === "out_of_stock" && qty > 0) return false;
    if (stockFilter === "low_stock" && (qty <= 0 || qty > 5)) return false;

    const prodCat = (product.category || "").trim();
    const resolvedProdCat = getCategoryLabel(prodCat) || prodCat;
    const resolvedActiveCat =
      getCategoryLabel(activeCategory) || activeCategory;

    const normProdCat = normalizeArabicText(resolvedProdCat);
    const normActiveCat = normalizeArabicText(resolvedActiveCat);

    const matchesCategory =
      activeCategory === "all"
        ? true
        : normProdCat === normActiveCat ||
          normProdCat.includes(normActiveCat) ||
          normActiveCat.includes(normProdCat);

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = normalizeArabicText(searchQuery);

    return (
      normalizeArabicText(product.title || "").includes(q) ||
      normalizeArabicText(product.code || "").includes(q) ||
      normalizeArabicText(product.author || "").includes(q) ||
      normalizeArabicText(product.publisher || "").includes(q) ||
      normalizeArabicText(product.description || "").includes(q) ||
      normProdCat.includes(q)
    );
  });
}
