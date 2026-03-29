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
import { bedLayoutFAQ } from "@/data/faq-data";

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

const NONE_OPTION = "__none__";

export default function BedLayoutPage() {
  const [bedWidth, setBedWidth] = useState(4);
  const [bedLength, setBedLength] = useState(8);
  const [veg1, setVeg1] = useState(VEGETABLES[9].name); // Tomato
  const [veg2, setVeg2] = useState(VEGETABLES[30].name); // Basil
  const [veg3, setVeg3] = useState(NONE_OPTION);

  const vegOptions = [
    { value: NONE_OPTION, label: "-- None --" },
    ...VEGETABLES.map((v) => ({
      value: v.name,
      label: `${v.icon} ${v.name}`,
    })),
  ];

  const selectedVegs = [veg1, veg2, veg3]
    .filter((name) => name !== NONE_OPTION)
    .map((name) => VEGETABLES.find((v) => v.name === name))
    .filter((v): v is (typeof VEGETABLES)[number] => v != null);

  const results = useMemo(() => {
    const bedWidthIn = bedWidth * 12;
    const bedLengthIn = bedLength * 12;
    const totalAreaSqIn = bedWidthIn * bedLengthIn;

    let remainingLengthIn = bedLengthIn;
    const vegResults: {
      name: string;
      icon: string;
      plantsPerRow: number;
      numRows: number;
      totalPlants: number;
      rowsUsedInches: number;
      yieldLbs: number;
      spacingIn: number;
      rowSpacingIn: number;
    }[] = [];

    for (const veg of selectedVegs) {
      if (remainingLengthIn <= 0) break;

      const plantsPerRow = Math.max(
        1,
        Math.floor(bedWidthIn / veg.spacingInches)
      );
      const numRows = Math.max(
        1,
        Math.floor(remainingLengthIn / veg.rowSpacingInches)
      );
      const totalPlants = plantsPerRow * numRows;
      const rowsUsedInches = numRows * veg.rowSpacingInches;
      const yieldPerPlant = YIELD_PER_PLANT[veg.name] || 0.5;
      const yieldLbs = totalPlants * yieldPerPlant;

      vegResults.push({
        name: veg.name,
        icon: veg.icon,
        plantsPerRow,
        numRows,
        totalPlants,
        rowsUsedInches,
        yieldLbs,
        spacingIn: veg.spacingInches,
        rowSpacingIn: veg.rowSpacingInches,
      });

      remainingLengthIn -= rowsUsedInches;
    }

    const totalPlants = vegResults.reduce((s, r) => s + r.totalPlants, 0);
    const totalUsedInches = vegResults.reduce(
      (s, r) => s + r.rowsUsedInches,
      0
    );
    const usedAreaSqIn = totalUsedInches * bedWidthIn;
    const utilization =
      totalAreaSqIn > 0
        ? Math.min(100, Math.round((usedAreaSqIn / totalAreaSqIn) * 100))
        : 0;
    const totalYield = vegResults.reduce((s, r) => s + r.yieldLbs, 0);

    return {
      vegResults,
      totalPlants,
      utilization,
      totalYield,
      remainingLengthIn: Math.max(0, remainingLengthIn),
      totalAreaSqFt: bedWidth * bedLength,
    };
  }, [selectedVegs, bedWidth, bedLength]);

  const fmt = (n: number) => (n % 1 === 0 ? String(n) : n.toFixed(1));

  return (
    <CalculatorLayout
      title="Garden Bed Layout Planner"
      description="Plan how many plants fit in your raised bed. Select up to 3 vegetables and see a suggested layout with spacing, row counts, and estimated yield."
      lastUpdated="March 2026"
    >
      <CalculatorSchema
        name="Garden Bed Layout Planner"
        description="Calculate how many plants fit in a raised garden bed. Select up to 3 vegetables, enter bed dimensions, and get a complete layout plan with plant counts, spacing, and estimated yield."
        url="https://plantingcalc.com/bed-layout"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          {
            name: "Bed Layout Planner",
            url: "https://plantingcalc.com/bed-layout",
          },
        ]}
      />

      {/* Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <NumberInput
          label="Bed Width"
          value={bedWidth}
          onChange={setBedWidth}
          min={1}
          max={20}
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

        <div className="sm:col-span-2">
          <SelectInput
            label="Vegetable 1"
            value={veg1}
            onChange={setVeg1}
            options={vegOptions.filter((o) => o.value !== NONE_OPTION)}
            helpText={
              VEGETABLES.find((v) => v.name === veg1)?.notes || undefined
            }
          />
        </div>

        <div className="sm:col-span-2">
          <SelectInput
            label="Vegetable 2 (optional)"
            value={veg2}
            onChange={setVeg2}
            options={vegOptions}
            helpText={
              veg2 !== NONE_OPTION
                ? VEGETABLES.find((v) => v.name === veg2)?.notes || undefined
                : undefined
            }
          />
        </div>

        <div className="sm:col-span-2">
          <SelectInput
            label="Vegetable 3 (optional)"
            value={veg3}
            onChange={setVeg3}
            options={vegOptions}
            helpText={
              veg3 !== NONE_OPTION
                ? VEGETABLES.find((v) => v.name === veg3)?.notes || undefined
                : undefined
            }
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Layout Results ({bedWidth}ft x {bedLength}ft bed)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResultCard
            label="Total Plants"
            value={String(results.totalPlants)}
            unit="plants"
            highlight
            icon="🌱"
          />
          <ResultCard
            label="Bed Utilization"
            value={String(results.utilization)}
            unit="%"
            highlight={results.utilization >= 80}
            icon="📐"
          />
          <ResultCard
            label="Estimated Yield"
            value={fmt(results.totalYield)}
            unit="lbs"
            icon="🥗"
          />
          <ResultCard
            label="Bed Area"
            value={String(results.totalAreaSqFt)}
            unit="sq ft"
            icon="📏"
          />
          <ResultCard
            label="Vegetables Planted"
            value={String(results.vegResults.length)}
            unit={results.vegResults.length === 1 ? "type" : "types"}
            icon="🥬"
          />
          <ResultCard
            label="Unused Space"
            value={
              results.remainingLengthIn > 0
                ? fmt(results.remainingLengthIn)
                : "0"
            }
            unit="inches length"
            icon="📍"
          />
        </div>
      </div>

      {/* Suggested Layout */}
      {results.vegResults.length > 0 && (
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            Suggested Layout
          </h3>
          <div className="space-y-4">
            {results.vegResults.map((vr, idx) => (
              <div
                key={vr.name}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[var(--color-text)]">
                    {vr.icon} {vr.name}
                    <span className="ml-2 text-xs font-normal text-[var(--color-text-muted)]">
                      (Section {idx + 1})
                    </span>
                  </h4>
                  <span className="rounded-full bg-[var(--color-ev-green)]/10 px-3 py-1 text-xs font-bold text-[var(--color-ev-green)]">
                    {vr.totalPlants} plants
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {vr.numRows} row{vr.numRows !== 1 ? "s" : ""} of{" "}
                  {vr.name.toLowerCase()} at {vr.spacingIn}&quot; plant spacing
                  with {vr.rowSpacingIn}&quot; between rows = {vr.totalPlants}{" "}
                  plants ({vr.plantsPerRow} per row)
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                  <span>
                    Yield: ~{fmt(vr.yieldLbs)} lbs
                  </span>
                  <span>
                    Uses: {fmt(vr.rowsUsedInches)}&quot; of bed length
                  </span>
                </div>

                {/* Mini row visualization */}
                <div className="mt-3 overflow-x-auto">
                  <div className="inline-block rounded-lg border border-amber-700/20 bg-amber-800/5 p-2">
                    {Array.from({
                      length: Math.min(vr.numRows, 6),
                    }).map((_, row) => (
                      <div
                        key={row}
                        className="flex items-center gap-1"
                        style={{
                          marginBottom:
                            row < Math.min(vr.numRows, 6) - 1
                              ? `${Math.min(vr.rowSpacingIn / 4, 8)}px`
                              : 0,
                        }}
                      >
                        {Array.from({
                          length: Math.min(vr.plantsPerRow, 10),
                        }).map((_, col) => (
                          <div
                            key={col}
                            className="flex items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs"
                            style={{
                              width: `${Math.max(18, Math.min(28, vr.spacingIn))}px`,
                              height: `${Math.max(18, Math.min(28, vr.spacingIn))}px`,
                            }}
                          >
                            {vr.icon}
                          </div>
                        ))}
                        {vr.plantsPerRow > 10 && (
                          <span className="text-[10px] text-[var(--color-text-muted)]">
                            +{vr.plantsPerRow - 10}
                          </span>
                        )}
                      </div>
                    ))}
                    {vr.numRows > 6 && (
                      <p className="mt-1 text-center text-[10px] text-[var(--color-text-muted)]">
                        +{vr.numRows - 6} more row
                        {vr.numRows - 6 !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.remainingLengthIn > 0 && (
            <p className="mt-4 text-sm text-[var(--color-text-muted)]">
              You have {fmt(results.remainingLengthIn)} inches (
              {fmt(results.remainingLengthIn / 12)} ft) of unused bed length
              remaining. Consider adding another vegetable or planting a cover
              crop.
            </p>
          )}
        </div>
      )}

      <ShareResults
        title={`Garden Bed Layout: ${results.totalPlants} plants`}
        text={`My ${bedWidth}x${bedLength}ft raised bed fits ${results.totalPlants} plants across ${results.vegResults.length} vegetable${results.vegResults.length !== 1 ? "s" : ""}. ${results.utilization}% bed utilization with ~${fmt(results.totalYield)} lbs estimated yield.`}
      />

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Recommended Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={`https://www.amazon.com/s?k=raised+garden+bed+kit&tag=${AMAZON_TAG}&ascsubtag=bed-layout`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
              <span className="text-5xl">🪵</span>
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
                Raised Garden Bed Kits
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Cedar and metal raised bed kits in popular sizes. Easy to
                assemble with no tools required.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">
                  $40 - $150
                </span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                  View on Amazon &rarr;
                </span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=garden+plant+spacing+tool+seed+ruler&tag=${AMAZON_TAG}&ascsubtag=bed-layout`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-5xl">📏</span>
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
                Seed Spacing Rulers
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Planting rulers and dibble boards for accurate seed and
                transplant spacing. Works with square foot gardening.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">
                  $10 - $30
                </span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                  View on Amazon &rarr;
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <FAQSection questions={bedLayoutFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          How This Calculator Works
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          The Garden Bed Layout Planner divides your raised bed into sections
          for each selected vegetable. It uses recommended in-row spacing and
          row spacing from university extension guides to calculate how many
          plants fit in each section. The first vegetable fills rows starting
          from one end of the bed, and each subsequent vegetable fills the
          remaining space. This approach mirrors how most gardeners actually
          plant mixed beds: in defined sections rather than interleaved rows.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          Tips for Planning Your Bed Layout
        </h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>
            Place tall plants (tomatoes, corn, pole beans) on the north side of
            the bed so they do not shade shorter crops.
          </li>
          <li>
            Group vegetables with similar water needs together. Tomatoes and
            peppers are a good pair. Lettuce and radishes share similar moisture
            preferences.
          </li>
          <li>
            Check the{" "}
            <a
              href="/companion-planting"
              className="text-[var(--color-primary)] hover:underline"
            >
              companion planting calculator
            </a>{" "}
            to make sure your selected vegetables grow well together.
          </li>
          <li>
            For beds narrower than 4 feet, you can reach the center from either
            side without stepping on the soil. Wider beds may need stepping
            stones or paths.
          </li>
          <li>
            Use the{" "}
            <a
              href="/seed-spacing"
              className="text-[var(--color-primary)] hover:underline"
            >
              seed spacing calculator
            </a>{" "}
            for detailed per-vegetable spacing diagrams and yield estimates.
          </li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="bed-layout" />
      <RelatedCalculators currentPath="/bed-layout" />
    </CalculatorLayout>
  );
}
