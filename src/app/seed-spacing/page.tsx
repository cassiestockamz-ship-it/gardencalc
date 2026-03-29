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
import { seedSpacingFAQ } from "@/data/faq-data";

const AMAZON_TAG = "kawaiiguy0f-pc-20";

// Rough yield per plant in lbs (conservative averages)
const YIELD_PER_PLANT: Record<string, number> = {
  "Lettuce": 0.5,
  "Spinach": 0.3,
  "Kale": 1.5,
  "Swiss Chard": 1.0,
  "Arugula": 0.25,
  "Broccoli": 1.0,
  "Cabbage": 2.5,
  "Cauliflower": 1.5,
  "Brussels Sprouts": 1.5,
  "Tomato": 10,
  "Pepper": 3,
  "Cucumber": 5,
  "Zucchini": 8,
  "Squash (Winter)": 5,
  "Eggplant": 4,
  "Watermelon": 15,
  "Pumpkin": 10,
  "Carrot": 0.25,
  "Beet": 0.3,
  "Radish": 0.1,
  "Potato": 2,
  "Sweet Potato": 2.5,
  "Turnip": 0.5,
  "Parsnip": 0.5,
  "Green Bean (Bush)": 0.5,
  "Green Bean (Pole)": 0.75,
  "Pea": 0.25,
  "Onion": 0.5,
  "Garlic": 0.15,
  "Leek": 0.5,
  "Basil": 0.5,
  "Cilantro": 0.2,
  "Dill": 0.2,
  "Parsley": 0.3,
  "Sweet Corn": 0.5,
};

