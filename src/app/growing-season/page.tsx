"use client";

import { useState, useMemo, useCallback } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SelectInput from "@/components/SelectInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";
import { VEGETABLES, CATEGORIES } from "@/data/vegetables";
import { getAllZoneGuides } from "@/data/zone-guides";

interface ZoneApiData {
  zip: string;
  zone: string;
  tempRange: string;
  lastFrost: string;
  firstFrost: string;
  growingSeason: number;
  lastFrostFormatted: string;
  firstFrostFormatted: string;
}

type FitCategory = "easy" | "tight" | "wontfit";

interface CategorizedVegetable {
  name: string;
  icon: string;
  category: string;
  daysToHarvest: [number, number];
  fit: FitCategory;
  notes: string;
}

const ZONE_GUIDES = getAllZoneGuides();
const MIN_LIST_ZONE = Math.min(...VEGETABLES.map((v) => v.minZone));
const MAX_LIST_ZONE = Math.max(...VEGETABLES.map((v) => v.maxZone));

// Day-of-year arithmetic on a non-leap calendar; frost dates are typical (50%) dates, not a specific year.
const DAYS_BEFORE_MONTH = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function dayOfYear(d: { month: number; day: number }): number {
  return DAYS_BEFORE_MONTH[d.month - 1] + d.day;
}
function frostFreeDays(z: { lastFrost: { month: number; day: number }; firstFrost: { month: number; day: number } }): number {
  return dayOfYear(z.firstFrost) - dayOfYear(z.lastFrost);
}
/** Zone frost dates are averages, so show them only to the third of a month ("Mid-May"), never to the day. */
function partOfMonth(d: { month: number; day: number }): string {
  const part = d.day <= 10 ? "Early" : d.day <= 20 ? "Mid" : "Late";
  return `${part}-${MONTH_NAMES[d.month - 1]}`;
}

/** Typical season length for zones 3-10 (where most US gardeners live), from the same frost table as the zone guides. */
const SEASON_TABLE = ZONE_GUIDES.filter((z) => z.zone >= 3 && z.zone <= 10).map((z) => {
  const days = frostFreeDays(z);
  return {
    zone: z.zone,
    slug: z.slug,
    lastFrost: partOfMonth(z.lastFrost),
    firstFrost: partOfMonth(z.firstFrost),
    days,
    weeks: Math.round(days / 7),
  };
});
const SHORTEST = SEASON_TABLE[0];
const LONGEST = SEASON_TABLE[SEASON_TABLE.length - 1];
const ZONE6 = SEASON_TABLE.find((r) => r.zone === 6)!;

const zoneOptions = [
  { value: "", label: "Select a zone..." },
  ...ZONE_GUIDES.map((z) => ({
    value: String(z.zone),
    label: `Zone ${z.zone} (${z.tempRange})`,
  })),
];

function categorizeVegetables(
  seasonDays: number,
  zoneNumber: number
): CategorizedVegetable[] {
  return VEGETABLES.filter(
    (v) => v.minZone <= zoneNumber && v.maxZone >= zoneNumber
  )
    .map((v) => {
      const minDays = v.daysToHarvest[0];
      const maxDays = v.daysToHarvest[1];
      const avgDays = (minDays + maxDays) / 2;

      let fit: FitCategory;
      if (maxDays <= seasonDays * 0.75) {
        fit = "easy";
      } else if (maxDays <= seasonDays) {
        fit = "tight";
      } else {
        fit = "wontfit";
      }

      return {
        name: v.name,
        icon: v.icon,
        category: v.category,
        daysToHarvest: v.daysToHarvest,
        fit,
        notes: v.notes,
      };
    })
    .sort((a, b) => {
      const order: Record<FitCategory, number> = {
        easy: 0,
        tight: 1,
        wontfit: 2,
      };
      if (order[a.fit] !== order[b.fit]) return order[a.fit] - order[b.fit];
      return a.daysToHarvest[0] - b.daysToHarvest[0];
    });
}

const FIT_LABELS: Record<FitCategory, { label: string; color: string; bg: string; description: string }> = {
  easy: {
    label: "Easy Fit",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    description: "Harvest well within your growing season",
  },
  tight: {
    label: "Tight Fit",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    description: "Needs most or all of your growing season",
  },
  wontfit: {
    label: "Won't Fit",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    description: "Needs a longer season than you have",
  },
};

