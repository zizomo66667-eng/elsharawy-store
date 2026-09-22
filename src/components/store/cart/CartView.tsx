"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";

export function CartView({
  currency,
  shippingFee,
  freeThreshold,
}: {
  currency: string;
  shippingFee: number;
  freeThreshold: number;
}) {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="py-12 text-center text-muted-text">جاري التحميل...</div>;
  }

  const sub = subtotal();
  const shipping = sub >= freeThreshold || sub === 0 ? 0 : shippingFee;
  const total = sub + shipping;

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-lg font-medium">السلة فارغة</p>
        <p className="text-muted-text text-sm">لم تضيفي أي منتجات بعد</p>
        <Link
          href="/products"
          className="inline-block bg-primary text-white px-6 py-3 rounded-[var(--btn-radius)] text-sm font-medium"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex gap-4 bg-white border border-border rounded-[var(--card-radius)] p-3 sm:p-4"
          >
            <div className="w-20 h-24 sm:w-24 sm:h-28 bg-surface rounded-md overflow-hidden shrink-0">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-text">—</div>
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
              {(item.size || item.color) && (
                <p className="text-xs text-muted-text">
                  {[item.size, item.color].filter(Boolean).join(" / ")}
                </p>
              )}
              <p className="text-sm font-semibold">{formatPrice(item.unitPrice, currency)}</p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    type="button"
                    className="w-9 h-9 text-lg"
                    onClick={() => {
                      const r = updateQuantity(item.key, item.quantity - 1);
                      if (!r.ok) setError(r.error || null);
                      else setError(null);
                    }}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    className="w-9 h-9 text-lg"
                    onClick={() => {
                      const r = updateQuantity(item.key, item.quantity + 1);
                      if (!r.ok) setError(r.error || null);
                      else setError(null);
                    }}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  className="text-xs text-error hover:underline"
                >
                  حذف
                </button>
              </div>
            </div>
            <div className="text-sm font-semibold shrink-0">
              {formatPrice(item.unitPrice * item.quantity, currency)}
            </div>
          </div>
        ))}
        {error && <p className="text-sm text-error">{error}</p>}
      </div>

      <div className="bg-white border border-border rounded-[var(--card-radius)] p-5 h-fit space-y-4 sticky top-20">
        <h2 className="font-heading font-semibold text-lg">ملخص الطلب</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-text">المنتجات ({itemCount()})</span>
            <span>{formatPrice(sub, currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text">الشحن</span>
            <span>
              {shipping === 0 ? (
                <span className="text-success">مجاني</span>
              ) : (
                formatPrice(shipping, currency)
              )}
            </span>
          </div>
          {sub > 0 && sub < freeThreshold && (
            <p className="text-xs text-muted-text">
              أضيفي بقيمة {formatPrice(freeThreshold - sub, currency)} للحصول على شحن مجاني
            </p>
          )}
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
            <span>الإجمالي</span>
            <span>{formatPrice(total, currency)}</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="block w-full text-center bg-primary text-white py-3.5 rounded-[var(--btn-radius)] font-medium text-sm hover:opacity-90"
        >
          إتمام الطلب
        </Link>
        <Link href="/products" className="block text-center text-sm text-muted-text hover:text-primary">
          متابعة التسوق
        </Link>
      </div>
    </div>
  );
}
