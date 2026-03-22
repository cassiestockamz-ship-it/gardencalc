"use client";

import { useState, useMemo, useCallback } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { VEGETABLES, CATEGORIES } from "@/data/vegetables";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import { plantingDatesFAQ } from "@/data/faq-data";

const AMAZON_TAG = "kawaiiguy0f-20";

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

function addWeeks(dateStr: string, weeks: number): Date {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtDateRange(d1: Date, d2: Date): string {
  return `${fmtDate(d1)} – ${fmtDate(d2)}`;
}

type TimeStatus = "past" | "now" | "upcoming" | "future";

function getTimeStatus(d: Date): TimeStatus {
  const now = new Date();
  const diffDays = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < -14) return "past";
  if (diffDays < 14) return "now";
  if (diffDays < 42) return "upcoming";
  return "future";
}

const STATUS_STYLES: Record<TimeStatus, { bg: string; text: string; label: string }> = {
  past: { bg: "bg-gray-100", text: "text-gray-400", label: "Past" },
  now: { bg: "bg-green-50 border-green-300", text: "text-green-700", label: "Plant Now!" },
  upcoming: { bg: "bg-amber-50 border-amber-300", text: "text-amber-700", label: "Coming Up" },
  future: { bg: "bg-blue-50", text: "text-blue-600", label: "Later" },
};

type FilterCategory = "all" | string;

