import Link from "next/link";
import { redirect } from "next/navigation";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    const result = await createCategory(formData);
    if (result?.error) {
      // In a real app we'd show the error; for now redirect with query or just log
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
        <h1 className="text-2xl font-heading font-bold">إضافة تصنيف</h1>
      </div>

      <form action={handleCreate} className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">الاسم (إنجليزي) *</label>
          <input name="name" required className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الاسم بالعربي</label>
          <input name="nameAr" className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input
            name="slug"
            required
            className="w-full border border-border rounded-lg px-3 py-2"
            dir="ltr"
            placeholder="bras"
          />
          <p className="text-xs text-muted-text mt-1">يُستخدم في الرابط (حروف إنجليزية صغيرة وشرطات)</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الوصف</label>
          <textarea name="description" rows={2} className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الترتيب</label>
          <input name="sortOrder" type="number" defaultValue={0} className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="isActive" id="isActive" defaultChecked className="rounded" />
          <label htmlFor="isActive" className="text-sm">نشط (ظاهر في المتجر)</label>
        </div>
        <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium">
          حفظ التصنيف
        </button>
      </form>
    </div>
  );
}
