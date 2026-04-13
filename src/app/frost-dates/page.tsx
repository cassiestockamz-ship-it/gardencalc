"use client";

import { useState, useMemo, useCallback } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";
import { frostDatesFAQ } from "@/data/faq-data";

interface ZoneData {
  zip: string;
  zone: string;
  tempRange: string;
  lastFrost: string;
  firstFrost: string;
  growingSeason: number;
  lastFrostFormatted: string;
  firstFrostFormatted: string;
}

const FROST_DATES_BY_ZONE: Record<
  string,
  { lastFrost: string; firstFrost: string } | null
> = {
  "1": { lastFrost: "05-30", firstFrost: "08-15" },
  "2": { lastFrost: "05-20", firstFrost: "09-01" },
  "3": { lastFrost: "05-10", firstFrost: "09-15" },
  "4": { lastFrost: "05-01", firstFrost: "10-01" },
  "5": { lastFrost: "04-15", firstFrost: "10-15" },
  "6": { lastFrost: "04-10", firstFrost: "10-20" },
  "7": { lastFrost: "04-01", firstFrost: "11-01" },
  "8": { lastFrost: "03-15", firstFrost: "11-15" },
  "9": { lastFrost: "03-01", firstFrost: "12-01" },
  "10": { lastFrost: "02-15", firstFrost: "12-15" },
  "11": null,
  "12": null,
  "13": null,
};

function parseZoneNumber(zone: string): string {
  const match = zone.match(/^(\d+)/);
  return match ? match[1] : "";
}

