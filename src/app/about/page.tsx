import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
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
              Plant-Harmony Companion Planting Database
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
          Built by gardeners and data analysts who believe everyone deserves
          access to the same planning tools professional growers use.
        </p>
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
