"use client";

const features = [
  {
    number: "01",
    title: "جودة استثنائية",
    description: "منتجات مختارة بعناية لتليق بكِ",
  },
  {
    number: "02",
    title: "شحن سريع",
    description: "نوصل طلبكِ بسرعة وأمان",
  },
  {
    number: "03",
    title: "دفع آمن",
    description: "طرق دفع آمنة وموثوقة",
  },
  {
    number: "04",
    title: "خدمة مميزة",
    description: "نحن هنا لمساعدتكِ دائمًا",
  },
];

export function FeaturesBar() {
  return (
    <section className="relative z-30 bg-[#F5EFEA] border-b border-[#B88A78]/20">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.number}
              className={`
                relative px-4 py-7 sm:px-6 md:py-9
                text-center
                group
                ${
                  index < features.length - 1
                    ? "border-l border-[#B88A78]/20"
                    : ""
                }
              `}
            >
              <span className="block text-[10px] tracking-[0.25em] text-[#B88A78] mb-2">
                {feature.number}
              </span>

              <h3 className="font-heading text-sm sm:text-base md:text-lg text-[#211D1E] font-semibold">
                {feature.title}
              </h3>

              <p className="mt-1.5 text-[11px] sm:text-xs text-[#211D1E]/60">
                {feature.description}
              </p>

              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#B88A78] group-hover:w-12 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}