export default function PlantingDatesPage() {
  const [zip, setZip] = useState("");
  const [zoneData, setZoneData] = useState<ZoneData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [showIndoor, setShowIndoor] = useState(true);

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

  const plantingSchedule = useMemo(() => {
    if (!zoneData) return [];

    return VEGETABLES.map((veg) => {
      const indoorDate = veg.indoorStart !== null ? addWeeks(zoneData.lastFrost, veg.indoorStart) : null;
      const transplantDate = veg.transplant !== null ? addWeeks(zoneData.lastFrost, veg.transplant) : null;
      const directSowDate = veg.directSow !== null ? addWeeks(zoneData.lastFrost, veg.directSow) : null;

      // Primary action date (what to show as the main date)
      const primaryDate = transplantDate || directSowDate || addWeeks(zoneData.lastFrost, 0);
      const primaryStatus = getTimeStatus(primaryDate);

      // Harvest window
      const harvestStart = new Date(primaryDate);
      harvestStart.setDate(harvestStart.getDate() + veg.daysToHarvest[0]);
      const harvestEnd = new Date(primaryDate);
      harvestEnd.setDate(harvestEnd.getDate() + veg.daysToHarvest[1]);

      return {
        ...veg,
        indoorDate,
        transplantDate,
        directSowDate,
        primaryDate,
        primaryStatus,
        harvestStart,
        harvestEnd,
      };
    }).sort((a, b) => a.primaryDate.getTime() - b.primaryDate.getTime());
  }, [zoneData]);

  const filteredSchedule = useMemo(() => {
    return plantingSchedule.filter((v) => {
      if (filter !== "all" && v.category !== filter) return false;
      return true;
    });
  }, [plantingSchedule, filter]);

  const nowCount = plantingSchedule.filter((v) => v.primaryStatus === "now").length;

  return (
    <CalculatorLayout
      title="Planting Date Calculator"
      description="Enter your ZIP code to get personalized planting dates for 35+ vegetables based on your USDA hardiness zone and local frost dates."
      lastUpdated="March 2026"
      intro="Your planting dates depend on your USDA hardiness zone and local last frost date. Most vegetables should be started indoors 6-8 weeks before the last frost, while cold-hardy crops like peas, spinach, and kale can be direct-sown 4-6 weeks before. Enter your ZIP code below for personalized dates."
    >
      <CalculatorSchema
        name="Planting Date Calculator by ZIP Code"
        description="Get personalized planting dates for 35+ vegetables based on your ZIP code, USDA hardiness zone, and frost dates."
        url="https://plantingcalc.com/planting-dates"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://plantingcalc.com" }, { name: "Planting Dates", url: "https://plantingcalc.com/planting-dates" }]} />

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
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
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
              {loading ? "Looking up..." : "Find Dates"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
        </div>
      </div>

      {/* Zone Info Card */}
      {zoneData && (
        <div className="mt-6 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="font-medium text-[var(--color-text-muted)]">Zone:</span>{" "}
              <span className="text-lg font-bold text-[var(--color-primary)]">{zoneData.zone}</span>
              <span className="ml-1 text-xs text-[var(--color-text-muted)]">({zoneData.tempRange}°F)</span>
            </div>
            <div>
              <span className="font-medium text-[var(--color-text-muted)]">Last Frost:</span>{" "}
              <span className="font-bold text-[var(--color-text)]">{zoneData.lastFrostFormatted}</span>
            </div>
            <div>
              <span className="font-medium text-[var(--color-text-muted)]">First Frost:</span>{" "}
              <span className="font-bold text-[var(--color-text)]">{zoneData.firstFrostFormatted}</span>
            </div>
            <div>
              <span className="font-medium text-[var(--color-text-muted)]">Growing Season:</span>{" "}
              <span className="font-bold text-[var(--color-text)]">{zoneData.growingSeason} days</span>
            </div>
          </div>
          {nowCount > 0 && (
            <p className="mt-3 text-sm font-semibold text-[var(--color-primary)]">
              🌱 {nowCount} vegetable{nowCount > 1 ? "s" : ""} ready to plant right now!
            </p>
          )}
        </div>
      )}

      {/* Filters */}
      {zoneData && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === "all"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
            }`}
          >
            All ({plantingSchedule.length})
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => {
            const count = plantingSchedule.filter((v) => v.category === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === key
                    ? "text-white"
                    : "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
                }`}
                style={filter === key ? { backgroundColor: cat.color } : undefined}
              >
                {cat.label} ({count})
              </button>
            );
          })}

          <label className="ml-auto flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <input
              type="checkbox"
              checked={showIndoor}
              onChange={(e) => setShowIndoor(e.target.checked)}
              className="rounded"
            />
            Show indoor start dates
          </label>
        </div>
      )}

      {/* Planting Schedule Table */}
      {zoneData && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full text-sm" style={{ minWidth: 650 }}>
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <th className="px-4 py-3 text-left font-semibold text-[var(--color-text)]">Vegetable</th>
                {showIndoor && (
                  <th className="px-3 py-3 text-center font-semibold text-[var(--color-text)]">Start Indoors</th>
                )}
                <th className="px-3 py-3 text-center font-semibold text-[var(--color-text)]">
                  Transplant / Sow
                </th>
                <th className="px-3 py-3 text-center font-semibold text-[var(--color-text)]">Harvest</th>
                <th className="px-3 py-3 text-center font-semibold text-[var(--color-text)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.map((veg) => {
                const status = STATUS_STYLES[veg.primaryStatus];
                return (
                  <tr
                    key={veg.name}
                    className={`border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-alt)] ${
                      veg.primaryStatus === "now" ? "bg-green-50/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{veg.icon}</span>
                        <div>
                          <div className="font-semibold text-[var(--color-text)]">{veg.name}</div>
                          <div className="text-[10px] text-[var(--color-text-muted)]">{veg.notes}</div>
                        </div>
                      </div>
                    </td>
                    {showIndoor && (
                      <td className="px-3 py-3 text-center">
                        {veg.indoorDate ? (
                          <span className={`text-xs font-medium ${
                            getTimeStatus(veg.indoorDate) === "now" ? "text-green-700 font-bold" : "text-[var(--color-text-muted)]"
                          }`}>
                            {fmtDate(veg.indoorDate)}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-3 py-3 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        {veg.transplantDate && (
                          <span className={`text-xs font-semibold ${
                            getTimeStatus(veg.transplantDate) === "now" ? "text-green-700" : "text-[var(--color-text)]"
                          }`}>
                            🌱 {fmtDate(veg.transplantDate)}
                          </span>
                        )}
                        {veg.directSowDate ? (
                          <span className={`text-xs ${
                            getTimeStatus(veg.directSowDate) === "now" ? "font-semibold text-green-700" : "text-[var(--color-text-muted)]"
                          }`}>
                            🌰 {fmtDate(veg.directSowDate)}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">Transplant only</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-[var(--color-text-muted)]">
                      {fmtDateRange(veg.harvestStart, veg.harvestEnd)}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {zoneData && (
        <ShareResults
          title={`Zone ${zoneData.zone} Planting Calendar`}
          text={`I'm in Zone ${zoneData.zone} (ZIP ${zoneData.zip}). Last frost: ${zoneData.lastFrostFormatted}. ${nowCount} vegetables ready to plant now!`}
        />
      )}

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Get Started Growing
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={`https://www.amazon.com/s?k=seed+starting+kit+indoor&tag=${AMAZON_TAG}&ascsubtag=planting-dates`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-5xl">🌱</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Seed Starting Kits</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Everything you need to start seeds indoors: trays, domes, grow lights, and seed starting mix.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$15 - $50</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=vegetable+seed+variety+pack&tag=${AMAZON_TAG}&ascsubtag=planting-dates`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
              <span className="text-5xl">🌰</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Vegetable Seed Variety Packs</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Heirloom and organic seed collections with 20-40 varieties. Non-GMO, tested for germination.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$15 - $30</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
        </div>
      </div>
      <FAQSection questions={plantingDatesFAQ} />
      <RelatedCalculators currentPath="/planting-dates" />
    </CalculatorLayout>
  );
}
