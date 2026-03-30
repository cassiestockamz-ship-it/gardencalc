import Link from "next/link";

const featured = [
  { title: "Planting Date Calculator", description: "Enter your ZIP code to get personalized planting dates for 45+ vegetables based on your USDA zone.", href: "/planting-dates", icon: "📅" },
  { title: "Raised Bed Soil Calculator", description: "Calculate exactly how much soil, compost, and amendments you need for any raised bed size.", href: "/soil-calculator", icon: "🪴" },
  { title: "Companion Planting Checker", description: "Find out which plants grow well together and which ones to keep apart.", href: "/companion-planting", icon: "🤝" },
  { title: "Seed Starting Calendar", description: "Know exactly when to start seeds indoors for your zone. Highlights what to start this week.", href: "/seed-starting", icon: "🌱" },
];

const categories = [
  {
    label: "Planning & Timing",
    icon: "📅",
    items: [
      { title: "Planting Dates", href: "/planting-dates" },
      { title: "Frost Dates", href: "/frost-dates" },
      { title: "Growing Season", href: "/growing-season" },
      { title: "Succession Planting", href: "/succession-planting" },
      { title: "Seed Starting", href: "/seed-starting" },
      { title: "Harvest Date", href: "/harvest-date" },
    ],
  },
  {
    label: "Garden Design",
    icon: "📐",
    items: [
      { title: "Soil Calculator", href: "/soil-calculator" },
      { title: "Bed Layout", href: "/bed-layout" },
      { title: "Square Foot Garden", href: "/square-foot" },
      { title: "Seed Spacing", href: "/seed-spacing" },
      { title: "Container Garden", href: "/container-garden" },
      { title: "Mulch Calculator", href: "/mulch-calculator" },
    ],
  },
  {
    label: "Plant Care",
    icon: "💧",
    items: [
      { title: "Companion Planting", href: "/companion-planting" },
      { title: "Fertilizer", href: "/fertilizer" },
      { title: "Watering Schedule", href: "/watering" },
      { title: "Sunlight Guide", href: "/sunlight" },
      { title: "Soil pH", href: "/soil-ph" },
      { title: "Pest Guide", href: "/pest-guide" },
    ],
  },
  {
    label: "Harvest & Yield",
    icon: "🥕",
    items: [
      { title: "Yield Estimator", href: "/yield-estimator" },
      { title: "Canning Calculator", href: "/canning" },
      { title: "Cost Savings", href: "/cost-savings" },
    ],
  },
];

const features = [
  { icon: "🗺️", title: "USDA Zone Data", description: "Planting recommendations based on your hardiness zone and local frost dates." },
  { icon: "📐", title: "Precise Calculations", description: "Exact soil volumes, seed counts, and spacing. No more guessing at the garden center." },
  { icon: "🌿", title: "Grow More Food", description: "Optimize your garden layout and timing to maximize your harvest season." },
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PlantingCalc",
        "url": "https://plantingcalc.com",
        "description": "Free gardening calculators powered by USDA zone data and agricultural research.",
        "publisher": { "@type": "Organization", "name": "PlantingCalc", "url": "https://plantingcalc.com/about" }
      })}} />

      {/* Hero */}
      <section className="px-4 pb-16 pt-20 text-center sm:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
          21 Free{" "}
          <span className="text-[var(--color-primary)]">Gardening</span>{" "}
          Calculators
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--color-text-muted)] sm:text-xl">
          Planting dates, soil volume, seed spacing, companion planting, and more.
          Powered by USDA zone data and agricultural research.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/planting-dates" className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[var(--color-primary-dark)]">
            Find Planting Dates
          </Link>
          <Link href="/calculators" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-colors hover:bg-[var(--color-surface-alt)]">
            Browse All Calculators
          </Link>
        </div>
      </section>

      {/* Featured Calculators (top 4 as cards) */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 text-center text-xl font-bold text-[var(--color-text)]">Most Popular</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
            >
              <span className="mb-2 block text-2xl">{calc.icon}</span>
              <h3 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                {calc.title}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                {calc.description}
              </p>
              <span className="mt-3 inline-block text-xs font-medium text-[var(--color-primary)]">
                Try it &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* All Calculators - compact directory */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-center text-xl font-bold text-[var(--color-text)]">All Calculators</h2>
          <div className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="mb-3 flex h-8 items-end border-b-2 border-[var(--color-primary)]/20 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                    <span className="mr-1.5">{cat.icon}</span>{cat.label}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/calculators" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
              View all with descriptions &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Why PlantingCalc */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-[var(--color-text)]">
          Why PlantingCalc?
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <span className="mb-3 inline-block text-3xl">{f.icon}</span>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Zone Guides CTA */}
      <section className="border-t border-[var(--color-border)] px-4 py-16 sm:px-6 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Planting Guides by Zone</h2>
        <p className="mt-3 text-[var(--color-text-muted)]">
          Detailed guides for all 13 USDA hardiness zones.
        </p>
        <Link href="/guides" className="mt-6 inline-block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-colors hover:bg-[var(--color-surface-alt)]">
          View Zone Guides &rarr;
        </Link>
      </section>
    </>
  );
}
