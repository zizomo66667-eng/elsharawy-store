import { ThemeStyle } from "./ThemeStyle";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { getCachedStoreConfig, getActiveCategories, getActiveBrands } from "@/lib/store/settings";

export async function StoreShell({ children }: { children: React.ReactNode }) {
  const [{ settings, theme }, categories, brands] = await Promise.all([
    getCachedStoreConfig(),
    getActiveCategories(),
    getActiveBrands(),
  ]);

  const storeName = String(settings.store_name || "الشعراوي");
  const logoUrl = settings.logo_desktop ? String(settings.logo_desktop) : null;
const logoDesktopHeight = Number(settings.logo_desktop_height || 80);
const logoMobileHeight = Number(settings.logo_mobile_height || 60);
  return (
    <>
      <ThemeStyle theme={theme} />
      <div className="min-h-screen flex flex-col bg-background text-text">
        <Header
  storeName={storeName}
  logoUrl={logoUrl}
  logoDesktopHeight={logoDesktopHeight}
  logoMobileHeight={logoMobileHeight}
  categories={categories}
  brands={brands}
/>
        <main className="flex-1">{children}</main>
        <Footer
          storeName={storeName}
          description={settings.store_description ? String(settings.store_description) : undefined}
          phone={settings.phone ? String(settings.phone) : undefined}
          whatsapp={settings.whatsapp ? String(settings.whatsapp) : undefined}
          instagram={settings.instagram ? String(settings.instagram) : undefined}
          facebook={settings.facebook ? String(settings.facebook) : undefined}
          address={settings.address ? String(settings.address) : undefined}
          workingHours={settings.working_hours ? String(settings.working_hours) : undefined}
        />
      </div>
    </>
  );
}
