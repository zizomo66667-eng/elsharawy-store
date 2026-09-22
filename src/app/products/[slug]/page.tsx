import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/store/layout/StoreShell";
import { ProductGallery } from "@/components/store/product/ProductGallery";
import { ProductPurchase } from "@/components/store/product/ProductPurchase";
import { ProductGrid } from "@/components/store/product/ProductGrid";
import { Badge } from "@/components/store/ui/Badge";
import { PriceDisplay } from "@/components/store/ui/PriceDisplay";
import { getProductBySlug, getRelatedProducts } from "@/lib/store/products";
import { getCachedStoreConfig } from "@/lib/store/settings";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "منتج غير موجود" };
  }

  return {
    title: `${product.nameAr || product.name} | الشعراوي`,
    description: product.description || undefined,
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const [product, { settings }] = await Promise.all([
    getProductBySlug(slug),
    getCachedStoreConfig(),
  ]);

  if (!product) notFound();

  const related = await getRelatedProducts(
    product.id,
    product.categoryId,
    4
  );

  const currency = String(settings.currency || "EGP");

  const isOutOfStock = product.stockQuantity <= 0;

  const isLowStock =
    !isOutOfStock &&
    product.stockQuantity <= product.lowStockThreshold;

  const productName = product.nameAr || product.name;

  return (
    <StoreShell>
      <main
        className="bg-[#FAF7F4] min-h-screen"
        dir="rtl"
      >
        <div className="container py-6 sm:py-8 md:py-12">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-xs sm:text-sm"
            style={{ color: "#8A7F7A" }}
          >
            <Link
              href="/"
              className="transition-colors hover:text-[#B88A78]"
            >
              الرئيسية
            </Link>

            <span style={{ color: "#CBBDB5" }}>/</span>

            <Link
              href="/products"
              className="transition-colors hover:text-[#B88A78]"
            >
              المنتجات
            </Link>

            {product.category && (
              <>
                <span style={{ color: "#CBBDB5" }}>/</span>

                <Link
                  href={`/category/${product.category.slug}`}
                  className="transition-colors hover:text-[#B88A78]"
                >
                  {product.category.nameAr || product.category.name}
                </Link>
              </>
            )}

            <span style={{ color: "#CBBDB5" }}>/</span>

            <span
              className="max-w-[220px] truncate"
              style={{ color: "#171516" }}
            >
              {productName}
            </span>
          </nav>

          {/* Product Main */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-20 items-start">

            {/* Gallery */}
            <div className="min-w-0">
              <div className="overflow-hidden rounded-2xl bg-white border border-[#E7DDD6] shadow-[0_10px_40px_rgba(23,21,22,0.05)]">
                <ProductGallery
                  images={product.images}
                  name={productName}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="min-w-0 lg:pt-4">

              {/* Brand */}
              {product.brand && (
                <Link
                  href={`/brand/${product.brand.slug}`}
                  className="inline-block mb-4 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] transition-colors hover:text-[#D8A58F]"
                  style={{ color: "#B88A78" }}
                >
                  {product.brand.name}
                </Link>
              )}

              {/* Product name */}
              <h1
                className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.2]"
                style={{ color: "#171516" }}
              >
                {productName}
              </h1>

              {/* Decorative line */}
              <div className="flex items-center gap-3 my-5">
                <span
                  className="h-px w-14"
                  style={{ background: "#B88A78" }}
                />

                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "#D8A58F" }}
                />
              </div>

              {/* Badges */}
              {(product.isNew ||
                product.isFeatured ||
                product.isBestSeller ||
                isOutOfStock ||
                isLowStock) && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {product.isNew && <Badge variant="new" />}
                  {product.isFeatured && <Badge variant="featured" />}
                  {product.isBestSeller && <Badge variant="bestseller" />}
                  {isOutOfStock && <Badge variant="outofstock" />}
                  {isLowStock && <Badge variant="lowstock" />}
                </div>
              )}

              {/* Price */}
              <div className="mb-5">
                <PriceDisplay
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  currency={currency}
                  size="lg"
                />
              </div>

              {/* SKU */}
              {product.sku && (
                <div
                  className="mb-6 pb-6 border-b"
                  style={{ borderColor: "#E7DDD6" }}
                >
                  <p
                    className="text-xs tracking-wide"
                    style={{ color: "#8A7F7A" }}
                    dir="ltr"
                  >
                    SKU: {product.sku}
                  </p>
                </div>
              )}

              {/* Purchase */}
              <div
                className="rounded-2xl bg-white border p-5 sm:p-6 shadow-[0_8px_30px_rgba(23,21,22,0.04)]"
                style={{ borderColor: "#E7DDD6" }}
              >
                <ProductPurchase
                  productId={product.id}
                  name={productName}
                  price={product.price}
                  image={product.images[0]?.url}
                  stockQuantity={product.stockQuantity}
                  variants={product.variants}
                />
              </div>

              {/* Description */}
              {product.description && (
                <div
                  className="mt-8 pt-7 border-t"
                  style={{ borderColor: "#E7DDD6" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="h-px w-8"
                      style={{ background: "#B88A78" }}
                    />

                    <h2
                      className="font-heading text-xl sm:text-2xl font-semibold"
                      style={{ color: "#171516" }}
                    >
                      الوصف
                    </h2>
                  </div>

                  <p
                    className="text-sm sm:text-base leading-8 whitespace-pre-line"
                    style={{ color: "#746B67" }}
                  >
                    {product.description}
                  </p>
                </div>
              )}

              {/* Trust points */}
              <div
                className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <div
                  className="rounded-xl px-4 py-4 text-center border"
                  style={{
                    background: "#F3E8DD",
                    borderColor: "#E7DDD6",
                  }}
                >
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: "#171516" }}
                  >
                    جودة مميزة
                  </div>

                  <div
                    className="text-[11px]"
                    style={{ color: "#8A7F7A" }}
                  >
                    اختيار بعناية
                  </div>
                </div>

                <div
                  className="rounded-xl px-4 py-4 text-center border"
                  style={{
                    background: "#F3E8DD",
                    borderColor: "#E7DDD6",
                  }}
                >
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: "#171516" }}
                  >
                    دفع آمن
                  </div>

                  <div
                    className="text-[11px]"
                    style={{ color: "#8A7F7A" }}
                  >
                    طرق دفع موثوقة
                  </div>
                </div>

                <div
                  className="rounded-xl px-4 py-4 text-center border"
                  style={{
                    background: "#F3E8DD",
                    borderColor: "#E7DDD6",
                  }}
                >
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: "#171516" }}
                  >
                    شحن سريع
                  </div>

                  <div
                    className="text-[11px]"
                    style={{ color: "#8A7F7A" }}
                  >
                    وصول آمن
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-20 sm:mt-24">

              <div className="mb-8 text-center">
                <div
                  className="mb-3 text-[10px] sm:text-xs tracking-[0.3em] uppercase"
                  style={{ color: "#B88A78" }}
                >
                  You May Also Like
                </div>

                <h2
                  className="font-heading text-2xl sm:text-3xl font-semibold"
                  style={{ color: "#171516" }}
                >
                  منتجات مشابهة
                </h2>

                <div className="flex justify-center items-center gap-3 mt-4">
                  <span
                    className="h-px w-12"
                    style={{ background: "#B88A78" }}
                  />

                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "#D8A58F" }}
                  />

                  <span
                    className="h-px w-12"
                    style={{ background: "#B88A78" }}
                  />
                </div>
              </div>

              <div className="min-w-0 overflow-hidden">
                <ProductGrid
                  products={related}
                  currency={currency}
                />
              </div>
            </section>
          )}

        </div>
      </main>
    </StoreShell>
  );
}