const growingSeasonFAQ = [
  {
    question: "How long is a growing season?",
    answer: `A growing season is the number of frost-free days between the typical last spring frost and the typical first fall frost. Across USDA zones ${SHORTEST.zone} to ${LONGEST.zone}, where most US gardens are, it runs from about ${SHORTEST.days} days (${SHORTEST.weeks} weeks) to about ${LONGEST.days} days (${LONGEST.weeks} weeks). A zone ${ZONE6.zone} garden typically gets about ${ZONE6.days} days. Enter your ZIP code above for the typical length where you live.`,
  },
  {
    question: "What determines my growing season length?",
    answer:
      "Your growing season is set by your local frost dates: the last spring frost and the first fall frost. Those come from local climate records, not from your USDA hardiness zone, which only measures the average coldest winter temperature. Zones are a useful shortcut because colder zones usually have later spring frosts and earlier fall frosts, but two places in the same zone can differ by weeks. Elevation, nearby large bodies of water, cities and low-lying frost pockets all shift the dates. Frost dates are also probabilities: a typical last frost date still leaves about a 50% chance of a later frost.",
  },
  {
    question: "Can I extend my growing season beyond the frost dates?",
    answer:
      "Yes, there are several ways to extend your growing season. Cold frames and low tunnels can add 4-6 weeks to each end of the season. Row covers (floating fabric) protect plants to about 28 degrees F. Hoop houses and unheated greenhouses can nearly double your effective season. Starting seeds indoors 6-10 weeks before your last frost date also gives warm-season crops a head start. In cold zones (1-5), season extension techniques make the biggest difference.",
  },
  {
    question: "What does 'tight fit' mean for a vegetable?",
    answer:
      "A 'tight fit' vegetable is one whose maximum days to harvest is close to your total growing season length. It means the plant can technically mature in your zone, but you will need to plant it on time, choose the fastest-maturing variety available, and hope for a season without early frost. Starting these crops indoors gives them the best chance. If your season is 120 days and a crop needs 100-120 days, that is a tight fit.",
  },
  {
    question: "Why do some vegetables show different days to harvest ranges?",
    answer:
      "Days to harvest varies because of variety differences, growing conditions, and what counts as 'harvest ready.' For example, tomatoes range from 60 to 85 days because early varieties like 'Early Girl' mature faster than beefsteaks. Temperature, sunlight, soil quality, and watering consistency also affect growth speed. The range shown represents typical performance across common varieties grown in home gardens.",
  },
  {
    question: "How do I find my USDA hardiness zone?",
    answer:
      "The easiest way is to enter your ZIP code in the calculator above. It uses the USDA Plant Hardiness Zone Map API to look up your exact zone. You can also visit the official USDA map at planthardiness.ars.usda.gov and search by ZIP code or click your location on the interactive map. Your zone is based on the average annual extreme minimum temperature recorded at weather stations near you.",
  },
];

