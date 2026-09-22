import Link from "next/link";
import type { ProductListItem } from "@/lib/store/products";
import { ProductGrid } from "@/components/store/product/ProductGrid";

export function ProductSection({
  title,
  products,
  viewAllLink,
  currency = "EGP",
}: {
  title?: string | null;
  products: ProductListItem[];
  viewAllLink?: string;
  currency?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-[#FAF7F4] overflow-hidden">
      {/* Decorative Rose Gold line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-[#B88A78]" />

      <div className="container">
        {/* Section heading */}
        <div className="flex items-end justify-between gap-5 mb-9 sm:mb-12">
          <div>
            <span className="block mb-2 text-[10px] sm:text-xs tracking-[0.28em] text-[#B88A78] uppercase">
              Elsharawy Collection
            </span>

            {title && (
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-[#211D1E] leading-tight">
                {title}
              </h2>
            )}
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="
                shrink-0
                inline-flex items-center gap-2
                text-xs sm:text-sm
                text-[#211D1E]/65
                hover:text-[#B88A78]
                transition-colors
                pb-1
                border-b border-[#211D1E]/20
                hover:border-[#B88A78]
              "
            >
              عرض الكل
              <span dir="ltr">←</span>
            </Link>
          )}
        </div>

        {/* Products */}
        <div className="w-full min-w-0 overflow-hidden">
          <ProductGrid
            products={products}
            currency={currency}
          />
        </div>
      </div>
    </section>
  );
}