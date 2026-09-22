import Link from "next/link";

type Category = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  image: string | null;
};

export function CategoryGridSection({
  title,
  categories,
}: {
  title?: string | null;
  categories: Category[];
}) {
  if (categories.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        {title && (
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-8">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group text-center"
            >
              <div className="aspect-square rounded-[var(--card-radius)] bg-surface overflow-hidden border border-border mb-2">
                {c.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image}
                    alt={c.nameAr || c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-text text-sm">
                    {c.nameAr || c.name}
                  </div>
                )}
              </div>
              <p className="text-sm font-medium group-hover:text-primary transition">
                {c.nameAr || c.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
