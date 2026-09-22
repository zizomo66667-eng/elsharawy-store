import type { Metadata } from "next";
import { StoreShell } from "@/components/store/layout/StoreShell";
import { CheckoutForm } from "@/components/store/cart/CheckoutForm";
import { getCachedStoreConfig } from "@/lib/store/settings";

export const metadata: Metadata = {
  title: "إتمام الطلب | الشعراوي",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const { settings } = await getCachedStoreConfig();

  const currency = String(settings.currency || "EGP");
  const shippingFee = Number(settings.shipping_fee ?? 50);
  const freeThreshold = Number(settings.free_shipping_threshold ?? 500);

  const vodafoneCashNumber = String(
    settings.vodafone_cash_number || ""
  );

  return (
    <StoreShell>
      <div
        dir="rtl"
        className="min-h-screen bg-[#FAF7F4]"
      >
        <div className="container py-8 max-w-3xl">

          <div className="mb-8">
            <p className="text-xs tracking-[0.25em] uppercase text-[#B88A78] mb-2">
              Elsharawy
            </p>

            <h1 className="font-heading text-3xl font-semibold text-[#171516]">
              إتمام الطلب
            </h1>

            <p className="text-sm text-[#746B67] mt-2">
              أدخلي بيانات التوصيل واختاري طريقة الدفع المناسبة.
            </p>
          </div>

          <CheckoutForm
            currency={currency}
            shippingFee={shippingFee}
            freeThreshold={freeThreshold}
            vodafoneCashNumber={vodafoneCashNumber}
          />

        </div>
      </div>
    </StoreShell>
  );
}