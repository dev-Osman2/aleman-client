import { Product } from "@/src/types";
import ProductCard from "./ProductCard";

interface DiscoverMoreSectionProps {
  books: Product[];
}

export default function DiscoverMoreSection({
  books,
}: DiscoverMoreSectionProps) {
  if (books.length === 0) return null;

  return (
    <section className="space-y-6 pt-8">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-xl font-bold text-slate-900">اكتشف المزيد</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {books.map((product) => (
          <ProductCard key={product.id || product.code} product={product} />
        ))}
      </div>
    </section>
  );
}
