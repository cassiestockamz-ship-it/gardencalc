"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SelectInput from "@/components/SelectInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import { wateringFAQ } from "@/data/faq-data";

const AMAZON_TAG = "kawaiiguy0f-pc-20";

interface PlantWater {
  name: string;
  icon: string;
  inchesPerWeekMin: number;
  inchesPerWeekMax: number;
  overWaterSigns: string;
  underWaterSigns: string;
}

const PLANTS: PlantWater[] = [
  { name: "Tomato", icon: "🍅", inchesPerWeekMin: 1, inchesPerWeekMax: 2, overWaterSigns: "Yellowing lower leaves, cracked fruit, root rot", underWaterSigns: "Wilting in afternoon, blossom end rot, curling leaves" },
  { name: "Lettuce", icon: "🥬", inchesPerWeekMin: 1, inchesPerWeekMax: 1, overWaterSigns: "Slimy leaves, root rot, mold", underWaterSigns: "Bitter taste, bolting, wilting" },
  { name: "Peppers", icon: "🌶️", inchesPerWeekMin: 1, inchesPerWeekMax: 1.5, overWaterSigns: "Yellow leaves, leaf drop, root rot", underWaterSigns: "Wilting, flower drop, small fruit" },
  { name: "Squash", icon: "🎃", inchesPerWeekMin: 1.5, inchesPerWeekMax: 2, overWaterSigns: "Powdery mildew, yellow leaves, fruit rot", underWaterSigns: "Wilting leaves, small fruit, blossom drop" },
  { name: "Beans", icon: "🫘", inchesPerWeekMin: 1, inchesPerWeekMax: 1, overWaterSigns: "Yellow leaves, root rot, poor pod set", underWaterSigns: "Wilting, flower drop, tough pods" },
  { name: "Carrots", icon: "🥕", inchesPerWeekMin: 1, inchesPerWeekMax: 1, overWaterSigns: "Forked roots, cracking, rot", underWaterSigns: "Woody texture, stunted growth, hairy roots" },
  { name: "Corn", icon: "🌽", inchesPerWeekMin: 1.5, inchesPerWeekMax: 1.5, overWaterSigns: "Yellow leaves, poor root development", underWaterSigns: "Rolled leaves, missing kernels, stunted ears" },
  { name: "Cucumbers", icon: "🥒", inchesPerWeekMin: 1, inchesPerWeekMax: 1.5, overWaterSigns: "Yellow leaves, root rot, bitter fruit", underWaterSigns: "Bitter fruit, wilting, misshapen cucumbers" },
  { name: "Herbs", icon: "🌿", inchesPerWeekMin: 0.5, inchesPerWeekMax: 1, overWaterSigns: "Root rot, leggy growth, reduced flavor", underWaterSigns: "Wilting, leaf drop, bolting" },
];

const CLIMATES = [
  { value: "arid", label: "Arid / Hot", multiplier: 1.5 },
  { value: "temperate", label: "Temperate", multiplier: 1.0 },
  { value: "cool", label: "Cool / Humid", multiplier: 0.7 },
  { value: "mediterranean", label: "Mediterranean", multiplier: 1.2 },
];

const SOILS = [
  { value: "sandy", label: "Sandy (drains fast)", multiplier: 1.3 },
  { value: "loam", label: "Loam (balanced)", multiplier: 1.0 },
  { value: "clay", label: "Clay (retains water)", multiplier: 0.8 },
];

const SEASONS = [
  { value: "summer", label: "Summer (peak)", multiplier: 1.2 },
  { value: "spring", label: "Spring", multiplier: 1.0 },
  { value: "fall", label: "Fall", multiplier: 0.85 },
];

const GROWING_METHODS = [
  { value: "inground", label: "In-Ground" },
  { value: "container", label: "Container / Raised Bed" },
];