export default function SeedSpacingPage() {
  const [selectedVeg, setSelectedVeg] = useState(VEGETABLES[0].name);
  const [bedWidth, setBedWidth] = useState(4);
  const [bedLength, setBedLength] = useState(8);

  const vegOptions = VEGETABLES.map((v) => ({
    value: v.name,
    label: `${v.icon} ${v.name}`,
  }));

  const veg = VEGETABLES.find((v) => v.name === selectedVeg) || VEGETABLES[0];

  const results = useMemo(() => {
    const bedWidthIn = bedWidth * 12;
    const bedLengthIn = bedLength * 12;

    // Number of rows that fit across the bed width
    const numRows = Math.max(1, Math.floor(bedWidthIn / veg.rowSpacingInches));
    // Number of plants per row along the bed length
    const plantsPerRow = Math.max(1, Math.floor(bedLengthIn / veg.spacingInches));
    // Total plants
    const totalPlants = numRows * plantsPerRow;

    // Yield
    const yieldPerPlant = YIELD_PER_PLANT[veg.name] || 0.5;
    const totalYield = totalPlants * yieldPerPlant;

    // Days to harvest (average)
    const avgDaysToHarvest = Math.round((veg.daysToHarvest[0] + veg.daysToHarvest[1]) / 2);

    return {
      numRows,
      plantsPerRow,
      totalPlants,
      yieldPerPlant,
      totalYield,
      avgDaysToHarvest,
      seedDepth: veg.depthInches,
      spacingIn: veg.spacingInches,
      rowSpacingIn: veg.rowSpacingInches,
    };
  }, [veg, bedWidth, bedLength]);

  const fmt = (n: number) => (n % 1 === 0 ? String(n) : n.toFixed(1));

  // Generate spacing visualization grid
  const visRows = Math.min(results.numRows, 8);
  const visCols = Math.min(results.plantsPerRow, 12);

  return (
    <CalculatorLayout
      title="Seed Spacing & Yield Calculator"
      description="Select a vegetable and enter your bed dimensions to see how many plants fit, estimated yield, seed depth, and optimal spacing."
      lastUpdated="March 2026"
    >
      <CalculatorSchema
        name="Seed Spacing & Yield Calculator"
        description="Calculate how many plants fit in your garden bed based on recommended spacing. Shows estimated yield, seed depth, and visual spacing diagrams."
        url="https://plantingcalc.com/seed-spacing"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://plantingcalc.com" }, { name: "Seed Spacing Calculator", url: "https://plantingcalc.com/seed-spacing" }]} />

      {/* Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <SelectInput
            label="Vegetable"
            value={selectedVeg}
            onChange={setSelectedVeg}
            options={vegOptions}
            helpText={veg.notes}
          />
        </div>

        <NumberInput
          label="Bed Width"
          value={bedWidth}
          onChange={setBedWidth}
          min={1}
          max={30}
          step={0.5}
          unit="feet"
        />

        <NumberInput
          label="Bed Length"
          value={bedLength}
          onChange={setBedLength}
          min={1}
          max={100}
          step={0.5}
          unit="feet"
        />
      </div>

      {/* Results */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Spacing Results for {veg.icon} {veg.name}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResultCard
            label="Plants Per Bed"
            value={String(results.totalPlants)}
            unit="plants"
            highlight
            icon="🌱"
          />
          <ResultCard
            label="Plants Per Row"
            value={String(results.plantsPerRow)}
            unit="plants"
            icon="📏"
          />
          <ResultCard
            label="Number of Rows"
            value={String(results.numRows)}
            unit="rows"
            icon="📐"
          />
          <ResultCard
            label="Seed Depth"
            value={results.seedDepth === 0 ? "Surface" : fmt(results.seedDepth)}
            unit={results.seedDepth === 0 ? "sow" : "inches"}
            icon="🕳️"
          />
          <ResultCard
            label="Days to Harvest"
            value={`${veg.daysToHarvest[0]}–${veg.daysToHarvest[1]}`}
            unit="days"
            icon="📅"
          />
          <ResultCard
            label="Estimated Yield"
            value={fmt(results.totalYield)}
            unit="lbs"
            icon="🥗"
          />
        </div>

        {/* Row Spacing Diagram */}
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            Row Spacing Diagram
          </h3>
          <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <div className="h-px w-6 bg-[var(--color-primary)]" />
                  <span className="text-xs font-semibold text-[var(--color-primary)]">{results.spacingIn}&quot;</span>
                  <div className="h-px w-6 bg-[var(--color-primary)]" />
                </div>
                <span className="mt-1 text-[10px]">Plant Spacing (in-row)</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <div className="h-px w-6 bg-[var(--color-ev-green)]" />
                  <span className="text-xs font-semibold text-[var(--color-ev-green)]">{results.rowSpacingIn}&quot;</span>
                  <div className="h-px w-6 bg-[var(--color-ev-green)]" />
                </div>
                <span className="mt-1 text-[10px]">Row Spacing</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <div className="h-px w-6 bg-amber-500" />
                  <span className="text-xs font-semibold text-amber-600">{results.seedDepth === 0 ? "Surface" : `${fmt(results.seedDepth)}"`}</span>
                  <div className="h-px w-6 bg-amber-500" />
                </div>
                <span className="mt-1 text-[10px]">Seed Depth</span>
              </div>
            </div>
          </div>

          {/* Cross-section */}
          <div className="mt-5 flex items-end justify-center gap-1">
            {Array.from({ length: Math.min(results.numRows, 6) }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-lg">{veg.icon}</span>
                <div
                  className="mt-1 w-8 rounded-t bg-amber-700/40"
                  style={{ height: `${Math.max(8, results.seedDepth * 12)}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mx-auto mt-0 h-2 rounded-b bg-amber-800/20" style={{ width: `${Math.min(results.numRows, 6) * 44}px` }} />
          <p className="mt-2 text-center text-[10px] text-[var(--color-text-muted)]">
            Cross-section view &middot; {results.numRows} row{results.numRows !== 1 ? "s" : ""} across {bedWidth}ft bed
          </p>
        </div>

        {/* Spacing Visualization */}
        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            Spacing Visualization ({bedWidth}ft x {bedLength}ft bed)
          </h3>
          <div className="overflow-x-auto">
            <div className="inline-block rounded-lg border-2 border-amber-700/30 bg-amber-800/10 p-3">
              {Array.from({ length: visRows }).map((_, row) => (
                <div key={row} className="flex items-center gap-2" style={{ marginBottom: row < visRows - 1 ? `${Math.min(results.rowSpacingIn / 3, 12)}px` : 0 }}>
                  {Array.from({ length: visCols }).map((_, col) => (
                    <div
                      key={col}
                      className="flex items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-sm"
                      style={{
                        width: `${Math.max(20, Math.min(32, results.spacingIn))}px`,
                        height: `${Math.max(20, Math.min(32, results.spacingIn))}px`,
                      }}
                    >
                      {veg.icon}
                    </div>
                  ))}
                  {results.plantsPerRow > visCols && (
                    <span className="text-xs text-[var(--color-text-muted)]">+{results.plantsPerRow - visCols}</span>
                  )}
                </div>
              ))}
              {results.numRows > visRows && (
                <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">+{results.numRows - visRows} more row{results.numRows - visRows !== 1 ? "s" : ""}</p>
              )}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
            {results.totalPlants} plants total &middot; {results.spacingIn}&quot; apart in rows &middot; {results.rowSpacingIn}&quot; between rows
          </p>
        </div>

        <ShareResults
          title={`${veg.name} Spacing: ${results.totalPlants} plants`}
          text={`My ${bedWidth}x${bedLength}ft bed fits ${results.totalPlants} ${veg.name.toLowerCase()} plants (${results.numRows} rows x ${results.plantsPerRow} per row). Estimated yield: ${fmt(results.totalYield)} lbs.`}
        />
        <p className="text-sm text-[var(--color-muted)] mt-4">
          <a href="/companion-planting" className="text-[var(--color-primary)] hover:underline">Check which plants grow well together &rarr;</a>
        </p>
      </div>

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Recommended Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={`https://www.amazon.com/s?k=seed+starting+trays+with+dome&tag=${AMAZON_TAG}&ascsubtag=seed-spacing`}
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
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Seed Starting Trays</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Seed starting trays with humidity domes and drain holes. Perfect for starting seeds indoors before transplanting.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$8 - $25</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=garden+row+markers+plant+labels&tag=${AMAZON_TAG}&ascsubtag=seed-spacing`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
              <span className="text-5xl">🏷️</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Garden Row Markers</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Weatherproof plant labels and row markers to keep your garden organized. Metal and bamboo options available.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$8 - $20</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
        </div>
      </div>
      <FAQSection questions={seedSpacingFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How This Calculator Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          Plant spacing is calculated using recommended distances from university agricultural extension guides. The calculator divides your bed dimensions by each vegetable&apos;s in-row spacing and row spacing to determine how many plants fit. Yield estimates are conservative averages — actual harvest depends on soil quality, watering consistency, sunlight, and variety selection. For example, a single tomato plant can produce 10-25 lbs in ideal conditions, but we estimate 10 lbs to account for typical home garden results.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Spacing Tips for Higher Yields</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>Square-foot gardening uses tighter spacing than traditional row planting. If you&apos;re using intensive methods, you can often reduce row spacing by 20-30% with adequate soil fertility.</li>
          <li>Vertical trellising for tomatoes, cucumbers, and pole beans lets you use the standard in-row spacing while reducing row spacing, fitting more plants per bed.</li>
          <li>Interplant quick-maturing crops (radishes, lettuce) between slow-growing ones (tomatoes, peppers) to maximize space during the early season.</li>
          <li>Use the <a href="/fertilizer" className="text-[var(--color-primary)] hover:underline">fertilizer calculator</a> to make sure your soil can support the plant density you&apos;re targeting — tight spacing demands richer soil.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="seed-spacing" />
      <RelatedCalculators currentPath="/seed-spacing" />
    </CalculatorLayout>
  );
}
