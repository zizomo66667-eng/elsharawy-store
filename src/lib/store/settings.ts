import { prisma } from "@/lib/prisma";
import { defaultTheme, type ThemeConfig } from "@/types/theme";
import { unstable_cache } from "next/cache";

export type StoreSettings = Record<string, any>;

export async function getSettings(): Promise<StoreSettings> {
  const rows = await prisma.setting.findMany();
  const map: StoreSettings = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

export async function getActiveTheme(): Promise<{
  id: string;
  name: string;
  config: ThemeConfig;
} | null> {
  const theme = await prisma.theme.findFirst({
    where: { isActive: true },
  });
  if (!theme) return null;
  return {
    id: theme.id,
    name: theme.name,
    config: (theme.config as unknown as ThemeConfig) || defaultTheme,
  };
}

export async function getStoreConfig() {
  const [settings, theme] = await Promise.all([getSettings(), getActiveTheme()]);
  return {
    settings,
    theme: theme?.config || defaultTheme,
    themeName: theme?.name || "Default",
    themeId: theme?.id || null,
  };
}

/** Cached version for public storefront pages */
export const getCachedStoreConfig = unstable_cache(
  async () => getStoreConfig(),
  ["store-config"],
  { revalidate: 30, tags: ["store-config"] }
);

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getActiveBrands() {
  return prisma.brand.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getHomepageSections() {
  return prisma.homepageSection.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}
export async function getActiveHeroBanners() {
  const now = new Date();

  return prisma.heroBanner.findMany({
    where: {
      isActive: true,
      AND: [
        {
          OR: [
            { startsAt: null },
            { startsAt: { lte: now } },
          ],
        },
        {
          OR: [
            { endsAt: null },
            { endsAt: { gte: now } },
          ],
        },
      ],
    },
    orderBy: { sortOrder: "asc" },
  });
}