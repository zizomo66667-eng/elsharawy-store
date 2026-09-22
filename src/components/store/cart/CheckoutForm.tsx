"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/stores/cart";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/store/orders";

const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
];

export function CheckoutForm({
  currency,
  shippingFee,
  freeThreshold,
  vodafoneCashNumber,
}: {
  currency: string;
  shippingFee: number;
  freeThreshold: number;
  vodafoneCashNumber: string;
}) {
  const router = useRouter();
  const { items, subtotal, clear, itemCount } = useCart();

  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [paymentMethod, setPaymentMethod] = useState<
    "CASH_ON_DELIVERY" | "VODAFONE_CASH"
  >("CASH_ON_DELIVERY");
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="py-12 text-center text-muted-text">
        جاري التحميل...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-lg font-medium">السلة فارغة</p>

        <Link
          href="/products"
          className="text-primary underline text-sm"
        >
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  const sub = subtotal();
  const shipping = sub >= freeThreshold ? 0 : shippingFee;
  const total = sub + shipping;

  async function copyVodafoneNumber() {
    if (!vodafoneCashNumber) return;

    try {
      await navigator.clipboard.writeText(vodafoneCashNumber);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (pending) return;

    setError(null);

    if (
      paymentMethod === "VODAFONE_CASH" &&
      !vodafoneCashNumber.trim()
    ) {
      setError(
        "الدفع عبر Vodafone Cash غير متاح حاليًا. برجاء اختيار الدفع عند الاستلام."
      );
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    startTransition(async () => {
      const result = await createOrder({
        customerName: String(fd.get("customerName") || ""),
        customerPhone: String(fd.get("customerPhone") || ""),
        governorate: String(fd.get("governorate") || ""),
        city: String(fd.get("city") || ""),
        address: String(fd.get("address") || ""),
        notes: String(fd.get("notes") || "") || undefined,
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      clear();
      router.push(`/order-success/${result.orderNumber}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      dir="rtl"
    >
      {/* Delivery */}
      <div className="bg-white border border-[#E7DDD6] rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
        <div>
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#B88A78] mb-1">
            Delivery
          </p>

          <h2 className="font-heading font-semibold text-xl text-[#171516]">
            بيانات التوصيل
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            الاسم *
          </label>

          <input
            name="customerName"
            required
            className="w-full border border-[#E7DDD6] rounded-xl px-4 py-3 text-sm bg-[#FAF7F4] focus:outline-none focus:ring-2 focus:ring-[#B88A78]/30 focus:border-[#B88A78]"
            placeholder="الاسم الكامل"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            رقم الهاتف *
          </label>

          <input
            name="customerPhone"
            required
            type="tel"
            inputMode="tel"
            className="w-full border border-[#E7DDD6] rounded-xl px-4 py-3 text-sm bg-[#FAF7F4] focus:outline-none focus:ring-2 focus:ring-[#B88A78]/30 focus:border-[#B88A78]"
            placeholder="01xxxxxxxxx"
            dir="ltr"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              المحافظة *
            </label>

            <select
              name="governorate"
              required
              defaultValue=""
              className="w-full border border-[#E7DDD6] rounded-xl px-4 py-3 text-sm bg-[#FAF7F4] focus:outline-none focus:ring-2 focus:ring-[#B88A78]/30 focus:border-[#B88A78]"
            >
              <option value="" disabled>
                اختاري المحافظة
              </option>

              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              المدينة / المنطقة *
            </label>

            <input
              name="city"
              required
              className="w-full border border-[#E7DDD6] rounded-xl px-4 py-3 text-sm bg-[#FAF7F4] focus:outline-none focus:ring-2 focus:ring-[#B88A78]/30 focus:border-[#B88A78]"
              placeholder="المدينة"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            العنوان بالتفصيل *
          </label>

          <textarea
            name="address"
            required
            rows={3}
            className="w-full border border-[#E7DDD6] rounded-xl px-4 py-3 text-sm bg-[#FAF7F4] focus:outline-none focus:ring-2 focus:ring-[#B88A78]/30 focus:border-[#B88A78]"
            placeholder="الشارع، رقم المبنى، علامة مميزة..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            ملاحظات (اختياري)
          </label>

          <textarea
            name="notes"
            rows={2}
            className="w-full border border-[#E7DDD6] rounded-xl px-4 py-3 text-sm bg-[#FAF7F4] focus:outline-none focus:ring-2 focus:ring-[#B88A78]/30 focus:border-[#B88A78]"
            placeholder="مثال: الدور الثالث — بجوار..."
          />
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white border border-[#E7DDD6] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div>
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#B88A78] mb-1">
            Payment
          </p>

          <h2 className="font-heading font-semibold text-xl text-[#171516]">
            طريقة الدفع
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {/* Cash */}
          <button
            type="button"
            onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
            className={`text-right p-4 rounded-xl border transition-all ${
              paymentMethod === "CASH_ON_DELIVERY"
                ? "border-[#B88A78] bg-[#FAF7F4] ring-1 ring-[#B88A78]"
                : "border-[#E7DDD6] bg-white hover:border-[#B88A78]/60"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "CASH_ON_DELIVERY"
                    ? "border-[#B88A78]"
                    : "border-[#CFC4BD]"
                }`}
              >
                {paymentMethod === "CASH_ON_DELIVERY" && (
                  <span className="w-2 h-2 rounded-full bg-[#B88A78]" />
                )}
              </span>

              <div>
                <p className="font-medium text-sm">
                  الدفع عند الاستلام
                </p>

                <p className="text-xs text-muted-text mt-1">
                  ادفعي عند استلام الطلب
                </p>
              </div>
            </div>
          </button>

          {/* Vodafone Cash */}
          <button
            type="button"
            onClick={() => setPaymentMethod("VODAFONE_CASH")}
            className={`text-right p-4 rounded-xl border transition-all ${
              paymentMethod === "VODAFONE_CASH"
                ? "border-[#B88A78] bg-[#FAF7F4] ring-1 ring-[#B88A78]"
                : "border-[#E7DDD6] bg-white hover:border-[#B88A78]/60"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "VODAFONE_CASH"
                    ? "border-[#B88A78]"
                    : "border-[#CFC4BD]"
                }`}
              >
                {paymentMethod === "VODAFONE_CASH" && (
                  <span className="w-2 h-2 rounded-full bg-[#B88A78]" />
                )}
              </span>

              <div>
                <p className="font-medium text-sm">
                  Vodafone Cash
                </p>

                <p className="text-xs text-muted-text mt-1">
                  تحويل قيمة الطلب قبل الشحن
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Vodafone instructions */}
        {paymentMethod === "VODAFONE_CASH" && (
          <div className="rounded-2xl border border-[#B88A78]/40 bg-[#F8F1ED] p-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-[#171516]">
                الدفع عبر Vodafone Cash
              </p>

              <p className="text-xs text-[#746B67] mt-1 leading-6">
                حوّلي إجمالي الطلب إلى الرقم التالي، ثم اضغطي
                على تأكيد الطلب.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E7DDD6] p-4">
              <p className="text-xs text-[#746B67] mb-2">
                رقم Vodafone Cash
              </p>

              <div className="flex items-center gap-2">
                <span
                  dir="ltr"
                  className="flex-1 font-semibold text-lg tracking-wider text-[#171516]"
                >
                  {vodafoneCashNumber || "لم يتم تحديد الرقم"}
                </span>

                <button
                  type="button"
                  onClick={copyVodafoneNumber}
                  disabled={!vodafoneCashNumber}
                  className="shrink-0 px-3 py-2 rounded-lg bg-[#171516] text-white text-xs font-medium disabled:opacity-40"
                >
                  {copied ? "تم النسخ ✓" : "نسخ"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#DCCFC7] pt-4">
              <span className="text-sm text-[#746B67]">
                المبلغ المطلوب تحويله
              </span>

              <span className="font-semibold text-[#171516]">
                {formatPrice(total, currency)}
              </span>
            </div>

            <p className="text-[11px] text-[#746B67] leading-5">
              ⚠️ تأكدي من تحويل المبلغ كاملًا قبل تأكيد الطلب.
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white border border-[#E7DDD6] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div>
          <p className="text-[11px] tracking-[0.22em] uppercase text-[#B88A78] mb-1">
            Your Order
          </p>

          <h2 className="font-heading font-semibold text-xl text-[#171516]">
            ملخص الطلب
          </h2>
        </div>

        <ul className="space-y-3 text-sm">
          {items.map((i) => (
            <li
              key={i.key}
              className="flex justify-between gap-4"
            >
              <span className="text-muted-text">
                {i.name}

                {(i.size || i.color) && (
                  <span className="text-xs">
                    {" "}
                    (
                    {[i.size, i.color]
                      .filter(Boolean)
                      .join("/")}
                    )
                  </span>
                )}

                {" "}× {i.quantity}
              </span>

              <span className="shrink-0 font-medium">
                {formatPrice(
                  i.unitPrice * i.quantity,
                  currency
                )}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-[#E7DDD6] pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-text">
              المجموع ({itemCount()})
            </span>

            <span>
              {formatPrice(sub, currency)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-text">
              الشحن
            </span>

            <span>
              {shipping === 0
                ? "مجاني"
                : formatPrice(shipping, currency)}
            </span>
          </div>

          <div className="flex justify-between font-semibold text-lg pt-2">
            <span>الإجمالي</span>

            <span className="text-[#B88A78]">
              {formatPrice(total, currency)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-error text-center bg-red-50 rounded-xl py-3 px-4">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#171516] text-white py-4 rounded-full font-medium text-base hover:bg-[#2A2526] transition disabled:opacity-50"
      >
        {pending
          ? "جاري تأكيد الطلب..."
          : paymentMethod === "VODAFONE_CASH"
            ? "تأكيد طلب Vodafone Cash"
            : "تأكيد الطلب"}
      </button>
    </form>
  );
}