import type { Metadata } from "next";
import { StoreShell } from "@/components/store/layout/StoreShell";
import { ProductGrid } from "@/components/store/product/ProductGrid";
import { getProducts } from "@/lib/store/products";
import { getCachedStoreConfig } from "@/lib/store/settings";

export const metadata: Metadata = {
  title: "البحث | الشعراوي",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const [{ products, total }, { settings }] = await Promise.all([
    q
      ? getProducts({ q, limit: 48 })
      : Promise.resolve({ products: [], total: 0, page: 1, limit: 48, totalPages: 0 }),
    getCachedStoreConfig(),
  ]);
  const currency = String(settings.currency || "EGP");

  return (
    <StoreShell>
      <div className="container py-8 space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">نتائج البحث</h1>
          {q ? (
            <p className="text-muted-text text-sm mt-1">
              عن &quot;{q}&quot; — {total} نتيجة
            </p>
          ) : (
            <p className="text-muted-text text-sm mt-1">اكتبي كلمة للبحث</p>
          )}
        </div>

        <form action="/search" method="get" className="flex gap-2 max-w-lg">
          <input
            name="q"
            defaultValue={q}
            placeholder="اسم المنتج، SKU، براند..."
            className="flex-1 border border-border rounded-lg px-4 py-2 text-sm"
          />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-sm">
            بحث
          </button>
        </form>

        <ProductGrid
          products={products}
          currency={currency}
          emptyTitle={q ? "لا توجد نتائج" : "ابدئي البحث"}
          emptyDescription={q ? "جرّبي كلمات أخرى أو تصفحي كل المنتجات" : undefined}
        />
      </div>
    </StoreShell>
  );
}
