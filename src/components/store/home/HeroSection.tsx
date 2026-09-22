"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HeroBanner = {
  id: string;
  title?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  imageDesktop: string;
  imageMobile?: string | null;
  textPosition?: string | null;
  overlay?: boolean;
  height?: string | null;
  duration?: number | null;
};

type HeroConfig = {
  buttonText?: string;
  buttonLink?: string;
  imageDesktop?: string;
  imageMobile?: string;
  textPosition?: string;
  overlay?: boolean;
  height?: string;
  heading?: string;
  description?: string;
};

export function HeroSection({
  title,
  subtitle,
  config = {},
  banners = [],
}: {
  title?: string | null;
  subtitle?: string | null;
  config?: HeroConfig;
  banners?: HeroBanner[];
}) {
  const slides = banners.length
    ? banners
    : [
        {
          id: "fallback",
          title: config.heading || title || "مجموعة جديدة",
          description:
            config.description ||
            subtitle ||
            "اكتشفي أناقتك مع الشعراوي",
          buttonText: config.buttonText || "تسوقي الآن",
          buttonLink: config.buttonLink || "/products",
          imageDesktop:
            config.imageDesktop || "/banners/hero-desktop.jpg",
          imageMobile:
            config.imageMobile ||
            config.imageDesktop ||
            "/banners/hero-desktop.jpg",
          textPosition: config.textPosition || "center",
          overlay: config.overlay !== false,
          height: config.height || "large",
          duration: 5000,
        },
      ];

  const [current, setCurrent] = useState(0);

  const slide = slides[current] || slides[0];

  useEffect(() => {
    if (slides.length <= 1) return;

    const duration = Math.max(1000, slide.duration || 5000);

    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [current, slides]);

  const alignClass =
    slide.textPosition === "left"
      ? "items-start text-right"
      : slide.textPosition === "right"
      ? "items-end text-left"
      : "items-center text-center";

  return (
    <section className="relative w-full overflow-hidden bg-[#171516]">
      {/* HERO */}
      <div
        className={`
          relative w-full
          min-h-[72vh]
          sm:min-h-[76vh]
          md:min-h-[82vh]
          lg:min-h-[88vh]
          flex ${alignClass} justify-center
        `}
      >
        <picture className="absolute inset-0 block">
          {slide.imageMobile && (
            <source
              media="(max-width: 639px)"
              srcSet={slide.imageMobile}
            />
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.imageDesktop}
            alt={slide.title || ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>

        {slide.overlay !== false && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/15" />
        )}

        {/* Content */}
        <div className="relative z-10 container px-5 sm:px-8 py-24 max-w-3xl">
          {slide.title && (
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] drop-shadow-xl">
              {slide.title}
            </h1>
          )}

          {slide.description && (
            <p className="mt-5 max-w-xl mx-auto text-white/90 text-base sm:text-lg md:text-xl leading-relaxed">
              {slide.description}
            </p>
          )}

          {slide.buttonText && (
            <Link
              href={slide.buttonLink || "/products"}
              className="
                inline-flex items-center justify-center
                mt-8 px-8 py-3.5
                rounded-full
                bg-[#B88A78]
                hover:bg-[#D8A58F]
                text-white
                text-sm font-medium
                shadow-xl
                transition-all duration-300
                hover:-translate-y-0.5
              "
            >
              {slide.buttonText}
            </Link>
          )}
        </div>

        {/* Navigation */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setCurrent(
                  (current - 1 + slides.length) % slides.length
                )
              }
              className="
                absolute left-4 sm:left-7 top-1/2
                -translate-y-1/2 z-20
                w-11 h-11
                rounded-full
                border border-white/30
                bg-black/20
                backdrop-blur-md
                text-white
                hover:bg-[#B88A78]/70
                transition-all
              "
              aria-label="Previous slide"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrent((current + 1) % slides.length)
              }
              className="
                absolute right-4 sm:right-7 top-1/2
                -translate-y-1/2 z-20
                w-11 h-11
                rounded-full
                border border-white/30
                bg-black/20
                backdrop-blur-md
                text-white
                hover:bg-[#B88A78]/70
                transition-all
              "
              aria-label="Next slide"
            >
              →
            </button>

            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={`
                    h-1.5 rounded-full transition-all duration-300
                    ${
                      index === current
                        ? "w-9 bg-[#D8A58F]"
                        : "w-2.5 bg-white/50 hover:bg-white/80"
                    }
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Rose Gold curve */}
        <div className="absolute bottom-[-1px] left-0 right-0 z-20 pointer-events-none">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-[55px] sm:h-[70px] md:h-[90px]"
          >
            <path
              d="M0,80 C360,145 1080,145 1440,80 L1440,120 L0,120 Z"
              fill="#171516"
            />
            <path
              d="M0,79 C360,144 1080,144 1440,79"
              fill="none"
              stroke="#B88A78"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}