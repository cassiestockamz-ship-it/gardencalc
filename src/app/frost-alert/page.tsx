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
import {
  FROST_CROPS,
  TIER_ORDER,
  TIER_LABEL,
  assessCropAtTemp,
  type FrostCrop,
  type FrostAction,
} from "@/data/frost-tolerance";
import { lookupZip, fetchForecast14, type DailyForecast } from "@/lib/weather";
import { frostVerdict, type FrostVerdict } from "@/lib/decisions";

const actionStyle: Record<
  FrostAction,
  { label: string; pill: string; emoji: string; ribbon: string }
> = {
  fine: {
    label: "Fine",
    pill: "bg-[var(--color-sow-soft)] text-[var(--color-sow-ink)] border-[var(--color-sow-ring)]",
    emoji: "✅",
    ribbon: "ribbon-sow",
  },
  cover: {
    label: "Cover",
    pill: "bg-[var(--color-watch-soft)] text-[var(--color-watch-ink)] border-[var(--color-watch-ring)]",
    emoji: "🛡️",
    ribbon: "ribbon-watch",
  },
  harvest: {
    label: "Harvest now",
    pill: "bg-[var(--color-watch-soft)] text-[var(--color-watch-ink)] border-[var(--color-watch-ring)]",
    emoji: "🧺",
    ribbon: "ribbon-watch",
  },
  lost: {
    label: "Cover or lose",
    pill: "bg-[var(--color-frost-soft)] text-[var(--color-frost-ink)] border-[var(--color-frost-ring)]",
    emoji: "🚨",
    ribbon: "ribbon-frost",
  },
};

const VERDICT_LABEL: Record<FrostVerdict["level"], string> = {
  "all-clear": "ALL CLEAR",
  watch: "WATCH",
  "action-needed": "ACTION NEEDED",
};

const VERDICT_RIBBON: Record<FrostVerdict["level"], string> = {
  "all-clear": "ribbon-sow",
  watch: "ribbon-watch",
  "action-needed": "ribbon-frost",
};

const VERDICT_TEXT: Record<FrostVerdict["level"], string> = {
  "all-clear": "text-[var(--color-sow-ink)]",
  watch: "text-[var(--color-watch-ink)]",
  "action-needed": "text-[var(--color-frost-ink)]",
};

const STORAGE_KEY = "pc_zip_context_v1";

