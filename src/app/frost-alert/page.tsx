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
import {
  FROST_CROPS,
  TIER_ORDER,
  TIER_LABEL,
  assessCropAtTemp,
  type FrostCrop,
  type FrostAction,
} from "@/data/frost-tolerance";
import { lookupZip, fetchForecast14, type DailyForecast } from "@/lib/weather";

const actionStyle: Record<
  FrostAction,
  { label: string; color: string; bg: string; emoji: string }
> = {
  fine: { label: "Fine", color: "text-emerald-700", bg: "bg-emerald-50", emoji: "✅" },
  cover: { label: "Cover", color: "text-amber-700", bg: "bg-amber-50", emoji: "🛡️" },
  harvest: { label: "Harvest now", color: "text-orange-700", bg: "bg-orange-50", emoji: "🧺" },
  lost: { label: "Cover or lose", color: "text-rose-700", bg: "bg-rose-50", emoji: "🚨" },
};

export default function FrostAlertPage() {
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<Set<string>>(() => {
    // Sensible defaults: the most common at-risk crops
    return new Set([
      "Tomatoes",
      "Peppers",
      "Basil",
      "Cucumber",
      "Zucchini",
      "Beans (snap, lima)",
    ]);
  });

  const toggleCrop = (name: string) => {
    setSelectedCrops((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

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
      // Only use the next 3 days for frost alert
      setForecast(f.slice(0, 3));
    } catch {
      setError("Unexpected error. Try again.");
    } finally {
      setLoading(false);
    }
  }, [zip]);

  // Lowest temp in the window determines the alert
  const alertWindow = useMemo(() => {
    if (!forecast.length) return null;
    const lowest = forecast.reduce((a, b) =>
      a.tempMinF < b.tempMinF ? a : b
    );
    return { night: lowest, days: forecast };
  }, [forecast]);

  const selectedCropObjects = useMemo(
    () => FROST_CROPS.filter((c) => selectedCrops.has(c.name)),
    [selectedCrops]
  );

  const byAction = useMemo(() => {
    if (!alertWindow) return null;
    const lowF = alertWindow.night.tempMinF;
    const groups: Record<FrostAction, FrostCrop[]> = {
      fine: [],
      cover: [],
      harvest: [],
      lost: [],
    };
    for (const crop of selectedCropObjects) {
      groups[assessCropAtTemp(crop, lowF)].push(crop);
    }
    return groups;
  }, [alertWindow, selectedCropObjects]);

  const riskCount = byAction
    ? byAction.cover.length + byAction.harvest.length + byAction.lost.length
    : 0;

  return (
    <CalculatorLayout
      title="Frost Alert — Cover Or Lose"
      description="Live 72-hour frost check for your ZIP. Pick what's in your garden, see exactly what to cover tonight or lose by morning."
      answerBlock={
        <p>
          <strong>Quick answer:</strong> Tender crops (tomatoes, peppers, basil, cucumbers,
          zucchini, beans) are damaged at any temperature below 33°F and killed outright
          below 30°F. Hardy crops (kale, spinach, broccoli, carrots, peas) are fine down
          to 26°F and actually taste better after a light frost. This tool pulls your live
          72-hour forecast from Open-Meteo, checks your selected crops against their
          documented frost tolerance, and prints a sorted cover-or-lose list. Do this 30
          minutes before sunset for maximum benefit.
        </p>
      }
      lastUpdated="April 2026"
    >
      <CalculatorSchema
        name="Frost Alert — Cover Or Lose"
        description="Live 72-hour frost alert tool. Checks your ZIP's forecast against documented crop frost tolerance and returns a prioritized cover-or-lose list. Free."
        url="https://plantingcalc.com/frost-alert"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Frost Alert", url: "https://plantingcalc.com/frost-alert" },
        ]}
      />

      {/* ZIP input */}
      <div className="mb-8">
        <label className="mb-1 block text-sm font-medium text-[var(--color-text)]">
          Your ZIP code
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
            {loading ? "Loading…" : "Check 72h forecast"}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs text-rose-600" role="alert">
            {error}
          </p>
        )}
        {placeName && (
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Forecast for {placeName}
          </p>
        )}
      </div>

      {/* Crop selector */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--color-text)]">
          What&apos;s in your garden right now?
        </h2>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {FROST_CROPS.map((c) => {
            const checked = selectedCrops.has(c.name);
            return (
              <label
                key={c.name}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  checked
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCrop(c.name)}
                  className="rounded"
                />
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {alertWindow && byAction && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultCard
              label="Lowest temp in next 72h"
              value={`${alertWindow.night.tempMinF.toFixed(0)}°F`}
              unit={new Date(alertWindow.night.date).toLocaleDateString("en-US", {
                weekday: "short",
              })}
              highlight
              icon="❄️"
            />
            <ResultCard
              label="Crops at risk"
              value={`${riskCount}`}
              unit={`/ ${selectedCropObjects.length}`}
              icon="⚠️"
            />
            <ResultCard
              label="Safe crops"
              value={`${byAction.fine.length}`}
              unit="no action"
              icon="✅"
            />
          </div>

          {/* 72h temperature strip */}
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
              72-hour low temperatures
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {alertWindow.days.map((d) => {
                const danger = d.tempMinF <= 33;
                return (
                  <div
                    key={d.date}
                    className={`rounded-lg p-3 text-center ${
                      danger ? "bg-rose-50" : "bg-emerald-50"
                    }`}
                  >
                    <div className="text-xs font-medium text-[var(--color-text-muted)]">
                      {new Date(d.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div
                      className={`mt-1 text-2xl font-bold ${
                        danger ? "text-rose-700" : "text-emerald-700"
                      }`}
                    >
                      {d.tempMinF.toFixed(0)}°
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      high {d.tempMaxF.toFixed(0)}°
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action-grouped crop lists */}
          <div className="mt-8 space-y-4">
            {(["lost", "harvest", "cover", "fine"] as FrostAction[]).map((action) => {
              const crops = byAction[action];
              if (!crops.length) return null;
              const st = actionStyle[action];
              return (
                <div
                  key={action}
                  className={`rounded-xl border border-[var(--color-border)] ${st.bg} p-5`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xl">{st.emoji}</span>
                    <h3 className={`text-lg font-bold ${st.color}`}>
                      {st.label}
                    </h3>
                    <span className="text-sm text-[var(--color-text-muted)]">
                      ({crops.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {crops.map((c) => (
                      <span
                        key={c.name}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-medium text-[var(--color-text)] shadow-sm"
                      >
                        <span>{c.icon}</span>
                        <span>{c.name}</span>
                      </span>
                    ))}
                  </div>
                  {action === "cover" && (
                    <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                      Use a frost blanket, bedsheet, or upside-down bucket. Cover
                      30 min before sunset. Remove in the morning to prevent heat
                      buildup.
                    </p>
                  )}
                  {action === "lost" && (
                    <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                      These will die without cover. Bring potted plants inside, or
                      double-layer sheets + plastic over in-ground crops.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <ShareResults
            title={`Frost alert: ${alertWindow.night.tempMinF.toFixed(0)}°F tonight in ${placeName}`}
            text={`${riskCount} of my crops are at risk in the next 72 hours. Lowest temp: ${alertWindow.night.tempMinF.toFixed(0)}°F.`}
            card={{
              headline: `${alertWindow.night.tempMinF.toFixed(0)}°F`,
              label: `72h forecast low — ${placeName ?? ""}`,
              sub: `${riskCount} of ${selectedCropObjects.length} crops need cover. ${byAction.lost.length} will die without it.`,
              calc: "frost-alert",
            }}
          />
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href="/frost-dates"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
        >
          Average frost dates →
        </Link>
        <Link
          href="/planting-dates"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/5"
        >
          Planting dates by ZIP →
        </Link>
      </div>

      <FAQSection questions={frostAlertFAQ} />
      <RelatedCalculators currentPath="/frost-alert" />
    </CalculatorLayout>
  );
}

const frostAlertFAQ = [
  {
    question: "Where does the forecast come from?",
    answer:
      "Open-Meteo, which aggregates NOAA GFS, NWS HRRR, and ECMWF models depending on region. It's the same data feed the National Weather Service uses for public forecasts. Your ZIP is looked up via zippopotam.us to get a lat/lng, then Open-Meteo returns daily min/max temperatures. No signup, no API key, no logging.",
  },
  {
    question: "At what temperature should I cover my tomatoes?",
    answer:
      "Any time the forecast low drops to 33°F or below. Tomatoes are damaged at the first hint of frost and killed outright below 30°F. Covering works best with a frost blanket or even a bedsheet draped over a cage — anything that traps radiant ground heat. Remove the cover by 9 AM so the plants don't cook under trapped solar heat.",
  },
  {
    question: "Why are kale and spinach in the 'fine' list even at 20°F?",
    answer:
      "Both are very-hardy and their flavor actually improves after light frost. Cellular sugars concentrate as the plant protects against freezing. You can leave kale uncovered through 15-20°F events without damage; it's one of the reasons it's the classic fall-to-winter extender.",
  },
  {
    question: "How much does covering actually help?",
    answer:
      "A single layer of frost blanket adds about 4-6°F of protection. A bedsheet adds 2-4°F. Rigid row cover over hoops adds 5-8°F. The reason covers work isn't insulation per se — it's preventing the plants from radiating their own heat to the clear night sky. Clear calm nights lose 4-6°F of radiative heat overnight; cover that sky view and most of that is kept.",
  },
  {
    question: "Should I water before a frost?",
    answer:
      "Yes, counterintuitively. Water has a huge heat capacity, so wet soil releases heat overnight much more slowly than dry soil. Water deeply in the morning of a frost day. For commercial crops, sprinkling water on the plants overnight works because the phase change of freezing water actually releases 144 BTU/lb of heat — but that's a lot of water and equipment and isn't practical for most gardens.",
  },
];
