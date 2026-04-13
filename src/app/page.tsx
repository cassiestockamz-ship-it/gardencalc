import Link from "next/link";
import CalculatorSearch from "@/components/CalculatorSearch";

const featured = [
  { title: "Frost Alert — Cover Or Lose", description: "Live 72-hour frost check for your ZIP. Tells you exactly what to cover tonight or lose by morning.", href: "/frost-alert", icon: "🚨" },
  { title: "Frost Probability Tool", description: "Real frost probability for any date, computed from 30 years of daily temperature records.", href: "/frost-probability", icon: "📊" },
  { title: "Can I Plant Today?", description: "Live red/yellow/green decision based on the 14-day forecast and estimated soil temperature.", href: "/plant-today", icon: "✅" },
  { title: "Seed Start Calendar with ICS", description: "Full personalized seed-starting calendar by ZIP. Download straight to Google or Apple Calendar.", href: "/seed-start-calendar", icon: "📅" },
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

const features = [
  { icon: "🗺️", title: "USDA Zone Data", description: "Planting recommendations based on your hardiness zone and local frost dates." },
  { icon: "📐", title: "Precise Calculations", description: "Exact soil volumes, seed counts, and spacing. No more guessing at the garden center." },
  { icon: "🌿", title: "Grow More Food", description: "Optimize your garden layout and timing to maximize your harvest season." },
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PlantingCalc",
        "url": "https://plantingcalc.com",
        "description": "Free gardening calculators powered by USDA zone data and agricultural research.",
        "publisher": { "@type": "Organization", "name": "PlantingCalc", "url": "https://plantingcalc.com/about" }
      })}} />

      {/* Hero */}
      <section className="px-4 pb-16 pt-20 text-center sm:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl">
          <span className="text-[var(--color-primary)]">Live-data</span>{" "}
          gardening calculators
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--color-text-muted)] sm:text-xl">
          Real 14-day forecasts, 30 years of frost history, live chill hour accumulation.
          Every tool uses your exact ZIP and real data from NOAA, Open-Meteo, and USDA.
          Free, no signup, no ads.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/frost-alert" className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[var(--color-primary-dark)]">
            Frost alert for tonight →
          </Link>
          <Link href="/plant-today" className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-colors hover:bg-[var(--color-surface-alt)]">
            Can I plant today?
          </Link>
        </div>
      </section>

      {/* Featured Calculators (top 4 as cards) */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="mb-6 text-center text-xl font-bold text-[var(--color-text)]">Most Popular</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
            >
              <span className="mb-2 block text-2xl">{calc.icon}</span>
              <h3 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                {calc.title}
              </h3>
              <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
                {calc.description}
              </p>
              <span className="mt-3 inline-block text-xs font-medium text-[var(--color-primary)]">
                Try it &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <CalculatorSearch />
      </section>

      {/* All Calculators - compact directory */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 text-center text-xl font-bold text-[var(--color-text)]">All Calculators</h2>
          <div className="grid items-start gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="mb-3 flex h-8 items-end border-b-2 border-[var(--color-primary)]/20 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                    <span className="mr-1.5">{cat.icon}</span>{cat.label}
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
          <div className="mt-8 text-center">
            <Link href="/calculators" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
              View all with descriptions &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Why PlantingCalc */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-[var(--color-text)]">
          Why PlantingCalc?
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <span className="mb-3 inline-block text-3xl">{f.icon}</span>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is a hardiness zone — educational */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-5 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            What is a USDA hardiness zone, really?
          </h2>
          <p>
            A USDA plant hardiness zone is a geographic region defined by its average annual <em>minimum</em>{" "}
            winter temperature. The continental United States is divided into 13 main zones, each 10 degrees
            Fahrenheit wide, with &quot;a&quot; and &quot;b&quot; sub-zones that split each band in half. Zone 1 is the
            coldest (below -50&deg;F winter lows, mostly interior Alaska), Zone 13 is the warmest (60&deg;F and above,
            the Florida Keys and Hawaiian coast).
          </p>
          <p>
            The practical reason gardeners care about their zone has almost nothing to do with summer. It&apos;s a
            question of which perennials survive a typical winter without dying and which annuals have enough
            frost-free days to finish their life cycle. If you plant a blueberry bush rated for Zones 4–7 in Zone 3,
            the extreme winter low will eventually kill it no matter how well you care for it in summer. If you plant
            a 120-day pumpkin variety in Zone 4, where the frost-free growing season averages under 120 days, you will
            watch the vines die in early September with immature fruit still on them. The zone is the hard constraint.
            Everything else — fertilizer, water, spacing, pest management — only matters if you respect the zone first.
          </p>
          <p>
            The zones were updated by USDA most recently in 2023, using 30-year climate normals from 1991–2020, and
            they shifted noticeably warmer across much of the country. If you haven&apos;t checked your zone since the
            mid-2010s, there&apos;s a meaningful chance you&apos;re one half-zone warmer than the map you grew up with.
            Use the planting-dates calculator above to pin down your current zone from a ZIP code; the answer comes
            from the official USDA Plant Hardiness Zone Map API and is as current as the map itself.
          </p>
        </div>
      </section>

      {/* The three mistakes — educational */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-5 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            The three mistakes almost every new gardener makes
          </h2>
          <p>
            After working through extension publications and talking to a lot of first-season gardeners, the same
            three planning mistakes come up over and over. None of them are about gardening skill. They&apos;re all
            planning decisions made before a single seed hits the dirt, and all three are the exact kind of problem
            that a calculator is designed to solve.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong className="text-[var(--color-text)]">Buying too many plants for the bed.</strong> A new 4&times;8
              raised bed looks cavernous in March. People buy 6 tomato starts, 4 pepper starts, 2 zucchini, a row of
              basil, and a few lettuces. By July the bed is a thicket, airflow is zero, powdery mildew shows up, and
              fruiting stalls. The seed-spacing calculator exists because the extension office answer to &quot;how
              many tomato plants in a 4&times;8 bed&quot; is three, not six.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Planting warm-season crops before last frost.</strong>
              {" "}Tomatoes, peppers, basil, squash, and cucumbers all shut down below 50&deg;F night temperatures and
              can be killed outright by a light frost. But every spring, gardeners see a 70&deg;F afternoon in late
              March and transplant everything that weekend. The planting-dates calculator ties your ZIP code to the
              official NOAA frost-date normals so that when you ask &quot;when can I put my tomatoes out,&quot; the
              answer is a real date for your real county, not a vague &quot;after the last frost.&quot;
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Under-ordering soil for a raised bed.</strong> A cubic yard
              looks like a lot of soil in a pile, but a single 4&times;8&times;1 foot raised bed needs about 32
              cubic feet — more than a cubic yard on its own, before you even start the second bed. Gardeners routinely
              buy half of what they need, panic on installation day, drive back to the nursery, and end up mixing two
              different soil blends in the same bed. The soil calculator handles the math and adds a 10–15% settling
              buffer that matches extension-office guidance.
            </li>
          </ul>
          <p>
            None of this is complicated math. It&apos;s just the kind of math that&apos;s easy to get wrong on a
            napkin, especially when you&apos;re excited to plant. That&apos;s the job the calculators above are built
            to do.
          </p>
        </div>
      </section>

      {/* Why use PlantingCalc vs extension office */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-5 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Why use PlantingCalc instead of your local extension office?
          </h2>
          <p>
            You shouldn&apos;t, in the strongest cases. Your local university extension office is the gold standard for
            region-specific gardening advice. They know your soil, they know your pest pressure, they know the exact
            cultivars that have historically performed well in your county, and they answer questions for free. If you
            have a specific, individualized question — especially anything involving chemical application or a sick
            plant — call them first, and call them before you call us.
          </p>
          <p>
            What PlantingCalc is good for is the other 90% of the time: the quick planning question at 9pm on a
            Sunday in February when the extension office is closed and you just want to know how many seed packets to
            order. That&apos;s the use case these calculators are built around. We sit on top of the same USDA, NOAA,
            and extension data that the professional sources use, and we make certain specific workflows faster:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-[var(--color-text)]">One-shot planting-date lookup by ZIP.</strong> Instead of
              cross-referencing an extension PDF with a frost-date table, you type in a ZIP and get the dates.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Zone-aware vegetable lists.</strong> Every zone guide
              lists the vegetables that reliably complete their cycle in that zone&apos;s growing-season window, which
              is rarely broken out that cleanly in a single extension publication.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Spacing and yield in the same place.</strong> Extension
              spacing charts and yield tables usually live in separate publications. Our calculators combine them so
              you can ask &quot;how many plants fit and how much will I get&quot; in one pass.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Zero subscription.</strong> Every tool is free, every result
              page shows the underlying logic, and nothing is gated behind an email signup.
            </li>
          </ul>
          <p>
            For anything we&apos;re not sure about, or for a specific garden question that depends on your exact soil
            and microclimate, we&apos;ll always tell you to call your extension office. That&apos;s not false modesty,
            it&apos;s how home gardening actually works. See our{" "}
            <Link href="/methodology" className="text-[var(--color-primary)] underline">methodology page</Link> for
            the full list of data sources and how each calculator works.
          </p>
        </div>
      </section>

      {/* Zone Guides CTA */}
      <section className="border-t border-[var(--color-border)] px-4 py-16 sm:px-6 text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Planting Guides by Zone</h2>
        <p className="mt-3 text-[var(--color-text-muted)]">
          Detailed guides for all 13 USDA hardiness zones.
        </p>
        <Link href="/guides" className="mt-6 inline-block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] shadow-sm transition-colors hover:bg-[var(--color-surface-alt)]">
          View Zone Guides &rarr;
        </Link>
      </section>
    </>
  );
}
