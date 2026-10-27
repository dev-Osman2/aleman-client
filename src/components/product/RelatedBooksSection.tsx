import { Product } from "@/src/types";
import ProductCard from "./ProductCard";

interface RelatedBooksSectionProps {
  books: Product[];
  categoryLabel: string;
}

export default function RelatedBooksSection({
  books,
  categoryLabel,
}: RelatedBooksSectionProps) {
  if (books.length === 0) return null;

  return (
    <section className="space-y-6 pt-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-xl font-bold text-slate-900">
          كتب ذات صلة قد تعجبك
        </h3>
        <span className="text-sm font-medium text-emerald-600">
          قسم {categoryLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {books.map((product) => (
          <ProductCard key={product.id || product.code} product={product} />
        ))}
      </div>
    </section>
  );
}
