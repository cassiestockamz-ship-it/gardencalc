import Link from "next/link";
import type { Metadata } from "next";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { getAllZoneGuides } from "@/data/zone-guides";

export const metadata: Metadata = {
  title: "USDA Zone Growing Guides — What to Plant in Your Zone",
  description:
    "Find what to plant in your USDA hardiness zone. Growing guides for Zones 1-13 with vegetable lists, planting tips, and season length — powered by real USDA data.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "USDA Zone Growing Guides",
    description: "Find what to plant in your USDA hardiness zone. Guides for all 13 zones.",
  },
};

export default function GuidesHubPage() {
  const zones = getAllZoneGuides();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Zone Guides", url: "https://plantingcalc.com/guides" },
        ]}
      />

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
          What to Plant in Your USDA Zone
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-[var(--color-text-muted)]">
          The USDA Plant Hardiness Zone Map divides North America into 13 zones
          based on minimum winter temperatures. Your zone determines which
          vegetables thrive, when to plant, and how long your growing season lasts.
        </p>
        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          Don&apos;t know your zone?{" "}
          <Link href="/planting-dates" className="text-[var(--color-primary)] hover:underline">
            Enter your ZIP code
          </Link>{" "}
          and we&apos;ll look it up.
        </p>
      </div>

      {/* Zone cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((z) => (
          <Link
            key={z.zone}
            href={`/guides/${z.slug}`}
            className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-2xl font-extrabold text-[var(--color-primary)]">
                Zone {z.zone}
              </span>
              <span className="rounded-full bg-[var(--color-surface-alt)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-muted)]">
                {z.tempRange}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
              {z.description}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-muted)]">
                {z.bestVegetables.length} vegetables · {z.growingSeasonWeeks} week season
              </span>
              <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                View guide →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Editorial */}
      <div className="mt-12 space-y-4 text-[var(--color-text-muted)]">
        <h2 className="text-xl font-bold text-[var(--color-text)]">
          Understanding USDA Hardiness Zones
        </h2>
        <p>
          The USDA zone system is based on the average annual minimum winter
          temperature. Zone 1 experiences lows of -60°F, while Zone 13 never drops
          below 60°F. Your zone doesn&apos;t just determine which perennials survive
          winter — it defines your growing season length, planting dates, and which
          annual vegetables you can realistically grow to maturity.
        </p>
        <p>
          Most of the continental U.S. falls in Zones 3-9, which support a wide
          range of vegetables. The biggest differences are in season length: Zone 3
          gardeners have about 13 weeks of frost-free growing, while Zone 9
          gardeners get 40+ weeks. This directly affects which crops mature in time
          and how many succession plantings you can fit in.
        </p>
        <p>
          Microclimates matter too — a south-facing wall, urban heat island, or
          elevation change can shift your effective zone by one or two numbers.
          The USDA map is a starting point; your local experience is the best guide.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link
            href="/planting-dates"
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
          >
            Look up your zone by ZIP →
          </Link>
          <Link
            href="/soil-calculator"
            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
          >
            Calculate soil for raised beds →
          </Link>
        </div>
      </div>
    </div>
  );
}
