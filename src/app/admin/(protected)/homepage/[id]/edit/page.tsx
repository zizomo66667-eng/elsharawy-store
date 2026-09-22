import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateHomepageSection } from "../../actions";

type EditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditHomepageSectionPage({
  params,
}: EditPageProps) {
  const { id } = await params;

  const [section, categories] =
    await Promise.all([
      prisma.homepageSection.findUnique({
        where: { id },
      }),

      prisma.category.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

  if (!section) {
    notFound();
  }

  const config =
    (section.config as Record<string, any>) || {};

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/homepage"
          className="text-sm text-muted-text"
        >
          ← Back to Homepage Manager
        </Link>

        <h1 className="text-2xl font-semibold mt-3">
          Edit Homepage Section
        </h1>

        <p className="text-sm text-muted-text mt-1">
          Update this section without changing the
          existing Hero Slider system.
        </p>
      </div>

      <form
        action={updateHomepageSection.bind(
          null,
          section.id
        )}
        className="space-y-6"
      >
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Section Type
            </label>

            <select
              name="type"
              defaultValue={section.type}
              className="w-full rounded-lg border border-border px-3 py-2 bg-background"
            >
              <option value="HERO">
                Hero
              </option>

              <option value="CATEGORY_GRID">
                Category Grid
              </option>

              <option value="PRODUCT_SLIDER">
                Product Slider
              </option>

              <option value="PRODUCT_GRID">
                Product Grid
              </option>

              <option value="FEATURED_PRODUCTS">
                Featured Products
              </option>

              <option value="NEW_ARRIVALS">
                New Arrivals
              </option>

              <option value="BEST_SELLERS">
                Best Sellers
              </option>

              <option value="OFFERS">
                Offers
              </option>

              <option value="BRANDS">
                Brands
              </option>

              <option value="TESTIMONIALS">
                Testimonials
              </option>

              <option value="INSTAGRAM">
                Instagram
              </option>

              <option value="NEWSLETTER">
                Newsletter
              </option>

              <option value="FEATURES">
                Features
              </option>

              <option value="CUSTOM_HTML">
                Custom HTML
              </option>

              <option value="BANNER">
                Banner
              </option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                English Title
              </label>

              <input
                name="title"
                defaultValue={section.title || ""}
                className="w-full rounded-lg border border-border px-3 py-2 bg-background"
                placeholder="New Arrivals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Arabic Title
              </label>

              <input
                name="titleAr"
                defaultValue={section.titleAr || ""}
                className="w-full rounded-lg border border-border px-3 py-2 bg-background"
                placeholder="وصل حديثًا"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Subtitle
            </label>

            <input
              name="subtitle"
              defaultValue={
                section.subtitle || ""
              }
              className="w-full rounded-lg border border-border px-3 py-2 bg-background"
              placeholder="Discover our latest collection"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-lg font-semibold">
            Product Settings
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Source
              </label>

              <select
                name="source"
                defaultValue={
                  config.source || "featured"
                }
                className="w-full rounded-lg border border-border px-3 py-2 bg-background"
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
                  Offers
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
                defaultValue={
                  config.categoryId || ""
                }
                className="w-full rounded-lg border border-border px-3 py-2 bg-background"
              >
                <option value="">
                  No Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Products Limit
              </label>

              <input
                type="number"
                name="limit"
                min="1"
                max="24"
                defaultValue={
                  config.limit || 8
                }
                className="w-full rounded-lg border border-border px-3 py-2 bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Sort
              </label>

              <select
                name="sort"
                defaultValue={
                  config.sort || "newest"
                }
                className="w-full rounded-lg border border-border px-3 py-2 bg-background"
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

        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Sort Order
            </label>

            <input
              type="number"
              name="sortOrder"
              defaultValue={section.sortOrder}
              className="w-full rounded-lg border border-border px-3 py-2 bg-background"
            />

            <p className="text-xs text-muted-text mt-1">
              Lower numbers appear first.
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isVisible"
              defaultChecked={
                section.isVisible
              }
              className="w-4 h-4"
            />

            <span className="text-sm">
              Show this section on the homepage
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/homepage"
            className="px-5 py-2.5 rounded-lg border border-border text-sm"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-black text-white text-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}