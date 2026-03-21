import Link from "next/link";

const calculators = [
  {
    title: "Raised Bed Soil Calculator",
    description:
      "Calculate exactly how much soil, compost, and amendments you need for any raised bed size.",
    href: "/soil-calculator",
    icon: "🪴",
    live: true,
  },
  {
    title: "Planting Date Calculator",
    description:
      "Enter your ZIP code to get personalized planting dates based on USDA zone and frost dates.",
    href: "/planting-dates",
    icon: "📅",
    live: true,
  },
  {
    title: "Seed Spacing & Yield Calculator",
    description:
      "Plan your garden layout with optimal spacing for maximum yield in your available space.",
    href: "/seed-spacing",
    icon: "🌱",
    live: true,
  },
  {
    title: "Companion Planting Checker",
    description:
      "Find out which plants grow well together and which ones to keep apart.",
    href: "/companion-planting",
    icon: "🤝",
    live: true,
  },
  {
    title: "Fertilizer Calculator",
    description:
      "Calculate the right NPK ratio and amount for your plants and garden size.",
    href: "/fertilizer",
    icon: "🧪",
    live: true,
  },
  {
    title: "Watering Schedule Calculator",
    description:
      "Get a personalized watering schedule based on your plants, zone, and season.",
    href: "/watering",
    icon: "💧",
    live: true,
  },
];

const features = [
  {
    icon: "🗺️",
    title: "USDA Zone Data",
    description:
      "Planting recommendations based on your hardiness zone and local frost dates.",
  },
  {
    icon: "📐",
    title: "Precise Calculations",
    description:
      "Exact soil volumes, seed counts, and spacing — no more guessing at the garden center.",
  },
  {
    icon: "🌿",
    title: "Grow More Food",
    description:
      "Optimize your garden layout and timing to maximize your harvest season.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-4 pb-16 pt-20 text-center sm:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
          Plan Your{" "}
          <span className="text-[var(--color-primary)]">Garden</span> With
          Confidence
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--color-text-muted)] sm:text-xl">
          Free gardening calculators powered by USDA zone data and agricultural
          research. Know exactly what to plant, when, and how much.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/soil-calculator"
            className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            Calculate Soil Volume
          </Link>
          <Link
            href="/planting-dates"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-colors hover:bg-[var(--color-surface-alt)]"
          >
            Find Planting Dates
          </Link>
        </div>
      </section>

      {/* Calculator Cards */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="mb-8 text-center text-2xl font-bold text-[var(--color-text)]">
          Garden Calculators
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calc) => {
            const Wrapper = calc.live ? Link : "div";
            return (
              <Wrapper
                key={calc.title}
                href={calc.href}
                className={`group relative rounded-xl border bg-[var(--color-surface)] p-6 transition-all ${
                  calc.live
                    ? "border-[var(--color-border)] shadow-sm hover:border-[var(--color-primary)]/30 hover:shadow-md"
                    : "border-dashed border-[var(--color-border)] opacity-70"
                }`}
              >
                {!calc.live && (
                  <span className="absolute right-4 top-4 rounded-full bg-[var(--color-surface-alt)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Coming Soon
                  </span>
                )}
                <span className="mb-3 block text-2xl">{calc.icon}</span>
                <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                  {calc.title}
                </h3>
                <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
                  {calc.description}
                </p>
                {calc.live && (
                  <span className="mt-4 inline-block text-sm font-medium text-[var(--color-primary)]">
                    Try it &rarr;
                  </span>
                )}
              </Wrapper>
            );
          })}
        </div>
      </section>

      {/* Why PlantingCalc */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="mb-10 text-center text-2xl font-bold text-[var(--color-text)]">
            Why PlantingCalc?
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <span className="mb-3 inline-block text-3xl">{f.icon}</span>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
