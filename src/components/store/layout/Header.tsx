"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartBadge } from "./CartBadge";

type NavCategory = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
};

type NavBrand = {
  id: string;
  name: string;
  slug: string;
};

export function Header({
  storeName,
  logoUrl,
  logoDesktopHeight = 70,
  logoMobileHeight = 44,
  categories = [],
  brands = [],
}: {
  storeName: string;
  logoUrl?: string | null;
  logoDesktopHeight?: number;
  logoMobileHeight?: number;
  categories?: NavCategory[];
  brands?: NavBrand[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
      setMobileOpen(false);
      setQ("");
    }
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  // Use the uploaded local logo unless an admin logo URL is provided.
  const finalLogoUrl = logoUrl || "/images/logo.jpeg";

  return (
    <header
      className="relative z-50 bg-[#F8F5F0] text-[#252223] border-b border-[#B88A78]/20"
      style={{ minHeight: "var(--header-height)" }}
    >
      {/* Main Header */}
      <div className="container relative h-[72px] md:h-[92px] flex items-center justify-between">
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[12px] lg:text-[13px] tracking-[0.04em]">
          <Link
            href="/"
            className="text-[#403B3C] hover:text-[#A87562] transition-colors"
          >
            الرئيسية
          </Link>

          <Link
            href="/products"
            className="text-[#403B3C] hover:text-[#A87562] transition-colors"
          >
            المنتجات
          </Link>

          {categories.length > 0 && (
            <div className="relative group">
              <button
                type="button"
                className="text-[#403B3C] hover:text-[#A87562] transition-colors"
              >
                التصنيفات
              </button>

              <div className="absolute top-full right-0 mt-5 w-56 bg-[#FBF8F4] border border-[#B88A78]/20 shadow-[0_18px_50px_rgba(38,27,25,0.12)] opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 py-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="block px-5 py-3 text-sm text-[#403B3C] hover:bg-[#F1E8E1] hover:text-[#9D6A57] transition-colors"
                  >
                    {category.nameAr || category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {brands.length > 0 && (
            <div className="relative group">
              <button
                type="button"
                className="text-[#403B3C] hover:text-[#A87562] transition-colors"
              >
                البراندات
              </button>

              <div className="absolute top-full right-0 mt-5 w-56 bg-[#FBF8F4] border border-[#B88A78]/20 shadow-[0_18px_50px_rgba(38,27,25,0.12)] opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 py-2">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brand/${brand.slug}`}
                    className="block px-5 py-3 text-sm text-[#403B3C] hover:bg-[#F1E8E1] hover:text-[#9D6A57] transition-colors"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Center Logo */}
        <Link
          href="/"
          aria-label={storeName}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
        >
          <div
            className="relative flex items-center justify-center"
            style={{
              width: "auto",
              height: `${logoDesktopHeight}px`,
            }}
          >
            {/* Desktop Logo */}
            <img
              src={finalLogoUrl}
              alt={storeName}
              className="hidden md:block w-auto max-w-[220px] h-[70px] object-contain"
            />

            {/* Mobile Logo */}
            <img
              src={finalLogoUrl}
              alt={storeName}
              className="md:hidden w-auto max-w-[145px] h-[44px] object-contain"
            />
          </div>
        </Link>

        {/* Actions */}
        <div className="mr-auto flex items-center gap-0.5 md:gap-2">
          
          {/* Search */}
          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            className="w-10 h-10 flex items-center justify-center text-[#403B3C] hover:text-[#A87562] transition-colors"
            aria-label="بحث"
          >
            <SearchIcon />
          </button>

          {/* Cart */}
          <div className="w-10 h-10 flex items-center justify-center text-[#403B3C] hover:text-[#A87562] transition-colors">
            <CartBadge />
          </div>

          {/* Mobile Menu */}
          <button
            type="button"
            className="md:hidden w-10 h-10 flex items-center justify-center text-[#403B3C] hover:text-[#A87562] transition-colors"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Elegant Divider */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[72%] h-px bg-gradient-to-r from-transparent via-[#B88A78]/45 to-transparent" />

      {/* Search Panel */}
      {searchOpen && (
        <div className="border-t border-[#B88A78]/15 bg-[#FBF8F4]">
          <form
            onSubmit={handleSearch}
            className="container py-4 md:py-5 flex gap-2"
          >
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحثي عن منتج أو براند أو SKU..."
              className="flex-1 bg-white border border-[#C9B8AE] text-[#252223] placeholder:text-[#8D8582] px-4 py-3.5 text-sm rounded-none focus:outline-none focus:border-[#A87562]"
              autoFocus
            />

            <button
              type="submit"
              className="bg-[#252223] hover:bg-[#A87562] text-white px-6 py-3.5 text-sm transition-colors"
            >
              بحث
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#B88A78]/15 bg-[#FBF8F4]">
          <nav className="container py-3 flex flex-col">
            <Link
              href="/"
              onClick={closeMobile}
              className="py-4 border-b border-[#D8CDC6] text-[#302B2C] text-sm"
            >
              الرئيسية
            </Link>

            <Link
              href="/products"
              onClick={closeMobile}
              className="py-4 border-b border-[#D8CDC6] text-[#302B2C] text-sm"
            >
              كل المنتجات
            </Link>

            {categories.length > 0 && (
              <>
                <p className="pt-5 pb-2 text-[11px] tracking-[0.15em] text-[#A87562]">
                  التصنيفات
                </p>

                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={closeMobile}
                    className="py-3 border-b border-[#E5DDD8] text-[#595153] text-sm"
                  >
                    {category.nameAr || category.name}
                  </Link>
                ))}
              </>
            )}

            {brands.length > 0 && (
              <>
                <p className="pt-6 pb-2 text-[11px] tracking-[0.15em] text-[#A87562]">
                  البراندات
                </p>

                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brand/${brand.slug}`}
                    onClick={closeMobile}
                    className="py-3 border-b border-[#E5DDD8] text-[#595153] text-sm"
                  >
                    {brand.name}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="21"
      height="21"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16M4 12h16M4 17h16"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="21"
      height="21"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6l12 12M18 6 6 18Z"
      />
    </svg>
  );
}