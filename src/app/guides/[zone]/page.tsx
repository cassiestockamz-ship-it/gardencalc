import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import EmailCapture from "@/components/EmailCapture";
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

  const title = `What to Plant in Zone ${guide.zone} — Growing Guide`;
  const description = `Complete growing guide for USDA Zone ${guide.zone} (${guide.tempRange}). ${guide.bestVegetables.length} vegetables you can grow, planting tips, and a ${guide.growingSeasonWeeks}-week growing season breakdown.`;

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Zone Guides", url: "https://plantingcalc.com/guides" },
          { name: `Zone ${guide.zone}`, url: `https://plantingcalc.com/guides/${guide.slug}` },
        ]}
      />

      {/* Hero */}
      <div className="mb-8 text-center">
        <Link href="/guides" className="mb-3 inline-block text-sm text-[var(--color-primary)] hover:underline">
          ← All Zone Guides
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
          What to Plant in Zone {guide.zone}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-[var(--color-text-muted)]">
          {guide.description}
        </p>
      </div>

      {/* Key stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-5 text-center">
          <div className="text-sm font-medium text-[var(--color-text-muted)]">Min Winter Temp</div>
          <div className="mt-1 text-2xl font-bold text-[var(--color-text)]">{guide.tempRange}</div>
        </div>
        <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-5 text-center">
          <div className="text-sm font-medium text-[var(--color-text-muted)]">Growing Season</div>
          <div className="mt-1 text-2xl font-bold text-[var(--color-text)]">{guide.growingSeasonWeeks} weeks</div>
        </div>
        <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-5 text-center">
          <div className="text-sm font-medium text-[var(--color-text-muted)]">Vegetables You Can Grow</div>
          <div className="mt-1 text-2xl font-bold text-[var(--color-text)]">{guide.bestVegetables.length}</div>
        </div>
      </div>

      {/* Tips */}
      <div className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6">
        <h2 className="mb-3 text-lg font-bold text-[var(--color-text)]">
          Zone {guide.zone} Growing Tips
        </h2>
        <ul className="space-y-2">
          {guide.tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--color-text-muted)]">
              <span className="mt-0.5 flex-shrink-0 text-[var(--color-primary)]">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Vegetable list by category */}
      <h2 className="mb-5 text-xl font-bold text-[var(--color-text)]">
        Vegetables for Zone {guide.zone}
      </h2>
      <div className="space-y-6">
        {categories.map((cat) => {
          const vegs = guide.bestVegetables.filter((v) => v.category === cat.key);
          if (vegs.length === 0) return null;
          return (
            <div key={cat.key}>
              <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--color-text)]">
                <span>{cat.icon}</span> {cat.label}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                      <th className="px-3 py-2 text-left font-semibold text-[var(--color-text)]">Vegetable</th>
                      <th className="px-3 py-2 text-right font-semibold text-[var(--color-text)]">Days to Harvest</th>
                      <th className="hidden px-3 py-2 text-right font-semibold text-[var(--color-text)] sm:table-cell">Spacing</th>
                      <th className="hidden px-3 py-2 text-left font-semibold text-[var(--color-text)] md:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vegs.map((v) => (
                      <tr key={v.name} className="border-b border-[var(--color-border)] last:border-b-0">
                        <td className="px-3 py-2 font-medium text-[var(--color-text)]">
                          {v.icon} {v.name}
                        </td>
                        <td className="px-3 py-2 text-right text-[var(--color-text-muted)]">
                          {v.daysToHarvest[0]}-{v.daysToHarvest[1]}
                        </td>
                        <td className="hidden px-3 py-2 text-right text-[var(--color-text-muted)] sm:table-cell">
                          {v.spacingInches}&quot; apart
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

      {/* Calculator links */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">
          Plan Your Zone {guide.zone} Garden
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/planting-dates", icon: "📅", label: "Planting Dates", desc: "Enter your ZIP for exact dates" },
            { href: "/soil-calculator", icon: "🪴", label: "Soil Calculator", desc: "How much soil you need" },
            { href: "/seed-spacing", icon: "📏", label: "Seed Spacing", desc: "Plants per bed calculator" },
            { href: "/companion-planting", icon: "🤝", label: "Companion Planting", desc: "What grows well together" },
            { href: "/fertilizer", icon: "🧪", label: "Fertilizer", desc: "NPK needs by vegetable" },
            { href: "/watering", icon: "💧", label: "Watering Schedule", desc: "How much water each plant needs" },
          ].map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
            >
              <span className="text-2xl">{calc.icon}</span>
              <div>
                <div className="text-sm font-semibold text-[var(--color-text)]">{calc.label}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{calc.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <EmailCapture variant="inline" context={`zone-${guide.zone}-guide`} />

      <div className="mt-10 text-center">
        <Link
          href="/guides"
          className="rounded-xl border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-alt)]"
        >
          ← View All Zone Guides
        </Link>
      </div>
    </div>
  );
}
