"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SelectInput from "@/components/SelectInput";
import NumberInput from "@/components/NumberInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";
import { VEGETABLES } from "@/data/vegetables";
import { harvestDateFAQ } from "@/data/faq-data";

type GrowingCondition = "ideal" | "average" | "challenging";

const CONDITION_OPTIONS = [
  { value: "ideal", label: "Ideal (full sun, great soil, consistent water)" },
  { value: "average", label: "Average (typical home garden)" },
  { value: "challenging", label: "Challenging (partial shade, poor soil, or inconsistent care)" },
];

const ZONE_OPTIONS = Array.from({ length: 13 }, (_, i) => ({
  value: String(i + 1),
  label: `Zone ${i + 1}`,
}));

const VEGETABLE_OPTIONS = VEGETABLES.map((v) => ({
  value: v.name,
  label: `${v.icon} ${v.name}`,
}));

function getTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function fmtShortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function addDays(dateStr: string, days: number): Date {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d;
}

function daysBetween(d1: Date, d2: Date): number {
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function getHarvestDays(
  daysToHarvest: [number, number],
  condition: GrowingCondition
): number {
  const [min, max] = daysToHarvest;
  switch (condition) {
    case "ideal":
      return min;
    case "average":
      return Math.round((min + max) / 2);
    case "challenging":
      return Math.round(max * 1.1);
  }
}

function getGrowingTips(vegName: string): string[] {
  const tips: Record<string, string[]> = {
    Tomato: [
      "Stake or cage plants early to support heavy fruit.",
      "Remove suckers below the first flower cluster for indeterminate varieties.",
      "Water consistently to prevent blossom end rot.",
      "Harvest when fully colored but still firm for best flavor.",
    ],
    Pepper: [
      "Wait until soil temperature reaches 65F before transplanting.",
      "Pick peppers green for a milder flavor, or let them ripen to red for sweeter taste.",
      "Pinch early flowers to encourage bushier growth and higher yields.",
    ],
    Cucumber: [
      "Trellis vining types to save space and improve air circulation.",
      "Pick cucumbers when they are 6 to 8 inches long for best texture.",
      "Water at the base to reduce powdery mildew risk.",
    ],
    Lettuce: [
      "Harvest outer leaves first for a continuous supply (cut-and-come-again).",
      "Provide afternoon shade in warm weather to delay bolting.",
      "Succession plant every 2 weeks for an extended harvest window.",
    ],
    Carrot: [
      "Thin seedlings to 2 inches apart once they reach 2 inches tall.",
      "Carrots are sweeter after a light frost.",
      "Loosen soil deeply before planting so roots grow straight.",
    ],
    Zucchini: [
      "Harvest at 6 to 8 inches for the best flavor and texture.",
      "Check plants daily during peak season; they grow fast.",
      "Hand-pollinate if fruit is not setting by transferring pollen with a small brush.",
    ],
  };

  return (
    tips[vegName] || [
      "Water consistently, especially during fruit or root development.",
      "Mulch around plants to retain moisture and suppress weeds.",
      "Harvest in the morning when vegetables are cool and crisp.",
    ]
  );
}

export default function HarvestDatePage() {
  const [selectedVeg, setSelectedVeg] = useState(VEGETABLES[0].name);
  const [plantingDate, setPlantingDate] = useState(getTodayString());
  const [zone, setZone] = useState("7");
  const [condition, setCondition] = useState<GrowingCondition>("average");

  const vegetable = useMemo(
    () => VEGETABLES.find((v) => v.name === selectedVeg) || VEGETABLES[0],
    [selectedVeg]
  );

  const results = useMemo(() => {
    const harvestDays = getHarvestDays(vegetable.daysToHarvest, condition);
    const harvestDate = addDays(plantingDate, harvestDays);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysRemaining = daysBetween(today, harvestDate);

    const earliestHarvest = addDays(plantingDate, vegetable.daysToHarvest[0]);
    const latestHarvest = addDays(
      plantingDate,
      condition === "challenging"
        ? Math.round(vegetable.daysToHarvest[1] * 1.1)
        : vegetable.daysToHarvest[1]
    );

    const windowDays = daysBetween(earliestHarvest, latestHarvest);

    const zoneNum = parseInt(zone, 10);
    const zoneCompatible =
      zoneNum >= vegetable.minZone && zoneNum <= vegetable.maxZone;

    return {
      harvestDays,
      harvestDate,
      daysRemaining,
      earliestHarvest,
      latestHarvest,
      windowDays,
      zoneCompatible,
    };
  }, [vegetable, plantingDate, condition, zone]);

  const tips = useMemo(() => getGrowingTips(selectedVeg), [selectedVeg]);

  // Timeline calculations for visual
  const timeline = useMemo(() => {
    const plantDate = new Date(plantingDate + "T00:00:00");
    const totalSpan = daysBetween(plantDate, results.latestHarvest);
    if (totalSpan <= 0) return null;

    const earliestPct = Math.round(
      (daysBetween(plantDate, results.earliestHarvest) / totalSpan) * 100
    );
    const estimatedPct = Math.round(
      (daysBetween(plantDate, results.harvestDate) / totalSpan) * 100
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDays = daysBetween(plantDate, today);
    const todayPct = Math.max(0, Math.min(100, Math.round((todayDays / totalSpan) * 100)));

    return { earliestPct, estimatedPct, todayPct, totalSpan };
  }, [plantingDate, results]);

  const hasResults = plantingDate.length > 0;

  return (
    <CalculatorLayout
      title="Harvest Date Calculator"
      description="Estimate when your vegetables will be ready to harvest based on the crop, planting date, USDA zone, and growing conditions."
      lastUpdated="March 2026"
      intro="Knowing when to expect your harvest helps you plan meals, succession plantings, and fall garden prep. Select your vegetable, enter the date you planted (or plan to plant), and adjust for your growing conditions to get a personalized harvest timeline."
    >
      <CalculatorSchema
        name="Harvest Date Calculator"
        description="Estimate when vegetables will be ready to harvest based on crop type, planting date, hardiness zone, and growing conditions."
        url="https://plantingcalc.com/harvest-date"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Harvest Date Calculator", url: "https://plantingcalc.com/harvest-date" },
        ]}
      />

      {/* Inputs */}
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectInput
          label="Vegetable"
          value={selectedVeg}
          onChange={(v) => setSelectedVeg(v)}
          options={VEGETABLE_OPTIONS}
          helpText={`${vegetable.daysToHarvest[0]}-${vegetable.daysToHarvest[1]} days to harvest`}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Planting Date
          </label>
          <input
            type="date"
            value={plantingDate}
            onChange={(e) => setPlantingDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] shadow-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>
        <SelectInput
          label="USDA Hardiness Zone"
          value={zone}
          onChange={(v) => setZone(v)}
          options={ZONE_OPTIONS}
          helpText="Used to check crop compatibility"
        />
        <SelectInput
          label="Growing Conditions"
          value={condition}
          onChange={(v) => setCondition(v as GrowingCondition)}
          options={CONDITION_OPTIONS}
          helpText="Affects estimated maturity speed"
        />
      </div>

      {/* Zone Warning */}
      {!results.zoneCompatible && (
        <div className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            {vegetable.icon} {vegetable.name} is typically grown in Zones{" "}
            {vegetable.minZone}-{vegetable.maxZone}. Zone {zone} may be outside
            the recommended range. Consider season extension methods like row
            covers, cold frames, or greenhouses for best results.
          </p>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">
            {vegetable.icon} {vegetable.name} Harvest Estimate
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <ResultCard
              label="Estimated Harvest Date"
              value={fmtShortDate(results.harvestDate)}
              unit={String(results.harvestDate.getFullYear())}
              highlight
              icon="📅"
            />
            <ResultCard
              label="Days Until Harvest"
              value={
                results.daysRemaining >= 0
                  ? String(results.daysRemaining)
                  : "Past due"
              }
              unit={results.daysRemaining >= 0 ? "days" : ""}
              icon="⏳"
            />
            <ResultCard
              label="Harvest Window"
              value={`${results.windowDays}`}
              unit={`days (${fmtShortDate(results.earliestHarvest)} to ${fmtShortDate(results.latestHarvest)})`}
              icon="📊"
            />
          </div>

          {/* Visual Timeline */}
          {timeline && (
            <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
                Growing Timeline
              </h3>
              <div className="relative">
                {/* Track */}
                <div className="relative h-8 w-full overflow-hidden rounded-full bg-[var(--color-surface-alt)]">
                  {/* Growing phase */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-l-full bg-green-200"
                    style={{ width: `${timeline.earliestPct}%` }}
                  />
                  {/* Harvest window */}
                  <div
                    className="absolute inset-y-0 rounded-r-full bg-green-500/40"
                    style={{
                      left: `${timeline.earliestPct}%`,
                      width: `${100 - timeline.earliestPct}%`,
                    }}
                  />
                  {/* Estimated harvest marker */}
                  <div
                    className="absolute inset-y-0 w-0.5 bg-green-700"
                    style={{ left: `${timeline.estimatedPct}%` }}
                  />
                  {/* Today marker */}
                  {timeline.todayPct > 0 && timeline.todayPct < 100 && (
                    <div
                      className="absolute inset-y-0 w-0.5 bg-blue-600"
                      style={{ left: `${timeline.todayPct}%` }}
                    />
                  )}
                </div>

                {/* Labels below track */}
                <div className="mt-2 flex justify-between text-[10px] font-medium text-[var(--color-text-muted)]">
                  <span>Planted {fmtShortDate(new Date(plantingDate + "T00:00:00"))}</span>
                  <span>Earliest: {fmtShortDate(results.earliestHarvest)}</span>
                  <span>Latest: {fmtShortDate(results.latestHarvest)}</span>
                </div>

                {/* Legend */}
                <div className="mt-3 flex flex-wrap gap-4 text-[10px] text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-200" /> Growing
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500/40" /> Harvest Window
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-0.5 bg-green-700" /> Est. Harvest
                  </span>
                  {timeline.todayPct > 0 && timeline.todayPct < 100 && (
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-2.5 w-0.5 bg-blue-600" /> Today
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Growing Tips */}
          <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
              {vegetable.icon} Growing Tips for {vegetable.name}
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]"
                >
                  <span className="mt-0.5 text-green-500">&#10003;</span>
                  {tip}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-[var(--color-text-muted)]">
              {vegetable.notes}
            </p>
          </div>

          {/* Condition breakdown */}
          <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
              Harvest by Growing Conditions
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["ideal", "average", "challenging"] as const).map((c) => {
                const days = getHarvestDays(vegetable.daysToHarvest, c);
                const date = addDays(plantingDate, days);
                const isActive = c === condition;
                return (
                  <div
                    key={c}
                    className={`rounded-lg border p-4 text-center transition-colors ${
                      isActive
                        ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {c}
                    </div>
                    <div
                      className={`mt-1 text-lg font-bold ${
                        isActive
                          ? "text-[var(--color-primary)]"
                          : "text-[var(--color-text)]"
                      }`}
                    >
                      {days} days
                    </div>
                    <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                      {fmtShortDate(date)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <ShareResults
            title={`${vegetable.name} Harvest Date`}
            text={`My ${vegetable.name} (planted ${fmtShortDate(new Date(plantingDate + "T00:00:00"))}) should be ready to harvest around ${fmtDate(results.harvestDate)} (${results.harvestDays} days). Harvest window: ${fmtShortDate(results.earliestHarvest)} to ${fmtShortDate(results.latestHarvest)}.`}
          />
        </div>
      )}

      <EmailCapture variant="banner" context="harvest-date" />
      <FAQSection questions={harvestDateFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          How This Calculator Works
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This harvest date calculator uses days-to-harvest data from agricultural
          extension services and seed catalog averages for each vegetable. Every
          crop has a minimum and maximum maturity range. The calculator adjusts
          this range based on your selected growing conditions: ideal conditions
          use the minimum days (best-case scenario with full sun, rich soil, and
          consistent watering), average conditions use the midpoint, and
          challenging conditions add 10% beyond the maximum to account for slower
          growth from shade, poor drainage, or inconsistent care.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          Tips for Harvesting at the Right Time
        </h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>
            Most vegetables are best harvested in the morning when temperatures
            are cool and moisture content is highest. This gives you the crispest
            greens and firmest fruits.
          </li>
          <li>
            Check plants daily once you enter the harvest window. Many crops
            like zucchini and cucumbers can go from perfect to overgrown in just
            a day or two.
          </li>
          <li>
            Use clean, sharp tools when harvesting. Tearing or breaking stems
            can damage the plant and reduce future yields. Pruning shears work
            well for tomatoes, peppers, and eggplant.
          </li>
          <li>
            Root vegetables like carrots, beets, and parsnips can often stay in
            the ground past their maturity date without losing quality. A light
            frost actually improves the flavor of many root crops and brassicas.
          </li>
          <li>
            Track your actual harvest dates each season and compare them to the
            estimates. Over time, you will build a personal database of maturity
            timelines specific to your garden conditions. Use the{" "}
            <a
              href="/planting-dates"
              className="text-[var(--color-primary)] hover:underline"
            >
              planting date calculator
            </a>{" "}
            to plan your next round of plantings.
          </li>
        </ul>
      </div>

      <RelatedCalculators currentPath="/harvest-date" />
    </CalculatorLayout>
  );
}
