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
import AmazonPicks from "@/components/AmazonPicks";
import { lookupZip, fetchHistoricalDaily } from "@/lib/weather";

const STORAGE_KEY = "pc_zip_context_v1";

type Season = "spring" | "fall";

interface FallResult {
  year: number;
  firstFrostDate: string | null; // null = no 32°F night from Jul 1 to Dec 31 that year
  tempF: number | null;
}

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
  // Jul-Dec visitors are asking about the first fall frost, Jan-Jun about the last spring one.
  const [season, setSeason] = useState<Season>(() => (new Date().getMonth() >= 6 ? "fall" : "spring"));
  const [checkMonth, setCheckMonth] = useState(() => (new Date().getMonth() >= 6 ? 11 : 5));
  const [checkDay, setCheckDay] = useState(1);
  const [fallResults, setFallResults] = useState<FallResult[]>([]);
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
    setFallResults([]);
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

      // Pull Feb 1 of the first year through Dec 31 of last year: 30 springs and 30 falls
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 30;
      const endYear = currentYear - 1;
      const startDate = `${startYear}-02-01`;
      const endDate = `${endYear}-12-31`;
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
        const monthDay = d.slice(5);
        // The range runs Feb of the first year to Jun of the last, so it includes
        // every fall and winter in between; only Feb-Jun counts as spring.
        if (tmin <= 32 && monthDay >= "02-01" && monthDay <= "06-30") {
          const year = Number(d.slice(0, 4));
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

      // For each year, the FIRST fall frost (earliest date from Jul 1 where tmin <= 32°F).
      // Every year is kept: a year with no fall frost counts as "no frost", not as missing.
      const fall: Record<number, FallResult> = {};
      for (let y = startYear; y <= endYear; y++) fall[y] = { year: y, firstFrostDate: null, tempF: null };
      for (let i = 0; i < data.dates.length; i++) {
        const d = data.dates[i];
        const tmin = data.tmin[i];
        if (tmin === null || tmin === undefined || !(tmin <= 32) || d.slice(5) < "07-01") continue;
        const f = fall[Number(d.slice(0, 4))];
        if (f && f.firstFrostDate === null) {
          f.firstFrostDate = d;
          f.tempF = tmin;
        }
      }
      setFallResults(Object.values(fall).sort((a, b) => a.year - b.year));
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

  // Fall: share of years whose first frost came on or before the check date
  const fallFrostBy = fallResults.filter(
    (y) => y.firstFrostDate !== null && isOnOrAfter(checkDateMD, parseMonthDay(y.firstFrostDate))
  );
  const fallProbability =
    fallResults.length > 0 ? (fallFrostBy.length / fallResults.length) * 100 : 0;
  // Earliest first, no-frost years last: fallPercentile(10) is the early (risky) date.
  const fallSorted = fallResults
    .map((y) => (y.firstFrostDate ? y.firstFrostDate.slice(5) : null))
    .sort((a, b) => (a === null ? 1 : b === null ? -1 : a < b ? -1 : a > b ? 1 : 0));
  const fallPercentile = (p: number): string | null => {
    if (!fallSorted.length) return null;
    const idx = Math.max(0, Math.ceil((p / 100) * fallSorted.length) - 1);
    const md = fallSorted[idx];
    if (md === null) return "No frost";
    const [m, d] = md.split("-").map(Number);
    return monthDayLabel(m, d);
  };
  const checkLabel = monthDayLabel(checkMonth, checkDay);
  const switchSeason = (next: Season) => {
    setSeason(next);
    setCheckMonth(next === "fall" ? 11 : 5);
    setCheckDay(1);
  };

  return (
    <CalculatorLayout
      title="Frost Probability Calculator"
      description="Real frost probability for any date at your ZIP, computed from 30 years of daily temperature records. Beats 'average last frost date': shows you the distribution."
      answerBlock={
        <p>
          <strong>Quick answer:</strong> The &ldquo;average last frost date&rdquo; you see
          in garden books is just the 50th percentile. Half the time it freezes later.
          This tool pulls 30 years of daily minimum temperatures for your location from
          NOAA's Regional Climate Centers (the PRISM daily grid, about 4 km), finds the real
          last-frost date for each year, and gives you the probability that it freezes on
          or after any date you pick. Use the 90% column as the &ldquo;safe&rdquo; date
          for tender crops like tomatoes. Switch to Fall for the other end of the season:
          the chance that the first fall frost has come by a date you pick.
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
          placeholder="Enter your ZIP code"
        />
        {error && (
          <p className="mt-2 text-xs text-[var(--color-frost-ink)]" role="alert">
            {error}
          </p>
        )}
        {loading && (
          <p className="mt-2 text-xs text-[var(--color-text-faint)]" role="status">Loading 30 years of daily records from NOAA climate centers. This usually takes 5 to 15 seconds.</p>
        )}
        {placeName && !loading && (
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {placeName} · {season === "fall" ? fallResults.length : yearResults.length} years analyzed
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-1">
        <div>
          <div className="mb-4 inline-flex rounded-lg border border-[var(--color-border)] p-1 text-sm" role="group" aria-label="Season">
            {(["spring", "fall"] as Season[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => switchSeason(s)}
                aria-pressed={season === s}
                className={`rounded-md px-4 py-1.5 font-medium transition-colors ${
                  season === s
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {s === "spring" ? "Spring: last frost" : "Fall: first frost"}
              </button>
            ))}
          </div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            Check date
          </label>
          <div className="flex gap-2">
            <select
              value={checkMonth}
              onChange={(e) => setCheckMonth(Number(e.target.value))}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            >
              {(season === "fall" ? ["Aug", "Sep", "Oct", "Nov", "Dec"] : ["Feb", "Mar", "Apr", "May", "Jun"]).map((m, i) => (
                <option key={m} value={i + (season === "fall" ? 8 : 2)}>
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
            {season === "fall"
              ? "How often has the first 32°F frost come by this date?"
              : "How often does a 32°F frost happen on or after this date?"}
          </p>
        </div>
      </div>

      {season === "fall" && fallResults.length > 0 && (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <ResultCard
              label={`First frost by ${checkLabel}`}
              value={`${fallProbability.toFixed(0)}%`}
              unit={`${fallFrostBy.length} of ${fallResults.length} yrs`}
              highlight
              icon="❄️"
            />
            <ResultCard
              label="50% (median first frost)"
              value={fallPercentile(50) ?? "n/a"}
              unit="typical date"
              icon="📊"
            />
            <ResultCard
              label="10% early date"
              value={fallPercentile(10) ?? "n/a"}
              unit="start covering"
              icon="🛡️"
            />
          </div>

          {/* Frost cloth card: only when a first frost by the chosen date has happened here */}
          {fallFrostBy.length > 0 && (
            <AmazonPicks
              heading="Have cover ready before the first fall frost"
              intro={`In ${fallFrostBy.length} of the last ${fallResults.length} years this ZIP had its first 32°F night by ${checkLabel}. To keep tomatoes, peppers and beans going through the first cold nights, keep frost cloth on hand: it is light, cuts to any size, and lets air, light and moisture through to the plants.`}
              picks={[
                { asin: "B0CH86PT5B", role: "Frost cloth", name: "KLEWEE Plant Covers Freeze Protection, 10 x 50 ft", note: "A 10 x 50 ft roll of 1.5 oz/yd² spun polypropylene. Cut it to the size of your beds, and use a doubled or tripled layer on the coldest nights." },
              ]}
            />
          )}

          {fallResults.every((y) => y.firstFrostDate === null) ? (
            <p className="mt-6 rounded-xl border border-[var(--color-border)] bg-white px-5 py-4 text-sm text-[var(--color-text-muted)]">
              No night at or below 32°F from July through December in any of the last {fallResults.length} years here.
            </p>
          ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white">
            <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--color-text)]">
                First fall frost probability
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                <tr>
                  <th className="px-5 py-2 text-left">Chance first frost has come by</th>
                  <th className="px-5 py-2 text-right">Date</th>
                  <th className="px-5 py-2 text-left">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {[
                  [10, "Early frost, about 1 year in 10"],
                  [30, "Cover tender crops on cold nights"],
                  [50, "Median first frost date"],
                  [70, "Most years have frozen by now"],
                  [90, "Frost has come in 9 of 10 years"],
                ].map(([p, note]) => (
                  <tr key={p}>
                    <td className={`px-5 py-2${p === 50 ? " bg-[var(--color-primary)]/5" : ""}`}>{p}%</td>
                    <td className={`whitespace-nowrap px-5 py-2 text-right font-semibold${p === 50 ? " bg-[var(--color-primary)]/5" : ""}`}>
                      {fallPercentile(p as number)}
                    </td>
                    <td className={`px-5 py-2 text-[var(--color-text-muted)]${p === 50 ? " bg-[var(--color-primary)]/5" : ""}`}>
                      {note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-[var(--color-primary)]">
              Show all {fallResults.length} individual years
            </summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-4 text-sm">
              {fallResults.map((y) => (
                <div
                  key={y.year}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
                >
                  <div className="font-semibold text-[var(--color-text)]">{y.year}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {y.firstFrostDate
                      ? `${monthDayLabel(...parseMonthDay(y.firstFrostDate))} · ${(y.tempF ?? 0).toFixed(0)}°F`
                      : "No frost"}
                  </div>
                </div>
              ))}
            </div>
          </details>

          <ShareResults
            title={`${fallProbability.toFixed(0)}% chance of the first frost by ${checkLabel} in ${placeName}`}
            text={`In ${fallResults.length} years of history, the first fall frost came by ${checkLabel} in ${fallFrostBy.length} of them.`}
            card={{
              headline: `${fallProbability.toFixed(0)}%`,
              label: `First frost by ${checkLabel}`,
              sub: `${placeName ?? ""} · ${fallResults.length}-year climatology`,
              calc: "frost-probability",
            }}
          />
        </>
      )}

      {season === "spring" && yearResults.length > 0 && (
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
              value={percentile(50) ?? "n/a"}
              unit="typical date"
              icon="📊"
            />
            <ResultCard
              label="90% safe date"
              value={percentile(10) ?? "n/a"}
              unit="tomatoes OK"
              icon="🛡️"
            />
          </div>

          {/* Frost cloth card: under the answer, only when a frost on or after the chosen date has happened here */}
          {frostOnOrAfter.length > 0 && (
            <AmazonPicks
              heading="Have cover ready if you plant out on this date"
              intro={`In ${frostOnOrAfter.length} of the last ${yearResults.length} years this ZIP had a 32°F night on or after ${monthDayLabel(checkMonth, checkDay)}. If you plant tender crops before the 90% safe date, keep frost cloth on hand: it is light, cuts to any size, and lets air, light and moisture through to the plants.`}
              picks={[
                { asin: "B0CH86PT5B", role: "Frost cloth", name: "KLEWEE Plant Covers Freeze Protection, 10 x 50 ft", note: "A 10 x 50 ft roll of 1.5 oz/yd² spun polypropylene. Cut it to the size of your beds, and use a doubled or tripled layer on the coldest nights." },
              ]}
            />
          )}

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
      "NOAA's Regional Climate Centers, through their ACIS data service. We read the PRISM daily temperature grid, which covers the lower 48 states at about 4 km resolution from 1981 onward and is built from thousands of weather stations. The 32°F threshold is the standard light-freeze definition used by NOAA NCEI and cooperative extension services.",
  },
  {
    question: "Does it cover the first fall frost?",
    answer:
      "Yes. Switch to Fall and the tool finds, for each of the last 30 years, the first night at or below 32°F from July 1 onward, then gives the chance that the first frost has come by the date you pick. Years with no fall frost at all count as no frost, so in warm ZIPs the chance stays low. The 10% date is the early end: from then on, cover tender crops on cold nights.",
  },
  {
    question: "Does this account for microclimate?",
    answer:
      "Only indirectly. PRISM is a 4 km gridded product, so it captures regional climate but not your specific south-facing brick wall or frost pocket. A south-facing slope with full sun and good drainage typically beats the ZIP average by 1-2 weeks on the last frost side. Urban heat islands can add 1-3 weeks of extension. Use the tool's number as a floor, then adjust for your site conditions.",
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
