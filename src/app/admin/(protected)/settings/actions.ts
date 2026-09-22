"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !["ADMIN", "SUPER_ADMIN"].includes((session.user as any)?.role)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function updateStoreSettings(formData: FormData) {
  await requireAdmin();

  const fields = [
    "store_name",
    "store_description",
    "phone",
    "whatsapp",
    "instagram",
    "facebook",
    "address",
    "working_hours",
    "currency",
    "shipping_fee",
   "free_shipping_threshold",
"vodafone_cash_number",
"seo_title",
    "seo_description",
  ];

  for (const key of fields) {
    const value = formData.get(key);
    if (value !== null) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: value.toString() },
        create: { key, value: value.toString() },
      });
    }
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
 return;
}

export async function updateThemeColors(formData: FormData) {
  await requireAdmin();

  const theme = await prisma.theme.findFirst({ where: { isActive: true } });
  if (!theme) {
    throw new Error("No active theme found");
  }

  const config = theme.config as any;

  const colorKeys = [
    "primary",
    "secondary",
    "accent",
    "background",
    "surface",
    "text",
    "mutedText",
    "border",
  ];

  for (const key of colorKeys) {
    const value = formData.get(`color_${key}`);
    if (value) {
      config.tokens.colors[key] = value.toString();
    }
  }

  // Fonts
  const fontFamily = formData.get("font_family");
  const fontHeading = formData.get("font_heading");
  if (fontFamily) config.tokens.typography.fontFamily = fontFamily.toString();
  if (fontHeading) config.tokens.typography.fontFamilyHeading = fontHeading.toString();

  await prisma.theme.update({
    where: { id: theme.id },
    data: { config },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return;
}
export async function changeAdminPassword(formData: FormData) {
  const session = await requireAdmin();

  const currentPassword = formData.get("current_password")?.toString();
  const newPassword = formData.get("new_password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("جميع الحقول مطلوبة");
  }

  if (newPassword !== confirmPassword) {
    throw new Error("كلمة المرور الجديدة غير متطابقة");
  }

  if (newPassword.length < 8) {
    throw new Error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
  }

  const userId = (session.user as any)?.id;

  if (!userId) {
    throw new Error("لم يتم العثور على المستخدم");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("المستخدم غير موجود");
  }

  const bcrypt = await import("bcryptjs");

  const isValid = await bcrypt.compare(
    currentPassword,
    user.passwordHash
  );

  if (!isValid) {
    throw new Error("كلمة المرور الحالية غير صحيحة");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  revalidatePath("/admin/settings");
}