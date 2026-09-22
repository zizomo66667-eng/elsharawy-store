"use server";

import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { defaultTheme } from "@/types/theme";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file: File, folder: string) {
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
        folder,
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

async function getImageValue(
  formData: FormData,
  key: string,
  folder: string
) {
  const value = formData.get(key);

  if (
    value &&
    typeof value === "object" &&
    "arrayBuffer" in value &&
    typeof (value as any).arrayBuffer === "function"
  ) {
    const file = value as File;

    if (file.size > 0) {
      return await uploadImage(file, folder);
    }
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return null;
}
export async function updateBrandIdentity(formData: FormData) {
await requireAdmin();

const storeName = formData.get("store_name");
const storeDescription = formData.get("store_description");
const favicon = formData.get("favicon");
const seoTitle = formData.get("seo_title");
const seoDescription = formData.get("seo_description");

const logoDesktop = await getImageValue(
formData,
"logo_desktop",
"elsharawy/branding"
);

const logoMobile = await getImageValue(
formData,
"logo_mobile",
"elsharawy/branding"
);

const logoDesktopHeight = formData.get("logo_desktop_height");
const logoMobileHeight = formData.get("logo_mobile_height");

const fields: Array<[string, FormDataEntryValue | null]> = [
["store_name", storeName],
["store_description", storeDescription],
["logo_desktop", logoDesktop],
["logo_mobile", logoMobile],
["logo_desktop_height", logoDesktopHeight],
["logo_mobile_height", logoMobileHeight],
["favicon", favicon],
["seo_title", seoTitle],
["seo_description", seoDescription],
];

for (const [key, value] of fields) {
if (value !== null) {
await prisma.setting.upsert({
where: { key },
update: { value: value.toString() },
create: { key, value: value.toString() },
});
}
}

revalidatePath("/");
revalidatePath("/admin/appearance");
}
export async function updateThemeAppearance(formData: FormData) {
  await requireAdmin();

  let theme = await prisma.theme.findFirst({ where: { isActive: true } });

  if (!theme) {
    theme = await prisma.theme.create({
      data: {
        name: "Custom",
        isActive: true,
        isDraft: false,
        config: defaultTheme as any,
      },
    });
  }

  const config = structuredClone((theme.config as any) || defaultTheme);

  const colorKeys = [
    "primary",
    "secondary",
    "accent",
    "background",
    "surface",
    "text",
    "mutedText",
    "border",
    "success",
    "error",
    "warning",
  ];

  for (const key of colorKeys) {
    const value = formData.get(`color_${key}`);

    if (value) {
      if (!config.tokens) config.tokens = {};
      if (!config.tokens.colors) config.tokens.colors = {};

      config.tokens.colors[key] = value.toString();
    }
  }

  const fontFamily = formData.get("font_family");
  const fontHeading = formData.get("font_heading");

  if (fontFamily) {
    config.tokens = config.tokens || {};
    config.tokens.typography = config.tokens.typography || {};
    config.tokens.typography.fontFamily = fontFamily.toString();
  }

  if (fontHeading) {
    config.tokens = config.tokens || {};
    config.tokens.typography = config.tokens.typography || {};
    config.tokens.typography.fontFamilyHeading = fontHeading.toString();
  }

  const radiusMd = formData.get("radius_md");
  const btnRadius = formData.get("btn_radius");

  if (radiusMd) {
    config.tokens = config.tokens || {};
    config.tokens.borders = config.tokens.borders || {};
    config.tokens.borders.radiusMd = radiusMd.toString();
    config.tokens.borders.radiusLg = radiusMd.toString();
  }

  if (btnRadius) {
    config.tokens = config.tokens || {};
    config.tokens.buttons = config.tokens.buttons || {};
    config.tokens.buttons.borderRadius = btnRadius.toString();
  }

  await prisma.theme.update({
    where: { id: theme.id },
    data: {
      config,
      name: formData.get("theme_name")?.toString() || theme.name,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/appearance");
}

export async function updateHeroSection(formData: FormData) {
  await requireAdmin();

  const hero = await prisma.homepageSection.findFirst({
    where: { type: "HERO" },
  });

  const config = {
    heading: formData.get("heading")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    buttonText: formData.get("buttonText")?.toString() || "",
    buttonLink: formData.get("buttonLink")?.toString() || "/products",
    imageDesktop: formData.get("imageDesktop")?.toString() || "",
    imageMobile: formData.get("imageMobile")?.toString() || "",
    textPosition: formData.get("textPosition")?.toString() || "center",
    overlay: formData.get("overlay") === "on",
    height: formData.get("height")?.toString() || "large",
  };

  if (hero) {
    await prisma.homepageSection.update({
      where: { id: hero.id },
      data: {
        title: config.heading || hero.title,
        subtitle: config.description || hero.subtitle,
        config,
        isVisible: formData.get("isVisible") !== "off",
      },
    });
  } else {
    await prisma.homepageSection.create({
      data: {
        type: "HERO",
        title: config.heading,
        subtitle: config.description,
        config,
        isVisible: true,
        sortOrder: 1,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/appearance");
}

export async function resetThemeToDefault() {
  await requireAdmin();

  await prisma.theme.updateMany({
    data: { isActive: false },
  });

  await prisma.theme.create({
    data: {
      name: "Luxury (Default)",
      isActive: true,
      isDraft: false,
      config: defaultTheme as any,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/appearance");
}
// ==================== HERO BANNERS ====================

export async function createHeroBanner(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const buttonText = formData.get("buttonText")?.toString() || "";
  const buttonLink = formData.get("buttonLink")?.toString() || "/products";

  const imageDesktop = await getImageValue(
    formData,
    "imageDesktop",
    "elsharawy/hero"
  );

  const imageMobile = await getImageValue(
    formData,
    "imageMobile",
    "elsharawy/hero"
  );

  if (!imageDesktop) {
    throw new Error("يجب اختيار صورة Desktop");
  }

  const textPosition =
    formData.get("textPosition")?.toString() || "center";

  const overlay = formData.get("overlay") === "on";

  const height =
    formData.get("height")?.toString() || "large";

  const durationValue =
    Number(formData.get("duration")) || 5000;

  const sortOrder =
    Number(formData.get("sortOrder")) || 0;

  const isActive =
    formData.get("isActive") !== "off";

  const startsAtValue =
    formData.get("startsAt")?.toString() || "";

  const endsAtValue =
    formData.get("endsAt")?.toString() || "";

  await prisma.heroBanner.create({
    data: {
      title,
      description,
      buttonText,
      buttonLink,
      imageDesktop,
      imageMobile,
      textPosition,
      overlay,
      height,
      duration: durationValue,
      sortOrder,
      isActive,
      startsAt: startsAtValue
        ? new Date(startsAtValue)
        : null,
      endsAt: endsAtValue
        ? new Date(endsAtValue)
        : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/appearance");
}

export async function updateHeroBanner(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id")?.toString();

  if (!id) {
    throw new Error("Hero غير موجود");
  }

  const existing = await prisma.heroBanner.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new Error("Hero غير موجود");
  }

  const imageDesktopValue = await getImageValue(
    formData,
    "imageDesktop",
    "elsharawy/hero"
  );

  const imageMobileValue = await getImageValue(
    formData,
    "imageMobile",
    "elsharawy/hero"
  );

  const title = formData.get("title")?.toString() || "";
  const description =
    formData.get("description")?.toString() || "";

  const buttonText =
    formData.get("buttonText")?.toString() || "";

  const buttonLink =
    formData.get("buttonLink")?.toString() || "/products";

  const textPosition =
    formData.get("textPosition")?.toString() || "center";

  const overlay =
    formData.get("overlay") === "on";

  const height =
    formData.get("height")?.toString() || "large";

  const duration =
    Number(formData.get("duration")) || 5000;

  const sortOrder =
    Number(formData.get("sortOrder")) || 0;

  const isActive =
    formData.get("isActive") !== "off";

  const startsAtValue =
    formData.get("startsAt")?.toString() || "";

  const endsAtValue =
    formData.get("endsAt")?.toString() || "";

  await prisma.heroBanner.update({
    where: { id },

    data: {
      title,
      description,
      buttonText,
      buttonLink,

      imageDesktop:
        imageDesktopValue || existing.imageDesktop,

      imageMobile:
        imageMobileValue || existing.imageMobile,

      textPosition,
      overlay,
      height,
      duration,
      sortOrder,
      isActive,

      startsAt: startsAtValue
        ? new Date(startsAtValue)
        : null,

      endsAt: endsAtValue
        ? new Date(endsAtValue)
        : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/appearance");
}

export async function deleteHeroBanner(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id")?.toString();

  if (!id) {
    throw new Error("Hero غير موجود");
  }

  await prisma.heroBanner.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin/appearance");
}

export async function toggleHeroBanner(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id")?.toString();

  if (!id) {
    throw new Error("Hero غير موجود");
  }

  const hero = await prisma.heroBanner.findUnique({
    where: { id },
  });

  if (!hero) {
    throw new Error("Hero غير موجود");
  }

  await prisma.heroBanner.update({
    where: { id },
    data: {
      isActive: !hero.isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/appearance");
}