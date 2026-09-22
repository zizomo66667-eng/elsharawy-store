import type { Metadata } from "next";
import { StoreShell } from "@/components/store/layout/StoreShell";
import { HeroSection } from "@/components/store/home/HeroSection";
import { CategoryGridSection } from "@/components/store/home/CategoryGrid";
import { ProductSection } from "@/components/store/home/ProductSection";
import { BrandsSection } from "@/components/store/home/BrandsSection";

import {
  getCachedStoreConfig,
  getHomepageSections,
  getActiveCategories,
  getActiveBrands,
  getActiveHeroBanners,
} from "@/lib/store/settings";

import { getProducts } from "@/lib/store/products";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getCachedStoreConfig();

  return {
    title: String(
      settings.seo_title ||
        settings.store_name ||
        "الشعراوي"
    ),
    description: String(
      settings.seo_description ||
        settings.store_description ||
        ""
    ),
  };
}

function getSectionTitle(section: any) {
  return section.titleAr || section.title || undefined;
}

async function getSectionProducts(section: any) {
  const config = (section.config || {}) as Record<string, any>;

  const source = String(config.source || "featured");
  const limit = Math.max(
    1,
    Math.min(24, Number(config.limit) || 8)
  );

  const sort =
    config.sort === "price_asc" ||
    config.sort === "price_desc" ||
    config.sort === "name" ||
    config.sort === "newest"
      ? config.sort
      : "newest";

  if (source === "offers") {
    const result = await getProducts({
      sort,
      limit: 50,
    });

    const products = result.products
      .filter(
        (product) =>
          product.compareAtPrice !== null &&
          product.compareAtPrice !== undefined &&
          product.compareAtPrice > product.price
      )
      .slice(0, limit);

    return products;
  }

  if (source === "featured") {
    const result = await getProducts({
      featured: true,
      sort,
      limit,
    });

    return result.products;
  }

  if (source === "new") {
    const result = await getProducts({
      isNew: true,
      sort,
      limit,
    });

    return result.products;
  }

  if (source === "bestSeller") {
    const result = await getProducts({
      bestSeller: true,
      sort,
      limit,
    });

    return result.products;
  }

  if (source === "category") {
    const categoryId = String(config.categoryId || "");

    if (!categoryId) {
      return [];
    }

    const { prisma } = await import("@/lib/prisma");

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },
      select: {
        slug: true,
      },
    });

    if (!category) {
      return [];
    }

    const result = await getProducts({
      categorySlug: category.slug,
      sort,
      limit,
    });

    return result.products;
  }

  const result = await getProducts({
    sort,
    limit,
  });

  return result.products;
}

export default async function HomePage() {
  const [
    { settings },
    sections,
    categories,
    brands,
    heroBanners,
  ] = await Promise.all([
    getCachedStoreConfig(),
    getHomepageSections(),
    getActiveCategories(),
    getActiveBrands(),
    getActiveHeroBanners(),
  ]);

  const currency = String(settings.currency || "EGP");

  /*
   * If Homepage Manager has no sections yet,
   * keep the original homepage behavior.
   */
  if (sections.length === 0) {
    const [
      featuredResult,
      newResult,
      bestSellerResult,
    ] = await Promise.all([
      getProducts({
        featured: true,
        limit: 8,
      }),
      getProducts({
        isNew: true,
        limit: 8,
      }),
      getProducts({
        bestSeller: true,
        limit: 8,
      }),
    ]);

    return (
      <StoreShell>
        <HeroSection
          title="مجموعة جديدة"
          subtitle="اكتشفي أناقتك مع الشعراوي"
          config={{
            buttonText: "تسوقي الآن",
            buttonLink: "/products",
            overlay: true,
            height: "large",
          }}
          banners={heroBanners}
        />

        <CategoryGridSection
          title="تسوقي حسب التصنيف"
          categories={categories}
        />

        <ProductSection
          title="منتجات مميزة"
          products={featuredResult.products}
          currency={currency}
        />

        <ProductSection
          title="وصل حديثًا"
          products={newResult.products}
          currency={currency}
        />

        <ProductSection
          title="الأكثر مبيعًا"
          products={bestSellerResult.products}
          currency={currency}
        />

        <BrandsSection
          title="برانداتنا"
          brands={brands}
        />
      </StoreShell>
    );
  }

  /*
   * Homepage Manager is active.
   * Every visible section is rendered according to
   * its database configuration and sort order.
   */
  const renderedSections = await Promise.all(
    sections.map(async (section) => {
      const config = (section.config || {}) as Record<string, any>;

      switch (section.type) {
        case "HERO":
          return (
            <HeroSection
              key={section.id}
              title={getSectionTitle(section)}
              subtitle={section.subtitle || undefined}
              config={config}
              banners={heroBanners}
            />
          );

        case "CATEGORY_GRID": {
          const limit = Math.max(
            1,
            Math.min(24, Number(config.limit) || categories.length)
          );

          return (
            <CategoryGridSection
              key={section.id}
              title={getSectionTitle(section)}
              categories={categories.slice(0, limit)}
            />
          );
        }

        case "BRANDS": {
          const limit = Math.max(
            1,
            Math.min(24, Number(config.limit) || brands.length)
          );

          return (
            <BrandsSection
              key={section.id}
              title={getSectionTitle(section)}
              brands={brands.slice(0, limit)}
            />
          );
        }

        case "FEATURED_PRODUCTS": {
          const limit = Math.max(
            1,
            Math.min(24, Number(config.limit) || 8)
          );

          const result = await getProducts({
            featured: true,
            sort: "newest",
            limit,
          });

          return (
            <ProductSection
              key={section.id}
              title={getSectionTitle(section)}
              products={result.products}
              viewAllLink="/products?featured=1"
              currency={currency}
            />
          );
        }

        case "NEW_ARRIVALS": {
          const limit = Math.max(
            1,
            Math.min(24, Number(config.limit) || 8)
          );

          const result = await getProducts({
            isNew: true,
            sort: "newest",
            limit,
          });

          return (
            <ProductSection
              key={section.id}
              title={getSectionTitle(section)}
              products={result.products}
              viewAllLink="/products?new=1"
              currency={currency}
            />
          );
        }

        case "BEST_SELLERS": {
          const limit = Math.max(
            1,
            Math.min(24, Number(config.limit) || 8)
          );

          const result = await getProducts({
            bestSeller: true,
            sort: "newest",
            limit,
          });

          return (
            <ProductSection
              key={section.id}
              title={getSectionTitle(section)}
              products={result.products}
              viewAllLink="/products?bestseller=1"
              currency={currency}
            />
          );
        }

        case "PRODUCT_GRID":
        case "PRODUCT_SLIDER":
        case "OFFERS": {
          const products = await getSectionProducts(section);

          return (
            <ProductSection
              key={section.id}
              title={getSectionTitle(section)}
              products={products}
              currency={currency}
            />
          );
        }

        default:
          /*
           * These section types exist in the database and can
           * be added later without breaking the homepage.
           */
          return null;
      }
    })
  );

  return (
    <StoreShell>
      {renderedSections}
    </StoreShell>
  );
}