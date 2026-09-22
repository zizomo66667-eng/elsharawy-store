import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/store/layout/StoreShell";
import { ProductGrid } from "@/components/store/product/ProductGrid";
import { getBrandBySlug, getProducts } from "@/lib/store/products";
import { getCachedStoreConfig } from "@/lib/store/settings";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "براند غير موجود" };
  return { title: `${brand.name} | الشعراوي` };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const [brand, { settings }] = await Promise.all([
    getBrandBySlug(slug),
    getCachedStoreConfig(),
  ]);
  if (!brand) notFound();

  const { products, total } = await getProducts({ brandSlug: slug, limit: 48 });
  const currency = String(settings.currency || "EGP");

  return (
    <StoreShell>
      <div className="container py-8 space-y-6">
        <nav className="text-xs text-muted-text flex gap-1">
          <Link href="/" className="hover:text-primary">الرئيسية</Link>
          <span>/</span>
          <span className="text-primary">{brand.name}</span>
        </nav>

        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">{brand.name}</h1>
          <p className="text-muted-text text-sm mt-1">{total} منتج</p>
        </div>

        <ProductGrid
          products={products}
          currency={currency}
          emptyTitle="لا توجد منتجات لهذا البراند"
        />
      </div>
    </StoreShell>
  );
}