export default function GrowingSeasonPage() {
  const [selectedZone, setSelectedZone] = useState("");
  const [zip, setZip] = useState("");
  const [zipLoading, setZipLoading] = useState(false);
  const [zipError, setZipError] = useState("");
  const [zipZoneData, setZipZoneData] = useState<ZoneApiData | null>(null);

  const fetchZoneByZip = useCallback(async () => {
    if (!/^\d{5}$/.test(zip)) {
      setZipError("Please enter a valid 5-digit ZIP code.");
      return;
    }
    setZipLoading(true);
    setZipError("");
    try {
      const res = await fetch(`/api/zone?zip=${zip}`);
      const data = await res.json();
      if (!res.ok) {
        setZipError(data.error || "Failed to look up zone.");
        setZipLoading(false);
        return;
      }
      setZipZoneData(data);
      // Extract the integer zone number from the zone string (e.g., "7a" -> "7")
      const zoneNum = data.zone.replace(/[ab]/i, "");
      setSelectedZone(zoneNum);
    } catch {
      setZipError("Network error. Please try again.");
    } finally {
      setZipLoading(false);
    }
  }, [zip]);

  const results = useMemo(() => {
    if (!selectedZone) return null;

    const zoneNum = parseInt(selectedZone);
    const guide = ZONE_GUIDES.find((z) => z.zone === zoneNum);
    if (!guide) return null;

    // One pair of frost dates drives the season length, the frost box and the planting window:
    // the ZIP's subzone dates when we have them, otherwise the zone's dates from the table below.
    // Both are averages, so dates show only to the third of a month (playbook rule 6).
    const zipMatchesZone =
      !!zipZoneData && parseInt(zipZoneData.zone.replace(/[ab]/i, "")) === zoneNum;
    const toMonthDay = (iso: string) => {
      const [m, d] = iso.slice(-5).split("-").map(Number);
      return { month: m, day: d };
    };
    const frost = zipMatchesZone
      ? { lastFrost: toMonthDay(zipZoneData!.lastFrost), firstFrost: toMonthDay(zipZoneData!.firstFrost) }
      : { lastFrost: guide.lastFrost, firstFrost: guide.firstFrost };
    // Zones 11-13 are stored as Jan 1 to Dec 31: no typical frost at all.
    const frostFree =
      frost.lastFrost.month === 1 && frost.lastFrost.day === 1 &&
      frost.firstFrost.month === 12 && frost.firstFrost.day === 31;
    const seasonDays = frostFree ? 365 : frostFreeDays(frost);
    const seasonWeeks = Math.round(seasonDays / 7);
    const lastFrostFormatted = frostFree ? "Usually none" : partOfMonth(frost.lastFrost);
    const firstFrostFormatted = frostFree ? "Usually none" : partOfMonth(frost.firstFrost);

    // Planting window: 2 weeks after last frost to 10 weeks before first frost
    const shift = (d: { month: number; day: number }, days: number) => {
      const t = new Date(Date.UTC(2001, d.month - 1, d.day + days));
      return { month: t.getUTCMonth() + 1, day: t.getUTCDate() };
    };
    const plantingWindowStart = frostFree ? "All year" : partOfMonth(shift(frost.lastFrost, 14));
    const plantingWindowEnd = frostFree ? "" : partOfMonth(shift(frost.firstFrost, -70));

    const categorized = categorizeVegetables(seasonDays, zoneNum);
    const easyCount = categorized.filter((v) => v.fit === "easy").length;
    const tightCount = categorized.filter((v) => v.fit === "tight").length;
    const wontFitCount = categorized.filter((v) => v.fit === "wontfit").length;
    const fitsCount = easyCount + tightCount;

    // When the ZIP's subzone value differs from the zone average in the table, say which is which.
    const zoneAvgDays = frostFree ? 365 : frostFreeDays(guide);
    const subzoneNote =
      zipMatchesZone && seasonDays !== zoneAvgDays
        ? `This is the typical season for subzone ${zipZoneData!.zone.toLowerCase()}, where your ZIP is. The zone table below averages all of zone ${zoneNum} (about ${zoneAvgDays} days, ${Math.round(zoneAvgDays / 7)} weeks), so the two numbers differ.`
        : "";

    return {
      zoneNum,
      seasonWeeks,
      seasonDays,
      subzoneNote,
      lastFrostFormatted,
      firstFrostFormatted,
      plantingWindowStart,
      plantingWindowEnd,
      categorized,
      easyCount,
      tightCount,
      wontFitCount,
      fitsCount,
      tempRange: guide.tempRange,
      description: guide.description,
      tips: guide.tips,
    };
  }, [selectedZone, zipZoneData]);

  return (
    <CalculatorLayout
      title="How Long Is Your Growing Season?"
      description="Find out how long your growing season is and which vegetables fit within it, based on your ZIP code or USDA hardiness zone."
      lastUpdated="October 2026"
      intro={`A growing season is the frost-free stretch between the typical last spring frost and first fall frost. In zones ${SHORTEST.zone} to ${LONGEST.zone} that is about ${SHORTEST.days} to ${LONGEST.days} days; a zone ${ZONE6.zone} garden gets about ${ZONE6.days} days (${ZONE6.weeks} weeks). Enter your ZIP for the typical length where you live and which vegetables have time to mature.`}
    >
      <CalculatorSchema
        name="Growing Season Length Calculator"
        description="Calculate your growing season length by USDA zone or ZIP code. See which vegetables fit your season and get planting window recommendations."
        url="https://plantingcalc.com/growing-season"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          {
            name: "Growing Season Calculator",
            url: "https://plantingcalc.com/growing-season",
          },
        ]}
      />

      {/* Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectInput
          label="USDA Hardiness Zone"
          value={selectedZone}
          onChange={(v) => {
            setSelectedZone(v);
            setZipZoneData(null);
          }}
          options={zoneOptions}
          helpText="Select your zone or use ZIP code lookup below"
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Or Enter ZIP Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchZoneByZip();
              }}
              placeholder="e.g. 90210"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] shadow-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
            <button
              onClick={fetchZoneByZip}
              disabled={zipLoading}
              className="shrink-0 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
            >
              {zipLoading ? "..." : "Look Up"}
            </button>
          </div>
          {zipError && (
            <p className="mt-1 text-xs text-red-600">{zipError}</p>
          )}
          {zipZoneData && (
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              ZIP {zipZoneData.zip} is Zone {zipZoneData.zone} ({zipZoneData.tempRange})
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <>
          <div className="mt-10">
            <h2 className="mb-2 text-lg font-bold text-[var(--color-text)]">
              Zone {results.zoneNum} Growing Season
            </h2>
            <p className="mb-5 text-sm text-[var(--color-text-muted)]">
              {results.description}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="Season Length"
                value={String(results.seasonWeeks)}
                unit="weeks"
                highlight
                icon="📅"
              />
              <ResultCard
                label="Season Length"
                value={String(results.seasonDays)}
                unit="days"
                icon="☀️"
              />
              <ResultCard
                label="Vegetables That Fit"
                value={results.categorized.length === 0 ? "n/a" : String(results.fitsCount)}
                unit={results.categorized.length === 0 ? "see below" : "crops"}
                icon="🌱"
              />
              <ResultCard
                label="Planting Window"
                value={results.plantingWindowStart}
                unit={results.plantingWindowEnd ? `to ${results.plantingWindowEnd}` : ""}
                icon="🗓️"
              />
            </div>
            {results.subzoneNote && (
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">{results.subzoneNote}</p>
            )}

            {/* Frost dates summary */}
            <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
                Frost Dates
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-xs font-medium text-[var(--color-text-muted)]">
                    Last Spring Frost
                  </span>
                  <p className="text-lg font-bold text-[var(--color-text)]">
                    {results.lastFrostFormatted}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-[var(--color-text-muted)]">
                    First Fall Frost
                  </span>
                  <p className="text-lg font-bold text-[var(--color-text)]">
                    {results.firstFrostFormatted}
                  </p>
                </div>
              </div>
            </div>

            <ShareResults
              title={`Zone ${results.zoneNum} Growing Season: ${results.seasonWeeks} weeks`}
              text={`Zone ${results.zoneNum} has a ${results.seasonWeeks}-week (${results.seasonDays}-day) growing season. ${results.categorized.length === 0 ? "" : `${results.fitsCount} vegetables fit within the season. `}Last frost: ${results.lastFrostFormatted}. First frost: ${results.firstFrostFormatted}.`}
            />
          </div>

          {/* Vegetable fit categories */}
          <div className="mt-10">
            <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
              Vegetable Fit for {results.seasonDays}-Day Season
            </h2>

            {results.categorized.length === 0 && (
              <p className="text-sm text-[var(--color-text-muted)]">
                Our vegetable list covers zones {MIN_LIST_ZONE} to {MAX_LIST_ZONE}, so we have no crop timings for zone {results.zoneNum}. Frost does not limit what you grow here; heat and rainfall do. See the zone {results.zoneNum} growing tips below.
              </p>
            )}

            {(["easy", "tight", "wontfit"] as FitCategory[]).map((fitCat) => {
              const vegs = results.categorized.filter((v) => v.fit === fitCat);
              if (vegs.length === 0) return null;
              const fitInfo = FIT_LABELS[fitCat];

              return (
                <div key={fitCat} className="mb-6">
                  <div className="mb-3 flex items-center gap-2">
                    <h3 className={`text-base font-semibold ${fitInfo.color}`}>
                      {fitInfo.label} ({vegs.length})
                    </h3>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {fitInfo.description}
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {vegs.map((v) => (
                      <div
                        key={v.name}
                        className={`rounded-lg border p-3 ${fitInfo.bg}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{v.icon}</span>
                            <span className={`text-sm font-medium ${fitInfo.color}`}>
                              {v.name}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-[var(--color-text-muted)]">
                            {v.daysToHarvest[0]}-{v.daysToHarvest[1]}d
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {CATEGORIES[v.category]?.label || v.category}
                          {v.notes ? ` · ${v.notes}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Zone tips */}
          {results.tips.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">
                Zone {results.zoneNum} Growing Tips
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--color-text-muted)]">
                {results.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

        </>
      )}

      {!results && (
        <div className="mt-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-8 text-center">
          <span className="mb-3 block text-4xl">🌻</span>
          <p className="text-sm text-[var(--color-text-muted)]">
            Select your USDA hardiness zone or enter a ZIP code to see your growing season details and which vegetables will thrive.
          </p>
        </div>
      )}

      {/* Crawlable reference table: rendered into the initial HTML */}
      <section className="mt-10">
        <h2 className="mb-2 text-lg font-bold text-[var(--color-text)]">
          Typical Growing Season Length by Zone
        </h2>
        <p className="mb-4 text-sm text-[var(--color-text-muted)]">
          Days between the typical last spring frost and first fall frost (about a 50% chance of frost on each date). Local dates can differ by weeks within a zone, so use the ZIP lookup above for your area.
        </p>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-surface-alt)] text-[var(--color-text)]">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">USDA zone</th>
                <th scope="col" className="px-3 py-2 font-semibold">Typical last frost</th>
                <th scope="col" className="px-3 py-2 font-semibold">Typical first frost</th>
                <th scope="col" className="px-3 py-2 font-semibold">Growing season</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-muted)]">
              {SEASON_TABLE.map((r) => (
                <tr key={r.zone} className="border-t border-[var(--color-border)]">
                  <td className="px-3 py-2">
                    <a href={`/guides/${r.slug}`} className="text-[var(--color-primary)] hover:underline">
                      Zone {r.zone}
                    </a>
                  </td>
                  <td className="px-3 py-2">{r.lastFrost}</td>
                  <td className="px-3 py-2">{r.firstFrost}</td>
                  <td className="px-3 py-2">
                    about {r.days} days ({r.weeks} weeks)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <FAQSection questions={growingSeasonFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          How This Calculator Works
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This calculator estimates your growing season from typical frost dates. When you enter a ZIP code, it looks up your zone from the USDA Plant Hardiness Zone Map and uses typical frost dates and season length for that subzone (for example 6a or 6b). If you pick a zone instead, it uses the zone&apos;s typical frost dates shown in the table above. Vegetables are categorized by comparing their days-to-harvest range against your total frost-free days. &quot;Easy fit&quot; crops finish harvest within 75% of your season, &quot;tight fit&quot; crops need most or all of it, and &quot;won&apos;t fit&quot; crops require more days than your season provides.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          Tips for Maximizing Your Growing Season
        </h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>
            Start warm-season crops (tomatoes, peppers, eggplant) indoors 8-10 weeks before your last frost to gain extra growing time.
          </li>
          <li>
            Use season extension tools like cold frames, row covers, and hoop houses to add 4-8 weeks to your effective season.
          </li>
          <li>
            Succession plant fast crops (lettuce, radishes, beans) every 2-3 weeks for continuous harvests throughout the season.
          </li>
          <li>
            Check our{" "}
            <a
              href="/planting-dates"
              className="text-[var(--color-primary)] hover:underline"
            >
              planting date calculator
            </a>{" "}
            for exact sowing dates, and our{" "}
            <a
              href="/seed-spacing"
              className="text-[var(--color-primary)] hover:underline"
            >
              seed spacing calculator
            </a>{" "}
            to maximize yield per square foot.
          </li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="growing-season" />
      <RelatedCalculators currentPath="/growing-season" />
    </CalculatorLayout>
  );
}
