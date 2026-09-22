import Link from "next/link";

export function Footer({
  storeName,
  description,
  phone,
  whatsapp,
  instagram,
  facebook,
  address,
  workingHours,
}: {
  storeName: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  address?: string;
  workingHours?: string;
}) {
  return (
    <footer
      className="mt-auto relative overflow-hidden"
      style={{
        background: "#171516",
        color: "#F3E8DD",
      }}
      dir="rtl"
    >
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #B88A78, #D8A58F, #B88A78, transparent)",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "#D8A58F" }}
      />

      <div className="container relative py-14 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

          <div className="space-y-5">
            <div>
              <div
                className="mb-3 text-xs tracking-[0.35em] uppercase"
                style={{ color: "#B88A78" }}
              >
                Elsharawy
              </div>

              <h3
                className="font-heading text-2xl sm:text-3xl font-semibold"
                style={{ color: "#F3E8DD" }}
              >
                {storeName}
              </h3>
            </div>

            {description && (
              <p
                className="max-w-sm text-sm leading-8"
                style={{ color: "rgba(243,232,221,0.68)" }}
              >
                {description}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <span
                className="h-px w-16"
                style={{ background: "#B88A78" }}
              />

              <span
                className="text-xs tracking-[0.25em]"
                style={{ color: "#B88A78" }}
              >
                LUXURY · ELEGANCE
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <h4
              className="text-sm font-semibold tracking-wide"
              style={{ color: "#F3E8DD" }}
            >
              روابط سريعة
            </h4>

            <div className="flex flex-col gap-3 text-sm">
              <Link
                href="/"
                className="group flex items-center gap-2"
                style={{ color: "rgba(243,232,221,0.68)" }}
              >
                <span
                  className="h-px w-0 transition-all duration-300 group-hover:w-5"
                  style={{ background: "#B88A78" }}
                />

                <span className="transition-colors group-hover:text-[#D8A58F]">
                  الرئيسية
                </span>
              </Link>

              <Link
                href="/products"
                className="group flex items-center gap-2"
                style={{ color: "rgba(243,232,221,0.68)" }}
              >
                <span
                  className="h-px w-0 transition-all duration-300 group-hover:w-5"
                  style={{ background: "#B88A78" }}
                />

                <span className="transition-colors group-hover:text-[#D8A58F]">
                  المنتجات
                </span>
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <h4
              className="text-sm font-semibold tracking-wide"
              style={{ color: "#F3E8DD" }}
            >
              تواصلي معنا
            </h4>

            <div className="flex flex-col gap-4 text-sm">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  dir="ltr"
                  className="w-fit transition-colors hover:text-[#D8A58F]"
                  style={{ color: "rgba(243,232,221,0.68)" }}
                >
                  {phone}
                </a>
              )}

              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit transition-colors hover:text-[#D8A58F]"
                  style={{ color: "rgba(243,232,221,0.68)" }}
                >
                  واتساب
                </a>
              )}

              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit transition-colors hover:text-[#D8A58F]"
                  style={{ color: "rgba(243,232,221,0.68)" }}
                >
                  إنستجرام
                </a>
              )}

              {facebook && (
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit transition-colors hover:text-[#D8A58F]"
                  style={{ color: "rgba(243,232,221,0.68)" }}
                >
                  فيسبوك
                </a>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <h4
              className="text-sm font-semibold tracking-wide"
              style={{ color: "#F3E8DD" }}
            >
              معلومات
            </h4>

            <div
              className="flex flex-col gap-4 text-sm leading-7"
              style={{ color: "rgba(243,232,221,0.68)" }}
            >
              {address && <p>{address}</p>}

              {workingHours && <p>{workingHours}</p>}
            </div>
          </div>

        </div>
      </div>

      <div
        className="border-t"
        style={{ borderColor: "rgba(184,138,120,0.18)" }}
      >
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-center sm:flex-row">
          <p
            className="text-xs"
            style={{ color: "rgba(243,232,221,0.45)" }}
          >
            © {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.
          </p>

          <div
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ color: "rgba(184,138,120,0.65)" }}
          >
            Elsharawy · Since Quality
          </div>
        </div>
      </div>
    </footer>
  );
}