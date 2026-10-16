import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "About PlantingCalc | Free Gardening Calculators" },
  description: "PlantingCalc is an independent publisher of free gardening calculators built on USDA zone data and university extension research.",
  alternates: { canonical: "https://plantingcalc.com/about" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PlantingCalc",
  url: "https://plantingcalc.com",
  logo: "https://plantingcalc.com/icon.svg",
  description:
    "Independent publisher of free, data-driven gardening calculators for U.S. home gardeners. Built from USDA hardiness zone data, typical frost dates for each zone, NOAA weather records, and university agricultural extension guidance.",
  sameAs: ["https://plantingcalc.com"],
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />

      <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
        About PlantingCalc
      </h1>

      <p className="mt-4 text-lg text-[var(--color-text-muted)]">
        PlantingCalc provides free gardening calculators powered by USDA
        hardiness zone data, typical frost dates for each zone, NOAA weather
        records, and agricultural extension guidance. Every tool on this site is designed to help home gardeners
        make data-driven decisions, from soil preparation to harvest
        timing.
      </p>

      {/* Data Sources */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-[var(--color-text)]">
          Our Data Sources
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--color-text-muted)]">
          <li>
            <strong className="text-[var(--color-text)]">
              USDA Plant Hardiness Zone Map
            </strong>{" "}
            (via phzmapi.org): determines your growing zone by ZIP code.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">
              Typical frost dates by hardiness zone
            </strong>
            : the usual last spring and first fall frost for each USDA subzone, used for planting windows. They are zone averages, so your own garden can differ.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">
              NOAA and National Weather Service data
            </strong>
            : 30 years of temperature records for your location on the frost probability tool, and the current forecast on Frost Alert.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">
              University Agricultural Extension Publications
            </strong>
            : planting timing, spacing and soil amendment guidelines. Where a page uses a specific rate, it names the source.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">
              Companion planting references
            </strong>
            : traditional good and bad pairings. Few of these have been tested in field trials, so treat them as guidance.
          </li>
        </ul>
      </section>

      {/* Why Trust Us */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-[var(--color-text)]">
          Why Trust Our Calculators
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--color-text-muted)]">
          <li>
            <strong className="text-[var(--color-text)]">Real government data</strong>
            : USDA zones, NOAA weather records and extension guidance, not guesswork.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Sources named</strong>
            : where a page gives a specific rate, it says where the number comes from.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Transparent methodology</strong>
            : every calculation explains how it works.
          </li>
          <li>
            <strong className="text-[var(--color-text)]">Corrected when wrong</strong>
            : when a number does not match its source, we fix it and update the page date.
          </li>
        </ul>
      </section>

      {/* Author */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-[var(--color-text)]">
          Who We Are
        </h2>
        <p className="mt-4 text-[var(--color-text-muted)]">
          PlantingCalc is a small independent publisher of free tools for home gardeners who want to plan from data instead of guessing: the kind of planning help commercial growers get, without paying for planning software.
        </p>
        <p className="mt-3 text-[var(--color-text-muted)]">
          Every calculator on this site is backed by published agricultural data, not guesswork. When we say &ldquo;plant tomatoes 2 weeks after your last frost,&rdquo; that comes from the same extension office guidelines that professional farmers follow.
        </p>
      </section>

      {/* Methodology */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-bold text-[var(--color-text)]">
          How We Calculate
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[var(--color-text-muted)]">
          <li>
            <strong className="text-[var(--color-text)]">Frost dates</strong> are the typical dates for your USDA hardiness subzone, which we look up from your ZIP through the phzmapi.org API. They are zone averages, not readings from a station near you; the frost probability tool uses 30 years of NOAA records for your location instead.
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
        <h2 className="font-display text-2xl font-bold text-[var(--color-text)]">
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
