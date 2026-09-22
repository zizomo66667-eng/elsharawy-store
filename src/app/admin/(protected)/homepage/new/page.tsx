import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createHomepageSection } from "../actions";

const sectionTypes = [
  { value: "HERO", label: "Hero Slider" },
  { value: "CATEGORY_GRID", label: "Category Grid" },
  { value: "PRODUCT_SLIDER", label: "Product Slider" },
  { value: "PRODUCT_GRID", label: "Product Grid" },
  { value: "FEATURED_PRODUCTS", label: "Featured Products" },
  { value: "NEW_ARRIVALS", label: "New Arrivals" },
  { value: "BEST_SELLERS", label: "Best Sellers" },
  { value: "OFFERS", label: "Offers" },
  { value: "BRANDS", label: "Brands" },
  { value: "FEATURES", label: "Features / Trust Bar" },
  { value: "BANNER", label: "Banner" },
  { value: "NEWSLETTER", label: "Newsletter" },
  { value: "CUSTOM_HTML", label: "Custom HTML" },
];

export default async function NewHomepageSectionPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/homepage"
          className="text-sm text-muted-text hover:text-primary"
        >
          ← Homepage
        </Link>

        <span className="text-muted-text">/</span>

        <h1 className="text-2xl font-heading font-bold">
          Add Homepage Section
        </h1>
      </div>

      <form
        action={createHomepageSection}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl border border-border p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Section Type
            </label>

            <select
              name="type"
              required
              className="w-full border border-border rounded-lg px-3 py-2 bg-white"
              defaultValue="PRODUCT_SLIDER"
            >
              {sectionTypes.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}
            </select>

            <p className="text-xs text-muted-text mt-2">
              Choose what this section will display on the homepage.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Arabic Title
              </label>

              <input
                name="titleAr"
                placeholder="مثال: أحدث المنتجات"
                className="w-full border border-border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                English Title
              </label>

              <input
                name="title"
                placeholder="New Arrivals"
                className="w-full border border-border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subtitle
            </label>

            <input
              name="subtitle"
              placeholder="A short description for this section"
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 space-y-5">
          <div>
            <h2 className="font-medium">
              Product Settings
            </h2>

            <p className="text-xs text-muted-text mt-1">
              These settings are used for product-based sections.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Source
              </label>

              <select
                name="source"
                defaultValue="featured"
                className="w-full border border-border rounded-lg px-3 py-2 bg-white"
              >
                <option value="featured">
                  Featured Products
                </option>

                <option value="new">
                  New Arrivals
                </option>

                <option value="bestSeller">
                  Best Sellers
                </option>

                <option value="category">
                  Category
                </option>

                <option value="offers">
                  Offers / Sale
                </option>

                <option value="all">
                  All Products
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>

              <select
                name="categoryId"
                defaultValue=""
                className="w-full border border-border rounded-lg px-3 py-2 bg-white"
              >
                <option value="">
                  No specific category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.nameAr || category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Products Count
              </label>

              <input
                name="limit"
                type="number"
                min="1"
                max="24"
                defaultValue="8"
                className="w-full border border-border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Sort
              </label>

              <select
                name="sort"
                defaultValue="newest"
                className="w-full border border-border rounded-lg px-3 py-2 bg-white"
              >
                <option value="newest">
                  Newest
                </option>

                <option value="price_asc">
                  Price: Low to High
                </option>

                <option value="price_desc">
                  Price: High to Low
                </option>

                <option value="name">
                  Name
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 space-y-5">
          <div>
            <h2 className="font-medium">
              Display Settings
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Sort Order
              </label>

              <input
                name="sortOrder"
                type="number"
                defaultValue="0"
                className="w-full border border-border rounded-lg px-3 py-2"
              />

              <p className="text-xs text-muted-text mt-1">
                Smaller numbers appear first.
              </p>
            </div>

            <label className="flex items-center gap-3 mt-7 cursor-pointer">
              <input
                type="checkbox"
                name="isVisible"
                defaultChecked
                className="w-4 h-4"
              />

              <span className="text-sm">
                Show this section on homepage
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link
            href="/admin/homepage"
            className="px-5 py-2 rounded-lg border border-border text-sm"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            Create Section
          </button>
        </div>
      </form>
    </div>
  );
}