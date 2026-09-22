import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "featured" | "bestseller" | "sale" | "outofstock" | "lowstock";

const styles: Record<BadgeVariant, string> = {
  new: "bg-blue-50 text-blue-700",
  featured: "bg-amber-50 text-amber-700",
  bestseller: "bg-purple-50 text-purple-700",
  sale: "bg-red-50 text-red-700",
  outofstock: "bg-gray-100 text-gray-600",
  lowstock: "bg-orange-50 text-orange-700",
};

const labels: Record<BadgeVariant, string> = {
  new: "جديد",
  featured: "مميز",
  bestseller: "الأكثر مبيعاً",
  sale: "خصم",
  outofstock: "نفد المخزون",
  lowstock: "كمية محدودة",
};

export function Badge({
  variant,
  children,
  className,
}: {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded",
        styles[variant],
        className
      )}
    >
      {children || labels[variant]}
    </span>
  );
}
