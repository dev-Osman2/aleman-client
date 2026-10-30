interface CatalogLoadMoreProps {
  onLoadMore: () => void;
}

export default function CatalogLoadMore({ onLoadMore }: CatalogLoadMoreProps) {
  return (
    <div className="mt-8 flex justify-center">
      <button
        type="button"
        onClick={onLoadMore}
        className="rounded-2xl bg-primary px-6 py-3 text-sm font-extrabold text-white shadow-xs transition hover:bg-primary-hover active:scale-95 cursor-pointer"
      >
        اكتشف المزيد
      </button>
    </div>
  );
}

