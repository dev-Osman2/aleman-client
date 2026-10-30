import { Product } from "@/src/types";
import { getApiUrl } from "@/src/lib/apiUrl";

/**
 * جلب قائمة الكتب من السيرفر مع تفعيل الـ ISR Cache في Next.js
 */
export async function fetchCatalogBooks(): Promise<Product[]> {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/books`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch books: ${res.status}`);
    }

    const json = await res.json();
    return Array.isArray(json.data)
      ? json.data
      : Array.isArray(json)
      ? json
      : [];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

