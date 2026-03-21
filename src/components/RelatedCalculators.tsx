import Link from "next/link";

const ALL_CALCULATORS = [
  { title: "Soil Calculator", description: "How much soil for your raised bed", href: "/soil-calculator", icon: "🪴" },
  { title: "Planting Dates", description: "When to plant by ZIP code", href: "/planting-dates", icon: "📅" },
  { title: "Seed Spacing", description: "How many plants fit in your bed", href: "/seed-spacing", icon: "🌱" },
  { title: "Companion Planting", description: "What grows well together", href: "/companion-planting", icon: "🤝" },
  { title: "Fertilizer", description: "NPK ratios for your plants", href: "/fertilizer", icon: "🧪" },
  { title: "Watering Schedule", description: "How much and how often", href: "/watering", icon: "💧" },
];

export default function RelatedCalculators({ currentPath }: { currentPath: string }) {
  const related = ALL_CALCULATORS.filter((c) => c.href !== currentPath);

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
    </div>
  );
}
