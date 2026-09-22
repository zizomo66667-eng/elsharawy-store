"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const nameAr = formData.get("nameAr")?.toString().trim() || null;
  const slug = formData.get("slug")?.toString().trim().toLowerCase().replace(/\s+/g, "-");
  const description = formData.get("description")?.toString().trim() || null;
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  if (!name || !slug) {
    return { error: "الاسم والـSlug مطلوبان" };
  }

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return { error: "الـSlug مستخدم بالفعل" };
  }

  await prisma.category.create({
    data: { name, nameAr, slug, description, sortOrder, isActive },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const nameAr = formData.get("nameAr")?.toString().trim() || null;
  const slug = formData.get("slug")?.toString().trim().toLowerCase().replace(/\s+/g, "-");
  const description = formData.get("description")?.toString().trim() || null;
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  if (!name || !slug) {
    return { error: "الاسم والـSlug مطلوبان" };
  }

  const existing = await prisma.category.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) {
    return { error: "الـSlug مستخدم بالفعل" };
  }

  await prisma.category.update({
    where: { id },
    data: { name, nameAr, slug, description, sortOrder, isActive },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  const productsCount = await prisma.product.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    return { error: `لا يمكن حذف التصنيف لأنه مرتبط بـ ${productsCount} منتج. قم بنقل المنتجات أولاً.` };
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { success: true };
}

export async function toggleCategoryActive(id: string) {
  await requireAdmin();

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return;

  await prisma.category.update({
    where: { id },
    data: { isActive: !category.isActive },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
}