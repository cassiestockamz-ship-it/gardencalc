"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import NumberInput from "@/components/NumberInput";
import SelectInput from "@/components/SelectInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { VEGETABLES } from "@/data/vegetables";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";

// Yield per plant in lbs: [low, high]
const YIELD_RANGES: Record<string, [number, number]> = {
  "Tomato": [10, 15],
  "Pepper": [3, 5],
  "Zucchini": [6, 10],
  "Cucumber": [5, 8],
  "Green Bean (Bush)": [0.5, 1],
  "Green Bean (Pole)": [0.5, 1],
  "Lettuce": [0.5, 1],
  "Carrot": [0.5, 0.75],
  "Kale": [2, 3],
  "Potato": [3, 5],
  "Sweet Corn": [0.5, 1], // 1-2 ears at 0.5 lb each
  "Onion": [0.5, 1],
  "Pea": [0.25, 0.5],
  "Radish": [0.1, 0.2],
  "Beet": [0.5, 0.75],
  "Spinach": [0.3, 0.5],
};

const DEFAULT_YIELD: [number, number] = [1, 2];

// Average grocery price per lb
const GROCERY_PRICE_PER_LB = 3;

// Approximate square feet per plant (based on spacing data)
function sqftPerPlant(vegName: string): number {
  const veg = VEGETABLES.find((v) => v.name === vegName);
  if (!veg) return 2;
  return (veg.spacingInches * veg.rowSpacingInches) / 144;
}

function getYieldRange(name: string): [number, number] {
  return YIELD_RANGES[name] || DEFAULT_YIELD;
}

function getAvgYield(name: string): number {
  const [lo, hi] = getYieldRange(name);
  return (lo + hi) / 2;
}

const yieldEstimatorFAQ = [
  {
    question: "How much food can a small garden produce?",
    answer:
      "A well-maintained 4x8-foot raised bed can produce 20 to 60 lbs of produce per growing season, depending on what you plant. High-yielding crops like tomatoes, zucchini, and cucumbers contribute the most weight. Succession planting and intensive spacing can push yields even higher. Most families find that 100 to 200 square feet of garden space provides a meaningful supplement to their grocery shopping.",
  },
  {
    question: "Which vegetables produce the highest yield per plant?",
    answer:
      "Tomatoes are the highest yielding plant for most home gardens, producing 10 to 15 lbs per plant over a season. Zucchini comes in second at 6 to 10 lbs per plant and is famously productive. Cucumbers yield 5 to 8 lbs per plant when kept well watered. Potatoes and peppers each produce 3 to 5 lbs per plant. For maximum harvest weight from a small space, focus on these heavy producers.",
  },
  {
    question: "How accurate are garden yield estimates?",
    answer:
      "Yield estimates are averages based on typical home garden conditions. Actual results vary significantly based on soil quality, sunlight hours, watering consistency, local climate, pest pressure, and the specific variety you grow. First-year gardeners often see lower yields while they learn. Experienced gardeners with optimized soil and season extension techniques can exceed the high end of these ranges by 30% or more.",
  },
  {
    question: "How do I maximize vegetable yield in a small space?",
    answer:
      "Focus on vertical growing for tomatoes, cucumbers, and pole beans to save ground space. Use succession planting so you harvest one crop and immediately replant another. Interplant fast-maturing crops (radishes, lettuce) between slower ones. Keep soil fertility high with compost, and water consistently. Square foot gardening methods can increase yield per area by 2 to 5 times compared to traditional row planting.",
  },
  {
    question: "How much money can a home garden save on groceries?",
    answer:
      "A productive home garden can save $300 to $600 or more per season on groceries, depending on size and what you grow. At an average grocery price of $3 per lb for fresh produce, a garden yielding 100 to 200 lbs saves $300 to $600 in a single season. High-value crops like tomatoes, peppers, and herbs offer the best return on investment because store-bought organic versions are especially expensive.",
  },
];

