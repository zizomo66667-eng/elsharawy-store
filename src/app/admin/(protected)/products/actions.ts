"use server";

import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file: File) {
  if (!file || file.size === 0) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("الملف يجب أن يكون صورة");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("حجم الصورة يجب ألا يتجاوز 10MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "elsharawy/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          reject(error || new Error("فشل رفع الصورة"));
          return;
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const nameAr = formData.get("nameAr")?.toString().trim() || null;
  const slug = formData
    .get("slug")
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const description = formData.get("description")?.toString().trim() || null;
  const price = Number(formData.get("price") || 0);
  const compareAtPrice = formData.get("compareAtPrice")
    ? Number(formData.get("compareAtPrice"))
    : null;
  const sku = formData.get("sku")?.toString().trim() || null;
  const barcode = formData.get("barcode")?.toString().trim() || null;
  const categoryId = formData.get("categoryId")?.toString() || null;
  const brandId = formData.get("brandId")?.toString() || null;
  const stockQuantity = Number(formData.get("stockQuantity") || 0);
  const lowStockThreshold = Number(
    formData.get("lowStockThreshold") || 5
  );

  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isNew = formData.get("isNew") === "on";
  const isBestSeller = formData.get("isBestSeller") === "on";

  const imageUrl = formData.get("imageUrl")?.toString().trim() || null;

  const imageFile = formData.get("imageFile");

  let uploadedImageUrl = imageUrl;

  if (imageFile instanceof File && imageFile.size > 0) {
    uploadedImageUrl = await uploadImage(imageFile);
  }

  const variantsRaw = formData.get("variants")?.toString() || "";

  if (!name || !slug || !price) {
    return { error: "الاسم والـSlug والسعر مطلوبون" };
  }

  const existing = await prisma.product.findUnique({
    where: { slug },
  });

  if (existing) {
    return { error: "الـSlug مستخدم بالفعل" };
  }

  const variants = variantsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [size, color, colorHex, stock] = line
        .split("|")
        .map((s) => s.trim());

      return {
        size: size || null,
        color: color || null,
        colorHex: colorHex || null,
        stockQuantity: Number(stock) || 0,
        isActive: true,
      };
    });

  await prisma.product.create({
    data: {
      name,
      nameAr,
      slug,
      description,
      price,
      compareAtPrice,
      sku,
      barcode,
      categoryId: categoryId || null,
      brandId: brandId || null,
      stockQuantity,
      lowStockThreshold,
      isActive,
      isFeatured,
      isNew,
      isBestSeller,

      images: uploadedImageUrl
        ? {
            create: [
              {
                url: uploadedImageUrl,
                alt: nameAr || name,
                isPrimary: true,
                sortOrder: 0,
              },
            ],
          }
        : undefined,

      variants:
        variants.length > 0
          ? {
              create: variants,
            }
          : undefined,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name")?.toString().trim();
  const nameAr = formData.get("nameAr")?.toString().trim() || null;
  const slug = formData
    .get("slug")
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
  const description = formData.get("description")?.toString().trim() || null;
  const price = Number(formData.get("price") || 0);
  const compareAtPrice = formData.get("compareAtPrice")
    ? Number(formData.get("compareAtPrice"))
    : null;
  const sku = formData.get("sku")?.toString().trim() || null;
  const barcode = formData.get("barcode")?.toString().trim() || null;
  const categoryId = formData.get("categoryId")?.toString() || null;
  const brandId = formData.get("brandId")?.toString() || null;
  const stockQuantity = Number(formData.get("stockQuantity") || 0);
  const lowStockThreshold = Number(
    formData.get("lowStockThreshold") || 5
  );

  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isNew = formData.get("isNew") === "on";
  const isBestSeller = formData.get("isBestSeller") === "on";

  if (!name || !slug || !price) {
    return { error: "الاسم والـSlug والسعر مطلوبون" };
  }

  const existing = await prisma.product.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  if (existing) {
    return { error: "الـSlug مستخدم بالفعل" };
  }

  const imageFile = formData.get("imageFile");

  let uploadedImageUrl: string | null = null;

  if (imageFile instanceof File && imageFile.size > 0) {
    uploadedImageUrl = await uploadImage(imageFile);
  }

  await prisma.product.update({
    where: { id },

    data: {
      name,
      nameAr,
      slug,
      description,
      price,
      compareAtPrice,
      sku,
      barcode,
      categoryId: categoryId || null,
      brandId: brandId || null,
      stockQuantity,
      lowStockThreshold,
      isActive,
      isFeatured,
      isNew,
      isBestSeller,

      ...(uploadedImageUrl
        ? {
            images: {
              deleteMany: {},
              create: [
                {
                  url: uploadedImageUrl,
                  alt: nameAr || name,
                  isPrimary: true,
                  sortOrder: 0,
                },
              ],
            },
          }
        : {}),
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

export async function toggleProductActive(id: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return;

  await prisma.product.update({
    where: { id },
    data: {
      isActive: !product.isActive,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
}