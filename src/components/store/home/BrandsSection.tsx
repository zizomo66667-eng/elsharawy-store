import Link from "next/link";

type Brand = { id: string; name: string; slug: string; logo: string | null };

export function BrandsSection({
  title,
  brands,
}: {
  title?: string | null;
  brands: Brand[];
}) {
  if (brands.length === 0) return null;

  return (
    <section className="section bg-surface">
      <div className="container">
        {title && (
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-8">
            {title}
          </h2>
        )}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/brand/${b.slug}`}
              className="px-6 py-3 bg-white border border-border rounded-[var(--card-radius)] text-sm font-medium hover:border-primary transition"
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
