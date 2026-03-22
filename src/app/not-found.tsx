"use client";

import Link from "next/link";

const calculators = [
  { title: "Raised Bed Soil Calculator", href: "/soil-calculator", icon: "🪴" },
  { title: "Planting Date Calculator", href: "/planting-dates", icon: "📅" },
  { title: "Seed Spacing & Yield Calculator", href: "/seed-spacing", icon: "🌱" },
  { title: "Companion Planting Checker", href: "/companion-planting", icon: "🤝" },
  { title: "Fertilizer Calculator", href: "/fertilizer", icon: "🧪" },
  { title: "Watering Schedule Calculator", href: "/watering", icon: "💧" },
];

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6">
      <span className="text-6xl" aria-hidden="true">
        🌾
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-3 text-lg text-[var(--color-text-muted)]">
        The calculator you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[var(--color-primary-dark)]"
      >
        Back to Homepage
      </Link>

      <div className="mt-12 w-full">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Try one of our calculators
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-left transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
            >
              <span className="text-2xl">{calc.icon}</span>
              <span className="text-sm font-medium text-[var(--color-text)]">
                {calc.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
