import { prisma } from "@/lib/prisma";
import {
  updateStoreSettings,
  updateThemeColors,
  changeAdminPassword,
} from "./actions";

async function getSettings() {
  const settings = await prisma.setting.findMany();

  return Object.fromEntries(
  settings.map((setting) => [setting.key, String(setting.value ?? "")])
);
}

export default async function SettingsPage() {
  const settings = await getSettings();

  const theme = await prisma.theme.findFirst({
    where: { isActive: true },
  });

  const config = (theme?.config as any) || {};

  const colors = config.tokens?.colors || {};
  const typography = config.tokens?.typography || {};

  return (
    <div className="space-y-8">

      {/* Store Settings */}
      <form
        action={updateStoreSettings}
        className="bg-white rounded-xl border border-border p-6 space-y-5"
      >
        <h2 className="font-heading font-semibold text-lg border-b border-border pb-3">
          إعدادات المتجر
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium mb-1">
              اسم المتجر
            </label>

            <input
              name="store_name"
              defaultValue={settings.store_name || ""}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              رقم الهاتف
            </label>

            <input
              name="phone"
              defaultValue={settings.phone || ""}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              واتساب
            </label>

            <input
              name="whatsapp"
              defaultValue={settings.whatsapp || ""}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Instagram
            </label>

            <input
              name="instagram"
              defaultValue={settings.instagram || ""}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Facebook
            </label>

            <input
              name="facebook"
              defaultValue={settings.facebook || ""}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              العنوان
            </label>

            <input
              name="address"
              defaultValue={settings.address || ""}
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
            defaultValue={settings.store_description || ""}
            rows={4}
            className="w-full border border-border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            مواعيد العمل
          </label>

          <input
            name="working_hours"
            defaultValue={settings.working_hours || ""}
            className="w-full border border-border rounded-lg px-3 py-2"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

  <div>
    <label className="block text-sm font-medium mb-1">
      العملة
    </label>

    <input
      name="currency"
      defaultValue={settings.currency || "EGP"}
      className="w-full border border-border rounded-lg px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      مصاريف الشحن
    </label>

    <input
      name="shipping_fee"
      type="number"
      defaultValue={settings.shipping_fee || ""}
      className="w-full border border-border rounded-lg px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      الشحن المجاني يبدأ من
    </label>

    <input
      name="free_shipping_threshold"
      type="number"
      defaultValue={settings.free_shipping_threshold || ""}
      className="w-full border border-border rounded-lg px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      رقم Vodafone Cash
    </label>

    <input
      name="vodafone_cash_number"
      type="tel"
      inputMode="tel"
      dir="ltr"
      placeholder="01xxxxxxxxx"
      defaultValue={settings.vodafone_cash_number || ""}
      className="w-full border border-border rounded-lg px-3 py-2"
    />

    <p className="text-xs text-gray-500 mt-1">
      الرقم الذي سيتم تحويل قيمة الطلب إليه.
    </p>
  </div>

</div>

<div className="grid md:grid-cols-2 gap-5">

  <div>
    <label className="block text-sm font-medium mb-1">
      SEO Title
    </label>

    <input
      name="seo_title"
      defaultValue={settings.seo_title || ""}
      className="w-full border border-border rounded-lg px-3 py-2"
    />
  </div>

  <div>
    <label className="block text-sm font-medium mb-1">
      SEO Description
    </label>

    <input
      name="seo_description"
      defaultValue={settings.seo_description || ""}
      className="w-full border border-border rounded-lg px-3 py-2"
    />
  </div>

</div>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90"
        >
          حفظ إعدادات المتجر
        </button>
      </form>


      {/* Theme Colors & Fonts */}
      <form
        action={updateThemeColors}
        className="bg-white rounded-xl border border-border p-6 space-y-5"
      >

        <h2 className="font-heading font-semibold text-lg border-b border-border pb-3">
          الألوان والخطوط
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

          {[
            ["primary", "اللون الأساسي"],
            ["secondary", "اللون الثانوي"],
            ["accent", "لون التمييز"],
            ["background", "الخلفية"],
            ["surface", "سطح العناصر"],
            ["text", "لون النص"],
            ["mutedText", "النص الثانوي"],
            ["border", "الحدود"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-2">
                {label}
              </label>

              <div className="flex items-center gap-2">

                <input
                  type="color"
                 name={`color_${key}`}
                  defaultValue={colors[key] || "#000000"}
                  className="w-12 h-10 rounded cursor-pointer border border-border"
                />

                <input
                  type="text"
                  defaultValue={colors[key] || ""}
                  className="flex-1 border border-border rounded-lg px-3 py-2"
                  readOnly
                />

              </div>
            </div>
          ))}

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-medium mb-1">
              الخط الأساسي
            </label>

            <input
              name="font_family"
              defaultValue={typography.fontFamily || ""}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              خط العناوين
            </label>

            <input
              name="font_heading"
              defaultValue={typography.fontFamilyHeading || ""}
              className="w-full border border-border rounded-lg px-3 py-2"
            />
          </div>

        </div>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90"
        >
          حفظ الألوان والخطوط
        </button>

      </form>


      {/* Security */}
      <form
        action={changeAdminPassword}
        className="bg-white rounded-xl border border-border p-6 space-y-5"
      >

        <h2 className="font-heading font-semibold text-lg border-b border-border pb-3">
          أمان الحساب
        </h2>

        <p className="text-sm text-gray-500">
          يمكنك تغيير كلمة مرور حساب المدير من هنا.
        </p>

        <div>
          <label className="block text-sm font-medium mb-1">
            كلمة المرور الحالية
          </label>

          <input
            name="current_password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full border border-border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            كلمة المرور الجديدة
          </label>

          <input
            name="new_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border border-border rounded-lg px-3 py-2"
          />

          <p className="text-xs text-gray-500 mt-1">
            يجب أن تكون كلمة المرور 8 أحرف على الأقل.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            تأكيد كلمة المرور الجديدة
          </label>

          <input
            name="confirm_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border border-border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90"
        >
          تغيير كلمة المرور
        </button>

      </form>

    </div>
  );
}