import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  deleteHomepageSection,
  toggleHomepageSection,
  moveHomepageSection,
} from "./actions";

const typeLabels: Record<string, string> = {
  HERO: "Hero",
  CATEGORY_GRID: "Category Grid",
  PRODUCT_SLIDER: "Product Slider",
  PRODUCT_GRID: "Product Grid",
  FEATURED_PRODUCTS: "Featured Products",
  NEW_ARRIVALS: "New Arrivals",
  BEST_SELLERS: "Best Sellers",
  OFFERS: "Offers",
  BRANDS: "Brands",
  TESTIMONIALS: "Testimonials",
  INSTAGRAM: "Instagram",
  NEWSLETTER: "Newsletter",
  FEATURES: "Features",
  CUSTOM_HTML: "Custom HTML",
  BANNER: "Banner",
};

export default async function HomepageManagerPage() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Homepage Manager</h1>
          <p className="text-sm text-muted-text mt-1">
            Manage the sections that appear on the homepage.
          </p>
        </div>

        <Link
          href="/admin/homepage/new"
          className="px-4 py-2 rounded-lg bg-black text-white text-sm"
        >
          + Add Section
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {sections.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-lg font-semibold">No homepage sections yet</h2>

            <p className="text-sm text-muted-text mt-2">
              Add your first homepage section to start building the homepage.
            </p>

            <Link
              href="/admin/homepage/new"
              className="inline-block mt-5 px-4 py-2 rounded-lg bg-black text-white text-sm"
            >
              Add First Section
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="p-5 flex items-center justify-between gap-5"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-sm shrink-0">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-medium">
                        {section.title ||
                          section.titleAr ||
                          typeLabels[section.type] ||
                          section.type}
                      </h2>

                      <span className="text-[11px] px-2 py-1 rounded-full bg-muted">
                        {typeLabels[section.type] || section.type}
                      </span>

                      <span
                        className={`text-[11px] px-2 py-1 rounded-full ${
                          section.isVisible
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {section.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    {section.subtitle && (
                      <p className="text-xs text-muted-text mt-1 truncate">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <form
                    action={async () => {
                      "use server";
                      await moveHomepageSection(section.id, "up");
                    }}
                  >
                    <button
                      type="submit"
                      disabled={index === 0}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs disabled:opacity-40"
                    >
                      ↑
                    </button>
                  </form>

                  <form
                    action={async () => {
                      "use server";
                      await moveHomepageSection(section.id, "down");
                    }}
                  >
                    <button
                      type="submit"
                      disabled={index === sections.length - 1}
                      className="px-3 py-1.5 rounded-lg border border-border text-xs disabled:opacity-40"
                    >
                      ↓
                    </button>
                  </form>

                  <Link
                    href={`/admin/homepage/${section.id}/edit`}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs"
                  >
                    Edit
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      await toggleHomepageSection(section.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg border border-border text-xs"
                    >
                      {section.isVisible ? "Hide" : "Show"}
                    </button>
                  </form>

                  <form
                    action={async () => {
                      "use server";
                      await deleteHomepageSection(section.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}