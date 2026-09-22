import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ==================== 1. Admin User ====================
  const email = process.env.ADMIN_EMAIL || "admin@elsharawy.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123456";
  const name = process.env.ADMIN_NAME || "مدير الشعراوي";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // ==================== 2. Store Settings ====================
  const settings = [
    { key: "store_name", value: "الشعراوي" },
    { key: "store_description", value: "متجر الشعراوي للملابس الداخلية الفاخرة" },
    { key: "phone", value: "01000000000" },
    { key: "whatsapp", value: "201000000000" },
    { key: "instagram", value: "https://instagram.com/elsharawy" },
    { key: "facebook", value: "https://facebook.com/elsharawy" },
    { key: "address", value: "القاهرة، مصر" },
    { key: "working_hours", value: "من 10 صباحاً إلى 10 مساءً" },
    { key: "currency", value: "EGP" },
    { key: "shipping_fee", value: 50 },
    { key: "free_shipping_threshold", value: 500 },
    { key: "seo_title", value: "الشعراوي | ملابس داخلية فاخرة" },
    { key: "seo_description", value: "تسوقي أجمل الملابس الداخلية من متجر الشعراوي" },
    { key: "logo_desktop", value: "/logo.png" },
    { key: "logo_mobile", value: "/logo-mobile.png" },
    { key: "favicon", value: "/favicon.ico" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log("✅ Store Settings created");

  // ==================== 3. Default Theme ====================
  const defaultThemeConfig = {
    name: "Luxury",
    tokens: {
      colors: {
        primary: "#1a1a1a",
        secondary: "#f5f0e8",
        accent: "#c9a87c",
        background: "#ffffff",
        surface: "#faf8f5",
        text: "#1a1a1a",
        mutedText: "#6b6b6b",
        border: "#e5e0d8",
        success: "#16a34a",
        error: "#dc2626",
        warning: "#d97706",
      },
      typography: {
        fontFamily: "Inter, system-ui, sans-serif",
        fontFamilyHeading: "Playfair Display, serif",
        fontSizeBase: "16px",
        fontSizeSm: "14px",
        fontSizeLg: "18px",
        fontSizeXl: "20px",
        fontSize2xl: "24px",
        fontWeightNormal: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        lineHeight: 1.6,
      },
      spacing: {
        sectionSpacing: "4rem",
        containerMaxWidth: "1280px",
        containerPadding: "1rem",
      },
      borders: {
        radiusSm: "4px",
        radiusMd: "8px",
        radiusLg: "12px",
        radiusFull: "9999px",
      },
      buttons: {
        borderRadius: "8px",
        paddingX: "1.5rem",
        paddingY: "0.75rem",
        fontWeight: 500,
      },
      cards: {
        borderRadius: "12px",
        shadow: "0 1px 3px rgba(0,0,0,0.08)",
        padding: "1rem",
      },
      header: {
        height: "64px",
        sticky: true,
        background: "#ffffff",
      },
      footer: {
        background: "#1a1a1a",
        textColor: "#f5f0e8",
      },
    },
    layout: {
      productCardStyle: "minimal",
      productGridColumns: { mobile: 2, tablet: 3, desktop: 4 },
      headerStyle: "simple",
      footerStyle: "multi-column",
    },
  };

  // Deactivate any existing active themes
  await prisma.theme.updateMany({ data: { isActive: false } });

  const theme = await prisma.theme.create({
    data: {
      name: "Luxury (Default)",
      isActive: true,
      isDraft: false,
      config: defaultThemeConfig,
    },
  });
  console.log("✅ Default Theme created:", theme.name);

  // Theme Presets
  const presets = [
    {
      name: "Luxury",
      description: "أسود + كريمي + ذهبي - فاخر",
      config: defaultThemeConfig,
    },
    {
      name: "Minimal",
      description: "أبيض ونظيف",
      config: {
        ...defaultThemeConfig,
        name: "Minimal",
        tokens: {
          ...defaultThemeConfig.tokens,
          colors: {
            ...defaultThemeConfig.tokens.colors,
            primary: "#111111",
            secondary: "#fafafa",
            accent: "#666666",
            background: "#ffffff",
            surface: "#f5f5f5",
          },
        },
      },
    },
    {
      name: "Modern",
      description: "كحلي + أبيض + ذهبي",
      config: {
        ...defaultThemeConfig,
        name: "Modern",
        tokens: {
          ...defaultThemeConfig.tokens,
          colors: {
            ...defaultThemeConfig.tokens.colors,
            primary: "#0a1628",
            secondary: "#ffffff",
            accent: "#c9a87c",
            background: "#ffffff",
            surface: "#f8f9fa",
          },
        },
      },
    },
  ];

  for (const p of presets) {
    const existing = await prisma.themePreset.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.themePreset.create({ data: p });
    }
  }
  console.log("✅ Theme Presets created");

  // ==================== 4. Categories ====================
  const categoriesData = [
    { name: "Bras", nameAr: "حمالات صدر", slug: "bras", sortOrder: 1 },
    { name: "Brief", nameAr: "ملابس داخلية", slug: "brief", sortOrder: 2 },
    { name: "Bikini", nameAr: "بيكيني", slug: "bikini", sortOrder: 3 },
    { name: "Hot Short", nameAr: "هوت شورت", slug: "hot-short", sortOrder: 4 },
    { name: "Midi", nameAr: "ميدي", slug: "midi", sortOrder: 5 },
    { name: "Badihas", nameAr: "بادي", slug: "badihas", sortOrder: 6 },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = c.id;
  }
  console.log("✅ Categories created");

  // ==================== 5. Brands ====================
  const brandsData = [
    { name: "الشعراوي", slug: "elsharawy", sortOrder: 1 },
    { name: "Premium Soft", slug: "premium-soft", sortOrder: 2 },
  ];

  const brands: Record<string, string> = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
    brands[b.slug] = brand.id;
  }
  console.log("✅ Brands created");

  // ==================== 6. Sample Products ====================
  const productsData = [
    {
      name: "حمالة صدر كلاسيك",
      nameAr: "حمالة صدر كلاسيك",
      slug: "classic-bra",
      description: "حمالة صدر مريحة بتصميم كلاسيكي أنيق",
      price: 299,
      compareAtPrice: 399,
      sku: "BR-001",
      categoryId: categories["bras"],
      brandId: brands["elsharawy"],
      stockQuantity: 50,
      isFeatured: true,
      isNew: true,
      isBestSeller: true,
    },
    {
      name: "بيكيني ساتان",
      nameAr: "بيكيني ساتان",
      slug: "satin-bikini",
      description: "بيكيني ناعم من الساتان",
      price: 249,
      compareAtPrice: 320,
      sku: "BK-001",
      categoryId: categories["bikini"],
      brandId: brands["elsharawy"],
      stockQuantity: 30,
      isFeatured: true,
      isNew: false,
      isBestSeller: true,
    },
    {
      name: "هوت شورت قطني",
      nameAr: "هوت شورت قطني",
      slug: "cotton-hot-short",
      description: "هوت شورت قطني مريح للاستخدام اليومي",
      price: 199,
      sku: "HS-001",
      categoryId: categories["hot-short"],
      brandId: brands["premium-soft"],
      stockQuantity: 80,
      isFeatured: false,
      isNew: true,
      isBestSeller: false,
    },
    {
      name: "بادي دانتيل",
      nameAr: "بادي دانتيل",
      slug: "lace-badi",
      description: "بادي أنيق من الدانتيل الفاخر",
      price: 449,
      compareAtPrice: 599,
      sku: "BD-001",
      categoryId: categories["badihas"],
      brandId: brands["elsharawy"],
      stockQuantity: 15,
      isFeatured: true,
      isNew: true,
      isBestSeller: false,
    },
    {
      name: "ميدي قطني",
      nameAr: "ميدي قطني",
      slug: "cotton-midi",
      description: "ميدي قطني ناعم",
      price: 179,
      sku: "MD-001",
      categoryId: categories["midi"],
      brandId: brands["premium-soft"],
      stockQuantity: 40,
      isFeatured: false,
      isNew: false,
      isBestSeller: true,
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        images: {
          create: [
            {
              url: `/products/${p.slug}-1.jpg`,
              alt: p.name,
              isPrimary: true,
              sortOrder: 0,
            },
          ],
        },
        variants: {
          create: [
            { size: "S", color: "أسود", colorHex: "#1a1a1a", stockQuantity: 10 },
            { size: "M", color: "أسود", colorHex: "#1a1a1a", stockQuantity: 15 },
            { size: "L", color: "أسود", colorHex: "#1a1a1a", stockQuantity: 12 },
            { size: "S", color: "بيج", colorHex: "#f5f0e8", stockQuantity: 8 },
            { size: "M", color: "بيج", colorHex: "#f5f0e8", stockQuantity: 10 },
          ],
        },
      },
    });
  }
  console.log("✅ Sample Products created");

  // ==================== 7. Homepage Sections ====================
  // Clear existing
  await prisma.homepageSection.deleteMany();

  const sections = [
    {
      type: "HERO" as const,
      title: "مجموعة جديدة",
      titleAr: "مجموعة جديدة",
      subtitle: "اكتشفي أناقتك مع الشعراوي",
      config: {
        buttonText: "تسوقي الآن",
        buttonLink: "/products",
        imageDesktop: "/banners/hero-desktop.jpg",
        imageMobile: "/banners/hero-mobile.jpg",
        textPosition: "center",
        overlay: true,
        height: "large",
      },
      isVisible: true,
      sortOrder: 1,
    },
    {
      type: "CATEGORY_GRID" as const,
      title: "تسوقي حسب التصنيف",
      titleAr: "تسوقي حسب التصنيف",
      config: {
        columns: { mobile: 2, tablet: 3, desktop: 6 },
      },
      isVisible: true,
      sortOrder: 2,
    },
    {
      type: "NEW_ARRIVALS" as const,
      title: "وصل حديثاً",
      titleAr: "وصل حديثاً",
      config: {
        limit: 8,
        layout: "slider",
        showViewAll: true,
        viewAllLink: "/products?filter=new",
      },
      isVisible: true,
      sortOrder: 3,
    },
    {
      type: "BEST_SELLERS" as const,
      title: "الأكثر مبيعاً",
      titleAr: "الأكثر مبيعاً",
      config: {
        limit: 8,
        layout: "grid",
        showViewAll: true,
        viewAllLink: "/products?filter=bestseller",
      },
      isVisible: true,
      sortOrder: 4,
    },
    {
      type: "FEATURED_PRODUCTS" as const,
      title: "منتجات مميزة",
      titleAr: "منتجات مميزة",
      config: {
        limit: 4,
        layout: "grid",
      },
      isVisible: true,
      sortOrder: 5,
    },
    {
      type: "BRANDS" as const,
      title: "برانداتنا",
      titleAr: "برانداتنا",
      config: {},
      isVisible: true,
      sortOrder: 6,
    },
  ];

  for (const s of sections) {
    await prisma.homepageSection.create({ data: s });
  }
  console.log("✅ Homepage Sections created");

  console.log("\n🎉 Seed completed successfully!");
  console.log("-----------------------------------");
  console.log(`Admin Email: ${email}`);
  console.log(`Admin Password: ${password}`);
  console.log("-----------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