export default function FrostAlertPage() {
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [selectedCrops, setSelectedCrops] = useState<Set<string>>(
    () =>
      new Set([
        "Tomatoes",
        "Peppers",
        "Basil",
        "Cucumber",
        "Zucchini",
        "Beans (snap, lima)",
      ])
  );

  // Restore ZIP from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { zip?: string };
        if (saved.zip && /^\d{5}$/.test(saved.zip)) {
          setZip(saved.zip);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCrop = (name: string) => {
    setSelectedCrops((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const runFetch = useCallback(async (decoded: DecodedZip) => {
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
        setError("Could not load the forecast. Try again in a moment.");
        return;
      }
      setForecast(f.slice(0, 3));

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

  const selectedCropObjects = useMemo(
    () => FROST_CROPS.filter((c) => selectedCrops.has(c.name)),
    [selectedCrops]
  );

  const verdict = useMemo(() => {
    if (forecast.length === 0 || selectedCropObjects.length === 0) return null;
    return frostVerdict(forecast, selectedCropObjects);
  }, [forecast, selectedCropObjects]);

  const byAction = useMemo(() => {
    if (forecast.length === 0) return null;
    const lowest = forecast.reduce((a, b) => (a.tempMinF < b.tempMinF ? a : b));
    const groups: Record<FrostAction, FrostCrop[]> = {
      fine: [],
      cover: [],
      harvest: [],
      lost: [],
    };
    for (const crop of selectedCropObjects) {
      groups[assessCropAtTemp(crop, lowest.tempMinF)].push(crop);
    }
    return groups;
  }, [forecast, selectedCropObjects]);

  return (
    <CalculatorLayout
      title="Frost Alert"
      description="Live 72-hour frost check against your actual crops. One ZIP, one answer. Know exactly what to cover before sunset."
      lastUpdated="Live"
      answerBlock={
        <>
          <p>
            Tender crops (tomatoes, peppers, basil, cucumbers, zucchini, beans) are damaged at any temperature below 33°F and killed outright below 30°F. Hardy crops (kale, spinach, broccoli, carrots, peas) are fine down to 26°F and actually taste better after a light frost.
          </p>
          <p className="mt-3">
            This tool pulls your live 72-hour forecast from Open-Meteo, checks your selected crops against documented frost tolerance from Cornell and Penn State extension publications, and returns a sorted cover-or-lose list. Do this 30 minutes before sunset for maximum benefit.
          </p>
        </>
      }
    >
      <CalculatorSchema
        name="Frost Alert: Cover Or Lose"
        description="Live 72-hour frost alert tool. Checks your ZIP's forecast against documented crop frost tolerance and returns a prioritized cover-or-lose list. Free."
        url="https://plantingcalc.com/frost-alert"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Frost Alert", url: "https://plantingcalc.com/frost-alert" },
        ]}
      />

      {/* ZIP Ring Decoder — the first interactive control */}
      <div className="mb-6">
        <ZipRingDecoder
          value={zip}
          onChange={setZip}
          onResolved={runFetch}
          placeholder="Enter your ZIP for a live 72-hour check"
        />
        {error && (
          <p className="mt-2 text-xs text-[var(--color-frost-ink)]" role="alert">
            {error}
          </p>
        )}
        {loading && (
          <p className="mt-2 text-xs text-[var(--color-text-faint)]">
            Reading forecast…
          </p>
        )}
      </div>

      {/* Verdict card — the one-screen answer */}
      {verdict && byAction && (
        <section
          className={`pc-fade-up mb-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm ${VERDICT_RIBBON[verdict.level]}`}
        >
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                  {placeName ? `Next 72h · ${placeName}` : "Next 72 hours"}
                </p>
                <h2
                  className={`mt-1 font-display text-3xl font-bold leading-tight sm:text-4xl ${VERDICT_TEXT[verdict.level]}`}
                >
                  {VERDICT_LABEL[verdict.level]}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  {verdict.headline}
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                  Lowest low
                </div>
                <div className="font-display text-4xl font-bold tabular-nums text-[var(--color-text)]">
                  {Math.round(verdict.lowestF)}°
                </div>
                <div className="text-[10px] text-[var(--color-text-faint)]">
                  {verdict.lowestDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2 border-t border-[var(--color-border)] pt-4">
              <CountTile label="Lose" count={byAction.lost.length} tone="frost" />
              <CountTile label="Harvest" count={byAction.harvest.length} tone="watch" />
              <CountTile label="Cover" count={byAction.cover.length} tone="watch" />
              <CountTile label="Fine" count={byAction.fine.length} tone="sow" />
            </div>
          </div>

          {/* 3-day strip */}
          <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 p-4 sm:p-5">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
              72-hour lows
            </p>
            <div className="grid grid-cols-3 gap-3">
              {forecast.map((d) => {
                const danger = d.tempMinF <= 33;
                return (
                  <div
                    key={d.date}
                    className={`rounded-lg border p-3 text-center ${
                      danger
                        ? "border-[var(--color-frost-ring)] bg-[var(--color-frost-soft)]"
                        : "border-[var(--color-sow-ring)] bg-[var(--color-sow-soft)]"
                    }`}
                  >
                    <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-faint)]">
                      {new Date(d.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div
                      className={`mt-0.5 font-display text-2xl font-bold tabular-nums ${
                        danger ? "text-[var(--color-frost-ink)]" : "text-[var(--color-sow-ink)]"
                      }`}
                    >
                      {Math.round(d.tempMinF)}°
                    </div>
                    <div className="text-[10px] text-[var(--color-text-faint)]">
                      high {Math.round(d.tempMaxF)}°
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Action-grouped crop lists */}
      {byAction && (
        <div className="space-y-4">
          {(["lost", "harvest", "cover", "fine"] as FrostAction[]).map((action) => {
            const crops = byAction[action];
            if (!crops.length) return null;
            const st = actionStyle[action];
            return (
              <div
                key={action}
                className={`overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] ${st.ribbon}`}
              >
                <div className="p-4 sm:p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xl" aria-hidden="true">
                      {st.emoji}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[var(--color-text)]">
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
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${st.pill}`}
                      >
                        <span aria-hidden="true">{c.icon}</span>
                        <span>{c.name}</span>
                      </span>
                    ))}
                  </div>
                  {action === "cover" && (
                    <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                      Use a frost blanket, bedsheet, or upside-down bucket. Cover 30 minutes before sunset. Remove by 9 AM to avoid heat buildup.
                    </p>
                  )}
                  {action === "lost" && (
                    <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                      These will die without cover. Bring potted plants inside, or double-layer sheets plus plastic over in-ground crops.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Crop selector — secondary control */}
      <details className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <summary className="cursor-pointer list-none px-5 py-4">
          <span className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--color-text)]">
              What&apos;s in your garden? ({selectedCropObjects.length} selected)
            </span>
            <span className="text-[var(--color-text-muted)]">&#9662;</span>
          </span>
        </summary>
        <div className="space-y-4 border-t border-[var(--color-border)] p-5">
          {TIER_ORDER.map((tier) => {
            const tierCrops = FROST_CROPS.filter((c) => c.tier === tier);
            if (tierCrops.length === 0) return null;
            return (
              <div key={tier}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                  {TIER_LABEL[tier]}
                </p>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {tierCrops.map((c) => {
                    const checked = selectedCrops.has(c.name);
                    return (
                      <label
                        key={c.name}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          checked
                            ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                            : "border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCrop(c.name)}
                          className="accent-[var(--color-primary)]"
                        />
                        <span aria-hidden="true">{c.icon}</span>
                        <span className="truncate">{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </details>

      {verdict && (
        <ShareResults
          title={`Frost alert: ${Math.round(verdict.lowestF)}°F in ${placeName ?? "my area"}`}
          text={`${verdict.atRisk.length} of my crops need action in the next 72 hours. Lowest temp: ${Math.round(verdict.lowestF)}°F.`}
          card={{
            headline: `${Math.round(verdict.lowestF)}°F`,
            label: `72h low · ${placeName ?? ""}`,
            sub: `${verdict.atRisk.length} of ${selectedCropObjects.length} crops need action. ${verdict.lost.length} will die without cover.`,
            calc: "frost-alert",
          }}
        />
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href="/frost-dates"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
        >
          Average frost dates &rarr;
        </Link>
        <Link
          href="/planting-dates"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2 font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary-soft)]"
        >
          Planting dates by ZIP &rarr;
        </Link>
      </div>

      <FAQSection questions={frostAlertFAQ} />
      <RelatedCalculators currentPath="/frost-alert" />
    </CalculatorLayout>
  );
}

function CountTile({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "sow" | "watch" | "frost";
}) {
  const color =
    tone === "sow"
      ? "text-[var(--color-sow-ink)]"
      : tone === "watch"
      ? "text-[var(--color-watch-ink)]"
      : "text-[var(--color-frost-ink)]";
  return (
    <div className="text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
      </div>
      <div className={`mt-0.5 font-display text-2xl font-bold tabular-nums ${color}`}>
        {count}
      </div>
    </div>
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
      "Any time the forecast low drops to 33°F or below. Tomatoes are damaged at the first hint of frost and killed outright below 30°F. Covering works best with a frost blanket or even a bedsheet draped over a cage. Anything that traps radiant ground heat works. Remove the cover by 9 AM so the plants don't cook under trapped solar heat.",
  },
  {
    question: "Why are kale and spinach in the 'fine' list even at 20°F?",
    answer:
      "Both are very-hardy and their flavor actually improves after light frost. Cellular sugars concentrate as the plant protects against freezing. You can leave kale uncovered through 15-20°F events without damage, and it's one of the reasons it's the classic fall-to-winter extender.",
  },
  {
    question: "How much does covering actually help?",
    answer:
      "A single layer of frost blanket adds about 4-6°F of protection. A bedsheet adds 2-4°F. Rigid row cover over hoops adds 5-8°F. The reason covers work isn't insulation per se. It's preventing the plants from radiating their own heat to the clear night sky. Clear calm nights lose 4-6°F of radiative heat overnight, and covering that sky view keeps most of that heat in.",
  },
  {
    question: "Should I water before a frost?",
    answer:
      "Yes, counterintuitively. Water has a huge heat capacity, so wet soil releases heat overnight much more slowly than dry soil. Water deeply in the morning of a frost day. For commercial crops, sprinkling water on the plants overnight works because the phase change of freezing water actually releases 144 BTU per pound of heat, but that's a lot of water and equipment and isn't practical for most gardens.",
  },
];
