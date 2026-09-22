import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateHeroBanner } from "../../../actions";

export default async function EditHeroPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const banner = await prisma.heroBanner.findUnique({
    where: { id },
  });

  if (!banner) {
    notFound();
  }

  const dateValue = (date: Date | null) =>
    date ? new Date(date).toISOString().slice(0, 16) : "";

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">
            تعديل Hero
          </h1>
          <p className="text-sm text-muted-text mt-1">
            عدّل بيانات وصورة الـ Hero ثم اضغط حفظ.
          </p>
        </div>

        <Link
          href="/admin/appearance"
          className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-surface"
        >
          ← العودة للمظهر
        </Link>
      </div>

      <form
        action={updateHeroBanner}
        encType="multipart/form-data"
        className="bg-white rounded-xl border border-border p-6 space-y-6"
      >
        <input type="hidden" name="id" value={banner.id} />

        {/* Basic info */}
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg border-b border-border pb-3">
            بيانات Hero
          </h2>

          <div>
            <label className="block text-sm font-medium mb-1">
              العنوان
            </label>
            <input
              name="title"
              defaultValue={banner.title || ""}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              الوصف
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={banner.description || ""}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                نص الزر
              </label>
              <input
                name="buttonText"
                defaultValue={banner.buttonText || ""}
                className="w-full border border-border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                رابط الزر
              </label>
              <input
                name="buttonLink"
                defaultValue={banner.buttonLink || "/products"}
                className="w-full border border-border rounded-lg px-3 py-2"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg border-b border-border pb-3">
            صور Hero
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                صورة Desktop
              </label>

              <input
                name="imageDesktop"
                type="file"
                accept="image/*"
                className="w-full border border-border rounded-lg px-3 py-2"
              />

              <div className="mt-2 rounded-lg bg-surface p-3">
                <p className="text-xs font-medium">
                  المقاس المثالي:
                </p>
                <p className="text-xs text-muted-text">
                  1920 × 1080 px — نسبة 16:9
                </p>
              </div>

              <img
                src={banner.imageDesktop}
                alt="Current Desktop Hero"
                className="mt-3 w-full h-40 object-cover rounded-lg border border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                صورة Mobile
              </label>

              <input
                name="imageMobile"
                type="file"
                accept="image/*"
                className="w-full border border-border rounded-lg px-3 py-2"
              />

              <div className="mt-2 rounded-lg bg-surface p-3">
                <p className="text-xs font-medium">
                  المقاس المثالي:
                </p>
                <p className="text-xs text-muted-text">
                  1080 × 1350 px — نسبة 4:5
                </p>
              </div>

              {banner.imageMobile ? (
                <img
                  src={banner.imageMobile}
                  alt="Current Mobile Hero"
                  className="mt-3 w-full h-40 object-cover rounded-lg border border-border"
                />
              ) : (
                <div className="mt-3 h-40 rounded-lg border border-dashed border-border flex items-center justify-center text-xs text-muted-text">
                  لا توجد صورة Mobile
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Display settings */}
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg border-b border-border pb-3">
            إعدادات العرض
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                مكان النص
              </label>

              <select
                name="textPosition"
                defaultValue={banner.textPosition}
                className="w-full border border-border rounded-lg px-3 py-2"
              >
                <option value="left">يسار</option>
                <option value="center">منتصف</option>
                <option value="right">يمين</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                ارتفاع Hero
              </label>

              <select
                name="height"
                defaultValue={banner.height}
                className="w-full border border-border rounded-lg px-3 py-2"
              >
                <option value="small">صغير</option>
                <option value="large">كبير</option>
                <option value="full">ملء الشاشة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                مدة العرض
              </label>

              <select
                name="duration"
                defaultValue={String(banner.duration)}
                className="w-full border border-border rounded-lg px-3 py-2"
              >
                <option value="3000">3 ثواني</option>
                <option value="4000">4 ثواني</option>
                <option value="5000">5 ثواني</option>
                <option value="6000">6 ثواني</option>
                <option value="8000">8 ثواني</option>
                <option value="10000">10 ثواني</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                ترتيب Hero
              </label>

              <input
                name="sortOrder"
                type="number"
                defaultValue={banner.sortOrder}
                className="w-full border border-border rounded-lg px-3 py-2"
              />

              <p className="text-xs text-muted-text mt-1">
                الرقم الأصغر يظهر أولًا.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-7">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                defaultChecked={banner.isActive}
                className="w-4 h-4"
              />

              <label htmlFor="isActive" className="text-sm font-medium">
                Hero نشط ويظهر في الموقع
              </label>
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              name="overlay"
              type="checkbox"
              defaultChecked={banner.overlay}
              className="w-4 h-4"
            />

            <span className="text-sm font-medium">
              تفعيل طبقة التعتيم فوق الصورة
            </span>
          </label>
        </div>

        {/* Scheduling */}
        <div className="space-y-4">
          <h2 className="font-heading font-semibold text-lg border-b border-border pb-3">
            جدولة الظهور
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                يبدأ من
              </label>

              <input
                name="startsAt"
                type="datetime-local"
                defaultValue={dateValue(banner.startsAt)}
                className="w-full border border-border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                ينتهي في
              </label>

              <input
                name="endsAt"
                type="datetime-local"
                defaultValue={dateValue(banner.endsAt)}
                className="w-full border border-border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <p className="text-xs text-muted-text">
            اترك التاريخين فارغين ليظهر الـ Hero بدون جدولة.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <button
            type="submit"
            className="bg-primary text-white px-7 py-2.5 rounded-lg text-sm font-medium"
          >
            حفظ التعديلات
          </button>

          <Link
            href="/admin/appearance"
            className="px-6 py-2.5 border border-border rounded-lg text-sm"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}