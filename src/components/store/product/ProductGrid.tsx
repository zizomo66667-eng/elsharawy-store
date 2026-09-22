"use client";

import type { ProductListItem } from "@/lib/store/products";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/store/ui/EmptyState";

export function ProductGrid({
  products,
  currency = "EGP",
  emptyTitle = "لا توجد منتجات حالياً",
  emptyDescription,
}: {
  products: ProductListItem[];
  currency?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <>
      {/* Mobile Carousel */}
      <div
        className="
          sm:hidden
          -mx-4
          px-4
          overflow-x-auto
          overflow-y-hidden
          snap-x snap-mandatory
          flex gap-3
          pb-4
          scrollbar-none
        "
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          overscrollBehaviorX: "contain",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="
              shrink-0
              w-[72vw]
              max-w-[280px]
              snap-start
            "
          >
            <ProductCard
              product={p}
              currency={currency}
            />
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Grid */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            currency={currency}
          />
        ))}
      </div>
    </>
  );
}