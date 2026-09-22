import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("\n===== NEON POSTGRES DATABASE =====\n");

  const counts = {
    Users: await prisma.user.count(),
    Settings: await prisma.setting.count(),
    Themes: await prisma.theme.count(),
    ThemePresets: await prisma.themePreset.count(),
    Brands: await prisma.brand.count(),
    Categories: await prisma.category.count(),
    Products: await prisma.product.count(),
    ProductImages: await prisma.productImage.count(),
    ProductVariants: await prisma.productVariant.count(),
    HomepageSections: await prisma.homepageSection.count(),
    Customers: await prisma.customer.count(),
    Orders: await prisma.order.count(),
    OrderItems: await prisma.orderItem.count(),
    OrderStatusHistory: await prisma.orderStatusHistory.count(),
    Coupons: await prisma.coupon.count(),
    Banners: await prisma.banner.count(),
    HeroBanners: await prisma.heroBanner.count(),
  };

  for (const [table, count] of Object.entries(counts)) {
    console.log(`${table.padEnd(22)} ${count}`);
  }

  console.log("\n=================================\n");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });