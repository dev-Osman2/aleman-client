"use client";

interface ProductInfoProps {
  category: string;
  name: string;
  description?: string;
}

export default function ProductInfo({
  category,
  name,
  description,
}: ProductInfoProps) {
  return (
    <div className="px-4 pt-3.5 pb-2 flex flex-col gap-1 text-right">
      <span className="w-fit sm:hidden text-[10px] font-bold text-primary bg-primary-light px-2.5 py-0.5 rounded-md mb-0.5">
  {category}
</span>
      <h3 className="font-extrabold text-heading text-base leading-snug">
        {name}
      </h3>
      {description && (
        <p className="text-xs text-muted line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
