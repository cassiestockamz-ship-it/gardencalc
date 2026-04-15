import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PlantingCalc",
  description: "PlantingCalc is an independent publisher of free, data-driven gardening calculators built from USDA hardiness zone data, NOAA frost normals, and university agricultural extension research.",
  alternates: { canonical: "https://plantingcalc.com/about" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PlantingCalc",
  url: "https://plantingcalc.com",
  logo: "https://plantingcalc.com/icon.svg",
  description:
    "Independent publisher of free, data-driven gardening calculators for U.S. home gardeners. Built from USDA hardiness zone data, NOAA frost normals, and university agricultural extension research.",
  sameAs: ["https://plantingcalc.com"],
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
        About PlantingCalc
      </h1>

      <p className="mt-4 text-lg text-[var(--color-text-muted)]">
        PlantingCalc provides free gardening calculators powered by USDA
        hardiness zone data, NOAA frost dates, and agricultural extension
        research. Every tool on this site is designed to help home gardeners
        make data-driven decisions&mdash;from soil preparation to harvest
        timing.
      </p>

      {/* Data Sources */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          Our Data Sources
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--color-text-muted)]">
          <li>
            <strong className="text-[var(--color-text)]">
              USDA Plant Hardiness Zone Map
            </strong>{" "}
            (via phzmapi.org) &mdash; determines your growing zone by ZIP code
          </li>
          <li>
            <strong className="text-[var(--color-text)]">
              NOAA Frost Date Normals
            </strong>{" "}
            &mdash; average first and last frost dates for accurate planting
            windows
          </li>
          <li>
            <strong className="text-[var(--color-text)]">
              University Agricultural Extension Publications
            </strong>{" "}
            &mdash; peer-reviewed spacing, fertilizer, and watering guidelines
          </li>
          <li>
            <strong className="text-[var(--color-text)]">
              Open-source companion planting databases and agricultural extension research
            </strong>{" "}
            &mdash; research-backed companion and antagonist plant pairings
          </li>
        </ul>
      </section>

      {/* Why Trust Us */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          Why Trust Our Calculators
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--color-text-muted)]">
          <li>
            <strong className="text-[var(--color-text)]">
              Real government data
            </strong>{" "}
            &mdash; USDA zones and NOAA frost dates, not guesswork
          </li>
          <li>
            <strong className="text-[var(--color-text)]">
              Open-source plant databases
            </strong>{" "}
            &mdash; transparent, verifiable information
          </li>
          <li>
            <strong className="text-[var(--color-text)]">
              Transparent methodology
            </strong>{" "}
            &mdash; every calculation explains how it works
          </li>
          <li>
            <strong className="text-[var(--color-text)]">
              Regularly updated
            </strong>{" "}
            &mdash; data refreshed to reflect the latest USDA and NOAA releases
          </li>
        </ul>
      </section>

      {/* Author */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          Who We Are
        </h2>
        <p className="mt-4 text-[var(--color-text-muted)]">
          PlantingCalc is built by home gardeners who got tired of guessing. We maintain raised beds and in-ground gardens across multiple USDA zones, and we built these tools because we wanted the same data-driven planning resources that commercial growers have. Without the $200/year software subscriptions.
        </p>
        <p className="mt-3 text-[var(--color-text-muted)]">
          Every calculator on this site is backed by published agricultural data, not guesswork. When we say &ldquo;plant tomatoes 2 weeks after your last frost,&rdquo; that comes from the same extension office guidelines that professional farmers follow.
        </p>
      </section>

      {/* Methodology */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          How We Calculate
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--color-text-muted)]">
          <li>
            <strong className="text-[var(--color-text)]">Frost dates</strong> are averaged from 30-year NOAA climate normals, cross-referenced with your USDA hardiness zone via the official phzmapi.org API.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Planting windows</strong> use the standard extension office formula: weeks before or after your local last frost date, calibrated per crop.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Spacing recommendations</strong> come from university agricultural extension publications (Cornell, UMass, UF/IFAS, Oregon State).
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Fertilizer profiles</strong> are based on published NPK requirements per crop from soil science research and extension guides.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Watering estimates</strong> use base rates from agricultural research, adjusted by multipliers for climate, soil type, container vs. in-ground, and season.
          </li>
        </ul>
      </section>

      {/* Calculator Links */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">
          Our Calculators
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/soil-calculator", label: "Raised Bed Soil Calculator" },
            { href: "/planting-dates", label: "Planting Date Calculator" },
            { href: "/seed-spacing", label: "Seed Spacing Calculator" },
            {
              href: "/companion-planting",
              label: "Companion Planting Guide",
            },
            { href: "/fertilizer", label: "Fertilizer Calculator" },
            { href: "/watering", label: "Watering Calculator" },
          ].map((calc) => (
            <li key={calc.href}>
              <Link
                href={calc.href}
                className="block rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-alt)]"
              >
                {calc.label} &rarr;
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
