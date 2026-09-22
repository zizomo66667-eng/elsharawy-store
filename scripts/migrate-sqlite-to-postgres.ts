import { PrismaClient as PostgresPrismaClient } from "@prisma/client";
import { PrismaClient as SqlitePrismaClient } from "../generated/sqlite";

const sqlite = new SqlitePrismaClient();
const postgres = new PostgresPrismaClient();

async function main() {
  console.log("\n========================================");
  console.log(" EL SHARAWY: SQLITE -> POSTGRES");
  console.log("========================================\n");

  // ========================================
  // 1. Read all data from SQLite
  // ========================================

  console.log("Reading SQLite data...");

  const users = await sqlite.user.findMany();
  const settings = await sqlite.setting.findMany();
  const themes = await sqlite.theme.findMany();
  const themePresets = await sqlite.themePreset.findMany();
  const brands = await sqlite.brand.findMany();
  const categories = await sqlite.category.findMany();
  const products = await sqlite.product.findMany();
  const productImages = await sqlite.productImage.findMany();
  const productVariants = await sqlite.productVariant.findMany();
  const homepageSections = await sqlite.homepageSection.findMany();
  const customers = await sqlite.customer.findMany();
  const orders = await sqlite.order.findMany();
  const orderItems = await sqlite.orderItem.findMany();
  const orderStatusHistory = await sqlite.orderStatusHistory.findMany();
  const coupons = await sqlite.coupon.findMany();
  const banners = await sqlite.banner.findMany();
  const heroBanners = await sqlite.heroBanner.findMany();

  console.log("\nSQLite records found:");

  console.log(`Users:                ${users.length}`);
  console.log(`Settings:             ${settings.length}`);
  console.log(`Themes:               ${themes.length}`);
  console.log(`Theme Presets:        ${themePresets.length}`);
  console.log(`Brands:               ${brands.length}`);
  console.log(`Categories:           ${categories.length}`);
  console.log(`Products:             ${products.length}`);
  console.log(`Product Images:       ${productImages.length}`);
  console.log(`Product Variants:     ${productVariants.length}`);
  console.log(`Homepage Sections:    ${homepageSections.length}`);
  console.log(`Customers:            ${customers.length}`);
  console.log(`Orders:               ${orders.length}`);
  console.log(`Order Items:          ${orderItems.length}`);
  console.log(`Order History:        ${orderStatusHistory.length}`);
  console.log(`Coupons:              ${coupons.length}`);
  console.log(`Banners:              ${banners.length}`);
  console.log(`Hero Banners:         ${heroBanners.length}`);

  // ========================================
  // 2. Check PostgreSQL
  // ========================================

  console.log("\nChecking Neon PostgreSQL...");

  const existingUsers = await postgres.user.count();
  const existingProducts = await postgres.product.count();
  const existingOrders = await postgres.order.count();

  console.log(`Existing Users:       ${existingUsers}`);
  console.log(`Existing Products:    ${existingProducts}`);
  console.log(`Existing Orders:      ${existingOrders}`);

  if (
    existingUsers > 0 ||
    existingProducts > 0 ||
    existingOrders > 0
  ) {
    throw new Error(
      "\nSTOP: Neon already contains data in Users, Products, or Orders.\n" +
      "Migration was NOT performed to avoid duplicates."
    );
  }

  // ========================================
  // 3. Migration
  // ========================================

  console.log("\nStarting migration...\n");

  await postgres.$transaction(
    async (tx) => {
      // --------------------------------------
      // Users
      // --------------------------------------

      if (users.length > 0) {
        await tx.user.createMany({
          data: users as any,
        });
      }

      console.log(`✓ Users migrated: ${users.length}`);

      // --------------------------------------
      // Settings
      // --------------------------------------

      if (settings.length > 0) {
        await tx.setting.createMany({
          data: settings as any,
        });
      }

      console.log(`✓ Settings migrated: ${settings.length}`);

      // --------------------------------------
      // Themes
      // --------------------------------------

      if (themes.length > 0) {
        await tx.theme.createMany({
          data: themes as any,
        });
      }

      console.log(`✓ Themes migrated: ${themes.length}`);

      // --------------------------------------
      // Theme Presets
      // --------------------------------------

      if (themePresets.length > 0) {
        await tx.themePreset.createMany({
          data: themePresets as any,
        });
      }

      console.log(
        `✓ Theme Presets migrated: ${themePresets.length}`
      );

      // --------------------------------------
      // Brands
      // --------------------------------------

      if (brands.length > 0) {
        await tx.brand.createMany({
          data: brands as any,
        });
      }

      console.log(`✓ Brands migrated: ${brands.length}`);

      // --------------------------------------
      // Categories
      // --------------------------------------

      // Insert categories without parentId first.
      // This safely handles CategoryTree relations.

      if (categories.length > 0) {
        const categoriesWithoutParents = categories.map(
          ({ parentId, ...category }) => ({
            ...category,
            parentId: null,
          })
        );

        await tx.category.createMany({
          data: categoriesWithoutParents as any,
        });

        // Restore parent relationships.
        for (const category of categories) {
          if (category.parentId) {
            await tx.category.update({
              where: {
                id: category.id,
              },
              data: {
                parentId: category.parentId,
              },
            });
          }
        }
      }

      console.log(`✓ Categories migrated: ${categories.length}`);

      // --------------------------------------
      // Products
      // --------------------------------------

      if (products.length > 0) {
        await tx.product.createMany({
          data: products as any,
        });
      }

      console.log(`✓ Products migrated: ${products.length}`);

      // --------------------------------------
      // Product Images
      // --------------------------------------

      if (productImages.length > 0) {
        await tx.productImage.createMany({
          data: productImages as any,
        });
      }

      console.log(
        `✓ Product Images migrated: ${productImages.length}`
      );

      // --------------------------------------
      // Product Variants
      // --------------------------------------

      if (productVariants.length > 0) {
        await tx.productVariant.createMany({
          data: productVariants as any,
        });
      }

      console.log(
        `✓ Product Variants migrated: ${productVariants.length}`
      );

      // --------------------------------------
      // Homepage Sections
      // --------------------------------------

      if (homepageSections.length > 0) {
        await tx.homepageSection.createMany({
          data: homepageSections as any,
        });
      }

      console.log(
        `✓ Homepage Sections migrated: ${homepageSections.length}`
      );

      // --------------------------------------
      // Customers
      // --------------------------------------

      if (customers.length > 0) {
        await tx.customer.createMany({
          data: customers as any,
        });
      }

      console.log(`✓ Customers migrated: ${customers.length}`);

      // --------------------------------------
      // Orders
      // --------------------------------------

      if (orders.length > 0) {
        await tx.order.createMany({
          data: orders as any,
        });
      }

      console.log(`✓ Orders migrated: ${orders.length}`);

      // --------------------------------------
      // Order Items
      // --------------------------------------

      if (orderItems.length > 0) {
        await tx.orderItem.createMany({
          data: orderItems as any,
        });
      }

      console.log(
        `✓ Order Items migrated: ${orderItems.length}`
      );

      // --------------------------------------
      // Order Status History
      // --------------------------------------

      if (orderStatusHistory.length > 0) {
        await tx.orderStatusHistory.createMany({
          data: orderStatusHistory as any,
        });
      }

      console.log(
        `✓ Order History migrated: ${orderStatusHistory.length}`
      );

      // --------------------------------------
      // Coupons
      // --------------------------------------

      if (coupons.length > 0) {
        await tx.coupon.createMany({
          data: coupons as any,
        });
      }

      console.log(`✓ Coupons migrated: ${coupons.length}`);

      // --------------------------------------
      // Banners
      // --------------------------------------

      if (banners.length > 0) {
        await tx.banner.createMany({
          data: banners as any,
        });
      }

      console.log(`✓ Banners migrated: ${banners.length}`);

      // --------------------------------------
      // Hero Banners
      // --------------------------------------

      if (heroBanners.length > 0) {
        await tx.heroBanner.createMany({
          data: heroBanners as any,
        });
      }

      console.log(
        `✓ Hero Banners migrated: ${heroBanners.length}`
      );
    },
    {
      maxWait: 30000,
      timeout: 120000,
    }
  );

  // ========================================
  // 4. Verify PostgreSQL
  // ========================================

  console.log("\n========================================");
  console.log(" VERIFYING NEON DATABASE");
  console.log("========================================\n");

  const pgCounts = {
    Users: await postgres.user.count(),
    Settings: await postgres.setting.count(),
    Themes: await postgres.theme.count(),
    ThemePresets: await postgres.themePreset.count(),
    Brands: await postgres.brand.count(),
    Categories: await postgres.category.count(),
    Products: await postgres.product.count(),
    ProductImages: await postgres.productImage.count(),
    ProductVariants: await postgres.productVariant.count(),
    HomepageSections: await postgres.homepageSection.count(),
    Customers: await postgres.customer.count(),
    Orders: await postgres.order.count(),
    OrderItems: await postgres.orderItem.count(),
    OrderStatusHistory: await postgres.orderStatusHistory.count(),
    Coupons: await postgres.coupon.count(),
    Banners: await postgres.banner.count(),
    HeroBanners: await postgres.heroBanner.count(),
  };

  for (const [name, count] of Object.entries(pgCounts)) {
    console.log(`${name.padEnd(22)} ${count}`);
  }

  console.log("\n========================================");
  console.log(" MIGRATION COMPLETED SUCCESSFULLY");
  console.log("========================================\n");
}

main()
  .catch((error) => {
    console.error("\n========================================");
    console.error(" MIGRATION FAILED");
    console.error("========================================\n");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await sqlite.$disconnect();
    await postgres.$disconnect();
  });