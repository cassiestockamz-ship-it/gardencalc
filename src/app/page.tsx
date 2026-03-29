import Link from "next/link";

const categories = [
  {
    id: "planning",
    label: "Planning & Timing",
    icon: "📅",
    calculators: [
      { title: "Planting Dates", description: "When to plant by ZIP code", href: "/planting-dates", icon: "📅" },
      { title: "Frost Dates", description: "First and last frost by ZIP", href: "/frost-dates", icon: "❄️" },
      { title: "Growing Season", description: "Season length by zone", href: "/growing-season", icon: "🌤️" },
      { title: "Succession Planting", description: "Stagger for continuous harvest", href: "/succession-planting", icon: "🔁" },
      { title: "Seed Starting", description: "When to start seeds indoors", href: "/seed-starting", icon: "🌱" },
      { title: "Harvest Date", description: "When your crop will be ready", href: "/harvest-date", icon: "🗓️" },
    ],
  },
  {
    id: "design",
    label: "Garden Design",
    icon: "📐",
    calculators: [
      { title: "Soil Calculator", description: "How much soil for your bed", href: "/soil-calculator", icon: "🪴" },
      { title: "Bed Layout", description: "Plan your raised bed layout", href: "/bed-layout", icon: "📐" },
      { title: "Square Foot Garden", description: "SFG spacing planner", href: "/square-foot", icon: "🌿" },
      { title: "Seed Spacing", description: "How many plants fit", href: "/seed-spacing", icon: "📏" },
      { title: "Container Garden", description: "Pot size and plant count", href: "/container-garden", icon: "🪻" },
      { title: "Mulch Calculator", description: "Mulch and compost volume", href: "/mulch-calculator", icon: "🪵" },
    ],
  },
  {
    id: "care",
    label: "Plant Care",
    icon: "💧",
    calculators: [
      { title: "Companion Planting", description: "What grows well together", href: "/companion-planting", icon: "🤝" },
      { title: "Fertilizer", description: "NPK ratios for your plants", href: "/fertilizer", icon: "🧪" },
      { title: "Watering Schedule", description: "How much and how often", href: "/watering", icon: "💧" },
      { title: "Sunlight Guide", description: "Match plants to your light", href: "/sunlight", icon: "☀️" },
      { title: "Soil pH", description: "pH matching and amendments", href: "/soil-ph", icon: "🔬" },
      { title: "Pest Guide", description: "Identify and treat pests", href: "/pest-guide", icon: "🐛" },
    ],
  },
  {
    id: "harvest",
    label: "Harvest & Yield",
    icon: "🥕",
    calculators: [
      { title: "Yield Estimator", description: "Expected harvest weight", href: "/yield-estimator", icon: "⚖️" },
      { title: "Canning Calculator", description: "Jars needed for preserving", href: "/canning", icon: "🫙" },
      { title: "Cost Savings", description: "Garden vs grocery savings", href: "/cost-savings", icon: "💰" },
    ],
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
      "Exact soil volumes, seed counts, and spacing. No more guessing at the garden center.",
  },
  {
    icon: "🌿",
    title: "Grow More Food",
    description:
      "Optimize your garden layout and timing to maximize your harvest season.",
  },
];

const totalCalcs = categories.reduce((s, c) => s + c.calculators.length, 0);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PlantingCalc",
        "url": "https://plantingcalc.com",
        "description": "Free gardening calculators powered by USDA zone data and agricultural research.",
        "publisher": {
          "@type": "Organization",
          "name": "PlantingCalc",
          "url": "https://plantingcalc.com/about"
        }
      })}} />
      {/* Hero */}
      <section className="px-4 pb-16 pt-20 text-center sm:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
          {totalCalcs} Free{" "}
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

      {/* Calculator Cards by Category */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {categories.map((cat) => (
          <div key={cat.id} className="mb-12">
            <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">
              <span className="mr-2">{cat.icon}</span>{cat.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.calculators.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="group relative rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
                >
                  <span className="mb-2 block text-2xl">{calc.icon}</span>
                  <h3 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                    {calc.title}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {calc.description}
                  </p>
                  <span className="mt-3 inline-block text-xs font-medium text-[var(--color-primary)]">
                    Try it &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
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

      {/* Zone Guides CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 text-center">
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
