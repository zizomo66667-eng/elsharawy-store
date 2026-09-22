import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ProductListItem = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    category: true;
    images: true;
    variants: true;
  };
}>;

const productInclude = {
  brand: true,
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: { where: { isActive: true } },
} satisfies Prisma.ProductInclude;

export type ProductFilters = {
  categorySlug?: string;
  brandSlug?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "name";
  page?: number;
  limit?: number;
};

export async function getProducts(filters: ProductFilters = {}) {
  const {
    categorySlug,
    brandSlug,
    q,
    minPrice,
    maxPrice,
    inStock,
    featured,
    isNew,
    bestSeller,
    sort = "newest",
    page = 1,
    limit = 24,
  } = filters;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (categorySlug) {
    where.category = { slug: categorySlug, isActive: true };
  }
  if (brandSlug) {
    where.brand = { slug: brandSlug, isActive: true };
  }
  if (featured) where.isFeatured = true;
  if (isNew) where.isNew = true;
  if (bestSeller) where.isBestSeller = true;
  if (inStock) where.stockQuantity = { gt: 0 };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) (where.price as any).gte = minPrice;
    if (maxPrice !== undefined) (where.price as any).lte = maxPrice;
  }
  if (q && q.trim()) {
    const term = q.trim();
    where.OR = [
      { name: { contains: term } },
      { nameAr: { contains: term } },
      { sku: { contains: term } },
      { barcode: { contains: term } },
      { brand: { name: { contains: term } } },
      { category: { name: { contains: term } } },
      { category: { nameAr: { contains: term } } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };
  if (sort === "newest") orderBy = { createdAt: "desc" };

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { where: { isActive: true } },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findFirst({
    where: { slug, isActive: true },
  });
}

export async function getBrandBySlug(slug: string) {
  return prisma.brand.findFirst({
    where: { slug, isActive: true },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      ...(categoryId ? { categoryId } : {}),
    },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: productInclude,
    take: limit,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getNewProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isNew: true },
    include: productInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getBestSellerProducts(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true, isBestSeller: true },
    include: productInclude,
    take: limit,
    orderBy: { updatedAt: "desc" },
  });
}
