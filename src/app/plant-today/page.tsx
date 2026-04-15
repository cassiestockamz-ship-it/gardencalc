"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CalculatorLayout from "@/components/CalculatorLayout";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import ShareResults from "@/components/ShareResults";
import RelatedCalculators from "@/components/RelatedCalculators";
import ZipRingDecoder, { type DecodedZip } from "@/components/ZipRingDecoder";
import { FROST_CROPS, type FrostCrop } from "@/data/frost-tolerance";
import { lookupZip, fetchForecast14, type DailyForecast } from "@/lib/weather";

const MIN_SOIL_F: Record<FrostCrop["tier"], number> = {
  "very-hardy": 35,
  hardy: 40,
  "semi-hardy": 45,
  tender: 55,
  "very-tender": 65,
};

type Verdict = "go" | "wait" | "stop";

const STORAGE_KEY = "pc_zip_context_v1";

function estimateSoilTemp(forecast: DailyForecast[]): number {
  const days = forecast.slice(0, 7);
  if (!days.length) return 50;
  return (
    days.reduce((s, d) => s + (d.tempMinF + d.tempMaxF) / 2, 0) / days.length
  );
}

export default function PlantTodayPage() {
  const [cropName, setCropName] = useState<string>("Tomatoes");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);

  const crop = useMemo(
    () => FROST_CROPS.find((c) => c.name === cropName) ?? FROST_CROPS[0],
    [cropName]
  );

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

  const runCheck = useCallback(async (decoded: DecodedZip) => {
    setError(null);
    setLoading(true);
    setForecast([]);
    try {
      const loc = await lookupZip(decoded.zip);
      if (!loc) {
        setError("Could not look up that ZIP code.");
        return;
      }
      setPlaceName(loc.place);
      const f = await fetchForecast14(loc.lat, loc.lng);
      if (!f) {
        setError("Could not load forecast.");
        return;
      }
      setForecast(f);
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
    } catch {
      setError("Unexpected error. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const analysis = useMemo(() => {
    if (!forecast.length) return null;
    const soilF = estimateSoilTemp(forecast);
    const minSoil = MIN_SOIL_F[crop.tier];
    const coldEvents = forecast.slice(0, 7).filter((d) => d.tempMinF <= 32);
    const nearFreezingEvents = forecast
      .slice(0, 7)
      .filter((d) => d.tempMinF <= crop.minTempF + 2);

    let verdict: Verdict;
    const reasons: string[] = [];
    const positives: string[] = [];

    if (
      coldEvents.length > 0 &&
      (crop.tier === "tender" || crop.tier === "very-tender")
    ) {
      verdict = "stop";
      reasons.push(
        `A 32°F or colder night is forecast ${
          coldEvents.length === 1 ? "once" : `${coldEvents.length} times`
        } in the next 7 days. ${crop.name} will be killed or severely damaged.`
      );
    } else if (soilF < minSoil - 3) {
      verdict = "stop";
      reasons.push(
        `Soil temperature is too cold. Estimated ${soilF.toFixed(0)}°F, need ${minSoil}°F for ${crop.name} to germinate and grow.`
      );
    } else if (soilF < minSoil) {
      verdict = "wait";
      reasons.push(
        `Soil temperature is close but a little low. Estimated ${soilF.toFixed(0)}°F, ideal is ${minSoil}°F. Wait 3-5 days for it to warm up, or plant with dark mulch to push germination along.`
      );
    } else if (nearFreezingEvents.length > 0 && crop.tier !== "very-hardy") {
      verdict = "wait";
      reasons.push(
        `A night near ${crop.minTempF}°F is forecast in the next 7 days. Wait it out or be ready to cover.`
      );
    } else {
      verdict = "go";
      positives.push(
        `Soil temperature is estimated at ${soilF.toFixed(0)}°F, above the ${minSoil}°F minimum.`
      );
      if (coldEvents.length === 0) {
        positives.push("No 32°F nights in the next 7 days.");
      }
      positives.push(
        `${crop.name} survives down to ${crop.minTempF}°F, which is below any forecast low this week.`
      );
    }

    return { soilF, minSoil, coldEvents, nearFreezingEvents, verdict, reasons, positives };
  }, [forecast, crop]);

  const verdictRibbon =
    analysis?.verdict === "go"
      ? "ribbon-sow"
      : analysis?.verdict === "wait"
      ? "ribbon-watch"
      : "ribbon-frost";
  const verdictTone =
    analysis?.verdict === "go"
      ? "text-[var(--color-sow-ink)]"
      : analysis?.verdict === "wait"
      ? "text-[var(--color-watch-ink)]"
      : "text-[var(--color-frost-ink)]";
  const verdictLabel =
    analysis?.verdict === "go"
      ? "PLANT TODAY"
      : analysis?.verdict === "wait"
      ? "WAIT A BIT"
      : "NOT YET";
  const verdictEmoji =
    analysis?.verdict === "go" ? "🟢" : analysis?.verdict === "wait" ? "🟡" : "🔴";

  return (
    <CalculatorLayout
      title="Can I Plant Today?"
      description="Live red/yellow/green decision for any crop at any ZIP. Uses the real 14-day forecast and estimated soil temperature."
      lastUpdated="Live"
      answerBlock={
        <p>
          Two things matter for planting today: is a frost coming in the next week, and is your soil warm enough for germination. Tender crops like tomatoes need 55°F soil and zero freezing nights. Cold-hardy crops like peas can tolerate 40°F soil and a 28°F night. This tool pulls your live 14-day forecast from Open-Meteo, estimates soil temperature from the 7-day rolling mean of air temperature, and gives you a red/yellow/green answer for any of 40+ crops.
        </p>
      }
    >
      <CalculatorSchema
        name="Can I Plant Today?"
        description="Live planting decision tool. Uses 14-day forecast and soil temperature estimate to answer yes/no for any crop at any US ZIP. Free."
        url="https://plantingcalc.com/plant-today"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Plant Today", url: "https://plantingcalc.com/plant-today" },
        ]}
      />

      {/* ZIP Ring Decoder */}
      <div className="mb-5">
        <ZipRingDecoder
          value={zip}
          onChange={setZip}
          onResolved={runCheck}
          placeholder="Enter your ZIP"
        />
      </div>

      {/* Crop picker */}
      <div className="mb-6">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
          Crop to check
        </label>
        <select
          value={cropName}
          onChange={(e) => setCropName(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3 font-display text-base font-semibold text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
        >
          {FROST_CROPS.map((c) => (
            <option key={c.name} value={c.name}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          Needs soil at {MIN_SOIL_F[crop.tier]}°F or warmer. Survives to {crop.minTempF}°F.
        </p>
      </div>

      {error && (
        <p className="mb-4 text-xs text-[var(--color-frost-ink)]" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <p className="mb-4 text-xs text-[var(--color-text-faint)]">Reading forecast…</p>
      )}

      {/* Verdict card */}
      {analysis && forecast.length > 0 && (
        <section
          className={`pc-fade-up overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm ${verdictRibbon}`}
        >
          <div className="p-6 text-center sm:p-8">
            <div className="text-5xl" aria-hidden="true">
              {verdictEmoji}
            </div>
            <div
              className={`mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl ${verdictTone}`}
            >
              {verdictLabel}
            </div>
            <div className="mt-2 font-display text-lg font-semibold text-[var(--color-text)]">
              {crop.icon} {crop.name}
              {placeName && (
                <span className="text-[var(--color-text-muted)]"> · {placeName}</span>
              )}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-4 text-center">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                  Soil est
                </div>
                <div className="mt-0.5 font-display text-xl font-bold tabular-nums text-[var(--color-text)]">
                  {analysis.soilF.toFixed(0)}°F
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                  Needs
                </div>
                <div className="mt-0.5 font-display text-xl font-bold tabular-nums text-[var(--color-text)]">
                  {analysis.minSoil}°F
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                  Freeze nights
                </div>
                <div className="mt-0.5 font-display text-xl font-bold tabular-nums text-[var(--color-text)]">
                  {analysis.coldEvents.length}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-left">
              {analysis.reasons.map((r, i) => (
                <p key={i} className="text-sm text-[var(--color-text)]">
                  &rarr; {r}
                </p>
              ))}
              {analysis.positives.map((p, i) => (
                <p key={i} className="text-sm text-[var(--color-text-muted)]">
                  &#10003; {p}
                </p>
              ))}
            </div>
          </div>

          {/* 14-day forecast strip */}
          <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 p-4 sm:p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
              Next 14 days
            </p>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {forecast.map((d) => {
                const danger = d.tempMinF <= Math.max(32, crop.minTempF);
                return (
                  <div
                    key={d.date}
                    className={`rounded-md p-2 ${
                      danger
                        ? "bg-[var(--color-frost-soft)]"
                        : "bg-[var(--color-sow-soft)]"
                    }`}
                  >
                    <div className="text-[10px] text-[var(--color-text-faint)]">
                      {new Date(d.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                    <div
                      className={`mt-0.5 font-display font-bold tabular-nums ${
                        danger
                          ? "text-[var(--color-frost-ink)]"
                          : "text-[var(--color-sow-ink)]"
                      }`}
                    >
                      {Math.round(d.tempMinF)}°
                    </div>
                    <div className="text-[9px] text-[var(--color-text-faint)]">
                      hi {Math.round(d.tempMaxF)}°
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {analysis && forecast.length > 0 && (
        <ShareResults
          title={`${verdictLabel}: ${crop.name} in ${placeName}`}
          text={`For ${crop.name} in ${placeName}, PlantingCalc says ${verdictLabel} based on the next 14 days.`}
          card={{
            headline: verdictLabel,
            label: `${crop.name} · ${placeName ?? ""}`,
            sub: `Soil est ${analysis.soilF.toFixed(0)}°F · min needed ${analysis.minSoil}°F · ${analysis.coldEvents.length} freezing nights next 7d`,
            calc: "plant-today",
          }}
        />
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href="/frost-alert"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
        >
          Frost alert for tonight &rarr;
        </Link>
        <Link
          href="/seed-start-calendar"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
        >
          Full seed start calendar &rarr;
        </Link>
        <Link
          href="/planting-dates"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
        >
          Crop-by-crop planting dates &rarr;
        </Link>
      </div>

      <FAQSection questions={plantTodayFAQ} />
      <RelatedCalculators currentPath="/plant-today" />
    </CalculatorLayout>
  );
}

const plantTodayFAQ = [
  {
    question: "How is soil temperature estimated?",
    answer:
      "Soil temperature at the 2-inch depth lags air temperature by about 3-5 days and smooths out daily swings. The standard extension-service approximation is a 7-day rolling mean of daily average air temperature. That's what this tool uses. In practice, sunny beds with dark mulch run 3-5°F warmer than the estimate, and shaded or heavily mulched beds run a few degrees cooler. For more accuracy, stick a soil thermometer in the bed for three mornings and average the readings.",
  },
  {
    question: "Why does the tool wait on tender crops even when it's above freezing?",
    answer:
      "Tender crops like tomatoes and basil don't actually die at 33°F. They stop growing below 50°F and suffer cold damage that takes weeks to recover from. A string of 35-40°F nights early in the season will produce stunted plants that underperform plants transplanted two weeks later into warm soil. The soil-temperature check is what forces a yellow or red even when there's no frost in the forecast.",
  },
  {
    question: "Is the 14-day forecast reliable out to day 14?",
    answer:
      "Days 1-7 are usually within 2-4°F of reality. Days 8-14 get progressively less accurate and should be treated as guidance, not commitment. The tool weights the first 7 days for the freeze check and soil estimate, so day-14 noise has minimal impact. If you want to be ultra-safe on a planting day, re-check 48 hours before you were planning to sow.",
  },
  {
    question: "Should I trust this more than the Farmers' Almanac last frost date?",
    answer:
      "For the 'should I plant this weekend' question, yes. The Almanac date is the 50th-percentile last frost, averaged over a large region. This tool uses YOUR ZIP's actual 14-day weather. When they disagree, the live forecast wins. For long-range planning (when to start seeds in February for a May transplant), use the seed start calendar tool instead, since it's based on your ZIP's actual historical last-frost date.",
  },
];
