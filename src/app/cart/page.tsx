import type { Metadata } from "next";
import { StoreShell } from "@/components/store/layout/StoreShell";
import { CartView } from "@/components/store/cart/CartView";
import { getCachedStoreConfig } from "@/lib/store/settings";

export const metadata: Metadata = {
  title: "السلة | الشعراوي",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const { settings } = await getCachedStoreConfig();

  const currency = String(settings.currency || "EGP");
  const shippingFee = Number(settings.shipping_fee ?? 50);
  const freeThreshold = Number(
    settings.free_shipping_threshold ?? 500
  );

  return (
    <StoreShell>
      <main
        dir="rtl"
        className="min-h-screen bg-[#FAF7F4] text-[#171516]"
      >
        {/* Cart Hero */}
        <section className="relative overflow-hidden border-b border-[#E7DDD6] bg-[#171516]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#B88A78]/10 blur-3xl" />
            <div className="absolute -bottom-36 -left-24 h-80 w-80 rounded-full bg-[#D8A58F]/10 blur-3xl" />
          </div>

          <div className="container relative py-10 sm:py-12 md:py-14">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#B88A78]/40 bg-[#B88A78]/10 text-[#D8A58F]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6"
                  />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#D8A58F] sm:text-xs">
                  Elsharawy
                </p>

                <h1 className="mt-1 font-heading text-2xl font-bold text-[#F3E8DD] sm:text-3xl">
                  سلة التسوق
                </h1>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-px w-12 bg-[#B88A78]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#D8A58F]" />
              <span className="h-px w-20 bg-[#B88A78]/50" />
            </div>
          </div>
        </section>

        {/* Cart Content */}
        <div className="container py-8 sm:py-10 md:py-12">
          <CartView
            currency={currency}
            shippingFee={shippingFee}
            freeThreshold={freeThreshold}
          />
        </div>
      </main>
    </StoreShell>
  );
}