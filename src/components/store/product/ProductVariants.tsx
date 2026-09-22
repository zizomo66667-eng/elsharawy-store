"use client";

import { useMemo, useState } from "react";

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stockQuantity: number;
};

export function ProductVariants({
  variants,
  onChange,
}: {
  variants: Variant[];
  onChange?: (variant: Variant | null) => void;
}) {
  const sizes = useMemo(
    () => [...new Set(variants.map((v) => v.size).filter(Boolean))] as string[],
    [variants]
  );
  const colors = useMemo(
    () =>
      [...new Map(
        variants
          .filter((v) => v.color)
          .map((v) => [v.color!, { color: v.color!, colorHex: v.colorHex }])
      ).values()],
    [variants]
  );

  const [size, setSize] = useState<string | null>(sizes[0] || null);
  const [color, setColor] = useState<string | null>(colors[0]?.color || null);

  const selected = useMemo(() => {
    return (
      variants.find(
        (v) =>
          (size ? v.size === size : !v.size) &&
          (color ? v.color === color : !v.color)
      ) || null
    );
  }, [variants, size, color]);

  const availableSizesForColor = useMemo(() => {
    if (!color) return sizes;
    return sizes.filter((s) =>
      variants.some((v) => v.size === s && v.color === color && v.stockQuantity > 0)
    );
  }, [variants, color, sizes]);

  function selectSize(s: string) {
    setSize(s);
    const v = variants.find(
      (x) => x.size === s && (color ? x.color === color : true)
    );
    onChange?.(v || null);
  }

  function selectColor(c: string) {
    setColor(c);
    const v = variants.find(
      (x) => x.color === c && (size ? x.size === size : true)
    );
    onChange?.(v || null);
  }

  if (variants.length === 0) return null;

  return (
    <div className="space-y-4">
      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">
            اللون: <span className="text-muted-text font-normal">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => selectColor(c.color)}
                className={`w-9 h-9 rounded-full border-2 ${
                  color === c.color ? "border-primary scale-110" : "border-border"
                }`}
                style={{ backgroundColor: c.colorHex || "#ccc" }}
                title={c.color}
                aria-label={c.color}
              />
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">المقاس</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const available = availableSizesForColor.includes(s) ||
                variants.some((v) => v.size === s && v.stockQuantity > 0);
              return (
                <button
                  key={s}
                  type="button"
                  disabled={!available}
                  onClick={() => selectSize(s)}
                  className={`min-w-[3rem] px-3 py-2 rounded-lg border text-sm ${
                    size === s
                      ? "border-primary bg-primary text-white"
                      : available
                      ? "border-border hover:border-primary"
                      : "border-border opacity-40 line-through cursor-not-allowed"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selected && selected.stockQuantity <= 0 && (
        <p className="text-sm text-error">هذا المقاس/اللون غير متوفر حالياً</p>
      )}
      {selected && selected.stockQuantity > 0 && selected.stockQuantity <= 5 && (
        <p className="text-sm text-warning">متبقي {selected.stockQuantity} فقط</p>
      )}
    </div>
  );
}
