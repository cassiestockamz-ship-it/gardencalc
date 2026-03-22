"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import NumberInput from "@/components/NumberInput";
import SelectInput from "@/components/SelectInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import {
  FERTILIZER_PROFILES,
  FEEDER_COLORS,
  COMMON_FERTILIZERS,
} from "@/data/fertilizer";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import { fertilizerFAQ } from "@/data/faq-data";

const AMAZON_TAG = "kawaiiguy0f-20";

export default function FertilizerCalculatorPage() {
  const [selectedPlant, setSelectedPlant] = useState("0");
  const [widthFt, setWidthFt] = useState(4);
  const [lengthFt, setLengthFt] = useState(8);

  const plant = FERTILIZER_PROFILES[parseInt(selectedPlant)];

  const plantOptions = FERTILIZER_PROFILES.map((p, i) => ({
    value: String(i),
    label: `${p.icon} ${p.name}`,
  }));

  const results = useMemo(() => {
    const areaSqFt = widthFt * lengthFt;
    const lbsN = (plant.lbsNPer1000sqft / 1000) * areaSqFt;

    // Find matching fertilizers based on the dominant NPK need
    const [n, p, k] = plant.npkRatio;
    const maxNPK = Math.max(n, p, k);
    const isBalanced = n === p && p === k;

    const suggestedFertilizers = COMMON_FERTILIZERS.filter((f) => {
      const [fn, fp, fk] = f.npk;
      if (isBalanced) return fn === fp && fp === fk;
      // Match if the fertilizer emphasizes the same nutrient(s)
      if (n === maxNPK && fn >= fp && fn >= fk) return true;
      if (p === maxNPK && k === maxNPK && fp >= fn) return true;
      if (p === maxNPK && fp > fn && fp > fk) return true;
      return false;
    });

    return { areaSqFt, lbsN, suggestedFertilizers };
  }, [plant, widthFt, lengthFt]);

  const feeder = FEEDER_COLORS[plant.feederType];
  const [n, p, k] = plant.npkRatio;
  const maxNPK = Math.max(n, p, k, 1);

  return (
    <CalculatorLayout
      title="Fertilizer Calculator"
      description="Find the right fertilizer type and amount for your vegetables based on plant needs and garden size."
      lastUpdated="March 2026"
    >
      <CalculatorSchema
        name="Fertilizer Calculator"
        description="Calculate the right fertilizer type, NPK ratio, and amount needed for your vegetable garden based on plant type and garden size."
        url="https://plantingcalc.com/fertilizer"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Fertilizer Calculator", url: "https://plantingcalc.com/fertilizer" },
        ]}
      />

      {/* Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectInput
          label="Vegetable"
          value={selectedPlant}
          onChange={setSelectedPlant}
          options={plantOptions}
          helpText="Select what you're growing"
        />

        <div /> {/* spacer for grid alignment */}

        <NumberInput
          label="Garden Width"
          value={widthFt}
          onChange={setWidthFt}
          min={1}
          max={100}
          step={1}
          unit="feet"
        />
        <NumberInput
          label="Garden Length"
          value={lengthFt}
          onChange={setLengthFt}
          min={1}
          max={100}
          step={1}
          unit="feet"
        />
      </div>

      {/* Results */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Fertilizer Plan for {plant.icon} {plant.name}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            label="Feeder Type"
            value={feeder.label}
            unit=""
            highlight
            icon={plant.feederType === "heavy" ? "🔴" : plant.feederType === "medium" ? "🟡" : plant.feederType === "light" ? "🟢" : "🔵"}
          />
          <ResultCard
            label="NPK Ratio"
            value={`${n}-${p}-${k}`}
            unit="N-P-K"
            icon="🧪"
          />
          <ResultCard
            label="Nitrogen Needed"
            value={results.lbsN < 0.1 ? "0" : results.lbsN.toFixed(2)}
            unit={`lbs N / ${results.areaSqFt} sq ft`}
            icon="🌱"
          />
          <ResultCard
            label="Feed Frequency"
            value={plant.feedFrequency.split(" ").slice(0, 2).join(" ")}
            unit={plant.feedFrequency.split(" ").slice(2).join(" ")}
            icon="📅"
          />
        </div>

        {/* Feeder Type Badge */}
        <div className={`mt-6 rounded-xl border p-4 ${feeder.bg}`}>
          <span className={`text-sm font-semibold ${feeder.text}`}>
            {feeder.label}
          </span>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {plant.notes}
          </p>
        </div>

        {/* NPK Visual Bar Chart */}
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            Recommended NPK Ratio
          </h3>
          <div className="space-y-3">
            {[
              { label: "N (Nitrogen)", value: n, color: "#16a34a", desc: "Leaf growth" },
              { label: "P (Phosphorus)", value: p, color: "#d97706", desc: "Root & flower" },
              { label: "K (Potassium)", value: k, color: "#7c3aed", desc: "Fruit & health" },
            ].map((nutrient) => (
              <div key={nutrient.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--color-text)]">
                    {nutrient.label}
                  </span>
                  <span className="text-[var(--color-text-muted)]">
                    {nutrient.value} &middot; {nutrient.desc}
                  </span>
                </div>
                <div className="h-6 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(nutrient.value / maxNPK) * 100}%`,
                      backgroundColor: nutrient.color,
                      minWidth: nutrient.value > 0 ? "8%" : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Fertilizers */}
        {results.suggestedFertilizers.length > 0 && (
          <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
              Suggested Fertilizers for {plant.name}
            </h3>
            <div className="space-y-2">
              {results.suggestedFertilizers.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--color-text)]">
                      {f.name}
                    </span>
                    {f.organic && (
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700 border border-green-200">
                        Organic
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[var(--color-text-muted)]">
                    {f.npk[0]}-{f.npk[1]}-{f.npk[2]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <ShareResults
          title={`Fertilizer for ${plant.name}: ${n}-${p}-${k}`}
          text={`My ${widthFt}x${lengthFt}ft ${plant.name} garden needs ${results.lbsN.toFixed(2)} lbs nitrogen per season. Recommended NPK: ${n}-${p}-${k}. ${feeder.label} — ${plant.feedFrequency}.`}
        />
      </div>

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Recommended Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={`https://www.amazon.com/s?k=organic+vegetable+fertilizer&tag=${AMAZON_TAG}`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-5xl">🌿</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Organic Vegetable Fertilizer</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Top-rated organic fertilizers for vegetable gardens. Espoma, Dr. Earth, and more.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$10 - $25</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=soil+test+kit+garden&tag=${AMAZON_TAG}`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
              <span className="text-5xl">🧪</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Soil Test Kits</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Test your soil's NPK levels, pH, and nutrients before fertilizing. Know exactly what your garden needs.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$10 - $30</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
        </div>
      </div>
      <FAQSection questions={fertilizerFAQ} />
      <RelatedCalculators currentPath="/fertilizer" />
    </CalculatorLayout>
  );
}
