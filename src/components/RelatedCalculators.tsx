import Link from "next/link";

interface Calc {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: string;
}

const ALL_CALCULATORS: Calc[] = [
  // Planning & Timing
  { title: "Planting Dates", description: "When to plant by ZIP code", href: "/planting-dates", icon: "📅", category: "planning" },
  { title: "Frost Dates", description: "First and last frost by ZIP", href: "/frost-dates", icon: "❄️", category: "planning" },
  { title: "Growing Season", description: "Season length by zone", href: "/growing-season", icon: "🌤️", category: "planning" },
  { title: "Succession Planting", description: "Stagger for continuous harvest", href: "/succession-planting", icon: "🔁", category: "planning" },
  { title: "Seed Starting", description: "When to start seeds indoors", href: "/seed-starting", icon: "🌱", category: "planning" },
  { title: "Harvest Date", description: "When your crop will be ready", href: "/harvest-date", icon: "🗓️", category: "planning" },
  // Garden Design
  { title: "Soil Calculator", description: "How much soil for your bed", href: "/soil-calculator", icon: "🪴", category: "design" },
  { title: "Bed Layout", description: "Plan your raised bed layout", href: "/bed-layout", icon: "📐", category: "design" },
  { title: "Square Foot Garden", description: "SFG spacing planner", href: "/square-foot", icon: "🌿", category: "design" },
  { title: "Seed Spacing", description: "How many plants fit", href: "/seed-spacing", icon: "📏", category: "design" },
  { title: "Container Garden", description: "Pot size and plant count", href: "/container-garden", icon: "🪻", category: "design" },
  { title: "Mulch Calculator", description: "Mulch and compost volume", href: "/mulch-calculator", icon: "🪵", category: "design" },
  // Plant Care
  { title: "Companion Planting", description: "What grows well together", href: "/companion-planting", icon: "🤝", category: "care" },
  { title: "Fertilizer", description: "NPK ratios for your plants", href: "/fertilizer", icon: "🧪", category: "care" },
  { title: "Watering Schedule", description: "How much and how often", href: "/watering", icon: "💧", category: "care" },
  { title: "Sunlight Guide", description: "Match plants to your light", href: "/sunlight", icon: "☀️", category: "care" },
  { title: "Soil pH", description: "pH matching and amendments", href: "/soil-ph", icon: "🔬", category: "care" },
  { title: "Pest Guide", description: "Identify and treat pests", href: "/pest-guide", icon: "🐛", category: "care" },
  // Harvest & Yield
  { title: "Yield Estimator", description: "Expected harvest weight", href: "/yield-estimator", icon: "⚖️", category: "harvest" },
  { title: "Canning Calculator", description: "Jars needed for preserving", href: "/canning", icon: "🫙", category: "harvest" },
  { title: "Cost Savings", description: "Garden vs grocery savings", href: "/cost-savings", icon: "💰", category: "harvest" },
];

export default function RelatedCalculators({ currentPath }: { currentPath: string }) {
  const current = ALL_CALCULATORS.find((c) => c.href === currentPath);
  const currentCategory = current?.category || "planning";
  const others = ALL_CALCULATORS.filter((c) => c.href !== currentPath);
  const sameCategory = others.filter((c) => c.category === currentCategory);
  const diffCategory = others.filter((c) => c.category !== currentCategory);
  const related = [...sameCategory, ...diffCategory].slice(0, 6);

  return (
    <div className="mt-12 border-t border-[var(--color-border)] pt-10">
      <h2 className="mb-5 text-center text-xl font-bold text-[var(--color-text)]">
        Try Our Other Calculators
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {related.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <span className="mb-2 block text-2xl">{calc.icon}</span>
            <h3 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
              {calc.title}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {calc.description}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/calculators" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
          View all {ALL_CALCULATORS.length} calculators &rarr;
        </Link>
      </div>
    </div>
  );
}
