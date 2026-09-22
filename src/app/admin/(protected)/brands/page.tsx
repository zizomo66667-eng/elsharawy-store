import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBrand, toggleBrandActive } from "./actions";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">البراندات</h1>
          <p className="text-muted-text text-sm mt-1">{brands.length} براند</p>
        </div>
        <Link
          href="/admin/brands/new"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + إضافة براند
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="text-right p-3 font-medium">الترتيب</th>
              <th className="text-right p-3 font-medium">الاسم</th>
              <th className="text-right p-3 font-medium">Slug</th>
              <th className="text-right p-3 font-medium">المنتجات</th>
              <th className="text-right p-3 font-medium">الحالة</th>
              <th className="text-right p-3 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-b border-border last:border-0">
                <td className="p-3">{brand.sortOrder}</td>
                <td className="p-3 font-medium">{brand.name}</td>
                <td className="p-3 font-mono text-xs" dir="ltr">{brand.slug}</td>
                <td className="p-3">{brand._count.products}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs ${
                      brand.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {brand.isActive ? "نشط" : "مخفي"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/brands/${brand.id}/edit`} className="text-primary hover:underline text-xs">
                      تعديل
                    </Link>
                    <form action={toggleBrandActive.bind(null, brand.id)}>
                      <button type="submit" className="text-xs text-muted-text hover:text-primary">
                        {brand.isActive ? "إخفاء" : "إظهار"}
                      </button>
                    </form>
                    <form action={async () => { "use server"; await deleteBrand(brand.id); }}>
                      <button type="submit" className="text-xs text-error hover:underline">حذف</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-text">
                  لا توجد براندات. <Link href="/admin/brands/new" className="text-primary underline">أضف براندًا</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
