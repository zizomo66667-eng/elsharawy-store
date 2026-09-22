"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

export async function createBrand(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim().toLowerCase().replace(/\s+/g, "-");
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  if (!name || !slug) return { error: "الاسم والـSlug مطلوبان" };

  const existing = await prisma.brand.findUnique({ where: { slug } });
  if (existing) return { error: "الـSlug مستخدم بالفعل" };

  await prisma.brand.create({
    data: { name, slug, sortOrder, isActive },
  });

  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}

export async function updateBrand(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim().toLowerCase().replace(/\s+/g, "-");
  const sortOrder = Number(formData.get("sortOrder") || 0);
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";

  if (!name || !slug) return { error: "الاسم والـSlug مطلوبان" };

  const existing = await prisma.brand.findFirst({
    where: { slug, NOT: { id } },
  });
  if (existing) return { error: "الـSlug مستخدم بالفعل" };

  await prisma.brand.update({
    where: { id },
    data: { name, slug, sortOrder, isActive },
  });

  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}

export async function deleteBrand(id: string) {
  await requireAdmin();

  const productsCount = await prisma.product.count({ where: { brandId: id } });
  if (productsCount > 0) {
    return { error: `لا يمكن حذف البراند لأنه مرتبط بـ ${productsCount} منتج.` };
  }

  await prisma.brand.delete({ where: { id } });
  revalidatePath("/admin/brands");
  revalidatePath("/");
  return { success: true };
}

export async function toggleBrandActive(id: string) {
  await requireAdmin();
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) return;

  await prisma.brand.update({
    where: { id },
    data: { isActive: !brand.isActive },
  });

  revalidatePath("/admin/brands");
  revalidatePath("/");
  
}
