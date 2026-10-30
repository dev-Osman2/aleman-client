"use client";

import { Product } from "@/src/types";
import HomeCategoryBar from "./HomeCategoryBar";
import CatalogHeader from "./catalog/CatalogHeader";
import CatalogBookList from "./catalog/CatalogBookList";
import CatalogLoadMore from "./catalog/CatalogLoadMore";
import { useBookFilter } from "./hooks/useBookFilter";

interface HomeCatalogProps {
  initialProducts: Product[];
  initialCategory: string | null;
  sidebar?: React.ReactNode;
}

export default function HomeCatalog({
  initialProducts,
  initialCategory,
  sidebar,
}: HomeCatalogProps) {
  const {
    currentCategory,
    isLatestBooks,
    title,
    canResetFilter,
    displayedProducts,
    categoriesWithProducts,
    latestProductsByCategory,
    hasMoreLatestBooks,
    selectCategory,
    resetFilter,
    loadMoreLatest,
  } = useBookFilter({
    initialProducts,
    initialCategory,
  });

  return (
    <>
      <HomeCategoryBar
        currentCategory={currentCategory}
        onSelectCategory={selectCategory}
      />

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-7/12 min-w-0">
          <CatalogHeader
            title={title}
            canResetFilter={canResetFilter}
            onResetFilter={resetFilter}
          />

          <CatalogBookList
            hasProducts={displayedProducts.length > 0}
            isLatestBooks={isLatestBooks}
            showCategoryHeaders={categoriesWithProducts.length > 1 && !isLatestBooks}
            categoryGroups={latestProductsByCategory}
          />

          {hasMoreLatestBooks && (
            <CatalogLoadMore onLoadMore={loadMoreLatest} />
          )}
        </div>

        {sidebar && (
          <div className="w-full lg:w-5/12 min-w-0 lg:sticky lg:top-20 self-start">
            {sidebar}
          </div>
        )}
      </div>
    </>
  );
}

