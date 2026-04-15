"use client";

import { useCallback, useEffect, useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import ResultCard from "@/components/ResultCard";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import ShareResults from "@/components/ShareResults";
import RelatedCalculators from "@/components/RelatedCalculators";
import ZipRingDecoder, { type DecodedZip } from "@/components/ZipRingDecoder";
import Link from "next/link";
import { lookupZip, fetchHistoricalDaily } from "@/lib/weather";

const STORAGE_KEY = "pc_zip_context_v1";

interface YearResult {
  year: number;
  lastFrostMonthDay: string; // MM-DD
  lastFrostDate: string;
  tempF: number;
}

function parseMonthDay(s: string): [number, number] {
  const [y, m, d] = s.split("-").map(Number);
  return [m, d];
}

function monthDayLabel(mm: number, dd: number): string {
  const date = new Date(2024, mm - 1, dd);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isOnOrAfter(
  [m1, d1]: [number, number],
  [m2, d2]: [number, number]
): boolean {
  // Returns true if date 1 is on or after date 2
  if (m1 > m2) return true;
  if (m1 < m2) return false;
  return d1 >= d2;
}

export default function FrostProbabilityPage() {
  const [zip, setZip] = useState("");
  const [checkMonth, setCheckMonth] = useState(5);
  const [checkDay, setCheckDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [yearResults, setYearResults] = useState<YearResult[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { zip?: string };
        if (saved.zip && /^\d{5}$/.test(saved.zip)) setZip(saved.zip);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const runCalc = useCallback(async (decoded: DecodedZip) => {
    setError(null);
    setLoading(true);
    setYearResults([]);
    try {
      const loc = await lookupZip(decoded.zip);
      if (!loc) {
        setError("Could not look up that ZIP code");
        setLoading(false);
        return;
      }
      setPlaceName(loc.place);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            zip: decoded.zip,
            state: decoded.state || loc.stateAbbr,
            zone: decoded.zone,
            lat: loc.lat,
            lng: loc.lng,
            place: loc.place,
          })
        );
        window.dispatchEvent(new CustomEvent("pc:zip-updated"));
      } catch {
        /* ignore */
      }

      // Pull Feb 1 through Jun 30 for 30 historical years
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 30;
      const endYear = currentYear - 1;
      const startDate = `${startYear}-02-01`;
      const endDate = `${endYear}-06-30`;
      const data = await fetchHistoricalDaily(loc.lat, loc.lng, startDate, endDate);
      if (!data || !data.dates.length) {
        setError("Could not load historical weather data");
        setLoading(false);
        return;
      }

      // For each year, find the LAST spring frost (last date Feb-Jun where tmin <= 32°F)
      const byYear: Record<number, YearResult> = {};
      for (let i = 0; i < data.dates.length; i++) {
        const d = data.dates[i];
        const tmin = data.tmin[i];
        if (tmin <= 32) {
          const year = Number(d.slice(0, 4));
          const monthDay = d.slice(5);
          const existing = byYear[year];
          if (!existing || monthDay > existing.lastFrostMonthDay) {
            byYear[year] = {
              year,
              lastFrostMonthDay: monthDay,
              lastFrostDate: d,
              tempF: tmin,
            };
          }
        }
      }

      const results = Object.values(byYear).sort((a, b) => a.year - b.year);
      setYearResults(results);
    } catch {
      setError("Unexpected error. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute frost probability on or after check date
  const checkDateMD: [number, number] = [checkMonth, checkDay];
  const frostOnOrAfter = yearResults.filter((y) =>
    isOnOrAfter(parseMonthDay(y.lastFrostDate), checkDateMD)
  );
  const probability =
    yearResults.length > 0
      ? (frostOnOrAfter.length / yearResults.length) * 100
      : 0;

  // Compute common exceedance dates (10%, 30%, 50%, 70%, 90%)
  const sortedMonthDays = [...yearResults]
    .map((y) => y.lastFrostMonthDay)
    .sort()
    .reverse(); // latest first
  const percentile = (p: number): string | null => {
    if (!sortedMonthDays.length) return null;
    const idx = Math.floor((p / 100) * (sortedMonthDays.length - 1));
    const md = sortedMonthDays[idx];
    const [m, d] = md.split("-").map(Number);
    return monthDayLabel(m, d);
  };

  return (
    <CalculatorLayout
      title="Frost Probability Calculator"
      description="Real frost probability for any date at your ZIP, computed from 30 years of daily temperature records. Beats 'average last frost date': shows you the distribution."
      answerBlock={
        <p>
          <strong>Quick answer:</strong> The &ldquo;average last frost date&rdquo; you see
          in garden books is just the 50th percentile. Half the time it freezes later.
          This tool pulls 30 years of daily minimum temperatures from the ERA5 historical
          reanalysis (the same dataset NOAA uses for climatology tables), finds the real
          last-frost date for each year, and gives you the probability that it freezes on
          or after any date you pick. Use the 90% column as the &ldquo;safe&rdquo; date
          for tender crops like tomatoes.
        </p>
      }
      lastUpdated="April 2026"
    >
      <CalculatorSchema
        name="Frost Probability Calculator"
        description="NOAA-style frost exceedance probability tool. Computes real last-frost distribution for any US ZIP from 30 years of daily historical temperatures. Free."
        url="https://plantingcalc.com/frost-probability"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          {
            name: "Frost Probability",
            url: "https://plantingcalc.com/frost-probability",
          },
        ]}
      />

      {/* ZIP Ring Decoder */}
      <div className="mb-6">
        <ZipRingDecoder
          value={zip}
          onChange={setZip}
          onResolved={runCalc}
          placeholder="Enter your ZIP to pull 30 years of history"
        />
        {error && (
          <p className="mt-2 text-xs text-[var(--color-frost-ink)]" role="alert">
            {error}
          </p>
        )}
        {loading && (
          <p className="mt-2 text-xs text-[var(--color-text-faint)]">Loading 30 years of daily records…</p>
        )}
        {placeName && !loading && (
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {placeName} · {yearResults.length} years analyzed
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-1">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            Check date
          </label>
          <div className="flex gap-2">
            <select
              value={checkMonth}
              onChange={(e) => setCheckMonth(Number(e.target.value))}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            >
              {["Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
                <option key={m} value={i + 2}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={checkDay}
              onChange={(e) => setCheckDay(Number(e.target.value))}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            How often does a 32°F frost happen on or after this date?
          </p>
        </div>
      </div>

      {yearResults.length > 0 && (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <ResultCard
              label={`Frost on/after ${monthDayLabel(checkMonth, checkDay)}`}
              value={`${probability.toFixed(0)}%`}
              unit={`${frostOnOrAfter.length} of ${yearResults.length} yrs`}
              highlight
              icon="❄️"
            />
            <ResultCard
              label="50% (mean last frost)"
              value={percentile(50) ?? ", "}
              unit="typical date"
              icon="📊"
            />
            <ResultCard
              label="90% safe date"
              value={percentile(90) ?? ", "}
              unit="tomatoes OK"
              icon="🛡️"
            />
          </div>

          {/* Exceedance table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text)]">
                Exceedance table. Last spring frost probability
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                <tr>
                  <th className="px-5 py-2 text-left">Probability of frost on/after</th>
                  <th className="px-5 py-2 text-right">Date</th>
                  <th className="px-5 py-2 text-left">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                <tr>
                  <td className="px-5 py-2">90%</td>
                  <td className="px-5 py-2 text-right font-semibold">{percentile(90)}</td>
                  <td className="px-5 py-2 text-[var(--color-text-muted)]">
                    Very likely before this date
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-2">70%</td>
                  <td className="px-5 py-2 text-right font-semibold">{percentile(70)}</td>
                  <td className="px-5 py-2 text-[var(--color-text-muted)]">
                    Likely, wait for tomatoes
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-2 bg-[var(--color-primary)]/5">50%</td>
                  <td className="px-5 py-2 text-right font-semibold bg-[var(--color-primary)]/5">
                    {percentile(50)}
                  </td>
                  <td className="px-5 py-2 text-[var(--color-text-muted)] bg-[var(--color-primary)]/5">
                    Mean last frost date
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-2">30%</td>
                  <td className="px-5 py-2 text-right font-semibold">{percentile(30)}</td>
                  <td className="px-5 py-2 text-[var(--color-text-muted)]">
                    Mostly safe for hardy crops
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-2">10%</td>
                  <td className="px-5 py-2 text-right font-semibold">{percentile(10)}</td>
                  <td className="px-5 py-2 text-[var(--color-text-muted)]">
                    Safe date for tender crops
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Raw year list */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-[var(--color-primary)]">
              Show all {yearResults.length} individual years
            </summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-4 text-sm">
              {yearResults.map((y) => (
                <div
                  key={y.year}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
                >
                  <div className="font-semibold text-[var(--color-text)]">{y.year}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {new Date(y.lastFrostDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    · {y.tempF.toFixed(0)}°F
                  </div>
                </div>
              ))}
            </div>
          </details>

          <ShareResults
            title={`${probability.toFixed(0)}% frost probability on ${monthDayLabel(checkMonth, checkDay)} in ${placeName}`}
            text={`In ${yearResults.length} years of history, it froze on or after ${monthDayLabel(checkMonth, checkDay)} in ${frostOnOrAfter.length} of them.`}
            card={{
              headline: `${probability.toFixed(0)}%`,
              label: `Frost probability on/after ${monthDayLabel(checkMonth, checkDay)}`,
              sub: `${placeName ?? ""} · ${yearResults.length}-year climatology`,
              calc: "frost-probability",
            }}
          />
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href="/frost-alert"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
        >
          Frost alert for tonight →
        </Link>
        <Link
          href="/planting-dates"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
        >
          Planting dates by ZIP →
        </Link>
        <Link
          href="/seed-start-calendar"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
        >
          Seed start calendar →
        </Link>
      </div>

      <FAQSection questions={frostProbFAQ} />
      <RelatedCalculators currentPath="/frost-probability" />
    </CalculatorLayout>
  );
}

const frostProbFAQ = [
  {
    question: "How is this different from the average last frost date?",
    answer:
      "The 'average last frost date' is just the 50th percentile: it means half the years will freeze later. This tool shows the full distribution. For tender crops, you really want to plant on the 10% date (90% of the time it won't freeze after that), not the average. Garden guides that only publish the average are technically correct but practically misleading.",
  },
  {
    question: "Where does the 30 years of data come from?",
    answer:
      "Open-Meteo's historical archive pulls from the ECMWF ERA5 reanalysis. The same global dataset NOAA climatology tables are built from. It covers every location on Earth at ~9 km resolution since 1940. The 32°F threshold is the standard light-freeze definition used by NOAA NCEI and cooperative extension services.",
  },
  {
    question: "Why only February through June?",
    answer:
      "This tool looks specifically at the last spring frost for planting-out decisions. The fall first-frost question is symmetrically important but belongs in a separate tool, so we fetch a narrower window and keep it fast. A fall frost probability tool is on the roadmap.",
  },
  {
    question: "Does this account for microclimate?",
    answer:
      "Only indirectly. ERA5 is a 9km gridded product, so it captures regional climate but not your specific south-facing brick wall or frost pocket. A south-facing slope with full sun and good drainage typically beats the ZIP average by 1-2 weeks on the last frost side. Urban heat islands can add 1-3 weeks of extension. Use the tool's number as a floor, then adjust for your site conditions.",
  },
  {
    question: "My zone didn't change after 2023. Is the historical data still relevant?",
    answer:
      "The 2023 USDA zone map update pushed about half the country a half-zone warmer because the climate normals shifted. This tool always uses the most recent 30 years, so the data automatically reflects the warming trend without you having to adjust. That's actually an advantage over published NCEI 1991-2020 tables, which are already three years stale.",
  },
  {
    question: "The tool said 90% safe is May 15, but I've seen frost on May 20. Is it wrong?",
    answer:
      "Not wrong, just stating probability. 90% safe means roughly 3 out of every 30 years WILL frost after that date. If you were gardening during one of those three years, you saw the tail event. That's why 'safe' dates for tender crops should be the 90% or even 95% percentile, and why you should keep frost blankets handy until the 99% date. The calculator is honest about how often the tail hits.",
  },
];
