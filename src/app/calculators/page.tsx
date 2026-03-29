import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Gardening Calculators",
  description:
    "21 free gardening calculators: planting dates, soil volume, seed spacing, companion planting, fertilizer, watering, harvest estimates, and more. Powered by USDA zone data.",
  alternates: { canonical: "/calculators" },
};

const categories = [
  {
    id: "planning",
    label: "Planning & Timing",
    icon: "📅",
    description: "Know exactly when to plant, start seeds, and harvest in your zone.",
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
    description: "Plan your beds, calculate soil, and figure out spacing.",
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
    description: "Keep your plants healthy with the right companions, nutrients, water, and light.",
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
    description: "Estimate yields, preserve your harvest, and calculate savings.",
    calculators: [
      { title: "Yield Estimator", description: "Expected harvest weight", href: "/yield-estimator", icon: "⚖️" },
      { title: "Canning Calculator", description: "Jars needed for preserving", href: "/canning", icon: "🫙" },
      { title: "Cost Savings", description: "Garden vs grocery savings", href: "/cost-savings", icon: "💰" },
    ],
  },
];

export default function CalculatorsPage() {
  const totalCalcs = categories.reduce((sum, c) => sum + c.calculators.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-[var(--color-text)] sm:text-4xl">
        All Gardening Calculators
      </h1>
      <p className="mt-3 text-lg text-[var(--color-text-muted)]">
        {totalCalcs} free tools powered by USDA zone data and agricultural research.
      </p>

      {categories.map((cat) => (
        <section key={cat.id} id={cat.id} className="mt-12">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[var(--color-text)]">
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{cat.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.calculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
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
        </section>
      ))}

      <div className="mt-16 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 text-center">
        <h2 className="text-lg font-bold text-[var(--color-text)]">Quick Jump</h2>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {cat.icon} {cat.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
