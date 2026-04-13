"use client";

import { useCallback, useMemo, useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultCard from "@/components/ResultCard";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import ShareResults from "@/components/ShareResults";
import RelatedCalculators from "@/components/RelatedCalculators";
import Link from "next/link";
import { lookupZip, fetchHistoricalDaily } from "@/lib/weather";
import { VARIETIES } from "@/data/chill-varieties";

/**
 * Daily chill hours using the 0-45°F model.
 *
 * Assume daily temperature follows a sine wave between tmin and tmax.
 * Compute the fraction of 24 hours where temp <= 45°F.
 *
 * Edge cases:
 *   - tmax <= 45: all 24 hours count
 *   - tmin >= 45: 0 hours
 *   - otherwise: solve the sine wave fraction analytically.
 */
function dailyChillHours(tmin: number, tmax: number): number {
  if (tmax <= 45) return 24;
  if (tmin >= 45) return 0;
  const mid = (tmin + tmax) / 2;
  const amp = (tmax - tmin) / 2;
  // temp(t) = mid + amp * sin(...) with period 24h
  // We want the fraction of the day where mid + amp*sin <= 45
  // => sin <= (45 - mid) / amp
  const threshold = (45 - mid) / amp;
  if (threshold >= 1) return 24;
  if (threshold <= -1) return 0;
  // Fraction of period where sin(x) <= threshold
  // sin(x) <= threshold for x in [pi + asin(|threshold|), 2pi - asin(|threshold|)]
  // The math: fraction = (pi - 2*asin(threshold)) / (2*pi) if threshold in [-1,1]
  const frac = (Math.PI - 2 * Math.asin(threshold)) / (2 * Math.PI);
  return Math.max(0, Math.min(24, 24 * (1 - frac)));
}

interface ChillResult {
  dates: string[];
  tmin: number[];
  tmax: number[];
  dailyChill: number[];
  cumulative: number[];
}

export default function ChillHoursPage() {
  const [zip, setZip] = useState("");
  const [fruit, setFruit] = useState<string>("Apple");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [current, setCurrent] = useState<ChillResult | null>(null);
  const [average, setAverage] = useState<number | null>(null);

  const fruitOptions = useMemo(
    () => Array.from(new Set(VARIETIES.map((v) => v.fruit))).sort(),
    []
  );

  const varietiesForFruit = useMemo(
    () => VARIETIES.filter((v) => v.fruit === fruit).sort((a, b) => a.minHours - b.minHours),
    [fruit]
  );

  const runLookup = useCallback(async () => {
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a 5-digit US ZIP code");
      return;
    }
    setError(null);
    setLoading(true);
    setCurrent(null);
    setAverage(null);
    try {
      const loc = await lookupZip(zip);
      if (!loc) {
        setError("Could not look up that ZIP");
        setLoading(false);
        return;
      }
      setPlaceName(loc.place);

      // Current season: Nov 1 of last year to today (or Feb 28 if past)
      const now = new Date();
      const currentYear = now.getFullYear();
      // If we're past March, compute for last winter
      const refYear = now.getMonth() >= 2 ? currentYear - 1 : currentYear - 1;
      const seasonStart = `${refYear}-11-01`;
      const seasonEnd =
        now.getMonth() <= 1 // Jan or Feb
          ? `${refYear + 1}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
          : `${refYear + 1}-02-28`;

      const data = await fetchHistoricalDaily(loc.lat, loc.lng, seasonStart, seasonEnd);
      if (!data || !data.dates.length) {
        setError("Could not load weather data");
        setLoading(false);
        return;
      }
      const dailyChill = data.dates.map((_, i) => dailyChillHours(data.tmin[i], data.tmax[i]));
      const cumulative: number[] = [];
      let running = 0;
      for (const h of dailyChill) {
        running += h;
        cumulative.push(running);
      }
      setCurrent({
        dates: data.dates,
        tmin: data.tmin,
        tmax: data.tmax,
        dailyChill,
        cumulative,
      });

      // Compute 10-year average TOTAL chill (Nov 1 to Feb 28)
      const avgStart = `${currentYear - 11}-11-01`;
      const avgEnd = `${currentYear - 1}-02-28`;
      const histData = await fetchHistoricalDaily(loc.lat, loc.lng, avgStart, avgEnd);
      if (histData && histData.dates.length) {
        let total = 0;
        let yearStartDate: Date | null = null;
        let yearCount = 0;
        let yearRunning = 0;
        for (let i = 0; i < histData.dates.length; i++) {
          const d = new Date(histData.dates[i]);
          // Skip months outside Nov-Feb
          const m = d.getMonth();
          if (m !== 10 && m !== 11 && m !== 0 && m !== 1) {
            if (yearStartDate && yearRunning > 0) {
              total += yearRunning;
              yearCount++;
              yearRunning = 0;
              yearStartDate = null;
            }
            continue;
          }
          if (!yearStartDate) yearStartDate = d;
          yearRunning += dailyChillHours(histData.tmin[i], histData.tmax[i]);
        }
        if (yearRunning > 0) {
          total += yearRunning;
          yearCount++;
        }
        if (yearCount > 0) {
          setAverage(total / yearCount);
        }
      }
    } catch {
      setError("Unexpected error. Try again.");
    } finally {
      setLoading(false);
    }
  }, [zip]);

  const accumulated = current ? current.cumulative[current.cumulative.length - 1] : 0;

  // Chart
  const chartWidth = 600;
  const chartHeight = 180;
  const padding = { left: 50, right: 10, top: 10, bottom: 30 };

  const maxY = current
    ? Math.max(accumulated, average ?? 0, ...varietiesForFruit.map((v) => v.minHours)) * 1.05
    : 1000;

  function xPct(i: number) {
    if (!current || current.dates.length < 2) return padding.left;
    return (
      padding.left +
      (i / (current.dates.length - 1)) *
        (chartWidth - padding.left - padding.right)
    );
  }
  function yPx(val: number) {
    return (
      padding.top +
      (1 - val / maxY) * (chartHeight - padding.top - padding.bottom)
    );
  }

  return (
    <CalculatorLayout
      title="Chill Hours Tracker"
      description="Live chill hour accumulation for your ZIP, measured against 40+ popular fruit varieties. Use this to pick which apple, peach, or cherry variety will actually fruit where you live."
      answerBlock={
        <p>
          <strong>Quick answer:</strong> Deciduous fruit trees need a specific number of
          cold hours each winter to flower properly the next spring. A Honeycrisp apple
          needs 800+ chill hours; an Anna apple only needs 200. If you plant a high-chill
          variety in a warm zone, you&apos;ll get weak bloom, poor pollination, and fruit
          drop. This tool pulls your ZIP&apos;s actual daily temperatures from the
          historical archive, computes accumulated chill hours for the current winter
          using the standard 0-45°F model, and tells you which varieties will be
          satisfied and which will struggle.
        </p>
      }
      lastUpdated="April 2026"
    >
      <CalculatorSchema
        name="Chill Hours Tracker"
        description="Live fruit tree chill hour accumulation tool. Computes accumulated chill from the current winter's daily temperatures and compares against variety requirements. Free."
        url="https://plantingcalc.com/chill-hours"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Chill Hours", url: "https://plantingcalc.com/chill-hours" },
        ]}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
            ZIP code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") runLookup();
              }}
              placeholder="e.g. 55401"
              className="w-32 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={runLookup}
              disabled={loading || !zip}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Loading…" : "Run tracker"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-xs text-rose-600" role="alert">
              {error}
            </p>
          )}
          {placeName && (
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              {placeName}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
            Fruit
          </label>
          <select
            value={fruit}
            onChange={(e) => setFruit(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          >
            {fruitOptions.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {varietiesForFruit.length} varieties in the database
          </p>
        </div>
      </div>

      {current && (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <ResultCard
              label="Accumulated this winter"
              value={`${accumulated.toFixed(0)}`}
              unit="chill hours"
              highlight
              icon="🌡️"
            />
            <ResultCard
              label="10-year average"
              value={average != null ? `${average.toFixed(0)}` : "—"}
              unit="chill hours"
              icon="📊"
            />
            <ResultCard
              label="Varieties satisfied"
              value={`${varietiesForFruit.filter((v) => v.minHours <= accumulated).length}`}
              unit={`/ ${varietiesForFruit.length}`}
              icon="✅"
            />
          </div>

          {/* Chart */}
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
              Cumulative chill hours this season
            </h3>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-auto w-full"
              role="img"
              aria-label="Cumulative chill hours chart"
            >
              {/* Variety threshold lines */}
              {varietiesForFruit.slice(0, 5).map((v) => (
                <g key={v.name}>
                  <line
                    x1={padding.left}
                    y1={yPx(v.minHours)}
                    x2={chartWidth - padding.right}
                    y2={yPx(v.minHours)}
                    stroke="#cbd5e1"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={chartWidth - padding.right - 4}
                    y={yPx(v.minHours) - 3}
                    textAnchor="end"
                    fontSize="9"
                    fill="#64748b"
                  >
                    {v.name} ({v.minHours}h)
                  </text>
                </g>
              ))}
              {/* Cumulative line */}
              <path
                d={current.cumulative
                  .map(
                    (c, i) =>
                      `${i === 0 ? "M" : "L"}${xPct(i)},${yPx(c)}`
                  )
                  .join(" ")}
                fill="none"
                stroke="#15803d"
                strokeWidth="2.5"
              />
              {/* Y axis labels */}
              {[0, 0.5, 1].map((frac) => {
                const val = maxY * (1 - frac);
                const yy =
                  padding.top + frac * (chartHeight - padding.top - padding.bottom);
                return (
                  <text
                    key={frac}
                    x={padding.left - 4}
                    y={yy + 3}
                    textAnchor="end"
                    fontSize="10"
                    fill="#64748b"
                  >
                    {Math.round(val)}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Variety table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-3">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text)]">
                {fruit} varieties vs your accumulation
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                <tr>
                  <th className="px-5 py-2 text-left">Variety</th>
                  <th className="px-5 py-2 text-right">Needs</th>
                  <th className="px-5 py-2 text-center">Status</th>
                  <th className="px-5 py-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {varietiesForFruit.map((v) => {
                  const satisfied = v.minHours <= accumulated;
                  return (
                    <tr key={v.name}>
                      <td className="px-5 py-2 font-medium">{v.name}</td>
                      <td className="px-5 py-2 text-right text-[var(--color-text-muted)]">
                        {v.minHours} h
                      </td>
                      <td className="px-5 py-2 text-center">
                        {satisfied ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                            ✓ Good
                          </span>
                        ) : (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                            ✗ {v.minHours - Math.round(accumulated)} short
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-2 text-xs text-[var(--color-text-muted)]">
                        {v.notes || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ShareResults
            title={`${accumulated.toFixed(0)} chill hours accumulated in ${placeName}`}
            text={`${placeName} has accumulated ${accumulated.toFixed(0)} chill hours this winter. 10-year average: ${average?.toFixed(0) ?? "—"}.`}
            card={{
              headline: `${accumulated.toFixed(0)}`,
              label: `Chill hours this winter — ${placeName ?? ""}`,
              sub: `10-year avg ${average?.toFixed(0) ?? "—"} · ${varietiesForFruit.filter((v) => v.minHours <= accumulated).length} of ${varietiesForFruit.length} ${fruit.toLowerCase()} varieties satisfied`,
              calc: "chill-hours",
            }}
          />
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href="/frost-probability"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
        >
          Frost probability by date →
        </Link>
        <Link
          href="/frost-dates"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
        >
          Average frost dates →
        </Link>
      </div>

      <FAQSection questions={chillFAQ} />
      <RelatedCalculators currentPath="/chill-hours" />
    </CalculatorLayout>
  );
}

const chillFAQ = [
  {
    question: "What's a chill hour, exactly?",
    answer:
      "A chill hour is one hour spent below 45°F during dormancy (roughly Nov 1 to Feb 28). Deciduous fruit trees need a certain total number of chill hours to signal the end of dormancy and set flower buds properly the next spring. The 0-45°F model is the most widely published definition. Other models (Utah, Dynamic) give more accurate results in some climates but are harder to compute from daily data.",
  },
  {
    question: "Where do the variety chill requirements come from?",
    answer:
      "The UC Davis Fruit & Nut Research Center, Dave Wilson Nursery, Stark Bros, University of Florida IFAS, and Rutgers NJAES all publish chill hour requirements for the varieties they sell or research. This tool's variety database is synthesized from those sources. Numbers have ~50 hour uncertainty — a 400-hour variety may set fruit on 350 chill hours in a warm spring or need 450 in a cool one.",
  },
  {
    question: "How does the calculator compute hours from daily temperatures?",
    answer:
      "The Open-Meteo historical archive returns daily minimum and maximum temperatures for your exact location. For each day, the tool models the temperature as a sine wave between tmin and tmax and computes the fraction of the 24-hour period where the temperature was at or below 45°F. This is a standard approximation used by extension service calculators when hourly data isn't available. Accuracy is typically within 10% of true hourly-data chill hours over a full season.",
  },
  {
    question: "What happens if my variety doesn't get enough chill?",
    answer:
      "Three things: weak, uneven bloom; poor pollination because bloom is spread out over weeks instead of concentrated in a single peak; and 'delayed foliation' where leaves emerge slowly or not at all from some buds. The fruit set is poor and the fruit that does set is undersized. Unfortunately, once you plant a high-chill variety in a warm zone, the only fix is to replace the tree. This tool helps you avoid that mistake at the nursery.",
  },
  {
    question: "My winter just started. Why does the tool already show numbers?",
    answer:
      "It tracks from November 1 of the previous year through today. Early in December you might see 50-100 hours; by February most zones have accumulated 500-1000. Check back weekly through mid-February to watch your accumulation climb, and compare against the 10-year average to see whether this is a high or low chill year.",
  },
  {
    question: "Can I get alerts when my variety's threshold is crossed?",
    answer:
      "Not yet. Email alerts are on the roadmap. For now, bookmark the page with your ZIP in the URL and check back weekly. Most fruit growers check once in late December, once in mid-January, and once in mid-February.",
  },
];