export default function YieldEstimatorPage() {
  const noneOption = { value: "__none__", label: "-- None --" };
  const vegOptions = [
    noneOption,
    ...VEGETABLES.map((v) => ({
      value: v.name,
      label: `${v.icon} ${v.name}`,
    })),
  ];

  const [selections, setSelections] = useState<string[]>([
    "Tomato",
    "Zucchini",
    "Pepper",
    "__none__",
    "__none__",
  ]);
  const [plantCounts, setPlantCounts] = useState<number[]>([5, 5, 5, 5, 5]);

  const updateSelection = (index: number, value: string) => {
    setSelections((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const updatePlantCount = (index: number, value: number) => {
    setPlantCounts((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const results = useMemo(() => {
    const activeVegs: { name: string; plants: number; yieldPerPlant: number; totalYield: number; sqft: number }[] = [];

    for (let i = 0; i < 5; i++) {
      if (selections[i] !== "__none__") {
        const name = selections[i];
        const plants = plantCounts[i];
        const avgYield = getAvgYield(name);
        const total = plants * avgYield;
        const sqft = plants * sqftPerPlant(name);
        activeVegs.push({ name, plants, yieldPerPlant: avgYield, totalYield: total, sqft });
      }
    }

    const totalYield = activeVegs.reduce((sum, v) => sum + v.totalYield, 0);
    const totalSqft = activeVegs.reduce((sum, v) => sum + v.sqft, 0);
    const groceryValue = totalYield * GROCERY_PRICE_PER_LB;
    const yieldPerSqft = totalSqft > 0 ? totalYield / totalSqft : 0;

    const topProducer = activeVegs.length > 0
      ? activeVegs.reduce((best, v) => (v.totalYield > best.totalYield ? v : best))
      : null;

    return { activeVegs, totalYield, groceryValue, topProducer, yieldPerSqft, totalSqft };
  }, [selections, plantCounts]);

  const fmt = (n: number) => (n % 1 === 0 ? String(n) : n.toFixed(1));

  return (
    <CalculatorLayout
      title="Garden Yield Estimator"
      description="Estimate how much produce your garden will harvest this season. Select up to 5 vegetables and see total yield in pounds, grocery value, and per-plant expectations."
      lastUpdated="March 2026"
    >
      <CalculatorSchema
        name="Garden Yield Estimator"
        description="Estimate expected harvest weight from your garden. Select vegetables, enter plant counts, and see total yield in pounds plus estimated grocery value."
        url="https://plantingcalc.com/yield-estimator"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Garden Yield Estimator", url: "https://plantingcalc.com/yield-estimator" },
        ]}
      />

      {/* Inputs */}
      <div className="space-y-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="grid gap-4 sm:grid-cols-2 items-end">
            <SelectInput
              label={`Vegetable ${i + 1}`}
              value={selections[i]}
              onChange={(val) => updateSelection(i, val)}
              options={vegOptions}
            />
            {selections[i] !== "__none__" && (
              <NumberInput
                label="Number of Plants"
                value={plantCounts[i]}
                onChange={(val) => updatePlantCount(i, val)}
                min={1}
                max={100}
                step={1}
                unit="plants"
              />
            )}
          </div>
        ))}
      </div>

      {/* Results */}
      {results.activeVegs.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
            Estimated Garden Harvest
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard
              label="Total Yield"
              value={fmt(results.totalYield)}
              unit="lbs"
              highlight
              icon="🥗"
            />
            <ResultCard
              label="Estimated Grocery Value"
              value={`$${fmt(results.groceryValue)}`}
              unit="saved"
              icon="💰"
            />
            <ResultCard
              label="Top Producer"
              value={results.topProducer ? results.topProducer.name : "N/A"}
              unit={results.topProducer ? `${fmt(results.topProducer.totalYield)} lbs` : ""}
              icon="🏆"
            />
            <ResultCard
              label="Yield Per Sq Ft"
              value={fmt(results.yieldPerSqft)}
              unit="lbs/sqft"
              icon="📐"
            />
          </div>

          {/* Per-vegetable breakdown */}
          <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
              Per-Vegetable Breakdown
            </h3>
            <div className="space-y-3">
              {results.activeVegs.map((v) => {
                const veg = VEGETABLES.find((ve) => ve.name === v.name);
                const icon = veg ? veg.icon : "🌱";
                const [lo, hi] = getYieldRange(v.name);
                const pct = results.totalYield > 0 ? (v.totalYield / results.totalYield) * 100 : 0;

                return (
                  <div key={v.name} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[var(--color-text)]">
                        {icon} {v.name} ({v.plants} plants)
                      </span>
                      <span className="font-semibold text-[var(--color-text)]">
                        {fmt(v.totalYield)} lbs
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 rounded-full bg-[var(--color-border)]">
                        <div
                          className="h-2.5 rounded-full bg-[var(--color-ev-green)]"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)] w-16 text-right">
                        {fmt(lo)}-{fmt(hi)} lb/plant
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              Yield estimates use average values from the expected range per plant. Actual harvest depends on soil quality, sunlight, water, and variety.
            </p>
          </div>

          {/* Space estimate */}
          <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
            <h3 className="mb-2 text-sm font-semibold text-[var(--color-text)]">
              Space Requirements
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Based on recommended spacing, this garden plan needs approximately{" "}
              <span className="font-semibold text-[var(--color-text)]">{fmt(results.totalSqft)} sq ft</span>{" "}
              of growing space (about a {fmt(Math.sqrt(results.totalSqft))} x {fmt(Math.sqrt(results.totalSqft))} foot area).
            </p>
          </div>

          <ShareResults
            title={`Garden Yield: ${fmt(results.totalYield)} lbs`}
            text={`My garden plan: ${results.activeVegs.map((v) => `${v.plants} ${v.name.toLowerCase()}`).join(", ")}. Estimated yield: ${fmt(results.totalYield)} lbs (~$${fmt(results.groceryValue)} in grocery value).`}
          />
        </div>
      )}

      {results.activeVegs.length === 0 && (
        <div className="mt-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-8 text-center">
          <p className="text-lg text-[var(--color-text-muted)]">
            Select at least one vegetable above to see your estimated harvest.
          </p>
        </div>
      )}

      <FAQSection questions={yieldEstimatorFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How This Calculator Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This yield estimator uses average harvest weights per plant based on data from university agricultural extension programs and experienced home gardeners. Each vegetable has a yield range (for example, tomatoes produce 10 to 15 lbs per plant), and the calculator uses the midpoint of that range multiplied by your plant count. Space requirements are calculated from recommended in-row and between-row spacing for each vegetable.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Tips for Maximizing Your Harvest</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>Healthy soil is the single biggest factor in yield. Add 2 to 3 inches of compost before each growing season and consider a <a href="/fertilizer" className="text-[var(--color-primary)] hover:underline">fertilizer plan</a> for heavy feeders like tomatoes and corn.</li>
          <li>Consistent watering prevents blossom end rot in tomatoes and bitter cucumbers. Use the <a href="/watering" className="text-[var(--color-primary)] hover:underline">watering calculator</a> to dial in your schedule.</li>
          <li>Harvest frequently. Picking zucchini, cucumbers, and beans regularly signals the plant to keep producing. Leaving overripe fruit on the vine reduces total yield.</li>
          <li>Use the <a href="/seed-spacing" className="text-[var(--color-primary)] hover:underline">seed spacing calculator</a> to make sure your plants have enough room to reach their full potential.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="yield-estimator" />
      <RelatedCalculators currentPath="/yield-estimator" />
    </CalculatorLayout>
  );
}
