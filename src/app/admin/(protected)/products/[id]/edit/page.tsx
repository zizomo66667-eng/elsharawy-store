import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.brand.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateProduct(id, formData);
    if (result?.error) {
      console.error(result.error);
      return;
    }
    redirect("/admin/products");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-muted-text hover:text-primary text-sm">← رجوع</Link>
        <h1 className="text-2xl font-heading font-bold">تعديل منتج</h1>
      </div>

      <form action={handleUpdate} className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">اسم المنتج (إنجليزي) *</label>
            <input name="name" required defaultValue={product.name} className="w-full border border-border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الاسم بالعربي</label>
            <input name="nameAr" defaultValue={product.nameAr || ""} className="w-full border border-border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input name="slug" required defaultValue={product.slug} className="w-full border border-border rounded-lg px-3 py-2" dir="ltr" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">الوصف</label>
          <textarea name="description" rows={3} defaultValue={product.description || ""} className="w-full border border-border rounded-lg px-3 py-2" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">السعر *</label>
            <input name="price" type="number" step="0.01" required defaultValue={product.price} className="w-full border border-border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">السعر قبل الخصم</label>
            <input name="compareAtPrice" type="number" step="0.01" defaultValue={product.compareAtPrice || ""} className="w-full border border-border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input name="sku" defaultValue={product.sku || ""} className="w-full border border-border rounded-lg px-3 py-2" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Barcode</label>
            <input name="barcode" defaultValue={product.barcode || ""} className="w-full border border-border rounded-lg px-3 py-2" dir="ltr" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">التصنيف</label>
            <select name="categoryId" defaultValue={product.categoryId || ""} className="w-full border border-border rounded-lg px-3 py-2">
              <option value="">— بدون —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameAr || c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">البراند</label>
            <select name="brandId" defaultValue={product.brandId || ""} className="w-full border border-border rounded-lg px-3 py-2">
              <option value="">— بدون —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">الكمية في المخزون</label>
            <input name="stockQuantity" type="number" defaultValue={product.stockQuantity} className="w-full border border-border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">تنبيه عند انخفاض المخزون</label>
            <input name="lowStockThreshold" type="number" defaultValue={product.lowStockThreshold} className="w-full border border-border rounded-lg px-3 py-2" />
          </div>
        </div>

        {product.variants.length > 0 && (
          <div className="bg-surface rounded-lg p-3 text-sm">
            <p className="font-medium mb-2">المقاسات والألوان الحالية:</p>
            <ul className="space-y-1 text-muted-text">
              {product.variants.map((v) => (
                <li key={v.id}>
                  {v.size || "—"} / {v.color || "—"} — مخزون: {v.stockQuantity}
                </li>
              ))}
            </ul>
            <p className="text-xs mt-2 text-muted-text">تعديل المقاسات المتقدم سيُضاف لاحقاً.</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isActive" defaultChecked={product.isActive} className="rounded" /> نشط
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className="rounded" /> مميز
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isNew" defaultChecked={product.isNew} className="rounded" /> جديد
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isBestSeller" defaultChecked={product.isBestSeller} className="rounded" /> الأكثر مبيعاً
          </label>
        </div>

        <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium">
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}
