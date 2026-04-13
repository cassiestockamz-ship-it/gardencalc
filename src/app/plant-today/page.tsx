"use client";

import { useCallback, useMemo, useState } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import ShareResults from "@/components/ShareResults";
import RelatedCalculators from "@/components/RelatedCalculators";
import Link from "next/link";
import { FROST_CROPS, type FrostCrop } from "@/data/frost-tolerance";
import { lookupZip, fetchForecast14, type DailyForecast } from "@/lib/weather";

/**
 * Minimum soil temperature for germination, by crop tier (°F).
 * Data: Iowa State Extension soil temperature planting guide.
 */
const MIN_SOIL_F: Record<FrostCrop["tier"], number> = {
  "very-hardy": 35,
  hardy: 40,
  "semi-hardy": 45,
  tender: 55,
  "very-tender": 65,
};

type Verdict = "go" | "wait" | "stop";

function estimateSoilTemp(forecast: DailyForecast[]): number {
  // Approximate 2-inch soil temperature as a 7-day rolling mean of
  // daily average air temperature. Standard simplification used in
  // cooperative extension calculators.
  const days = forecast.slice(0, 7);
  const avg =
    days.reduce((s, d) => s + (d.tempMinF + d.tempMaxF) / 2, 0) / days.length;
  return avg;
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

  const runCheck = useCallback(async () => {
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a 5-digit US ZIP code");
      return;
    }
    setError(null);
    setLoading(true);
    setForecast([]);
    try {
      const loc = await lookupZip(zip);
      if (!loc) {
        setError("Could not look up that ZIP code");
        setLoading(false);
        return;
      }
      setPlaceName(loc.place);
      const f = await fetchForecast14(loc.lat, loc.lng);
      if (!f) {
        setError("Could not load forecast");
        setLoading(false);
        return;
      }
      setForecast(f);
    } catch {
      setError("Unexpected error. Try again.");
    } finally {
      setLoading(false);
    }
  }, [zip]);

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

    if (coldEvents.length > 0 && (crop.tier === "tender" || crop.tier === "very-tender")) {
      verdict = "stop";
      reasons.push(
        `A 32°F or colder night is forecast ${coldEvents.length === 1 ? "once" : `${coldEvents.length} times`} in the next 7 days. ${crop.name} will be killed or severely damaged.`
      );
    } else if (soilF < minSoil - 3) {
      verdict = "stop";
      reasons.push(
        `Soil temperature is too cold (estimated ${soilF.toFixed(0)}°F, need ${minSoil}°F for ${crop.name} to germinate and grow).`
      );
    } else if (soilF < minSoil) {
      verdict = "wait";
      reasons.push(
        `Soil temperature is close but a little low (estimated ${soilF.toFixed(0)}°F, ideal is ${minSoil}°F). Wait 3-5 days for it to warm up, or plant with dark mulch to push germination along.`
      );
    } else if (nearFreezingEvents.length > 0 && crop.tier !== "very-hardy") {
      verdict = "wait";
      reasons.push(
        `A night near ${crop.minTempF}°F is forecast in the next 7 days. Wait it out or be ready to cover.`
      );
    } else {
      verdict = "go";
      positives.push(`Soil temperature is estimated at ${soilF.toFixed(0)}°F, above the ${minSoil}°F minimum.`);
      if (coldEvents.length === 0) {
        positives.push("No 32°F nights in the next 7 days.");
      }
      positives.push(`${crop.name} survives down to ${crop.minTempF}°F, which is below any forecast low this week.`);
    }

    return { soilF, minSoil, coldEvents, nearFreezingEvents, verdict, reasons, positives };
  }, [forecast, crop]);

  const verdictColor =
    analysis?.verdict === "go"
      ? "text-emerald-700"
      : analysis?.verdict === "wait"
        ? "text-amber-700"
        : "text-rose-700";
  const verdictBg =
    analysis?.verdict === "go"
      ? "bg-emerald-50 border-emerald-300"
      : analysis?.verdict === "wait"
        ? "bg-amber-50 border-amber-300"
        : "bg-rose-50 border-rose-300";
  const verdictLabel =
    analysis?.verdict === "go"
      ? "PLANT TODAY"
      : analysis?.verdict === "wait"
        ? "WAIT A BIT"
        : "NOT YET";

  return (
    <CalculatorLayout
      title="Can I Plant Today?"
      description="Live decision tool. Pick a crop, enter your ZIP, and get a red/yellow/green answer based on the actual 14-day forecast and estimated soil temperature at your location."
      answerBlock={
        <p>
          <strong>Quick answer:</strong> Two things matter for planting today: is a frost
          coming in the next week, and is your soil warm enough for germination.
          Tender crops like tomatoes need 55°F soil and zero freezing nights; cold-hardy
          crops like peas can tolerate 40°F soil and a 28°F night. This tool pulls your
          live 14-day forecast from Open-Meteo, estimates soil temperature from the 7-day
          rolling mean of air temperature, and gives you a red/yellow/green answer for
          any of 40+ crops.
        </p>
      }
      lastUpdated="April 2026"
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

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
            Crop
          </label>
          <select
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
          >
            {FROST_CROPS.map((c) => (
              <option key={c.name} value={c.name}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Needs soil ≥ {MIN_SOIL_F[crop.tier]}°F, survives to {crop.minTempF}°F
          </p>
        </div>
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
                if (e.key === "Enter") runCheck();
              }}
              placeholder="e.g. 55401"
              className="w-32 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={runCheck}
              disabled={loading || !zip}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Checking…" : "Check"}
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
      </div>

      {analysis && forecast.length > 0 && (
        <>
          <div
            className={`mt-10 rounded-3xl border-2 ${verdictBg} p-8 text-center shadow-sm`}
          >
            <div className="text-6xl">
              {analysis.verdict === "go" ? "🟢" : analysis.verdict === "wait" ? "🟡" : "🔴"}
            </div>
            <div className={`mt-3 text-4xl font-black ${verdictColor}`}>
              {verdictLabel}
            </div>
            <div className="mt-2 text-lg font-semibold text-[var(--color-text)]">
              {crop.icon} {crop.name} · {placeName}
            </div>
            <div className="mt-4 space-y-2 text-left">
              {analysis.reasons.map((r, i) => (
                <p key={i} className="text-sm text-[var(--color-text)]">
                  → {r}
                </p>
              ))}
              {analysis.positives.map((p, i) => (
                <p key={i} className="text-sm text-[var(--color-text-muted)]">
                  ✓ {p}
                </p>
              ))}
            </div>
          </div>

          {/* Forecast strip */}
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
              Next 14 days
            </h3>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {forecast.map((d) => {
                const danger = d.tempMinF <= Math.max(32, crop.minTempF);
                return (
                  <div
                    key={d.date}
                    className={`rounded-md p-2 ${danger ? "bg-rose-50" : "bg-emerald-50"}`}
                  >
                    <div className="text-[var(--color-text-muted)]">
                      {new Date(d.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                    <div
                      className={`mt-1 font-bold ${danger ? "text-rose-700" : "text-emerald-700"}`}
                    >
                      {d.tempMinF.toFixed(0)}°
                    </div>
                    <div className="text-[10px] text-[var(--color-text-muted)]">
                      hi {d.tempMaxF.toFixed(0)}°
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

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
          href="/seed-start-calendar"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
        >
          Full seed start calendar →
        </Link>
        <Link
          href="/planting-dates"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
        >
          Crop-by-crop planting dates →
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
      "Soil temperature at the 2-inch depth lags air temperature by about 3-5 days and smooths out daily swings. The standard extension-service approximation is a 7-day rolling mean of daily average air temperature. That's what this tool uses. In practice, sunny beds with dark mulch run 3-5°F warmer than the estimate, and shaded or heavily-mulched beds run a few degrees cooler. For more accuracy, stick a soil thermometer in the bed for three mornings and average the readings.",
  },
  {
    question: "Why does the tool wait on tender crops even when it's above freezing?",
    answer:
      "Tender crops like tomatoes and basil don't actually die at 33°F — they stop growing below 50°F and suffer cold damage that takes weeks to recover from. A string of 35-40°F nights early in the season will produce stunted plants that ultimately underperform plants transplanted two weeks later into warm soil. The soil-temperature check is what forces a yellow/red even when there's no frost in the forecast.",
  },
  {
    question: "Is the 14-day forecast reliable out to day 14?",
    answer:
      "Days 1-7 are usually within 2-4°F of reality. Days 8-14 get progressively less accurate and should be treated as guidance, not commitment. The tool weights the first 7 days for the freeze check and soil estimate, so day-14 noise has minimal impact. If you want to be ultra-safe on a planting day, re-check 48 hours before you were planning to sow.",
  },
  {
    question: "What about heat, not just cold?",
    answer:
      "Right now the tool only checks the cold-tolerance side because spring planting mistakes skew cold. A heat-limit check for fall planting (e.g., don't direct-sow lettuce when the 7-day forecast averages above 75°F) is on the roadmap.",
  },
  {
    question: "Should I trust this more than the Farmers' Almanac last frost date?",
    answer:
      "For the 'should I plant this weekend' question, yes. The Almanac date is the 50th-percentile last frost, averaged over a large region. This tool uses YOUR ZIP's actual 14-day weather. When they disagree, the live forecast wins. For long-range planning (when to start seeds in February for a May transplant), use the seed start calendar tool instead, since it's based on your ZIP's actual historical last-frost date.",
  },
];
