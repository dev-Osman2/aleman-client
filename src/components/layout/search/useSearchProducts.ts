import { useState, useEffect, useMemo } from "react";
import { Product } from "@/src/types";

export function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase("ar")
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .trim();
}

export function useSearchProducts(query: string) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/books`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data.data)
              ? data.data
              : Array.isArray(data.products)
                ? data.products
                : [];
          setProducts(list);
        }
      } catch (err) {
        console.error("Failed to load products in SearchBar:", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = normalizeSearchText(query);
    return products
      .filter((item) => {
        const matchTitle = normalizeSearchText(item.title || "").includes(q);
        const matchAuthor = normalizeSearchText(item.author || "").includes(q);
        const matchCategory = normalizeSearchText(item.category || "").includes(
          q,
        );
        return matchTitle || matchAuthor || matchCategory;
      })
      .slice(0, 6);
  }, [products, query]);

  return { filteredProducts };
}
