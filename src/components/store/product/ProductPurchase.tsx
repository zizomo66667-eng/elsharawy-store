"use client";

import { useState } from "react";
import { ProductVariants } from "./ProductVariants";
import { AddToCartButton } from "./AddToCartButton";

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stockQuantity: number;
  price?: number | null;
};

export function ProductPurchase({
  productId,
  name,
  price,
  image,
  stockQuantity,
  variants,
}: {
  productId: string;
  name: string;
  price: number;
  image?: string | null;
  stockQuantity: number;
  variants: Variant[];
}) {
  const [selected, setSelected] = useState<Variant | null>(
    variants.length === 1 ? variants[0] : null
  );

  return (
    <div className="space-y-5">
      {variants.length > 0 && (
        <ProductVariants
          variants={variants}
          onChange={(v) => setSelected(v as Variant | null)}
        />
      )}
      {variants.length === 0 && (
        <p className={`text-sm ${stockQuantity <= 0 ? "text-error" : "text-success"}`}>
          {stockQuantity <= 0 ? "نفد المخزون" : "متوفر"}
        </p>
      )}
      <AddToCartButton
        productId={productId}
        name={name}
        price={price}
        image={image}
        stockQuantity={stockQuantity}
        variants={variants}
        selectedVariantId={selected?.id}
        disabled={stockQuantity <= 0 && variants.length === 0}
      />
    </div>
  );
}
