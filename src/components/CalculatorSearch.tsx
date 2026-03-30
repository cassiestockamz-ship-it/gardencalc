"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Calc {
  title: string;
  description: string;
  href: string;
  icon: string;
}

const ALL_CALCULATORS: Calc[] = [
  { title: "Planting Dates", description: "When to plant by ZIP code", href: "/planting-dates", icon: "📅" },
  { title: "Frost Dates", description: "First and last frost by ZIP", href: "/frost-dates", icon: "❄️" },
  { title: "Growing Season", description: "Season length by zone", href: "/growing-season", icon: "🌤️" },
  { title: "Succession Planting", description: "Stagger for continuous harvest", href: "/succession-planting", icon: "🔁" },
  { title: "Seed Starting", description: "When to start seeds indoors", href: "/seed-starting", icon: "🌱" },
  { title: "Harvest Date", description: "When your crop will be ready", href: "/harvest-date", icon: "🗓️" },
  { title: "Soil Calculator", description: "How much soil for your bed", href: "/soil-calculator", icon: "🪴" },
  { title: "Bed Layout", description: "Plan your raised bed layout", href: "/bed-layout", icon: "📐" },
  { title: "Square Foot Garden", description: "SFG spacing planner", href: "/square-foot", icon: "🌿" },
  { title: "Seed Spacing", description: "How many plants fit", href: "/seed-spacing", icon: "📏" },
  { title: "Container Garden", description: "Pot size and plant count", href: "/container-garden", icon: "🪻" },
  { title: "Mulch Calculator", description: "Mulch and compost volume", href: "/mulch-calculator", icon: "🪵" },
  { title: "Companion Planting", description: "What grows well together", href: "/companion-planting", icon: "🤝" },
  { title: "Fertilizer", description: "NPK ratios for your plants", href: "/fertilizer", icon: "🧪" },
  { title: "Watering Schedule", description: "How much and how often", href: "/watering", icon: "💧" },
  { title: "Sunlight Guide", description: "Match plants to your light", href: "/sunlight", icon: "☀️" },
  { title: "Soil pH", description: "pH matching and amendments", href: "/soil-ph", icon: "🔬" },
  { title: "Pest Guide", description: "Identify and treat pests", href: "/pest-guide", icon: "🐛" },
  { title: "Yield Estimator", description: "Expected harvest weight", href: "/yield-estimator", icon: "⚖️" },
  { title: "Canning Calculator", description: "Jars needed for preserving", href: "/canning", icon: "🫙" },
  { title: "Cost Savings", description: "Garden vs grocery savings", href: "/cost-savings", icon: "💰" },
];

export default function CalculatorSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_CALCULATORS.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="relative mx-auto max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search calculators..."
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
      />
      {query.trim() && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
          {results.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto py-2">
              {results.map((calc) => (
                <li key={calc.href}>
                  <Link
                    href={calc.href}
                    onClick={() => setQuery("")}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--color-surface-alt)]"
                  >
                    <span className="text-lg">{calc.icon}</span>
                    <div>
                      <div className="font-medium text-[var(--color-text)]">{calc.title}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{calc.description}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-[var(--color-text-muted)]">
              No calculators found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