function parseDate(monthDay: string): Date {
  const year = new Date().getFullYear();
  return new Date(`${year}-${monthDay}T00:00:00`);
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

interface FrostResult {
  lastFrostDate: Date;
  firstFrostDate: Date;
  growingDays: number;
  frostFree: boolean;
  pastLastFrost: boolean;
  daysUntilNextEvent: number;
  nextEventLabel: string;
  growingDaysRemaining: number;
  seasonStatus: string;
}

function calculateFrost(zoneNum: string): FrostResult | null {
  const entry = FROST_DATES_BY_ZONE[zoneNum];

  if (entry === null) {
    // Frost-free zones
    return {
      lastFrostDate: new Date(),
      firstFrostDate: new Date(),
      growingDays: 365,
      frostFree: true,
      pastLastFrost: true,
      daysUntilNextEvent: 0,
      nextEventLabel: "",
      growingDaysRemaining: 365,
      seasonStatus: "Year-round growing season. No frost expected.",
    };
  }

  if (!entry) return null;

  const now = new Date();
  const year = now.getFullYear();

  const lastFrostDate = parseDate(entry.lastFrost);
  let firstFrostDate = parseDate(entry.firstFrost);

  // If first frost is before last frost (unlikely with these zones but safety check)
  if (firstFrostDate < lastFrostDate) {
    firstFrostDate = new Date(
      `${year + 1}-${entry.firstFrost}T00:00:00`
    );
  }

  const growingDays = daysBetween(lastFrostDate, firstFrostDate);
  const pastLastFrost = now >= lastFrostDate;

  let daysUntilNextEvent: number;
  let nextEventLabel: string;
  let growingDaysRemaining: number;
  let seasonStatus: string;

  if (now < lastFrostDate) {
    // Before last frost
    daysUntilNextEvent = daysBetween(now, lastFrostDate);
    nextEventLabel = "days until last spring frost";
    growingDaysRemaining = growingDays;
    seasonStatus = `Frost risk is still present. Your last expected spring frost is ${fmtDate(lastFrostDate)}. Wait ${daysUntilNextEvent} more days before planting tender crops.`;
  } else if (now < firstFrostDate) {
    // In the growing season
    daysUntilNextEvent = daysBetween(now, firstFrostDate);
    nextEventLabel = "days until first fall frost";
    growingDaysRemaining = daysUntilNextEvent;
    seasonStatus = `You are in the frost-free growing season. You have about ${daysUntilNextEvent} days of frost-free weather remaining before the first fall frost around ${fmtDate(firstFrostDate)}.`;
  } else {
    // After first frost
    const nextLastFrost = new Date(
      `${year + 1}-${entry.lastFrost}T00:00:00`
    );
    daysUntilNextEvent = daysBetween(now, nextLastFrost);
    nextEventLabel = "days until next spring frost-free date";
    growingDaysRemaining = 0;
    seasonStatus = `The growing season has ended. Your first fall frost has passed. The next frost-free date is around ${fmtDate(nextLastFrost)} (${daysUntilNextEvent} days away).`;
  }

  return {
    lastFrostDate,
    firstFrostDate,
    growingDays,
    frostFree: false,
    pastLastFrost,
    daysUntilNextEvent,
    nextEventLabel,
    growingDaysRemaining,
    seasonStatus,
  };
}

// Calendar bar months
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function CalendarBar({
  lastFrost,
  firstFrost,
  frostFree,
}: {
  lastFrost: Date;
  firstFrost: Date;
  frostFree: boolean;
}) {
  if (frostFree) {
    return (
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
          Frost-Free Window
        </h3>
        <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
          <div className="flex">
            {MONTHS.map((m) => (
              <div
                key={m}
                className="flex-1 border-r border-[var(--color-border)] last:border-r-0 bg-green-100 px-1 py-2 text-center text-[10px] font-medium text-green-800"
              >
                {m}
              </div>
            ))}
          </div>
          <div className="bg-green-50 px-3 py-2 text-center text-xs font-medium text-green-700">
            Year-round frost-free growing season
          </div>
        </div>
      </div>
    );
  }

  const year = new Date().getFullYear();
  const yearStart = new Date(`${year}-01-01T00:00:00`).getTime();
  const yearEnd = new Date(`${year}-12-31T00:00:00`).getTime();
  const totalDays = yearEnd - yearStart;

  const frostStartPct =
    ((lastFrost.getTime() - yearStart) / totalDays) * 100;
  const frostEndPct =
    ((firstFrost.getTime() - yearStart) / totalDays) * 100;

  const todayPct =
    ((new Date().getTime() - yearStart) / totalDays) * 100;

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
        Frost-Free Window
      </h3>
      <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
        {/* Month labels */}
        <div className="flex">
          {MONTHS.map((m) => (
            <div
              key={m}
              className="flex-1 border-r border-[var(--color-border)] last:border-r-0 bg-[var(--color-surface-alt)] px-1 py-2 text-center text-[10px] font-medium text-[var(--color-text-muted)]"
            >
              {m}
            </div>
          ))}
        </div>
        {/* Bar */}
        <div className="relative h-8 bg-blue-50">
          {/* Frost zone (before last frost) */}
          <div
            className="absolute inset-y-0 left-0 bg-blue-100"
            style={{ width: `${frostStartPct}%` }}
          />
          {/* Growing season (green) */}
          <div
            className="absolute inset-y-0 bg-green-200"
            style={{
              left: `${frostStartPct}%`,
              width: `${frostEndPct - frostStartPct}%`,
            }}
          />
          {/* Frost zone (after first frost) */}
          <div
            className="absolute inset-y-0 right-0 bg-blue-100"
            style={{ width: `${100 - frostEndPct}%` }}
          />
          {/* Today marker */}
          {todayPct > 0 && todayPct < 100 && (
            <div
              className="absolute inset-y-0 w-0.5 bg-red-500"
              style={{ left: `${todayPct}%` }}
              title="Today"
            />
          )}
          {/* Last frost marker */}
          <div
            className="absolute inset-y-0 w-0.5 bg-amber-500"
            style={{ left: `${frostStartPct}%` }}
            title="Last Spring Frost"
          />
          {/* First frost marker */}
          <div
            className="absolute inset-y-0 w-0.5 bg-amber-500"
            style={{ left: `${frostEndPct}%` }}
            title="First Fall Frost"
          />
        </div>
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 bg-[var(--color-surface)] px-3 py-2">
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-100" />
            Frost risk
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-200" />
            Frost-free growing
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
            <span className="inline-block h-2.5 w-0.5 bg-amber-500" />
            Frost dates
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
            <span className="inline-block h-2.5 w-0.5 bg-red-500" />
            Today
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FrostDatesPage() {
  const [zip, setZip] = useState("");
  const [zoneData, setZoneData] = useState<ZoneData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchZone = useCallback(async () => {
    if (!/^\d{5}$/.test(zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/zone?zip=${zip}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to look up zone.");
        return;
      }
      setZoneData(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [zip]);

  const frostResult = useMemo(() => {
    if (!zoneData) return null;
    const zoneNum = parseZoneNumber(zoneData.zone);
    return calculateFrost(zoneNum);
  }, [zoneData]);

  return (
    <CalculatorLayout
      title="Frost Date Lookup"
      description="Find your first and last frost dates by ZIP code. See your frost-free growing window, season status, and days until the next frost event."
      lastUpdated="March 2026"
      intro="Frost dates are the foundation of garden planning. Your last spring frost tells you when it is safe to transplant tender crops outdoors, and your first fall frost tells you when to harvest or protect cold-sensitive plants. Enter your ZIP code below to get frost date estimates based on your USDA hardiness zone and 30-year NOAA averages."
    >
      <CalculatorSchema
        name="Frost Date Lookup by ZIP Code"
        description="Look up your last spring frost and first fall frost dates by ZIP code. See frost-free growing days, season status, and a visual calendar."
        url="https://plantingcalc.com/frost-dates"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          {
            name: "Frost Date Lookup",
            url: "https://plantingcalc.com/frost-dates",
          },
        ]}
      />

      {/* ZIP Input */}
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex-1 w-full">
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Your ZIP Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={zip}
              onChange={(e) =>
                setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              onKeyDown={(e) => e.key === "Enter" && fetchZone()}
              placeholder="e.g. 90210"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-lg font-semibold text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/40 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              maxLength={5}
              inputMode="numeric"
            />
            <button
              onClick={fetchZone}
              disabled={loading || zip.length !== 5}
              className="whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
            >
              {loading ? "Looking up..." : "Find Frost Dates"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
          )}
        </div>
      </div>

      {/* Zone Info Card */}
      {zoneData && (
        <div className="mt-6 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="font-medium text-[var(--color-text-muted)]">
                Zone:
              </span>{" "}
              <span className="text-lg font-bold text-[var(--color-primary)]">
                {zoneData.zone}
              </span>
              <span className="ml-1 text-xs text-[var(--color-text-muted)]">
                ({zoneData.tempRange}&deg;F)
              </span>
            </div>
            <div>
              <span className="font-medium text-[var(--color-text-muted)]">
                ZIP:
              </span>{" "}
              <span className="font-bold text-[var(--color-text)]">
                {zoneData.zip}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Result Cards */}
      {frostResult && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            label="Last Spring Frost"
            value={
              frostResult.frostFree
                ? "None"
                : fmtDate(frostResult.lastFrostDate)
            }
            unit={frostResult.frostFree ? "frost-free zone" : ""}
            icon="🌸"
            highlight={frostResult.pastLastFrost && !frostResult.frostFree}
          />
          <ResultCard
            label="First Fall Frost"
            value={
              frostResult.frostFree
                ? "None"
                : fmtDate(frostResult.firstFrostDate)
            }
            unit={frostResult.frostFree ? "frost-free zone" : ""}
            icon="🍂"
          />
          <ResultCard
            label="Growing Season"
            value={String(frostResult.growingDays)}
            unit="frost-free days"
            icon="☀️"
            highlight
          />
          <ResultCard
            label={
              frostResult.frostFree
                ? "Season Status"
                : frostResult.nextEventLabel
                  ? "Next Frost Event"
                  : "Season Status"
            }
            value={
              frostResult.frostFree
                ? "365"
                : String(frostResult.daysUntilNextEvent)
            }
            unit={
              frostResult.frostFree
                ? "days year-round"
                : frostResult.nextEventLabel
            }
            icon="📆"
          />
        </div>
      )}

      {/* Season Status */}
      {frostResult && (
        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h3 className="mb-2 text-sm font-semibold text-[var(--color-text)]">
            Current Season Status
          </h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            {frostResult.seasonStatus}
          </p>
          {!frostResult.frostFree && frostResult.growingDaysRemaining > 0 && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span>Growing season progress</span>
                <span>
                  {frostResult.growingDays - frostResult.growingDaysRemaining} of{" "}
                  {frostResult.growingDays} days
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-surface-alt)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      ((frostResult.growingDays -
                        frostResult.growingDaysRemaining) /
                        frostResult.growingDays) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visual Calendar Bar */}
      {frostResult && !frostResult.frostFree && (
        <CalendarBar
          lastFrost={frostResult.lastFrostDate}
          firstFrost={frostResult.firstFrostDate}
          frostFree={frostResult.frostFree}
        />
      )}
      {frostResult && frostResult.frostFree && (
        <CalendarBar
          lastFrost={frostResult.lastFrostDate}
          firstFrost={frostResult.firstFrostDate}
          frostFree={frostResult.frostFree}
        />
      )}

      {frostResult && zoneData && (
        <ShareResults
          title={`Zone ${zoneData.zone} Frost Dates`}
          text={
            frostResult.frostFree
              ? `I'm in Zone ${zoneData.zone} (ZIP ${zoneData.zip}). Frost-free year-round with a 365-day growing season!`
              : `I'm in Zone ${zoneData.zone} (ZIP ${zoneData.zip}). Last frost: ${fmtDate(frostResult.lastFrostDate)}. First frost: ${fmtDate(frostResult.firstFrostDate)}. ${frostResult.growingDays} frost-free days.`
          }
        />
      )}

      <EmailCapture variant="banner" context="frost-dates" />
      <FAQSection questions={frostDatesFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          How This Calculator Works
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          We look up your USDA hardiness zone using the USDA Plant Hardiness
          Zone Map API (phzmapi.org) based on your ZIP code, then cross-reference
          it with 30-year average frost date normals from NOAA. Frost dates are
          estimates based on the 50% probability date, meaning there is a 50%
          chance of frost occurring after the last spring frost date and before
          the first fall frost date. Actual frost dates can vary by 2 to 3 weeks
          depending on local microclimates, elevation, and weather patterns.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          Tips for Working With Frost Dates
        </h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>
            Frost dates are averages, not guarantees. Add a 1 to 2 week safety
            buffer before transplanting warm-season crops like tomatoes and
            peppers.
          </li>
          <li>
            Microclimates matter. South-facing slopes, urban heat islands, and
            areas near buildings or water stay warmer longer than open fields at
            the same ZIP code.
          </li>
          <li>
            Use row covers or cold frames to extend your growing season by 2 to
            4 weeks on each end, effectively shifting your frost dates.
          </li>
          <li>
            Monitor overnight low temperatures as your frost dates approach.
            Frost can occur when air temperatures drop below 36 F, even if the
            forecast says 38 F, because ground-level temperatures run colder.
          </li>
          <li>
            Once you know your frost dates, use our{" "}
            <a
              href="/planting-dates"
              className="text-[var(--color-primary)] hover:underline"
            >
              planting date calculator
            </a>{" "}
            to plan when to start each vegetable.
          </li>
        </ul>
      </div>

      <RelatedCalculators currentPath="/frost-dates" />
    </CalculatorLayout>
  );
}
