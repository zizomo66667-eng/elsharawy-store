import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCategory, toggleCategoryActive } from "./actions";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">التصنيفات</h1>
          <p className="text-muted-text text-sm mt-1">{categories.length} تصنيف</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
        >
          + إضافة تصنيف
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
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-border last:border-0">
                <td className="p-3">{cat.sortOrder}</td>
                <td className="p-3">
                  <div className="font-medium">{cat.nameAr || cat.name}</div>
                  {cat.nameAr && <div className="text-xs text-muted-text">{cat.name}</div>}
                </td>
                <td className="p-3 font-mono text-xs" dir="ltr">{cat.slug}</td>
                <td className="p-3">{cat._count.products}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs ${
                      cat.isActive
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cat.isActive ? "نشط" : "مخفي"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="text-primary hover:underline text-xs"
                    >
                      تعديل
                    </Link>
                    <form action={toggleCategoryActive.bind(null, cat.id)}>
                      <button type="submit" className="text-xs text-muted-text hover:text-primary">
                        {cat.isActive ? "إخفاء" : "إظهار"}
                      </button>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await deleteCategory(cat.id);
                      }}
                    >
                      <button type="submit" className="text-xs text-error hover:underline">
                        حذف
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-text">
                  لا توجد تصنيفات بعد.{" "}
                  <Link href="/admin/categories/new" className="text-primary underline">
                    أضف تصنيفًا
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
