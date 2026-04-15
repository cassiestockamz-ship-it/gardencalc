import Link from "next/link";
import CalculatorSearch from "@/components/CalculatorSearch";
import LiveWeekAhead from "@/components/LiveWeekAhead";
import FAQSection from "@/components/FAQSection";
import { plantingDatesFAQ } from "@/data/faq-data";

const featured = [
  {
    title: "Frost Alert",
    tagline: "Cover or lose tonight",
    description:
      "Live 3-night low against your actual crops. Tells you exactly what to cover.",
    href: "/frost-alert",
    icon: "🚨",
  },
  {
    title: "Plant Today?",
    tagline: "Live red/yellow/green",
    description:
      "One verdict against the 14-day forecast and estimated soil temperature.",
    href: "/plant-today",
    icon: "✅",
  },
  {
    title: "Frost Probability",
    tagline: "30 years of NOAA data",
    description:
      "Real frost probability for any date from the ERA5 climate record.",
    href: "/frost-probability",
    icon: "📊",
  },
  {
    title: "Seed Start Calendar",
    tagline: "Apple / Google Calendar",
    description:
      "Full personalized seed-starting calendar exported straight to your phone.",
    href: "/seed-start-calendar",
    icon: "📅",
  },
];

const categories = [
  {
    label: "Live Data Tools",
    icon: "⚡",
    items: [
      { title: "Frost Alert", href: "/frost-alert" },
      { title: "Plant Today?", href: "/plant-today" },
      { title: "Frost Probability", href: "/frost-probability" },
      { title: "Chill Hours Tracker", href: "/chill-hours" },
      { title: "Seed Start Calendar", href: "/seed-start-calendar" },
    ],
  },
  {
    label: "Planning & Timing",
    icon: "📅",
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
    icon: "📐",
    items: [
      { title: "Soil Calculator", href: "/soil-calculator" },
      { title: "Bed Layout", href: "/bed-layout" },
      { title: "Square Foot Garden", href: "/square-foot" },
      { title: "Seed Spacing", href: "/seed-spacing" },
    ],
  },
  {
    label: "Plant Care",
    icon: "💧",
    items: [
      { title: "Companion Planting", href: "/companion-planting" },
      { title: "Fertilizer", href: "/fertilizer" },
      { title: "Watering Schedule", href: "/watering" },
      { title: "Sunlight Guide", href: "/sunlight" },
      { title: "Soil pH", href: "/soil-ph" },
      { title: "Pest Guide", href: "/pest-guide" },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "PlantingCalc",
            url: "https://plantingcalc.com",
            description:
              "The planting calendar that reads your forecast. Free gardening calculators powered by live 14-day forecasts, 30-year NOAA frost history, and USDA hardiness zone data.",
            publisher: {
              "@type": "Organization",
              name: "PlantingCalc",
              url: "https://plantingcalc.com/about",
            },
            potentialAction: {
              "@type": "SearchAction",
              target: "https://plantingcalc.com/planting-dates?zip={zip}",
              "query-input": "required name=zip",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "PlantingCalc Live Week Ahead",
            url: "https://plantingcalc.com",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Enter a ZIP and get this week's exact gardening decisions. Reads the live 14-day forecast and tells you what to sow, what to watch, and what to cover against frost.",
          }),
        }}
      />

      {/* HERO — tool-first */}
      <section className="px-4 pt-10 pb-8 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            The planting calendar that reads your forecast
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
            Enter a ZIP.
            <br />
            Get this week&apos;s answer.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[var(--color-text-muted)] sm:text-lg">
            Live 14-day forecast, 30 years of NOAA frost history, your USDA zone. No wizard, no signup, no ads in the way. One ZIP tells you what to plant, what to cover, and how many days remain until your last frost.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <LiveWeekAhead />
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Live data tools
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Four calculators that read your current forecast. No static tables.
            </p>
          </div>
          <Link
            href="/calculators"
            className="hidden text-sm font-medium text-[var(--color-primary)] hover:underline sm:inline"
          >
            All 22 calculators &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)]/40 hover:shadow-md ribbon-sow"
            >
              <span className="mb-3 block text-3xl" aria-hidden="true">
                {calc.icon}
              </span>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                {calc.tagline}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold leading-tight text-[var(--color-text)] group-hover:text-[var(--color-primary-ink)]">
                {calc.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
                {calc.description}
              </p>
              <span className="mt-3 inline-block text-xs font-semibold text-[var(--color-primary)]">
                Open tool &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Search + directory */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]/50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Every calculator
            </h2>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              22 tools across live data, planning, design, and care. Search, or browse by category.
            </p>
          </div>
          <CalculatorSearch />
          <div className="mt-10 grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="mb-3 flex h-8 items-end border-b-2 border-[var(--color-primary)]/25 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary-ink)]">
                    <span className="mr-1.5" aria-hidden="true">
                      {cat.icon}
                    </span>
                    {cat.label}
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zone guides CTA */}
      <section className="border-t border-[var(--color-border)] px-4 py-14 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Zone by zone
          </p>
          <h2 className="font-display text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Planting guides for every USDA hardiness zone
          </h2>
          <p className="max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
            Each of the 13 guides opens with a live frost countdown and the three crops you should plant this week in that zone. The prose lives below the tool, not above it.
          </p>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-primary-soft)] px-5 py-3 text-sm font-semibold text-[var(--color-primary-ink)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
          >
            Browse 13 zone guides &rarr;
          </Link>
        </div>
      </section>

      {/* FAQ with Speakable */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 font-display text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Common questions
          </h2>
          <FAQSection items={plantingDatesFAQ} includeSpeakable />
        </div>
      </section>
    </>
  );
}
