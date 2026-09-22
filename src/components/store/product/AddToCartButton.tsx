"use client";

import { useState } from "react";
import { useCart } from "@/stores/cart";

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stockQuantity: number;
  price?: number | null;
};

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  stockQuantity,
  variants = [],
  selectedVariantId,
  disabled,
}: {
  productId: string;
  name: string;
  price: number;
  image?: string | null;
  stockQuantity: number;
  variants?: Variant[];
  selectedVariantId?: string | null;
  disabled?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasVariants = variants.length > 0;
  const selected = hasVariants
    ? variants.find((v) => v.id === selectedVariantId)
    : null;

  const isDisabled =
    disabled ||
    (hasVariants && !selected) ||
    (hasVariants && selected && selected.stockQuantity <= 0) ||
    (!hasVariants && stockQuantity <= 0);

  function handleAdd() {
    setMessage(null);
    setError(null);

    if (hasVariants && !selected) {
      setError("يرجى اختيار المقاس واللون");
      return;
    }

    const maxStock = selected ? selected.stockQuantity : stockQuantity;
    const unitPrice = selected?.price != null ? selected.price : price;

    const result = addItem({
      productId,
      variantId: selected?.id ?? null,
      name,
      image,
      size: selected?.size ?? null,
      color: selected?.color ?? null,
      unitPrice,
      maxStock,
      quantity: 1,
    });

    if (!result.ok) {
      setError(result.error || "تعذر الإضافة");
      return;
    }
    setMessage("تمت الإضافة إلى السلة");
    setTimeout(() => setMessage(null), 2500);
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleAdd}
        className="w-full bg-primary text-white py-3.5 rounded-[var(--btn-radius)] font-medium text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {hasVariants && !selected
          ? "اختاري المقاس واللون"
          : isDisabled
          ? "نفد المخزون"
          : "أضيفي إلى السلة"}
      </button>
      {error && <p className="text-sm text-error text-center">{error}</p>}
      {message && <p className="text-sm text-success text-center">{message}</p>}
    </div>
  );
}
