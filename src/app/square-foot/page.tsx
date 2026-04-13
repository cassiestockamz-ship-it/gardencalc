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
import { squareFootFAQ } from "@/data/faq-data";

// SFG category based on spacing in inches
type SFGCategory = "extra-large" | "large" | "medium" | "small" | "tiny";

interface SFGRule {
  label: string;
  plantsPerSqFt: number;
  color: string;
  examples: string;
}

const SFG_RULES: Record<SFGCategory, SFGRule> = {
  "extra-large": { label: "Extra-Large", plantsPerSqFt: 1, color: "#ef4444", examples: "Tomatoes, Squash, Eggplant" },
  "large": { label: "Large", plantsPerSqFt: 1, color: "#f59e0b", examples: "Peppers, Broccoli, Cabbage" },
  "medium": { label: "Medium", plantsPerSqFt: 4, color: "#22c55e", examples: "Lettuce, Spinach, Swiss Chard" },
  "small": { label: "Small", plantsPerSqFt: 9, color: "#3b82f6", examples: "Carrots, Radishes, Onions" },
  "tiny": { label: "Tiny", plantsPerSqFt: 16, color: "#8b5cf6", examples: "Chives, Green Onions" },
};

function getSFGCategory(spacingInches: number): SFGCategory {
  if (spacingInches >= 24) return "extra-large";
  if (spacingInches >= 12) return "large";
  if (spacingInches >= 6) return "medium";
  if (spacingInches >= 3) return "small";
  return "tiny";
}

const GRID_COLORS: Record<SFGCategory, string> = {
  "extra-large": "bg-red-100 border-red-300 text-red-700",
  "large": "bg-amber-100 border-amber-300 text-amber-700",
  "medium": "bg-green-100 border-green-300 text-green-700",
  "small": "bg-blue-100 border-blue-300 text-blue-700",
  "tiny": "bg-violet-100 border-violet-300 text-violet-700",
};

