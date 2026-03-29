"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SelectInput from "@/components/SelectInput";
import NumberInput from "@/components/NumberInput";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { VEGETABLES } from "@/data/vegetables";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";
import { successionPlantingFAQ } from "@/data/faq-data";

const AMAZON_TAG = "kawaiiguy0f-pc-20";

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtShortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function addDays(d: Date, days: number): Date {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

function diffWeeks(a: Date, b: Date): number {
  const ms = Math.abs(b.getTime() - a.getTime());
  return Math.round(ms / (1000 * 60 * 60 * 24 * 7) * 10) / 10;
}

function getDefaultDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

interface SuccessionRow {
  index: number;
  plantDate: Date;
  harvestStartDate: Date;
  harvestEndDate: Date;
}

export default function SuccessionPlantingPage() {
  const [selectedVeg, setSelectedVeg] = useState(VEGETABLES[0].name);
  const [zone, setZone] = useState("6");
  const [frequency, setFrequency] = useState("2");
  const [numPlantings, setNumPlantings] = useState(4);
  const [firstPlantingDate, setFirstPlantingDate] = useState(getDefaultDate);

  const vegOptions = VEGETABLES.map((v) => ({
    value: v.name,
    label: `${v.icon} ${v.name}`,
  }));

  const zoneOptions = Array.from({ length: 13 }, (_, i) => ({
    value: String(i + 1),
    label: `Zone ${i + 1}`,
  }));

  const frequencyOptions = [
    { value: "1", label: "Every 1 week" },
    { value: "2", label: "Every 2 weeks" },
    { value: "3", label: "Every 3 weeks" },
    { value: "4", label: "Every 4 weeks" },
  ];

  const veg = VEGETABLES.find((v) => v.name === selectedVeg) || VEGETABLES[0];
  const zoneNum = parseInt(zone, 10);
  const freqWeeks = parseInt(frequency, 10);

  const zoneCompatible = zoneNum >= veg.minZone && zoneNum <= veg.maxZone;

  const schedule: SuccessionRow[] = useMemo(() => {
    const base = new Date(firstPlantingDate + "T00:00:00");
    if (isNaN(base.getTime())) return [];

    const rows: SuccessionRow[] = [];
    for (let i = 0; i < numPlantings; i++) {
      const plantDate = addDays(base, i * freqWeeks * 7);
      const harvestStartDate = addDays(plantDate, veg.daysToHarvest[0]);
      const harvestEndDate = addDays(plantDate, veg.daysToHarvest[1]);
      rows.push({ index: i + 1, plantDate, harvestStartDate, harvestEndDate });
    }
    return rows;
  }, [firstPlantingDate, numPlantings, freqWeeks, veg]);

  const totalHarvestWindow = useMemo(() => {
    if (schedule.length === 0) return 0;
    const firstHarvest = schedule[0].harvestStartDate;
    const lastHarvest = schedule[schedule.length - 1].harvestEndDate;
    return diffWeeks(firstHarvest, lastHarvest);
  }, [schedule]);

  const overlapPeriods = useMemo(() => {
    if (schedule.length < 2) return [];
    const overlaps: { start: Date; end: Date; plantings: number[] }[] = [];

    for (let i = 0; i < schedule.length - 1; i++) {
      const currentEnd = schedule[i].harvestEndDate;
      const nextStart = schedule[i + 1].harvestStartDate;

      if (currentEnd.getTime() > nextStart.getTime()) {
        // Find all plantings that overlap in this window
        const overlapStart = nextStart;
        const overlapEnd = currentEnd;
        const plantingIndices: number[] = [];

        for (const row of schedule) {
          if (
            row.harvestStartDate.getTime() <= overlapEnd.getTime() &&
            row.harvestEndDate.getTime() >= overlapStart.getTime()
          ) {
            plantingIndices.push(row.index);
          }
        }

        overlaps.push({
          start: overlapStart,
          end: overlapEnd,
          plantings: plantingIndices,
        });
      }
    }
    return overlaps;
  }, [schedule]);

  const hasResults = schedule.length > 0;

  return (
    <CalculatorLayout
      title="Succession Planting Planner"
      description="Plan staggered plantings for a continuous harvest. Select your vegetable, zone, and desired schedule to see exactly when to plant and when to expect each harvest."
      lastUpdated="March 2026"
      intro="Succession planting means sowing the same crop at regular intervals so you enjoy a steady supply instead of one big harvest. This planner calculates your planting and harvest dates, shows you the total harvest window, and highlights periods where multiple plantings produce at the same time."
    >
      <CalculatorSchema
        name="Succession Planting Planner"
        description="Plan staggered plantings for continuous harvest. Calculate planting dates, harvest windows, and overlap periods for any vegetable."
        url="https://plantingcalc.com/succession-planting"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          {
            name: "Succession Planting Planner",
            url: "https://plantingcalc.com/succession-planting",
          },
        ]}
      />

      {/* Inputs */}
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectInput
          label="Vegetable"
          value={selectedVeg}
          onChange={setSelectedVeg}
          options={vegOptions}
          helpText={`${veg.daysToHarvest[0]}-${veg.daysToHarvest[1]} days to harvest`}
        />
        <SelectInput
          label="USDA Hardiness Zone"
          value={zone}
          onChange={setZone}
          options={zoneOptions}
          helpText={`${veg.name} grows in zones ${veg.minZone}-${veg.maxZone}`}
        />
        <SelectInput
          label="Harvest Frequency"
          value={frequency}
          onChange={setFrequency}
          options={frequencyOptions}
          helpText="How often you want a new harvest ready"
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            First Planting Date
          </label>
          <input
            type="date"
            value={firstPlantingDate}
            onChange={(e) => setFirstPlantingDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] shadow-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            When to put in your first planting
          </p>
        </div>
      </div>

      <div className="mt-5">
        <SliderInput
          label="Number of Succession Plantings"
          value={numPlantings}
          onChange={setNumPlantings}
          min={2}
          max={8}
          unit="plantings"
        />
      </div>

      {/* Zone Warning */}
      {!zoneCompatible && (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Zone compatibility note:</strong> {veg.name} typically grows in
          zones {veg.minZone} to {veg.maxZone}. Zone {zoneNum} may not be ideal.
          Consider season extension techniques like row covers, cold frames, or
          greenhouses.
        </div>
      )}

      {/* Result Cards */}
      {hasResults && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            label="Total Plantings"
            value={String(numPlantings)}
            unit="rounds"
            icon="🌱"
            highlight
          />
          <ResultCard
            label="Harvest Window"
            value={String(totalHarvestWindow)}
            unit="weeks"
            icon="📅"
          />
          <ResultCard
            label="First Harvest"
            value={fmtShortDate(schedule[0].harvestStartDate)}
            unit=""
            icon="🥬"
          />
          <ResultCard
            label="Last Harvest"
            value={fmtShortDate(schedule[schedule.length - 1].harvestEndDate)}
            unit=""
            icon="🏁"
          />
        </div>
      )}

      {/* Schedule Table */}
      {hasResults && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">
            Planting Schedule for {veg.icon} {veg.name}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-sm" style={{ minWidth: 500 }}>
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-text)]">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-text)]">
                    Planting Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-text)]">
                    Harvest Window
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-[var(--color-text)]">
                    Days to Harvest
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr
                    key={row.index}
                    className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-alt)]"
                  >
                    <td className="px-4 py-3 font-semibold text-[var(--color-primary)]">
                      {row.index}
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--color-text)]">
                      {fmtDate(row.plantDate)}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">
                      {fmtShortDate(row.harvestStartDate)} to{" "}
                      {fmtShortDate(row.harvestEndDate)}
                    </td>
                    <td className="px-4 py-3 text-center text-[var(--color-text-muted)]">
                      {veg.daysToHarvest[0]}-{veg.daysToHarvest[1]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Overlap Periods */}
      {overlapPeriods.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-base font-semibold text-[var(--color-text)]">
            Harvest Overlap Periods
          </h3>
          <p className="mb-3 text-sm text-[var(--color-text-muted)]">
            During these windows, multiple plantings produce at the same time,
            giving you extra-abundant harvests.
          </p>
          <div className="space-y-2">
            {overlapPeriods.map((overlap, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5"
              >
                <span className="text-lg">🔄</span>
                <div className="text-sm">
                  <span className="font-semibold text-green-800">
                    {fmtShortDate(overlap.start)} to{" "}
                    {fmtShortDate(overlap.end)}
                  </span>
                  <span className="ml-2 text-green-700">
                    Plantings #{overlap.plantings.join(", #")} harvesting
                    together
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasResults && (
        <ShareResults
          title={`${veg.name} Succession Planting Plan`}
          text={`${numPlantings} plantings of ${veg.name} every ${freqWeeks} week${freqWeeks > 1 ? "s" : ""}, starting ${fmtDate(schedule[0].plantDate)}. Total harvest window: ${totalHarvestWindow} weeks.`}
        />
      )}

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Succession Planting Supplies
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={`https://www.amazon.com/s?k=seed+starting+kit+indoor&tag=${AMAZON_TAG}&ascsubtag=succession-planting`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-5xl">🌱</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Recommended
                </span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                  Ad
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                Seed Starting Kits
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Trays, domes, grow lights, and seed starting mix for getting each
                succession off to a strong start.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">
                  $15 - $50
                </span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                  View on Amazon &rarr;
                </span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=garden+row+markers+plant+labels&tag=${AMAZON_TAG}&ascsubtag=succession-planting`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
              <span className="text-5xl">🏷️</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Recommended
                </span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                  Ad
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                Plant Labels and Row Markers
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Keep track of which succession is which with weatherproof labels
                and date markers for your rows.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">
                  $8 - $20
                </span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                  View on Amazon &rarr;
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <EmailCapture variant="banner" context="succession-planting" />
      <FAQSection questions={successionPlantingFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          How This Calculator Works
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This planner takes your selected vegetable, planting frequency, and
          number of rounds, then calculates each planting date by adding the
          frequency interval to the previous date. Harvest windows are estimated
          using the crop&apos;s days-to-harvest range from agricultural extension
          data. Overlap periods are detected when one planting&apos;s harvest
          window intersects with the next, meaning you will have multiple
          plantings producing at once.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          Tips for Successful Succession Planting
        </h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>
            Start with fast-maturing crops like lettuce, radishes, and bush beans.
            These give you the most rounds per season and are forgiving if your
            timing is slightly off.
          </li>
          <li>
            Label each planting with the date so you can track which succession is
            which. This helps you dial in the ideal spacing for your specific
            conditions.
          </li>
          <li>
            Refresh the soil between plantings by working in a thin layer of
            compost. Each crop pulls nutrients from the soil, and replenishing
            between rounds keeps yields strong.
          </li>
          <li>
            Use our{" "}
            <a
              href="/planting-dates"
              className="text-[var(--color-primary)] hover:underline"
            >
              planting date calculator
            </a>{" "}
            to find your frost dates, then plan your first and last succession
            plantings within that window.
          </li>
        </ul>
      </div>

      <RelatedCalculators currentPath="/succession-planting" />
    </CalculatorLayout>
  );
}
