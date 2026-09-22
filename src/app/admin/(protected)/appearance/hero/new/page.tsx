import Link from "next/link";
import { createHeroBanner } from "../../actions";

export default function NewHeroPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/appearance"
          className="text-sm text-muted-text hover:text-primary"
        >
          ← العودة إلى المظهر والهوية
        </Link>

        <h1 className="text-2xl font-heading font-bold mt-3">
          إضافة Hero جديد
        </h1>

        <p className="text-sm text-muted-text mt-1">
          أضيفي Banner جديد للـHero Slider.
        </p>
      </div>

      <form
        action={createHeroBanner}
        encType="multipart/form-data"
        className="bg-white rounded-xl border border-border p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            عنوان الـHero
          </label>

          <input
            name="title"
            className="w-full border border-border rounded-lg px-3 py-2"
            placeholder="مثال: مجموعة الصيف الجديدة"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            الوصف
          </label>

          <textarea
            name="description"
            rows={3}
            className="w-full border border-border rounded-lg px-3 py-2"
            placeholder="اكتبي وصفًا قصيرًا للعرض أو المجموعة..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              نص الزر
            </label>

            <input
              name="buttonText"
              className="w-full border border-border rounded-lg px-3 py-2"
              placeholder="تسوقي الآن"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              رابط الزر
            </label>

            <input
              name="buttonLink"
              defaultValue="/products"
              className="w-full border border-border rounded-lg px-3 py-2"
              dir="ltr"
            />
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h2 className="font-medium mb-3">
            صور الـHero
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                صورة Desktop *
              </label>

              <input
                name="imageDesktop"
                type="file"
                accept="image/*"
                required
                className="w-full border border-border rounded-lg px-3 py-2"
              />

              <p className="text-xs text-muted-text mt-1">
                يفضل صورة عريضة مناسبة لشاشة الكمبيوتر.
              </p>
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

              <p className="text-xs text-muted-text mt-1">
                صورة مخصصة للموبايل، ويمكن تركها فارغة.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              موضع النص
            </label>

            <select
              name="textPosition"
              defaultValue="center"
              className="w-full border border-border rounded-lg px-3 py-2"
            >
              <option value="center">وسط</option>
              <option value="left">يسار</option>
              <option value="right">يمين</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              ارتفاع الـHero
            </label>

            <select
              name="height"
              defaultValue="large"
              className="w-full border border-border rounded-lg px-3 py-2"
            >
              <option value="small">صغير</option>
              <option value="medium">متوسط</option>
              <option value="large">كبير</option>
              <option value="full">ملء الشاشة</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              مدة السلايد (بالثواني)
            </label>

            <input
              name="duration"
              type="number"
              min="2"
              max="60"
              defaultValue="5"
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              الترتيب
            </label>

            <input
              name="sortOrder"
              type="number"
              min="0"
              defaultValue="0"
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2 pt-7">
            <input
              type="checkbox"
              name="overlay"
              id="overlay"
              defaultChecked
              className="rounded"
            />

            <label htmlFor="overlay" className="text-sm">
              Overlay داكن
            </label>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h2 className="font-medium mb-3">
            فترة الظهور
          </h2>

          <p className="text-xs text-muted-text mb-4">
            اتركي التاريخين فارغين ليظل الـHero ظاهرًا بدون فترة محددة.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                يبدأ من
              </label>

              <input
                name="startsAt"
                type="datetime-local"
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
                className="w-full border border-border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-5">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            defaultChecked
            className="rounded"
          />

          <label htmlFor="isActive" className="text-sm">
            تفعيل الـHero فورًا
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium"
          >
            حفظ وإضافة الـHero
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