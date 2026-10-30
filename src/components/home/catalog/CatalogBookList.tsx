import ProductCard from "@/src/components/product/ProductCard";
import { Product } from "@/src/types";

interface CategoryGroup {
  slug: string;
  name: string;
  products: Product[];
}

interface CatalogBookListProps {
  hasProducts: boolean;
  isLatestBooks: boolean;
  showCategoryHeaders: boolean;
  categoryGroups: CategoryGroup[];
}

export default function CatalogBookList({
  hasProducts,
  isLatestBooks,
  showCategoryHeaders,
  categoryGroups,
}: CatalogBookListProps) {
  if (!hasProducts) {
    return (
      <div className="text-center text-muted-light py-16 bg-white rounded-2xl border border-border-subtle">
        لا توجد كتب متاحة في هذا القسم حالياً.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {categoryGroups.map((group) => (
        <section key={group.slug}>
          {showCategoryHeaders && (
            <h2 className="mb-4 border-r-4 border-primary pr-3 text-lg font-black text-heading">
              {group.name} ({group.products.length})
            </h2>
          )}
          <div className="flex flex-wrap gap-4 md:gap-5 items-stretch">
            {group.products.map((product) => (
              <div
                key={product.id}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] flex flex-col"
              >
                <ProductCard
                  product={product}
                  showStockBadge={isLatestBooks}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

