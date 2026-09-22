import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCategory } from "../../actions";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateCategory(id, formData);
    if (result?.error) {
      console.error(result.error);
      return;
    }
    redirect("/admin/categories");
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/categories" className="text-muted-text hover:text-primary text-sm">
          ← رجوع
        </Link>
        <h1 className="text-2xl font-heading font-bold">تعديل تصنيف</h1>
      </div>

      <form action={handleUpdate} className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">الاسم (إنجليزي) *</label>
          <input name="name" required defaultValue={category.name} className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الاسم بالعربي</label>
          <input name="nameAr" defaultValue={category.nameAr || ""} className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input name="slug" required defaultValue={category.slug} className="w-full border border-border rounded-lg px-3 py-2" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الوصف</label>
          <textarea name="description" rows={2} defaultValue={category.description || ""} className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الترتيب</label>
          <input name="sortOrder" type="number" defaultValue={category.sortOrder} className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="isActive" id="isActive" defaultChecked={category.isActive} className="rounded" />
          <label htmlFor="isActive" className="text-sm">نشط (ظاهر في المتجر)</label>
        </div>
        <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium">
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}
