"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const categories = [
  {
    label: "Planning & Timing",
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
    items: [
      { title: "Yield Estimator", href: "/yield-estimator" },
      { title: "Canning Calculator", href: "/canning" },
      { title: "Cost Savings", href: "/cost-savings" },
    ],
  },
];

export default function NavDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]"
      >
        Calculators
        <svg className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-xl"
          style={{ width: "min(620px, 90vw)" }}
        >
          <div className="grid grid-cols-4 gap-5">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="mb-2.5 border-b-2 border-[var(--color-primary)]/20 pb-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                    {cat.label}
                  </h3>
                </div>
                <ul className="space-y-1">
                  {cat.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block rounded px-2 py-1 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)]"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-[var(--color-border)] pt-3 text-center">
            <Link
              href="/calculators"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-[var(--color-primary)] hover:underline"
            >
              View all 21 calculators &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
