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
    question: "What determines my growing season length?",
    answer:
      "Your growing season is the number of frost-free days between your last spring frost and your first fall frost. This is primarily determined by your USDA hardiness zone, which is based on average annual minimum winter temperatures. Northern zones (1-4) have shorter seasons of 8-16 weeks, while southern zones (8-13) can have 32-52 weeks of growing time. Elevation, proximity to large bodies of water, and local microclimates can also shift your actual season by a week or two in either direction.",
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

    const seasonWeeks = guide.growingSeasonWeeks;
    const seasonDays = seasonWeeks * 7;

    // Use ZIP API data if available, otherwise estimate from zone
    let lastFrostFormatted = "";
    let firstFrostFormatted = "";
    let plantingWindowStart = "";
    let plantingWindowEnd = "";

    if (zipZoneData && parseInt(zipZoneData.zone.replace(/[ab]/i, "")) === zoneNum) {
      lastFrostFormatted = zipZoneData.lastFrostFormatted;
      firstFrostFormatted = zipZoneData.firstFrostFormatted;

      // Planting window: 2 weeks after last frost to 10 weeks before first frost
      const lastFrost = new Date(zipZoneData.lastFrost + "T00:00:00");
      const firstFrost = new Date(zipZoneData.firstFrost + "T00:00:00");
      const windowStart = new Date(lastFrost);
      windowStart.setDate(windowStart.getDate() + 14);
      const windowEnd = new Date(firstFrost);
      windowEnd.setDate(windowEnd.getDate() - 70);

      plantingWindowStart = windowStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      plantingWindowEnd = windowEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      // Estimate frost dates from zone
      const estimatedLastFrost = estimateLastFrost(zoneNum);
      const estimatedFirstFrost = estimateFirstFrost(zoneNum);
      lastFrostFormatted = estimatedLastFrost.label;
      firstFrostFormatted = estimatedFirstFrost.label;

      const windowStart = new Date(estimatedLastFrost.date);
      windowStart.setDate(windowStart.getDate() + 14);
      const windowEnd = new Date(estimatedFirstFrost.date);
      windowEnd.setDate(windowEnd.getDate() - 70);

      plantingWindowStart = windowStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      plantingWindowEnd = windowEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    const categorized = categorizeVegetables(seasonDays, zoneNum);
    const easyCount = categorized.filter((v) => v.fit === "easy").length;
    const tightCount = categorized.filter((v) => v.fit === "tight").length;
    const wontFitCount = categorized.filter((v) => v.fit === "wontfit").length;
    const fitsCount = easyCount + tightCount;

    return {
      zoneNum,
      seasonWeeks,
      seasonDays,
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
      title="Growing Season Length Calculator"
      description="Find out how long your growing season is and which vegetables fit within it, based on your USDA hardiness zone or ZIP code."
      lastUpdated="March 2026"
      intro="Your growing season is the number of frost-free weeks between your last spring frost and first fall frost. Zone 5 gardeners get about 20 weeks, while Zone 8 gardeners enjoy 32 weeks or more. Knowing your season length helps you pick vegetables that will actually have time to mature before frost arrives."
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
                value={String(results.fitsCount)}
                unit="crops"
                icon="🌱"
              />
              <ResultCard
                label="Planting Window"
                value={results.plantingWindowStart}
                unit={`to ${results.plantingWindowEnd}`}
                icon="🗓️"
              />
            </div>

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
              text={`Zone ${results.zoneNum} has a ${results.seasonWeeks}-week (${results.seasonDays}-day) growing season. ${results.fitsCount} vegetables fit within the season. Last frost: ${results.lastFrostFormatted}. First frost: ${results.firstFrostFormatted}.`}
            />
          </div>

          {/* Vegetable fit categories */}
          <div className="mt-10">
            <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
              Vegetable Fit for {results.seasonDays}-Day Season
            </h2>

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

      <FAQSection questions={growingSeasonFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          How This Calculator Works
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This calculator uses USDA hardiness zone data to determine your growing season length in weeks and days. When you enter a ZIP code, it fetches your exact zone from the USDA Plant Hardiness Zone Map API and calculates frost dates specific to your subzone. Vegetables are categorized by comparing their days-to-harvest range against your total frost-free days. &quot;Easy fit&quot; crops finish harvest within 75% of your season, &quot;tight fit&quot; crops need most or all of it, and &quot;won&apos;t fit&quot; crops require more days than your season provides.
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

// Estimated frost dates by zone (used when ZIP lookup is not available)
function estimateLastFrost(zone: number): { label: string; date: Date } {
  const year = new Date().getFullYear();
  const estimates: Record<number, { month: number; day: number; label: string }> = {
    1: { month: 6, day: 8, label: "Early June" },
    2: { month: 5, day: 22, label: "Late May" },
    3: { month: 5, day: 12, label: "Mid May" },
    4: { month: 5, day: 1, label: "Early May" },
    5: { month: 4, day: 17, label: "Mid April" },
    6: { month: 4, day: 7, label: "Early April" },
    7: { month: 3, day: 26, label: "Late March" },
    8: { month: 3, day: 11, label: "Mid March" },
    9: { month: 2, day: 20, label: "Late February" },
    10: { month: 1, day: 23, label: "Late January" },
    11: { month: 1, day: 1, label: "January 1 (frost-free)" },
    12: { month: 1, day: 1, label: "January 1 (frost-free)" },
    13: { month: 1, day: 1, label: "January 1 (frost-free)" },
  };
  const est = estimates[zone] || estimates[6];
  return {
    label: est.label,
    date: new Date(year, est.month - 1, est.day),
  };
}

function estimateFirstFrost(zone: number): { label: string; date: Date } {
  const year = new Date().getFullYear();
  const estimates: Record<number, { month: number; day: number; label: string }> = {
    1: { month: 8, day: 22, label: "Late August" },
    2: { month: 9, day: 7, label: "Early September" },
    3: { month: 9, day: 17, label: "Mid September" },
    4: { month: 9, day: 28, label: "Late September" },
    5: { month: 10, day: 9, label: "Early October" },
    6: { month: 10, day: 19, label: "Mid October" },
    7: { month: 10, day: 31, label: "Late October" },
    8: { month: 11, day: 14, label: "Mid November" },
    9: { month: 12, day: 4, label: "Early December" },
    10: { month: 12, day: 25, label: "Late December" },
    11: { month: 12, day: 31, label: "December 31 (frost-free)" },
    12: { month: 12, day: 31, label: "December 31 (frost-free)" },
    13: { month: 12, day: 31, label: "December 31 (frost-free)" },
  };
  const est = estimates[zone] || estimates[6];
  return {
    label: est.label,
    date: new Date(year, est.month - 1, est.day),
  };
}
