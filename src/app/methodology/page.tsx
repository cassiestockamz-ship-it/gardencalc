import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How We Research: Methodology",
  description: "How PlantingCalc sources, validates, and presents gardening data. Data sources, refresh cadence, calculator logic, editorial process, and corrections policy.",
  alternates: { canonical: "https://plantingcalc.com/methodology" },
};

export default function MethodologyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
        How We Research
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Methodology. Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-8 text-[var(--color-text-muted)]">
        <section>
          <p>
            PlantingCalc exists because home gardeners deserve the same data-driven planning tools that commercial
            growers and university extension offices rely on. Without the $200/year software subscriptions, the
            paywalled journals, or the half-day of digging through academic PDFs to answer a one-line question. This
            page explains exactly where our data comes from, how we turn it into each calculator, what we add on top,
            and what we deliberately don&apos;t do.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">1. Where the data comes from</h2>
          <p className="mt-3">
            Every calculator and every zone guide on PlantingCalc traces back to one of four underlying data sources:
          </p>
          <ul className="mt-3 list-disc space-y-3 pl-5">
            <li>
              <strong className="text-[var(--color-text)]">USDA Plant Hardiness Zone Map</strong>. The canonical U.S.
              growing-zone dataset, accessed via the public{" "}
              <a href="https://phzmapi.org" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">phzmapi.org</a>
              {" "}API. When you submit a ZIP code to our planting-dates calculator, your ZIP is resolved to a hardiness
              zone by this API and then used to select the right frost-date window and crop list for you. We do not
              store the ZIP.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">NOAA 30-year climate normals</strong>. The 30-year moving
              average of first-frost and last-frost dates maintained by the National Oceanic and Atmospheric
              Administration. These are the same averages published by USDA in their extension guides and are the
              industry-standard reference for &quot;average last frost date in your area.&quot; We use them unaltered.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">University agricultural extension publications</strong> ,
              peer-reviewed planting guides, spacing tables, fertilizer recommendations, and companion-planting
              research from land-grant university extension offices (Cornell, UMass, UF/IFAS, Oregon State, and others).
              These are publicly available and are treated across the industry as the authoritative, research-backed
              source for &quot;what to plant, when, how far apart, and how much.&quot;
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Open-source plant databases</strong>. Vetted
              community-maintained plant datasets for vegetable metadata (days to harvest, category, basic care notes)
              that we cross-reference against extension publications before relying on.
            </li>
          </ul>
          <p className="mt-3">
            None of these sources are paywalled. They&apos;re the same datasets used by commercial growers, licensed
            nursery professionals, and government-facing planning tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">2. How we turn data into calculators</h2>
          <p className="mt-3">
            Each calculator is a specific formula or lookup, documented in the code:
          </p>
          <ul className="mt-3 list-disc space-y-3 pl-5">
            <li>
              <strong className="text-[var(--color-text)]">Planting dates</strong> use the standard extension office
              formula: your last local frost date (from NOAA, via your ZIP → USDA zone) plus or minus an offset per
              crop (e.g., &quot;tomatoes: last frost + 14 days&quot;) from published extension schedules.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Soil volume</strong> is a straight cubic-foot calculation
              from your bed dimensions with a default 10–15% buffer to account for settling, the same rule of thumb
              extension guides use.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Seed spacing</strong> pulls the recommended in-row and
              between-row spacing for each vegetable from extension publications and divides your bed area by those
              values to estimate plants per bed.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Companion planting</strong> uses a compatibility matrix
              built from extension research and widely cited companion planting publications. Relationships are tagged
              as compatible, antagonistic, or neutral.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Fertilizer</strong> uses crop-specific NPK demand values
              from published soil science research, converted into pounds-per-square-foot estimates for common
              fertilizer blends.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Watering schedule</strong> uses base rates from agricultural
              research, adjusted by multipliers for climate zone, soil type, container vs. in-ground, and growth stage.
            </li>
          </ul>
          <p className="mt-3">
            When our calculators disagree with your own experience, trust your garden. Local microclimate, soil, and
            weather variance will routinely beat any averaged national dataset.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">3. Refresh cadence</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-[var(--color-text)]">USDA zone data</strong> is looked up live from phzmapi.org
              when you submit a ZIP. No staleness.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">NOAA frost normals</strong> update on a multi-year cycle; we
              align to the current published release.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Extension spacing and fertilizer data</strong> lives as
              structured data in our codebase and is reviewed at least once per year against the latest extension
              publications.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Zone guides</strong> are refreshed whenever any upstream
              source updates, with a version note in the repo.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">4. What we add on top</h2>
          <p className="mt-3">
            Raw data alone is not a garden plan. Where useful, we add a plain-language editorial layer on top of the
            calculator output. For example, an explanation of what a specific output <em>means</em> for your bed, or a
            practical note about common failure modes for a given vegetable in a given zone. These editorial sections
            are clearly separated from the calculator outputs and from the raw underlying data. They are our own
            interpretation at the time of writing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">5. What we deliberately don&apos;t do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>We don&apos;t store your ZIP, bed dimensions, or any other calculator inputs.</li>
            <li>We don&apos;t sell, rent, or share email addresses collected through our subscribe forms.</li>
            <li>We don&apos;t accept payment from seed companies, fertilizer brands, or nursery chains to influence our recommendations.</li>
            <li>We don&apos;t invent spacing, timing, or fertilizer values. If we state a number, it comes from a named source.</li>
            <li>We don&apos;t give individualized professional advice. See our <Link href="/disclaimer" className="text-[var(--color-primary)] underline">disclaimer</Link>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">6. Corrections policy</h2>
          <p className="mt-3">
            If you believe a page on PlantingCalc is wrong. An incorrect zone assignment, a spacing value that
            doesn&apos;t match a published extension guide, an outdated frost date, or a factual error in an editorial
            section. Please <Link href="/contact" className="text-[var(--color-primary)] underline">contact us</Link>
            {" "}with the page URL and what you believe is wrong. For calculator-level data we verify against the live
            source before making changes; for editorial content we fix it directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">7. Who runs this site</h2>
          <p className="mt-3">
            PlantingCalc is built and maintained by a small, independent team of home gardeners who wanted the planning
            tools commercial growers have. Without the subscription. We are not university extension agents or
            licensed horticulturists. We are not funded by any seed company, fertilizer brand, or nursery network. The
            site covers its operating costs through contextual advertising that is clearly labeled and does not
            influence calculator outputs or zone recommendations.
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-[var(--color-border)] pt-6">
        <Link href="/" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
