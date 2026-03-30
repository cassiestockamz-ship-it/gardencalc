import Link from "next/link";
import CalculatorSearch from "@/components/CalculatorSearch";
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
      { title: "Planting Dates", description: "When to plant by ZIP code", href: "/planting-dates" },
      { title: "Frost Dates", description: "First and last frost by ZIP", href: "/frost-dates" },
      { title: "Growing Season", description: "Season length by zone", href: "/growing-season" },
      { title: "Succession Planting", description: "Stagger for continuous harvest", href: "/succession-planting" },
      { title: "Seed Starting", description: "When to start seeds indoors", href: "/seed-starting" },
      { title: "Harvest Date", description: "When your crop will be ready", href: "/harvest-date" },
    ],
  },
  {
    id: "design",
    label: "Garden Design",
    icon: "📐",
    description: "Plan your beds, calculate soil, and figure out spacing.",
    calculators: [
      { title: "Soil Calculator", description: "How much soil for your bed", href: "/soil-calculator" },
      { title: "Bed Layout", description: "Plan your raised bed layout", href: "/bed-layout" },
      { title: "Square Foot Garden", description: "SFG spacing planner", href: "/square-foot" },
      { title: "Seed Spacing", description: "How many plants fit", href: "/seed-spacing" },
      { title: "Container Garden", description: "Pot size and plant count", href: "/container-garden" },
      { title: "Mulch Calculator", description: "Mulch and compost volume", href: "/mulch-calculator" },
    ],
  },
  {
    id: "care",
    label: "Plant Care",
    icon: "💧",
    description: "Keep your plants healthy with the right companions, nutrients, water, and light.",
    calculators: [
      { title: "Companion Planting", description: "What grows well together", href: "/companion-planting" },
      { title: "Fertilizer", description: "NPK ratios for your plants", href: "/fertilizer" },
      { title: "Watering Schedule", description: "How much and how often", href: "/watering" },
      { title: "Sunlight Guide", description: "Match plants to your light", href: "/sunlight" },
      { title: "Soil pH", description: "pH matching and amendments", href: "/soil-ph" },
      { title: "Pest Guide", description: "Identify and treat pests", href: "/pest-guide" },
    ],
  },
  {
    id: "harvest",
    label: "Harvest & Yield",
    icon: "🥕",
    description: "Estimate yields, preserve your harvest, and calculate savings.",
    calculators: [
      { title: "Yield Estimator", description: "Expected harvest weight", href: "/yield-estimator" },
      { title: "Canning Calculator", description: "Jars needed for preserving", href: "/canning" },
      { title: "Cost Savings", description: "Garden vs grocery savings", href: "/cost-savings" },
    ],
  },
];

export default function CalculatorsPage() {
  const totalCalcs = categories.reduce((sum, c) => sum + c.calculators.length, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-[var(--color-text)]">
        All Gardening Calculators
      </h1>
      <p className="mt-2 text-[var(--color-text-muted)]">
        {totalCalcs} free tools powered by USDA zone data and agricultural research.
      </p>

      {/* Search */}
      <div className="mt-6 mb-10">
        <CalculatorSearch />
      </div>

      {/* Category sections - compact list with descriptions */}
      {categories.map((cat) => (
        <section key={cat.id} id={cat.id} className="mb-10">
          <div className="mb-4 flex h-8 items-end border-b-2 border-[var(--color-primary)]/20 pb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
              <span className="mr-1.5">{cat.icon}</span>{cat.label}
            </h2>
          </div>
          <p className="mb-3 text-xs text-[var(--color-text-muted)]">{cat.description}</p>
          <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {cat.calculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group rounded-lg py-2 transition-colors"
              >
                <div className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                  {calc.title}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {calc.description}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
