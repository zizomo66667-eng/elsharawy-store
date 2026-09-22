import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings, getActiveTheme } from "@/lib/store/settings";
import {
  updateBrandIdentity,
  updateThemeAppearance,
  resetThemeToDefault,
  toggleHeroBanner,
  deleteHeroBanner,
} from "./actions";
import { defaultTheme } from "@/types/theme";

export default async function AppearancePage() {
  const [settings, theme, heroBanners] = await Promise.all([
    getSettings(),
    getActiveTheme(),
    prisma.heroBanner.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    }),
  ]);

  const config = theme?.config || defaultTheme;
  const colors = config.tokens?.colors || defaultTheme.tokens.colors;
  const typography =
    config.tokens?.typography || defaultTheme.tokens.typography;
  const borders = config.tokens?.borders || defaultTheme.tokens.borders;
  const buttons = config.tokens?.buttons || defaultTheme.tokens.buttons;

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-heading font-bold">
            المظهر والهوية
          </h1>

          <p className="text-muted-text text-sm mt-1">
            غيّري شكل المتجر بالكامل — التغييرات تظهر فوراً على الواجهة بعد الحفظ
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-surface"
          >
            معاينة المتجر ↗
          </Link>

          <form action={resetThemeToDefault}>
            <button
              type="submit"
              className="px-4 py-2 border border-border rounded-lg text-sm text-error hover:bg-red-50"
            >
              إعادة تعيين الثيم
            </button>
          </form>
        </div>
      </div>

      {/* Preview strip */}
      <div className="bg-white rounded-xl border border-border p-4">
        <p className="text-xs text-muted-text mb-3">
          معاينة الألوان الحالية
        </p>

        <div className="flex flex-wrap gap-2">
          {Object.entries(colors).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: String(val) }}
              />

              <span className="text-muted-text">{key}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <span
            className="px-4 py-2 text-sm font-medium rounded"
            style={{
              backgroundColor: colors.primary,
              color: "#fff",
              borderRadius: buttons.borderRadius,
            }}
          >
            زر تجريبي
          </span>

          <span
            className="px-4 py-2 text-sm border rounded"
            style={{
              borderColor: colors.border,
              color: colors.text,
              borderRadius: borders.radiusMd,
              fontFamily: typography.fontFamily,
            }}
          >
            نص تجريبي
          </span>
        </div>
      </div>

      {/* 1. Brand Identity */}
      <form
        action={updateBrandIdentity}
        encType="multipart/form-data"
        className="bg-white rounded-xl border border-border p-6 space-y-4"
      >
        <h2 className="font-heading font-semibold text-lg border-b border-border pb-3">
          1. هوية المتجر
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              اسم المتجر
            </label>

            <input
              name="store_name"
              defaultValue={String(settings.store_name || "")}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              SEO Title
            </label>

            <input
              name="seo_title"
              defaultValue={String(settings.seo_title || "")}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            وصف المتجر
          </label>

          <textarea
            name="store_description"
            rows={2}
            defaultValue={String(settings.store_description || "")}
            className="w-full border border-border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            SEO Description
          </label>

          <textarea
            name="seo_description"
            rows={2}
            defaultValue={String(settings.seo_description || "")}
            className="w-full border border-border rounded-lg px-3 py-2"
          />
        </div>

        {/* Logos */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Logo (Desktop)
            </label>

            <input
              name="logo_desktop"
              type="file"
              accept="image/*"
              className="w-full border border-border rounded-lg px-3 py-2"
            />

            {settings.logo_desktop && (
              <div className="mt-2">
                <p className="text-xs text-muted-text mb-1">
                  اللوجو الحالي:
                </p>

                <img
                  src={String(settings.logo_desktop)}
                  alt="Current logo"
                  className="h-12 w-auto object-contain border border-border rounded p-1"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Logo (Mobile)
            </label>

            <input
              name="logo_mobile"
              type="file"
              accept="image/*"
              className="w-full border border-border rounded-lg px-3 py-2"
            />

            {settings.logo_mobile && (
              <div className="mt-2">
                <p className="text-xs text-muted-text mb-1">
                  اللوجو الحالي:
                </p>

                <img
                  src={String(settings.logo_mobile)}
                  alt="Current mobile logo"
                  className="h-12 w-auto object-contain border border-border rounded p-1"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Desktop Logo Height (px)
            </label>

            <input
              name="logo_desktop_height"
              type="number"
              min="20"
              max="200"
              defaultValue={String(
                settings.logo_desktop_height || "80"
              )}
              className="w-full border border-border rounded-lg px-3 py-2"
            />

            <p className="text-xs text-muted-text mt-1">
              حجم اللوجو على الكمبيوتر — من 20 إلى 200 بكسل
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Logo Height (px)
            </label>

            <input
              name="logo_mobile_height"
              type="number"
              min="20"
              max="150"
              defaultValue={String(
                settings.logo_mobile_height || "60"
              )}
              className="w-full border border-border rounded-lg px-3 py-2"
            />

            <p className="text-xs text-muted-text mt-1">
              حجم اللوجو على الموبايل — من 20 إلى 150 بكسل
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Favicon URL
          </label>

          <input
            name="favicon"
            defaultValue={String(settings.favicon || "")}
            className="w-full border border-border rounded-lg px-3 py-2"
            dir="ltr"
            placeholder="https://..."
          />
        </div>

        <p className="text-xs text-muted-text">
          اختار صورة اللوجو من جهازك وسيتم رفعها تلقائيًا إلى Cloudinary.
        </p>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium"
        >
          حفظ الهوية
        </button>
      </form>

      {/* 2. Colors & Typography */}
      <form
        action={updateThemeAppearance}
        className="bg-white rounded-xl border border-border p-6 space-y-5"
      >
        <h2 className="font-heading font-semibold text-lg border-b border-border pb-3">
          2. الألوان والخطوط
        </h2>

        <div>
          <label className="block text-sm font-medium mb-1">
            اسم الثيم
          </label>

          <input
            name="theme_name"
            defaultValue={theme?.name || "Custom"}
            className="w-full border border-border rounded-lg px-3 py-2 max-w-xs"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            [
              ["primary", "Primary"],
              ["secondary", "Secondary"],
              ["accent", "Accent"],
              ["background", "Background"],
              ["surface", "Surface"],
              ["text", "Text"],
              ["mutedText", "Muted Text"],
              ["border", "Border"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">
                {label}
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name={`color_${key}`}
                  defaultValue={String(
                    (colors as any)[key] || "#000000"
                  )}
                  className="w-10 h-10 rounded cursor-pointer border border-border"
                />

                <input
                  type="text"
                  name={`color_${key}`}
                  defaultValue={String(
                    (colors as any)[key] || ""
                  )}
                  className="flex-1 border border-border rounded-lg px-2 py-1.5 text-sm"
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              خط النصوص
            </label>

            <input
              name="font_family"
              defaultValue={typography.fontFamily}
              className="w-full border border-border rounded-lg px-3 py-2"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              خط العناوين
            </label>

            <input
              name="font_heading"
              defaultValue={typography.fontFamilyHeading}
              className="w-full border border-border rounded-lg px-3 py-2"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Border Radius
            </label>

            <input
              name="radius_md"
              defaultValue={borders.radiusMd}
              className="w-full border border-border rounded-lg px-3 py-2"
              dir="ltr"
              placeholder="8px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Button Radius
            </label>

            <input
              name="btn_radius"
              defaultValue={buttons.borderRadius}
              className="w-full border border-border rounded-lg px-3 py-2"
              dir="ltr"
              placeholder="8px"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium"
        >
          حفظ الألوان والخطوط
        </button>
      </form>

      {/* 3. Hero Banners */}
      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-border pb-3">
          <div>
            <h2 className="font-heading font-semibold text-lg">
              3. Hero Banners
            </h2>

            <p className="text-xs text-muted-text mt-1">
              أضيفي أكثر من Hero وتحكمي في الترتيب والظهور ومدة العرض.
            </p>
          </div>

          <Link
            href="/admin/appearance/hero/new"
            className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium"
          >
            + إضافة Hero
          </Link>
        </div>

        {heroBanners.length === 0 ? (
          <div className="border border-dashed border-border rounded-lg p-8 text-center">
            <p className="text-muted-text text-sm">
              لا توجد Hero Banners حاليًا.
            </p>

            <p className="text-muted-text text-xs mt-1">
              اضغطي على "إضافة Hero" لإنشاء أول Banner.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {heroBanners.map((banner) => (
              <div
                key={banner.id}
                className="border border-border rounded-xl p-4 flex items-center gap-4 flex-wrap"
              >
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-surface shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={banner.imageDesktop}
                    alt={banner.title || "Hero Banner"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">
                      {banner.title || "بدون عنوان"}
                    </h3>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        banner.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {banner.isActive ? "نشط" : "متوقف"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-text mt-1">
                    الترتيب: {banner.sortOrder} — المدة:{" "}
                    {banner.duration / 1000} ثواني
                  </p>

                  {banner.description && (
                    <p className="text-xs text-muted-text mt-1 line-clamp-1">
                      {banner.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/appearance/hero/${banner.id}/edit`}
                    className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-surface"
                  >
                    تعديل
                  </Link>

                  <form action={toggleHeroBanner}>
                    <input
                      type="hidden"
                      name="id"
                      value={banner.id}
                    />

                    <button
                      type="submit"
                      className="px-3 py-2 border border-border rounded-lg text-sm hover:bg-surface"
                    >
                      {banner.isActive ? "إيقاف" : "تفعيل"}
                    </button>
                  </form>

                  <form action={deleteHeroBanner}>
                    <input
                      type="hidden"
                      name="id"
                      value={banner.id}
                    />

                    <button
                      type="submit"
                      className="px-3 py-2 border border-border rounded-lg text-sm text-error hover:bg-red-50"
                    >
                      حذف
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}