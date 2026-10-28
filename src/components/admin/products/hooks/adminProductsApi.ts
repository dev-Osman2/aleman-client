import { Product } from "@/src/types";
import { adminFetch } from "@/src/lib/adminFetch";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export async function fetchBooksApi(): Promise<Product[]> {
  const res = await fetch(`${apiUrl}/books`);
  if (!res.ok) throw new Error("تعذر جلب قائمة الكتب");
  const json = await res.json();
  return Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : [];
}

export async function saveBookApi(
  payload: Record<string, unknown>,
  editingId?: string,
): Promise<Product> {
  const path = editingId ? `/admin/books/${editingId}` : `/admin/books`;
  const method = editingId ? "PUT" : "POST";

  const res = await adminFetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "تعذر حفظ بيانات الكتاب");
  }
  return data.data;
}

export async function deleteBookApi(
  bookId: string
): Promise<{ success: boolean; message?: string }> {
  const res = await adminFetch(`/admin/books/${bookId}`, {
    method: "DELETE",
  });
  return res.json();
}
