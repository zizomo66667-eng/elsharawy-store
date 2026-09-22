import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteProduct, toggleProductActive } from "./actions";
import { formatPrice } from "@/lib/utils";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      brand: true,
      images: { where: { isPrimary: true }, take: 1 },
      _count: { select: { variants: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">المنتجات</h1>
          <p className="text-muted-text text-sm mt-1">{products.length} منتج</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + إضافة منتج
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="text-right p-3 font-medium">المنتج</th>
              <th className="text-right p-3 font-medium">التصنيف</th>
              <th className="text-right p-3 font-medium">السعر</th>
              <th className="text-right p-3 font-medium">المخزون</th>
              <th className="text-right p-3 font-medium">الحالة</th>
              <th className="text-right p-3 font-medium">شارات</th>
              <th className="text-right p-3 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-3">
                  <div className="font-medium">{p.nameAr || p.name}</div>
                  <div className="text-xs text-muted-text font-mono" dir="ltr">{p.sku || p.slug}</div>
                </td>
                <td className="p-3 text-muted-text">
                  {p.category?.nameAr || p.category?.name || "—"}
                </td>
                <td className="p-3">
                  <div>{formatPrice(p.price)}</div>
                  {p.compareAtPrice && (
                    <div className="text-xs text-muted-text line-through">
                      {formatPrice(p.compareAtPrice)}
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={
                      p.stockQuantity <= p.lowStockThreshold
                        ? "text-error font-medium"
                        : ""
                    }
                  >
                    {p.stockQuantity}
                  </span>
                  {p._count.variants > 0 && (
                    <div className="text-xs text-muted-text">{p._count.variants} مقاس/لون</div>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs ${
                      p.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.isActive ? "نشط" : "مخفي"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {p.isFeatured && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">مميز</span>
                    )}
                    {p.isNew && (
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">جديد</span>
                    )}
                    {p.isBestSeller && (
                      <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">الأكثر مبيعاً</span>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-primary hover:underline text-xs">
                      تعديل
                    </Link>
                    <form action={toggleProductActive.bind(null, p.id)}>
                      <button type="submit" className="text-xs text-muted-text hover:text-primary">
                        {p.isActive ? "إخفاء" : "إظهار"}
                      </button>
                    </form>
                    <form action={async () => { "use server"; await deleteProduct(p.id); }}>
                      <button type="submit" className="text-xs text-error hover:underline">حذف</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-text">
                  لا توجد منتجات.{" "}
                  <Link href="/admin/products/new" className="text-primary underline">أضف منتجًا</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
