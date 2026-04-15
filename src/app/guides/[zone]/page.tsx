import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import EmailCapture from "@/components/EmailCapture";
import ZoneToolHeader from "@/components/ZoneToolHeader";
import { getZoneGuide, getZoneSlugs } from "@/data/zone-guides";

export function generateStaticParams() {
  return getZoneSlugs().map((zone) => ({ zone }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ zone: string }>;
}): Promise<Metadata> {
  const { zone: slug } = await params;
  const guide = getZoneGuide(slug);
  if (!guide) return {};

  const title = `Zone ${guide.zone} Planting Guide: Live Frost Countdown & This Week's Crops`;
  const description = `Complete Zone ${guide.zone} growing guide (${guide.tempRange}). Live frost countdown, ${guide.bestVegetables.length} plantable vegetables, and a ${guide.growingSeasonWeeks}-week season breakdown.`;

  return {
    title,
    description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { title, description },
  };
}

export default async function ZoneGuidePage({
  params,
}: {
  params: Promise<{ zone: string }>;
}) {
  const { zone: slug } = await params;
  const guide = getZoneGuide(slug);
  if (!guide) notFound();

  const categories = [
    { key: "leafy", label: "Leafy Greens", icon: "🥬" },
    { key: "brassica", label: "Brassicas", icon: "🥦" },
    { key: "fruiting", label: "Fruiting", icon: "🍅" },
    { key: "root", label: "Root Vegetables", icon: "🥕" },
    { key: "legume", label: "Legumes", icon: "🫘" },
    { key: "allium", label: "Alliums", icon: "🧅" },
    { key: "herb", label: "Herbs", icon: "🌿" },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Zone ${guide.zone} Planting Guide`,
    description: guide.description,
    author: { "@type": "Organization", name: "PlantingCalc" },
    publisher: {
      "@type": "Organization",
      name: "PlantingCalc",
      url: "https://plantingcalc.com",
    },
    datePublished: "2026-03-21",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: `https://plantingcalc.com/guides/${guide.slug}`,
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to start a Zone ${guide.zone} vegetable garden`,
    description: `A 5-step guide to planting a vegetable garden in USDA hardiness Zone ${guide.zone}.`,
    totalTime: "P2W",
    step: [
      {
        "@type": "HowToStep",
        name: "Check your zone and frost date",
        text: `Confirm your USDA Zone ${guide.zone} assignment via the ZIP lookup tool above and note your typical last frost date.`,
      },
      {
        "@type": "HowToStep",
        name: "Pick crops that match your growing season",
        text: `Use the vegetable list below. Zone ${guide.zone} supports ${guide.bestVegetables.length} crops with the ${guide.growingSeasonWeeks}-week growing season.`,
      },
      {
        "@type": "HowToStep",
        name: "Start seeds indoors where needed",
        text: "Tomatoes, peppers, and eggplant get a 6-10 week indoor head start before the last frost. Direct-sow crops like carrots, beans, and squash go straight into the ground.",
      },
      {
        "@type": "HowToStep",
        name: "Harden off and transplant",
        text: "Expose seedlings to outdoor conditions for a week before transplanting. Transplant tender crops only after the last frost date has passed.",
      },
      {
        "@type": "HowToStep",
        name: "Watch the weather, not the calendar",
        text: "Use the Frost Alert tool to check the live 72-hour forecast. Cover tender crops when the forecast low drops below 33°F.",
      },
    ],
  };

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Zone ${guide.zone} Planting Guide`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable]"],
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Zone Guides", url: "https://plantingcalc.com/guides" },
          { name: `Zone ${guide.zone}`, url: `https://plantingcalc.com/guides/${guide.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />

      {/* Compact hero */}
      <div className="mb-6">
        <Link
          href="/guides"
          className="mb-2 inline-block text-xs font-medium text-[var(--color-primary)] hover:underline"
        >
          &larr; All Zone Guides
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          Zone {guide.zone} Planting Guide
        </h1>
        <p
          className="mt-2 max-w-2xl text-base text-[var(--color-text-muted)] sm:text-lg"
          data-speakable
        >
          {guide.description} Minimum winter temperature {guide.tempRange}.
        </p>
      </div>

      {/* Tool-first header: live frost countdown + this week's crops */}
      <ZoneToolHeader
        zone={guide.zone}
        lastFrost={guide.lastFrost}
        firstFrost={guide.firstFrost}
        growingSeasonWeeks={guide.growingSeasonWeeks}
        vegetables={guide.bestVegetables}
      />

      {/* Calculator cross-links */}
      <section className="mb-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-[var(--color-text)]">
          Plan your Zone {guide.zone} garden
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/planting-dates", icon: "📅", label: "Planting Dates", desc: "Enter your ZIP for exact dates" },
            { href: "/frost-alert", icon: "🚨", label: "Frost Alert", desc: "Cover or lose tonight" },
            { href: "/plant-today", icon: "✅", label: "Plant Today?", desc: "Red/yellow/green verdict" },
            { href: "/soil-calculator", icon: "🪴", label: "Soil Calculator", desc: "How much soil you need" },
            { href: "/seed-spacing", icon: "📏", label: "Seed Spacing", desc: "Plants per bed" },
            { href: "/companion-planting", icon: "🤝", label: "Companion Planting", desc: "What grows well together" },
          ].map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 p-3 transition-all hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary-soft)]"
            >
              <span className="text-2xl" aria-hidden="true">
                {calc.icon}
              </span>
              <div>
                <div className="font-display text-sm font-semibold text-[var(--color-text)]">
                  {calc.label}
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {calc.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="mb-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
        <h2 className="mb-3 font-display text-lg font-bold text-[var(--color-text)]">
          Zone {guide.zone} growing tips
        </h2>
        <ul className="space-y-2.5">
          {guide.tips.map((tip, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-[var(--color-text-muted)]"
            >
              <span className="mt-0.5 flex-shrink-0 text-[var(--color-primary)]">
                &#8226;
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* Vegetable list by category */}
      <section className="mb-8 cv-auto">
        <h2 className="mb-5 font-display text-xl font-bold text-[var(--color-text)]">
          Every vegetable plantable in Zone {guide.zone}
        </h2>
        <div className="space-y-6">
          {categories.map((cat) => {
            const vegs = guide.bestVegetables.filter((v) => v.category === cat.key);
            if (vegs.length === 0) return null;
            return (
              <div key={cat.key}>
                <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-[var(--color-text)]">
                  <span aria-hidden="true">{cat.icon}</span> {cat.label}
                </h3>
                <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]/60">
                        <th className="px-3 py-2 text-left font-semibold text-[var(--color-text)]">
                          Vegetable
                        </th>
                        <th className="px-3 py-2 text-right font-semibold text-[var(--color-text)]">
                          Days to Harvest
                        </th>
                        <th className="hidden px-3 py-2 text-right font-semibold text-[var(--color-text)] sm:table-cell">
                          Spacing
                        </th>
                        <th className="hidden px-3 py-2 text-left font-semibold text-[var(--color-text)] md:table-cell">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vegs.map((v) => (
                        <tr
                          key={v.name}
                          className="border-b border-[var(--color-border)] last:border-b-0"
                        >
                          <td className="px-3 py-2 font-medium text-[var(--color-text)]">
                            <span aria-hidden="true">{v.icon}</span> {v.name}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums text-[var(--color-text-muted)]">
                            {v.daysToHarvest[0]}&ndash;{v.daysToHarvest[1]}
                          </td>
                          <td className="hidden px-3 py-2 text-right tabular-nums text-[var(--color-text-muted)] sm:table-cell">
                            {v.spacingInches}&quot;
                          </td>
                          <td className="hidden px-3 py-2 text-xs text-[var(--color-text-muted)] md:table-cell">
                            {v.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <EmailCapture variant="inline" context={`zone-${guide.zone}-guide`} />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6">
        {guide.zone > 1 ? (
          <Link
            href={`/guides/zone-${guide.zone - 1}`}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-alt)]"
          >
            &larr; Zone {guide.zone - 1}
          </Link>
        ) : <span />}
        <Link
          href="/guides"
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          All zones
        </Link>
        {guide.zone < 13 ? (
          <Link
            href={`/guides/zone-${guide.zone + 1}`}
            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-alt)]"
          >
            Zone {guide.zone + 1} &rarr;
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
