import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/store/layout/StoreShell";
import { ProductGrid } from "@/components/store/product/ProductGrid";
import { getCategoryBySlug, getProducts } from "@/lib/store/products";
import { getCachedStoreConfig } from "@/lib/store/settings";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "تصنيف غير موجود" };
  }

  return {
    title: `${category.nameAr || category.name} | الشعراوي`,
    description: category.description || undefined,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const [category, { settings }] = await Promise.all([
    getCategoryBySlug(slug),
    getCachedStoreConfig(),
  ]);

  if (!category) {
    notFound();
  }

  const { products, total } = await getProducts({
    categorySlug: slug,
    limit: 48,
  });

  const currency = String(settings.currency || "EGP");
  const categoryName = category.nameAr || category.name;

  return (
    <StoreShell>
      <main
        dir="rtl"
        className="min-h-screen bg-[#FAF7F4] text-[#171516]"
      >
        {/* Category Hero */}
        <section className="relative overflow-hidden border-b border-[#E7DDD6] bg-[#171516]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#B88A78]/10 blur-3xl" />
            <div className="absolute -bottom-36 -left-24 h-80 w-80 rounded-full bg-[#D8A58F]/10 blur-3xl" />
          </div>

          <div className="container relative py-10 sm:py-14 md:py-16">
            <nav
              aria-label="مسار التنقل"
              className="mb-8 flex flex-wrap items-center gap-2 text-xs"
            >
              <Link
                href="/"
                className="text-[#F3E8DD]/60 transition hover:text-[#D8A58F]"
              >
                الرئيسية
              </Link>

              <span className="text-[#B88A78]">/</span>

              <Link
                href="/products"
                className="text-[#F3E8DD]/60 transition hover:text-[#D8A58F]"
              >
                المنتجات
              </Link>

              <span className="text-[#B88A78]">/</span>

              <span className="font-medium text-[#F3E8DD]">
                {categoryName}
              </span>
            </nav>

            <div className="max-w-3xl">
              <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-[#D8A58F] sm:text-xs">
                Elsharawy Collection
              </p>

              <h1 className="font-heading text-3xl font-bold leading-tight text-[#F3E8DD] sm:text-4xl md:text-5xl">
                {categoryName}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-px w-12 bg-[#B88A78]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#D8A58F]" />
                <span className="h-px w-20 bg-[#B88A78]/50" />
              </div>

              {category.description && (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[#F3E8DD]/70 sm:text-base">
                  {category.description}
                </p>
              )}

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#B88A78]/30 bg-[#B88A78]/10 px-4 py-2 text-xs text-[#F3E8DD]/80">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D8A58F]" />
                {total} منتج
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <div className="container py-10 sm:py-12 md:py-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[#B88A78]" />

            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B88A78]">
              Collection
            </span>

            <span className="h-px flex-1 bg-[#E7DDD6]" />
          </div>

          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                اكتشفي المجموعة
              </h2>

              <p className="mt-1 text-sm text-[#746B67]">
                منتجات مختارة بعناية من الشعراوي
              </p>
            </div>

            <Link
              href="/products"
              className="hidden rounded-full border border-[#E7DDD6] bg-white px-5 py-2.5 text-xs font-medium transition hover:border-[#B88A78] hover:text-[#B88A78] sm:block"
            >
              كل المنتجات
            </Link>
          </div>

          <ProductGrid
            products={products}
            currency={currency}
            emptyTitle="لا توجد منتجات في هذا التصنيف"
            emptyDescription="سيتم إضافة منتجات جديدة إلى هذا التصنيف قريبًا."
          />

          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href="/products"
              className="rounded-full bg-[#171516] px-7 py-3 text-xs font-semibold text-[#F3E8DD] transition hover:bg-[#B88A78]"
            >
              تصفح كل المنتجات
            </Link>
          </div>
        </div>
      </main>
    </StoreShell>
  );
}