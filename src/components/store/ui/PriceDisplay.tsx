import { calcDiscountPercent, formatPrice } from "@/lib/utils";
import { Badge } from "./Badge";

export function PriceDisplay({
  price,
  compareAtPrice,
  currency = "EGP",
  size = "md",
}: {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
}) {
  const discount = calcDiscountPercent(price, compareAtPrice);
  const sizeClass =
    size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-base";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`font-semibold text-primary ${sizeClass}`}>
        {formatPrice(price, currency)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <>
          <span className={`text-muted-text line-through ${size === "lg" ? "text-base" : "text-xs"}`}>
            {formatPrice(compareAtPrice, currency)}
          </span>
          {discount && <Badge variant="sale">-{discount}%</Badge>}
        </>
      )}
    </div>
  );
}
