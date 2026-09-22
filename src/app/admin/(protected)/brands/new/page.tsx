import Link from "next/link";
import { redirect } from "next/navigation";
import { createBrand } from "../actions";

export default function NewBrandPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    const result = await createBrand(formData);
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
        <h1 className="text-2xl font-heading font-bold">إضافة براند</h1>
      </div>
      <form action={handleCreate} className="bg-white rounded-xl border border-border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">اسم البراند *</label>
          <input name="name" required className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input name="slug" required className="w-full border border-border rounded-lg px-3 py-2" dir="ltr" placeholder="elsharawy" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الترتيب</label>
          <input name="sortOrder" type="number" defaultValue={0} className="w-full border border-border rounded-lg px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="isActive" id="isActive" defaultChecked className="rounded" />
          <label htmlFor="isActive" className="text-sm">نشط</label>
        </div>
        <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium">حفظ</button>
      </form>
    </div>
  );
}