export default function SquareFootPage() {
  const [bedWidth, setBedWidth] = useState(4);
  const [bedLength, setBedLength] = useState(4);
  const [veg1, setVeg1] = useState("Tomato");
  const [veg2, setVeg2] = useState("Pepper");
  const [veg3, setVeg3] = useState("Lettuce");
  const [veg4, setVeg4] = useState("");
  const [veg5, setVeg5] = useState("");

  const vegOptions = [
    { value: "", label: "-- None --" },
    ...VEGETABLES.map((v) => ({
      value: v.name,
      label: `${v.icon} ${v.name}`,
    })),
  ];

  // Options without the "None" entry for slot 1 (required)
  const vegOptionsRequired = VEGETABLES.map((v) => ({
    value: v.name,
    label: `${v.icon} ${v.name}`,
  }));

  const selectedNames = [veg1, veg2, veg3, veg4, veg5].filter(Boolean);

  const results = useMemo(() => {
    const totalSquares = Math.floor(bedWidth) * Math.floor(bedLength);
    const vegs = selectedNames
      .map((name) => VEGETABLES.find((v) => v.name === name))
      .filter((v): v is (typeof VEGETABLES)[number] => v !== undefined);

    if (vegs.length === 0) {
      return { totalSquares, assignments: [], totalPlants: 0, vegs: [] };
    }

    // Divide squares evenly among selected vegetables
    const baseSquares = Math.floor(totalSquares / vegs.length);
    const remainder = totalSquares % vegs.length;

    const assignments = vegs.map((v, i) => {
      const category = getSFGCategory(v.spacingInches);
      const rule = SFG_RULES[category];
      const squares = baseSquares + (i < remainder ? 1 : 0);
      const plants = squares * rule.plantsPerSqFt;

      return {
        name: v.name,
        icon: v.icon,
        category,
        categoryLabel: rule.label,
        plantsPerSqFt: rule.plantsPerSqFt,
        squares,
        plants,
      };
    });

    const totalPlants = assignments.reduce((sum, a) => sum + a.plants, 0);

    return { totalSquares, assignments, totalPlants, vegs };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bedWidth, bedLength, veg1, veg2, veg3, veg4, veg5]);

  // Build grid layout: assign vegetables to squares
  const gridWidth = Math.floor(bedWidth);
  const gridHeight = Math.floor(bedLength);
  const gridAssignment = useMemo(() => {
    const grid: (typeof results.assignments)[number][] = [];
    let idx = 0;
    for (const assignment of results.assignments) {
      for (let s = 0; s < assignment.squares; s++) {
        grid[idx] = assignment;
        idx++;
      }
    }
    return grid;
  }, [results.assignments]);

  const shareText = results.assignments
    .map((a) => `${a.name}: ${a.squares} sq ft, ${a.plants} plants`)
    .join("; ");

  return (
    <CalculatorLayout
      title="Square Foot Garden Planner"
      description="Plan your square foot garden bed. Select up to 5 vegetables and see how many plants fit in each square using SFG spacing rules."
      lastUpdated="March 2026"
    >
      <CalculatorSchema
        name="Square Foot Garden Planner"
        description="Plan a square foot garden bed with up to 5 vegetables. Calculates plants per square foot, suggested square allocation, and total plant count using SFG spacing rules."
        url="https://plantingcalc.com/square-foot"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Square Foot Garden Planner", url: "https://plantingcalc.com/square-foot" },
        ]}
      />

      {/* Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <NumberInput
          label="Bed Width"
          value={bedWidth}
          onChange={setBedWidth}
          min={1}
          max={12}
          step={1}
          unit="feet"
          helpText="Standard SFG beds are 4 feet wide"
        />

        <NumberInput
          label="Bed Length"
          value={bedLength}
          onChange={setBedLength}
          min={1}
          max={20}
          step={1}
          unit="feet"
          helpText="Common sizes: 4x4, 4x8, or 4x12"
        />

        <SelectInput
          label="Vegetable 1"
          value={veg1}
          onChange={setVeg1}
          options={vegOptionsRequired}
        />

        <SelectInput
          label="Vegetable 2"
          value={veg2}
          onChange={setVeg2}
          options={vegOptions}
        />

        <SelectInput
          label="Vegetable 3"
          value={veg3}
          onChange={setVeg3}
          options={vegOptions}
        />

        <SelectInput
          label="Vegetable 4"
          value={veg4}
          onChange={setVeg4}
          options={vegOptions}
        />

        <div className="sm:col-span-2">
          <SelectInput
            label="Vegetable 5"
            value={veg5}
            onChange={setVeg5}
            options={vegOptions}
          />
        </div>
      </div>

      {/* SFG Spacing Reference */}
      <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
        <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
          Square Foot Gardening Spacing Rules
        </h3>
        <div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(SFG_RULES).map(([key, rule]) => (
            <div key={key} className="flex items-center gap-2 rounded-lg bg-[var(--color-surface)] px-3 py-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: rule.color }}
              />
              <div>
                <span className="font-semibold text-[var(--color-text)]">
                  {rule.label}: {rule.plantsPerSqFt} per sq ft
                </span>
                <span className="ml-1 text-[var(--color-text-muted)]">
                  ({rule.examples})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Garden Plan Results
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResultCard
            label="Total Squares"
            value={String(results.totalSquares)}
            unit="sq ft"
            highlight
            icon="📐"
          />
          <ResultCard
            label="Vegetables Selected"
            value={String(results.assignments.length)}
            unit="types"
            icon="🥬"
          />
          <ResultCard
            label="Total Plants"
            value={String(results.totalPlants)}
            unit="plants"
            highlight
            icon="🌱"
          />
        </div>

        {/* Per-vegetable breakdown */}
        {results.assignments.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              Plant Breakdown
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {results.assignments.map((a) => {
                const veg = VEGETABLES.find((v) => v.name === a.name);
                return (
                  <div
                    key={a.name}
                    className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{a.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">{a.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {a.categoryLabel} ({a.plantsPerSqFt}/sq ft) &middot; {a.squares} square{a.squares !== 1 ? "s" : ""}
                        </p>
                        {veg && (
                          <p className="text-xs text-[var(--color-text-muted)]">
                            Harvest: {veg.daysToHarvest[0]}-{veg.daysToHarvest[1]} days
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[var(--color-primary)]">{a.plants}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">plants</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Grid Layout Visualization */}
        {gridWidth > 0 && gridHeight > 0 && results.assignments.length > 0 && (
          <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
              Bed Layout ({bedWidth}ft x {bedLength}ft)
            </h3>
            <div className="overflow-x-auto">
              <div className="inline-block">
                {Array.from({ length: gridHeight }).map((_, row) => (
                  <div key={row} className="flex">
                    {Array.from({ length: gridWidth }).map((_, col) => {
                      const idx = row * gridWidth + col;
                      const assignment = gridAssignment[idx];
                      const colorClass = assignment
                        ? GRID_COLORS[assignment.category]
                        : "bg-gray-100 border-gray-300 text-gray-400";
                      return (
                        <div
                          key={col}
                          className={`flex h-16 w-16 flex-col items-center justify-center border text-center sm:h-20 sm:w-20 ${colorClass}`}
                        >
                          {assignment ? (
                            <>
                              <span className="text-lg leading-none">{assignment.icon}</span>
                              <span className="mt-0.5 text-[9px] font-medium leading-tight">
                                {assignment.plantsPerSqFt}x
                              </span>
                            </>
                          ) : (
                            <span className="text-[10px]">empty</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
              {results.assignments.map((a) => (
                <div key={a.name} className="flex items-center gap-1.5">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: SFG_RULES[a.category].color }}
                  />
                  <span>{a.icon} {a.name} ({a.squares} sq ft)</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">
              Each cell = 1 square foot. Number shows plants per square.
            </p>
          </div>
        )}

        <ShareResults
          title={`Square Foot Garden: ${bedWidth}x${bedLength}ft, ${results.totalPlants} plants`}
          text={`My ${bedWidth}x${bedLength}ft square foot garden (${results.totalSquares} squares): ${shareText}. Total: ${results.totalPlants} plants.`}
        />
      </div>

      <FAQSection questions={squareFootFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How Square Foot Gardening Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          Square foot gardening (SFG) was popularized by Mel Bartholomew in 1981. The method divides raised beds into a grid of 1-foot squares. Each square is planted with a specific number of plants based on their mature size. This eliminates row spacing, reduces wasted space, and makes planning simple. A standard 4x4 bed gives you 16 squares to work with, and a 4x8 bed gives you 32 squares.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Tips for a Productive Square Foot Garden</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>Use a high-quality soil mix (Mel&apos;s Mix: equal parts compost, peat moss, and vermiculite) for best results in raised SFG beds.</li>
          <li>Plant tall crops on the north side of the bed so they do not shade shorter vegetables.</li>
          <li>Succession plant quick-harvesting squares (radishes, lettuce) to get multiple crops per season from the same square.</li>
          <li>Add a trellis on the north end to grow vining crops like cucumbers, peas, and pole beans vertically without shading neighbors.</li>
          <li>Use the <a href="/companion-planting" className="text-[var(--color-primary)] hover:underline">companion planting checker</a> to make sure your selected vegetables grow well together.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="square-foot" />
      <RelatedCalculators currentPath="/square-foot" />
    </CalculatorLayout>
  );
}
