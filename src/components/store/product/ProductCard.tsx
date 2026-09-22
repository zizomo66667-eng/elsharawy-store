import Link from "next/link";
import type { ProductListItem } from "@/lib/store/products";
import { Badge } from "@/components/store/ui/Badge";
import { PriceDisplay } from "@/components/store/ui/PriceDisplay";

export function ProductCard({
  product,
  currency = "EGP",
}: {
  product: ProductListItem;
  currency?: string;
}) {
  const primaryImage =
    product.images.find((i) => i.isPrimary) || product.images[0];

  const imageUrl = primaryImage?.url || "/placeholder-product.jpg";

  const isOutOfStock = product.stockQuantity <= 0;

  const isLowStock =
    !isOutOfStock &&
    product.stockQuantity <= product.lowStockThreshold;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="
        group block
        bg-white
        rounded-2xl
        overflow-hidden
        border border-[#B88A78]/15
        hover:border-[#B88A78]/40
        hover:shadow-[0_18px_45px_rgba(40,25,25,0.10)]
        transition-all duration-500
      "
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-[#F1ECE8] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.nameAr || product.name}
          className="
            w-full h-full object-cover
            transition-transform duration-700
            group-hover:scale-[1.04]
          "
          loading="lazy"
        />

        {/* Soft image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

        {/* Product badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {product.isNew && <Badge variant="new" />}
          {product.isFeatured && <Badge variant="featured" />}
          {product.isBestSeller && <Badge variant="bestseller" />}
          {isOutOfStock && <Badge variant="outofstock" />}
          {isLowStock && <Badge variant="lowstock" />}
        </div>

        {/* Luxury quick indicator */}
        <div
          className="
            absolute bottom-3 left-3
            w-9 h-9
            rounded-full
            bg-white/90
            backdrop-blur-sm
            flex items-center justify-center
            text-[#B88A78]
            opacity-0
            translate-y-2
            group-hover:opacity-100
            group-hover:translate-y-0
            transition-all duration-300
          "
          aria-hidden="true"
        >
          <span className="text-sm">↗</span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {product.brand && (
          <p className="text-[10px] sm:text-[11px] text-[#B88A78] uppercase tracking-[0.18em] mb-1.5">
            {product.brand.name}
          </p>
        )}

        <h3 className="text-sm sm:text-[15px] font-medium text-[#211D1E] line-clamp-2 leading-relaxed">
          {product.nameAr || product.name}
        </h3>

        <div className="mt-2.5">
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            currency={currency}
            size="sm"
          />
        </div>
      </div>
    </Link>
  );
}