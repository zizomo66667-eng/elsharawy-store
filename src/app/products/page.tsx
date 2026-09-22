import type { Metadata } from "next";
import Link from "next/link";
import { StoreShell } from "@/components/store/layout/StoreShell";
import { ProductGrid } from "@/components/store/product/ProductGrid";
import { getProducts } from "@/lib/store/products";
import {
  getActiveCategories,
  getActiveBrands,
  getCachedStoreConfig,
} from "@/lib/store/settings";

export const metadata: Metadata = {
  title: "المنتجات | الشعراوي",
  description: "تصفحي جميع منتجات متجر الشعراوي",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q : undefined;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const brand = typeof sp.brand === "string" ? sp.brand : undefined;
  const sort = (typeof sp.sort === "string" ? sp.sort : "newest") as any;

  const featured = sp.featured === "1";
  const isNew = sp.new === "1";
  const bestSeller = sp.bestseller === "1";
  const inStock = sp.inStock === "1";
  const page = Number(sp.page) || 1;

  const [{ products, total, totalPages }, categories, brands, { settings }] =
    await Promise.all([
      getProducts({
        q,
        categorySlug: category,
        brandSlug: brand,
        sort,
        featured: featured || undefined,
        isNew: isNew || undefined,
        bestSeller: bestSeller || undefined,
        inStock: inStock || undefined,
        page,
        limit: 24,
      }),
      getActiveCategories(),
      getActiveBrands(),
      getCachedStoreConfig(),
    ]);

  const currency = String(settings.currency || "EGP");

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();

    const merged: Record<string, string | undefined> = {
      q,
      category,
      brand,
      sort: sort !== "newest" ? sort : undefined,
      featured: featured ? "1" : undefined,
      new: isNew ? "1" : undefined,
      bestseller: bestSeller ? "1" : undefined,
      inStock: inStock ? "1" : undefined,
      page: page > 1 ? String(page) : undefined,
      ...overrides,
    };

    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, value);
    }

    const queryString = params.toString();

    return queryString ? `/products?${queryString}` : "/products";
  }

  return (
    <StoreShell>
      <main
        dir="rtl"
        className="min-h-screen bg-[#FAF7F4] text-[#171516]"
      >
        {/* Luxury Page Hero */}
        <section className="relative overflow-hidden border-b border-[#E7DDD6] bg-[#171516]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#B88A78]/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[#D8A58F]/10 blur-3xl" />
          </div>

          <div className="container relative py-12 sm:py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-[#D8A58F] sm:text-xs">
                Elsharawy Collection
              </p>

              <h1 className="font-heading text-3xl font-bold leading-tight text-[#F3E8DD] sm:text-4xl md:text-5xl">
                مجموعة الشعراوي
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-px w-12 bg-[#B88A78]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#D8A58F]" />
                <span className="h-px w-20 bg-[#B88A78]/50" />
              </div>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#F3E8DD]/70 sm:text-base">
                اكتشفي تشكيلتنا المختارة بعناية، بتفاصيل تجمع بين الأناقة
                والجودة والراحة.
              </p>
            </div>
          </div>
        </section>

        <div className="container py-8 sm:py-10 md:py-12">
          {/* Page Heading */}
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B88A78]">
                SHOP ALL
              </p>

              <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">
                المنتجات
              </h2>

              <p className="mt-1 text-sm text-[#746B67]">
                {total} منتج متاح
              </p>
            </div>

            {page > 1 && (
              <div className="text-xs text-[#746B67]">
                صفحة {page} من {totalPages}
              </div>
            )}
          </div>

          {/* Filters */}
          <section className="mb-8 rounded-2xl border border-[#E7DDD6] bg-white p-4 shadow-[0_10px_35px_rgba(23,21,22,0.05)] sm:p-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3E8DD] text-[#B88A78]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5h18M6 12h12M10 19h4"
                  />
                </svg>
              </span>

              <div>
                <h3 className="font-heading text-base font-bold">
                  اكتشفي ما يناسبك
                </h3>

                <p className="text-xs text-[#746B67]">
                  ابحثي واختاري من التصنيفات والعلامات التجارية
                </p>
              </div>
            </div>

            {/* Search */}
            <form
              action="/products"
              method="get"
              className="mb-5 flex flex-col gap-2 sm:flex-row"
            >
              <input
                name="q"
                defaultValue={q || ""}
                placeholder="ابحثي عن منتج..."
                className="h-12 flex-1 rounded-xl border border-[#E7DDD6] bg-[#FAF7F4] px-4 text-sm outline-none transition placeholder:text-[#746B67]/60 focus:border-[#B88A78] focus:bg-white focus:ring-2 focus:ring-[#B88A78]/10"
              />

              <button
                type="submit"
                className="h-12 rounded-xl bg-[#171516] px-7 text-sm font-semibold text-[#F3E8DD] transition hover:bg-[#B88A78]"
              >
                بحث
              </button>
            </form>

            {/* Sorting */}
            <div className="mb-5">
              <div className="mb-2 text-xs font-semibold text-[#746B67]">
                ترتيب المنتجات
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: "newest", label: "الأحدث" },
                  { key: "price_asc", label: "السعر ↑" },
                  { key: "price_desc", label: "السعر ↓" },
                ].map((item) => (
                  <Link
                    key={item.key}
                    href={buildUrl({
                      sort: item.key,
                      page: undefined,
                    })}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                      sort === item.key
                        ? "border-[#171516] bg-[#171516] text-[#F3E8DD]"
                        : "border-[#E7DDD6] bg-[#FAF7F4] text-[#171516] hover:border-[#B88A78] hover:text-[#B88A78]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}

                <Link
                  href={buildUrl({
                    inStock: inStock ? undefined : "1",
                    page: undefined,
                  })}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                    inStock
                      ? "border-[#B88A78] bg-[#B88A78] text-white"
                      : "border-[#E7DDD6] bg-[#FAF7F4] text-[#171516] hover:border-[#B88A78]"
                  }`}
                >
                  متوفر فقط
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="border-t border-[#E7DDD6] pt-5">
              <div className="mb-2 text-xs font-semibold text-[#746B67]">
                التصنيفات
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildUrl({
                    category: undefined,
                    page: undefined,
                  })}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                    !category
                      ? "border-[#B88A78] bg-[#B88A78] text-white"
                      : "border-[#E7DDD6] bg-[#FAF7F4] hover:border-[#B88A78]"
                  }`}
                >
                  الكل
                </Link>

                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={buildUrl({
                      category: c.slug,
                      page: undefined,
                    })}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                      category === c.slug
                        ? "border-[#171516] bg-[#171516] text-[#F3E8DD]"
                        : "border-[#E7DDD6] bg-[#FAF7F4] hover:border-[#B88A78] hover:text-[#B88A78]"
                    }`}
                  >
                    {c.nameAr || c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div className="mt-5 border-t border-[#E7DDD6] pt-5">
                <div className="mb-2 text-xs font-semibold text-[#746B67]">
                  العلامات التجارية
                </div>

                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      href={buildUrl({
                        brand: brand === b.slug ? undefined : b.slug,
                        page: undefined,
                      })}
                      className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                        brand === b.slug
                          ? "border-[#B88A78] bg-[#B88A78] text-white"
                          : "border-[#E7DDD6] bg-[#FAF7F4] hover:border-[#B88A78] hover:text-[#B88A78]"
                      }`}
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Product Collection */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#B88A78]" />

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A78]">
                Collection
              </span>

              <span className="h-px flex-1 bg-[#E7DDD6]" />
            </div>

            <ProductGrid
              products={products}
              currency={currency}
              emptyTitle="لا توجد منتجات"
              emptyDescription="جرّبي تغيير الفلاتر أو البحث بكلمات أخرى"
            />
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="تنقل صفحات المنتجات"
              className="mt-10 flex items-center justify-center gap-2"
            >
              {page > 1 && (
                <Link
                  href={buildUrl({
                    page: String(page - 1),
                  })}
                  className="rounded-full border border-[#E7DDD6] bg-white px-5 py-2.5 text-sm font-medium transition hover:border-[#B88A78] hover:text-[#B88A78]"
                >
                  السابق
                </Link>
              )}

              <span className="rounded-full bg-[#171516] px-5 py-2.5 text-xs font-semibold text-[#F3E8DD]">
                {page} / {totalPages}
              </span>

              {page < totalPages && (
                <Link
                  href={buildUrl({
                    page: String(page + 1),
                  })}
                  className="rounded-full border border-[#E7DDD6] bg-white px-5 py-2.5 text-sm font-medium transition hover:border-[#B88A78] hover:text-[#B88A78]"
                >
                  التالي
                </Link>
              )}
            </nav>
          )}
        </div>
      </main>
    </StoreShell>
  );
}