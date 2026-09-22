"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";

const SECTION_TYPES = [
  "HERO",
  "CATEGORY_GRID",
  "PRODUCT_SLIDER",
  "PRODUCT_GRID",
  "FEATURED_PRODUCTS",
  "NEW_ARRIVALS",
  "BEST_SELLERS",
  "OFFERS",
  "BRANDS",
  "TESTIMONIALS",
  "INSTAGRAM",
  "NEWSLETTER",
  "FEATURES",
  "CUSTOM_HTML",
  "BANNER",
] as const;

function getString(
  formData: FormData,
  key: string,
  fallback = ""
) {
  return formData.get(key)?.toString().trim() || fallback;
}

function getNumber(
  formData: FormData,
  key: string,
  fallback = 0
) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getConfig(formData: FormData) {
  const type = getString(formData, "type");

  const config: any = {};

  if (
    type === "PRODUCT_GRID" ||
    type === "PRODUCT_SLIDER" ||
    type === "OFFERS"
  ) {
    config.source = getString(
      formData,
      "source",
      "featured"
    );

    config.categoryId =
      getString(formData, "categoryId") || null;

    config.limit = Math.max(
      1,
      Math.min(
        24,
        getNumber(formData, "limit", 8)
      )
    );

    config.sort = getString(
      formData,
      "sort",
      "newest"
    );
  }

  if (type === "CATEGORY_GRID") {
    config.limit = Math.max(
      1,
      Math.min(
        24,
        getNumber(formData, "limit", 8)
      )
    );
  }

  if (type === "FEATURED_PRODUCTS") {
    config.limit = Math.max(
      1,
      Math.min(
        24,
        getNumber(formData, "limit", 8)
      )
    );
  }

  if (type === "NEW_ARRIVALS") {
    config.limit = Math.max(
      1,
      Math.min(
        24,
        getNumber(formData, "limit", 8)
      )
    );
  }

  if (type === "BEST_SELLERS") {
    config.limit = Math.max(
      1,
      Math.min(
        24,
        getNumber(formData, "limit", 8)
      )
    );
  }

  if (type === "BRANDS") {
    config.limit = Math.max(
      1,
      Math.min(
        24,
        getNumber(formData, "limit", 8)
      )
    );
  }

  if (type === "FEATURES") {
    config.items = getString(
      formData,
      "items"
    );
  }

  if (type === "BANNER") {
    config.image = getString(
      formData,
      "image"
    );

    config.mobileImage = getString(
      formData,
      "mobileImage"
    );

    config.link = getString(
      formData,
      "link"
    );
  }

  if (type === "CUSTOM_HTML") {
    config.html = getString(
      formData,
      "html"
    );
  }

  return config;
}

export async function createHomepageSection(
  formData: FormData
) {
  await requireAdmin();

  const type = getString(
    formData,
    "type"
  );

  if (
    !SECTION_TYPES.includes(
      type as (typeof SECTION_TYPES)[number]
    )
  ) {
    throw new Error(
      "Invalid section type"
    );
  }

  const title = getString(
    formData,
    "title"
  );

  const titleAr = getString(
    formData,
    "titleAr"
  );

  const subtitle = getString(
    formData,
    "subtitle"
  );

  const isVisible = getBoolean(
    formData,
    "isVisible"
  );

  const sortOrder = getNumber(
    formData,
    "sortOrder",
    0
  );

  const config = getConfig(
    formData
  );

  await prisma.homepageSection.create({
    data: {
      type: type as any,
      title: title || null,
      titleAr: titleAr || null,
      subtitle: subtitle || null,
      config,
      isVisible,
      sortOrder,
    },
  });

  revalidatePath(
    "/admin/homepage"
  );

  revalidatePath("/");

  redirect(
    "/admin/homepage"
  );
}

export async function updateHomepageSection(
  id: string,
  formData: FormData
) {
  await requireAdmin();

  const type = getString(
    formData,
    "type"
  );

  if (
    !SECTION_TYPES.includes(
      type as (typeof SECTION_TYPES)[number]
    )
  ) {
    throw new Error(
      "Invalid section type"
    );
  }

  const title =
    getString(
      formData,
      "title"
    ) || null;

  const titleAr =
    getString(
      formData,
      "titleAr"
    ) || null;

  const subtitle =
    getString(
      formData,
      "subtitle"
    ) || null;

  const isVisible = getBoolean(
    formData,
    "isVisible"
  );

  const sortOrder = getNumber(
    formData,
    "sortOrder",
    0
  );

  const config = getConfig(
    formData
  );

  await prisma.homepageSection.update({
    where: { id },
    data: {
      type: type as any,
      title,
      titleAr,
      subtitle,
      config,
      isVisible,
      sortOrder,
    },
  });

  revalidatePath(
    "/admin/homepage"
  );

  revalidatePath("/");

  redirect(
    "/admin/homepage"
  );
}

export async function deleteHomepageSection(
  id: string
) {
  await requireAdmin();

  await prisma.homepageSection.delete({
    where: { id },
  });

  revalidatePath(
    "/admin/homepage"
  );

  revalidatePath("/");

  return {
    success: true,
  };
}

export async function toggleHomepageSection(
  id: string
) {
  await requireAdmin();

  const section =
    await prisma.homepageSection.findUnique({
      where: { id },
    });

  if (!section) {
    return {
      error: "Section not found",
    };
  }

  await prisma.homepageSection.update({
    where: { id },
    data: {
      isVisible: !section.isVisible,
    },
  });

  revalidatePath(
    "/admin/homepage"
  );

  revalidatePath("/");

  return {
    success: true,
  };
}

export async function moveHomepageSection(
  id: string,
  direction: "up" | "down"
) {
  await requireAdmin();

  const current =
    await prisma.homepageSection.findUnique({
      where: { id },
    });

  if (!current) {
    return {
      error: "Section not found",
    };
  }

  const sections =
    await prisma.homepageSection.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });

  const currentIndex =
    sections.findIndex(
      (section) =>
        section.id === id
    );

  if (currentIndex === -1) {
    return {
      error: "Section not found",
    };
  }

  const targetIndex =
    direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >= sections.length
  ) {
    return {
      success: true,
    };
  }

  const target =
    sections[targetIndex];

  await prisma.$transaction([
    prisma.homepageSection.update({
      where: {
        id: current.id,
      },
      data: {
        sortOrder:
          target.sortOrder,
      },
    }),

    prisma.homepageSection.update({
      where: {
        id: target.id,
      },
      data: {
        sortOrder:
          current.sortOrder,
      },
    }),
  ]);

  revalidatePath(
    "/admin/homepage"
  );

  revalidatePath("/");

  return {
    success: true,
  };
}