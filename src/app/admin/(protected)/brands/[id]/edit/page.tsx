import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBrand } from "../../actions";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    const result = await updateBrand(id, formData);
    if (result?.error) {
      console.error(result.error);
      return;
    }
    redirect("/admin/brands");
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/brands" className="text-muted-text hover:text-primary text-sm">← رجوع</Link>
        <h1 className="text-2xl font-heading font-bold">تعديل براند</h1>
      </div>
      <form action={handleUpdate} className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">اسم البراند *</label>
          <input name="name" required defaultValue={brand.name} className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input name="slug" required defaultValue={brand.slug} className="w-full border border-border rounded-lg px-3 py-2" dir="ltr" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الترتيب</label>
          <input name="sortOrder" type="number" defaultValue={brand.sortOrder} className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="isActive" id="isActive" defaultChecked={brand.isActive} className="rounded" />
          <label htmlFor="isActive" className="text-sm">نشط</label>
        </div>
        <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium">حفظ التعديلات</button>
      </form>
    </div>
  );
}
