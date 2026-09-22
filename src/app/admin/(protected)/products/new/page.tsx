import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  async function handleCreate(formData: FormData) {
    "use server";

    const result = await createProduct(formData);

    if (result?.error) {
      console.error(result.error);
      return;
    }

    redirect("/admin/products");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="text-muted-text hover:text-primary text-sm"
        >
          ← رجوع
        </Link>

        <h1 className="text-2xl font-heading font-bold">
          إضافة منتج
        </h1>
      </div>

      <form
        action={handleCreate}
        encType="multipart/form-data"
        className="bg-white rounded-xl border border-border p-6 space-y-5"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              اسم المنتج (إنجليزي) *
            </label>

            <input
              name="name"
              required
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              الاسم بالعربي
            </label>

            <input
              name="nameAr"
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug *
          </label>

          <input
            name="slug"
            required
            className="w-full border border-border rounded-lg px-3 py-2"
            dir="ltr"
            placeholder="classic-bra"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            الوصف
          </label>

          <textarea
            name="description"
            rows={3}
            className="w-full border border-border rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              السعر *
            </label>

            <input
              name="price"
              type="number"
              step="0.01"
              required
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              السعر قبل الخصم
            </label>

            <input
              name="compareAtPrice"
              type="number"
              step="0.01"
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              SKU
            </label>

            <input
              name="sku"
              className="w-full border border-border rounded-lg px-3 py-2"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Barcode
            </label>

            <input
              name="barcode"
              className="w-full border border-border rounded-lg px-3 py-2"
              dir="ltr"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              التصنيف
            </label>

            <select
              name="categoryId"
              className="w-full border border-border rounded-lg px-3 py-2"
            >
              <option value="">— بدون —</option>

              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr || c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              البراند
            </label>

            <select
              name="brandId"
              className="w-full border border-border rounded-lg px-3 py-2"
            >
              <option value="">— بدون —</option>

              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              الكمية في المخزون
            </label>

            <input
              name="stockQuantity"
              type="number"
              defaultValue={0}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              تنبيه عند انخفاض المخزون
            </label>

            <input
              name="lowStockThreshold"
              type="number"
              defaultValue={5}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            صورة المنتج
          </label>

          <input
            name="imageFile"
            type="file"
            accept="image/*"
            className="w-full border border-border rounded-lg px-3 py-2"
          />

          <p className="text-xs text-muted-text mt-2">
            اختر صورة المنتج من جهازك، وسيتم رفعها تلقائيًا.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            رابط الصورة — اختياري
          </label>

          <input
            name="imageUrl"
            className="w-full border border-border rounded-lg px-3 py-2"
            dir="ltr"
            placeholder="https://..."
          />

          <p className="text-xs text-muted-text mt-1">
            استخدم هذا فقط إذا لم تختر صورة من جهازك.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            المقاسات والألوان (اختياري)
          </label>

          <textarea
            name="variants"
            rows={4}
            className="w-full border border-border rounded-lg px-3 py-2 font-mono text-sm"
            dir="ltr"
            placeholder={
              "S|أسود|#1a1a1a|10\nM|أسود|#1a1a1a|15\nL|بيج|#f5f0e8|8"
            }
          />

          <p className="text-xs text-muted-text mt-1">
            كل سطر: size|color|colorHex|stock
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked
              className="rounded"
            />
            نشط
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isFeatured"
              className="rounded"
            />
            مميز
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isNew"
              className="rounded"
            />
            جديد
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isBestSeller"
              className="rounded"
            />
            الأكثر مبيعًا
          </label>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium"
        >
          حفظ المنتج
        </button>
      </form>
    </div>
  );
}