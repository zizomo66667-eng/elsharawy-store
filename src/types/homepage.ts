// src/types/homepage.ts
// Homepage Section Schema

export type SectionType =
  | "HERO"
  | "CATEGORY_GRID"
  | "PRODUCT_SLIDER"
  | "PRODUCT_GRID"
  | "FEATURED_PRODUCTS"
  | "NEW_ARRIVALS"
  | "BEST_SELLERS"
  | "OFFERS"
  | "BRANDS"
  | "TESTIMONIALS"
  | "INSTAGRAM"
  | "NEWSLETTER"
  | "FEATURES"
  | "CUSTOM_HTML"
  | "BANNER";

export interface BaseSectionConfig {
  title?: string;
  titleAr?: string;
  subtitle?: string;
  subtitleAr?: string;
}

export interface HeroSectionConfig extends BaseSectionConfig {
  buttonText?: string;
  buttonLink?: string;
  imageDesktop: string;
  imageMobile?: string;
  textPosition?: "left" | "center" | "right";
  overlay?: boolean;
  height?: "small" | "medium" | "large" | "full";
  alignment?: "start" | "center" | "end";
}

export interface ProductSectionConfig extends BaseSectionConfig {
  limit?: number;
  categoryId?: string;
  productIds?: string[];
  layout?: "slider" | "grid";
  showViewAll?: boolean;
  viewAllLink?: string;
}

export interface CategoryGridConfig extends BaseSectionConfig {
  categoryIds?: string[];
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface BannerSectionConfig extends BaseSectionConfig {
  imageDesktop: string;
  imageMobile?: string;
  link?: string;
}

export interface CustomHtmlConfig extends BaseSectionConfig {
  html: string;
}

export type SectionConfig =
  | HeroSectionConfig
  | ProductSectionConfig
  | CategoryGridConfig
  | BannerSectionConfig
  | CustomHtmlConfig
  | BaseSectionConfig;

export interface HomepageSection {
  id: string;
  type: SectionType;
  title?: string;
  titleAr?: string;
  subtitle?: string;
  config: SectionConfig;
  isVisible: boolean;
  sortOrder: number;
}