export default function WateringCalculatorPage() {
  const [selectedPlants, setSelectedPlants] = useState<Set<number>>(new Set([0]));
  const [climate, setClimate] = useState("temperate");
  const [soil, setSoil] = useState("loam");
  const [method, setMethod] = useState("inground");
  const [season, setSeason] = useState("summer");

  const togglePlant = (index: number) => {
    setSelectedPlants((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        if (next.size > 1) next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const climateMultiplier = CLIMATES.find((c) => c.value === climate)?.multiplier ?? 1;
  const soilMultiplier = SOILS.find((s) => s.value === soil)?.multiplier ?? 1;
  const containerMultiplier = method === "container" ? 1.5 : 1;
  const seasonMultiplier = SEASONS.find((s) => s.value === season)?.multiplier ?? 1;
  const totalMultiplier = climateMultiplier * soilMultiplier * containerMultiplier * seasonMultiplier;

  const results = useMemo(() => {
    const plants = Array.from(selectedPlants).map((i) => PLANTS[i]);

    // Average water needs across selected plants
    const avgMin = plants.reduce((sum, p) => sum + p.inchesPerWeekMin, 0) / plants.length;
    const avgMax = plants.reduce((sum, p) => sum + p.inchesPerWeekMax, 0) / plants.length;

    const adjustedMin = avgMin * totalMultiplier;
    const adjustedMax = avgMax * totalMultiplier;

    // Convert inches/week to gallons per 100 sq ft (1 inch of water on 1 sq ft = 0.623 gallons)
    const gallonsPer100SqFtMin = adjustedMin * 0.623 * 100;
    const gallonsPer100SqFtMax = adjustedMax * 0.623 * 100;

    // Watering frequency
    let frequency: string;
    if (adjustedMax >= 2) {
      frequency = "Daily";
    } else if (adjustedMax >= 1.5) {
      frequency = "Every 1-2 days";
    } else if (adjustedMax >= 1) {
      frequency = "Every 2-3 days";
    } else {
      frequency = "Every 3-4 days";
    }

    // Collect all over/under water signs from selected plants
    const overSigns = [...new Set(plants.map((p) => p.overWaterSigns))];
    const underSigns = [...new Set(plants.map((p) => p.underWaterSigns))];

    return {
      plants,
      adjustedMin,
      adjustedMax,
      gallonsPer100SqFtMin,
      gallonsPer100SqFtMax,
      frequency,
      overSigns,
      underSigns,
    };
  }, [selectedPlants, totalMultiplier]);

  const climateOptions = CLIMATES.map((c) => ({ value: c.value, label: c.label }));
  const soilOptions = SOILS.map((s) => ({ value: s.value, label: s.label }));
  const methodOptions = GROWING_METHODS.map((m) => ({ value: m.value, label: m.label }));
  const seasonOptions = SEASONS.map((s) => ({ value: s.value, label: s.label }));

  const fmtRange = (min: number, max: number) =>
    min === max ? min.toFixed(1) : `${min.toFixed(1)}-${max.toFixed(1)}`;

  const selectedNames = Array.from(selectedPlants)
    .map((i) => PLANTS[i].name)
    .join(", ");

  return (
    <CalculatorLayout
      title="Watering Schedule Calculator"
      description="Get a personalized watering schedule for your vegetable garden based on plants, climate, soil, and season."
      lastUpdated="March 2026"
    >
      <CalculatorSchema
        name="Watering Schedule Calculator"
        description="Calculate a personalized watering schedule for your vegetable garden based on plant types, climate, soil type, growing method, and season."
        url="https://plantingcalc.com/watering"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Watering Schedule Calculator", url: "https://plantingcalc.com/watering" },
        ]}
      />

      {/* Plant Selection */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
          Select Your Plants
        </label>
        <p className="mb-3 text-xs text-[var(--color-text-muted)]">
          Click to select or deselect. At least one plant must be selected.
        </p>
        <div className="flex flex-wrap gap-2">
          {PLANTS.map((plant, i) => (
            <button
              key={plant.name}
              onClick={() => togglePlant(i)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                selectedPlants.has(i)
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)]/30"
              }`}
            >
              {plant.icon} {plant.name}
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <SelectInput
          label="Climate"
          value={climate}
          onChange={setClimate}
          options={climateOptions}
          helpText={`Water adjustment: ${climateMultiplier}x`}
        />
        <SelectInput
          label="Soil Type"
          value={soil}
          onChange={setSoil}
          options={soilOptions}
          helpText={`Water adjustment: ${soilMultiplier}x`}
        />
        <SelectInput
          label="Growing Method"
          value={method}
          onChange={setMethod}
          options={methodOptions}
          helpText={method === "container" ? "Containers dry out 1.5x faster" : "Standard in-ground watering"}
        />
        <SelectInput
          label="Season"
          value={season}
          onChange={setSeason}
          options={seasonOptions}
          helpText={`Water adjustment: ${SEASONS.find((s) => s.value === season)?.multiplier}x`}
        />
      </div>

      {/* Results */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Your Watering Schedule
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            label="Water Needed"
            value={fmtRange(results.adjustedMin, results.adjustedMax)}
            unit="inches/week"
            highlight
            icon="💧"
          />
          <ResultCard
            label="Per 100 sq ft"
            value={fmtRange(results.gallonsPer100SqFtMin, results.gallonsPer100SqFtMax)}
            unit="gallons/week"
            icon="🪣"
          />
          <ResultCard
            label="Frequency"
            value={results.frequency}
            unit=""
            icon="📅"
          />
          <ResultCard
            label="Best Time"
            value="Morning"
            unit="6-10 AM"
            icon="🌅"
          />
        </div>

        {/* Multiplier Breakdown */}
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            Adjustment Factors
          </h3>
          <div className="space-y-2">
            {[
              { label: "Climate", value: climateMultiplier, detail: CLIMATES.find((c) => c.value === climate)?.label },
              { label: "Soil", value: soilMultiplier, detail: SOILS.find((s) => s.value === soil)?.label },
              { label: "Growing Method", value: containerMultiplier, detail: method === "container" ? "Container" : "In-Ground" },
              { label: "Season", value: seasonMultiplier, detail: SEASONS.find((s) => s.value === season)?.label },
            ].map((factor) => (
              <div
                key={factor.label}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm"
              >
                <span className="text-[var(--color-text)]">
                  {factor.label} <span className="text-[var(--color-text-muted)]">({factor.detail})</span>
                </span>
                <span
                  className={`font-mono font-semibold ${
                    factor.value > 1
                      ? "text-red-600"
                      : factor.value < 1
                      ? "text-blue-600"
                      : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {factor.value > 1 ? "+" : ""}
                  {((factor.value - 1) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-lg border-2 border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-2.5 text-sm">
              <span className="font-semibold text-[var(--color-text)]">Total Adjustment</span>
              <span className="font-mono font-bold text-[var(--color-primary)]">
                {totalMultiplier > 1 ? "+" : ""}
                {((totalMultiplier - 1) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Watering Tips */}
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            Watering Tips
          </h3>
          <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600">&#10003;</span>
              Water in the <strong className="text-[var(--color-text)]">morning (6-10 AM)</strong> to reduce evaporation and fungal disease
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600">&#10003;</span>
              Water <strong className="text-[var(--color-text)]">deeply and less often</strong> rather than shallow daily watering
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600">&#10003;</span>
              Use <strong className="text-[var(--color-text)]">mulch (2-3 inches)</strong> to reduce evaporation by up to 70%
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600">&#10003;</span>
              Water at the <strong className="text-[var(--color-text)]">base of plants</strong>, not overhead, to prevent leaf disease
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-600">&#10003;</span>
              Check soil moisture by inserting a finger <strong className="text-[var(--color-text)]">2 inches deep</strong> &mdash; water when dry
            </li>
          </ul>
        </div>

        {/* Over/Under Watering Signs */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="mb-3 text-sm font-semibold text-blue-800">
              Signs of Over-Watering
            </h3>
            <ul className="space-y-1.5 text-sm text-blue-700">
              {results.overSigns.map((sign, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5">&#9679;</span>
                  {sign}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="mb-3 text-sm font-semibold text-amber-800">
              Signs of Under-Watering
            </h3>
            <ul className="space-y-1.5 text-sm text-amber-700">
              {results.underSigns.map((sign, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5">&#9679;</span>
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ShareResults
          title={`Watering Schedule: ${fmtRange(results.adjustedMin, results.adjustedMax)} in/week`}
          text={`My ${selectedNames} garden (${CLIMATES.find((c) => c.value === climate)?.label}, ${SOILS.find((s) => s.value === soil)?.label} soil, ${method}) needs ${fmtRange(results.adjustedMin, results.adjustedMax)} inches of water per week (${fmtRange(results.gallonsPer100SqFtMin, results.gallonsPer100SqFtMax)} gal/100 sq ft). Water ${results.frequency.toLowerCase()}.`}
        />
      </div>

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Recommended Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href={`https://www.amazon.com/s?k=soaker+hose+garden&tag=${AMAZON_TAG}&ascsubtag=watering`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
              <span className="text-5xl">💧</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Soaker Hoses</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Flat and round soaker hoses for efficient, deep watering at the root zone.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$15 - $35</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=garden+watering+timer+automatic&tag=${AMAZON_TAG}&ascsubtag=watering`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-5xl">⏲️</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Watering Timers</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Programmable hose timers for automatic watering. Set it and forget it.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$20 - $50</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=rain+gauge+garden+outdoor&tag=${AMAZON_TAG}&ascsubtag=watering`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
              <span className="text-5xl">🌧️</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Rain Gauges</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Track rainfall to know exactly when to supplement with watering.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$8 - $20</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
        </div>
      </div>
      <FAQSection questions={wateringFAQ} />
      <RelatedCalculators currentPath="/watering" />
    </CalculatorLayout>
  );
}
