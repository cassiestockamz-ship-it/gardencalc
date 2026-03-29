"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import NumberInput from "@/components/NumberInput";
import SelectInput from "@/components/SelectInput";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";
import { soilPhFAQ } from "@/data/faq-data";

const AMAZON_TAG = "kawaiiguy0f-pc-20";

interface PhRange {
  name: string;
  icon: string;
  minPh: number;
  maxPh: number;
}

const PH_PREFERENCES: PhRange[] = [
  { name: "Blueberries", icon: "🫐", minPh: 4.5, maxPh: 5.5 },
  { name: "Potatoes", icon: "🥔", minPh: 5.0, maxPh: 6.0 },
  { name: "Sweet Potatoes", icon: "🍠", minPh: 5.5, maxPh: 6.5 },
  { name: "Tomatoes", icon: "🍅", minPh: 6.0, maxPh: 6.8 },
  { name: "Peppers", icon: "🌶️", minPh: 6.0, maxPh: 6.8 },
  { name: "Eggplant", icon: "🍆", minPh: 6.0, maxPh: 6.8 },
  { name: "Carrots", icon: "🥕", minPh: 6.0, maxPh: 7.0 },
  { name: "Beets", icon: "🟣", minPh: 6.0, maxPh: 7.0 },
  { name: "Lettuce", icon: "🥬", minPh: 6.0, maxPh: 7.0 },
  { name: "Spinach", icon: "🥬", minPh: 6.0, maxPh: 7.0 },
  { name: "Cucumbers", icon: "🥒", minPh: 6.0, maxPh: 7.0 },
  { name: "Squash", icon: "🎃", minPh: 6.0, maxPh: 7.0 },
  { name: "Beans", icon: "🫘", minPh: 6.0, maxPh: 7.0 },
  { name: "Peas", icon: "🟢", minPh: 6.0, maxPh: 7.0 },
  { name: "Corn", icon: "🌽", minPh: 6.0, maxPh: 7.0 },
  { name: "Onions", icon: "🧅", minPh: 6.0, maxPh: 7.0 },
  { name: "Garlic", icon: "🧄", minPh: 6.0, maxPh: 7.0 },
  { name: "Broccoli", icon: "🥦", minPh: 6.5, maxPh: 7.5 },
  { name: "Cabbage", icon: "🥬", minPh: 6.5, maxPh: 7.5 },
  { name: "Cauliflower", icon: "🥦", minPh: 6.5, maxPh: 7.5 },
  { name: "Kale", icon: "🥬", minPh: 6.5, maxPh: 7.5 },
  { name: "Brussels Sprouts", icon: "🥬", minPh: 6.5, maxPh: 7.5 },
  { name: "Asparagus", icon: "🌿", minPh: 6.5, maxPh: 7.5 },
];

const SOIL_TYPES = [
  { value: "clay", label: "Clay" },
  { value: "loam", label: "Loam" },
  { value: "sandy", label: "Sandy" },
];

// Lbs per 100 sqft to raise pH by 0.5
const LIME_RATES: Record<string, number> = {
  clay: 8,
  loam: 5,
  sandy: 3,
};

// Lbs per 100 sqft to lower pH by 0.5
const SULFUR_RATES: Record<string, number> = {
  clay: 3,
  loam: 2,
  sandy: 1,
};

function getPhLabel(ph: number): string {
  if (ph < 5.5) return "Strongly Acidic";
  if (ph < 6.0) return "Moderately Acidic";
  if (ph < 6.5) return "Slightly Acidic";
  if (ph <= 7.0) return "Neutral";
  if (ph <= 7.5) return "Slightly Alkaline";
  if (ph <= 8.0) return "Moderately Alkaline";
  return "Strongly Alkaline";
}

function getPhIcon(ph: number): string {
  if (ph < 6.0) return "🟡";
  if (ph <= 7.0) return "🟢";
  return "🔵";
}

export default function SoilPhCalculatorPage() {
  const [currentPh, setCurrentPh] = useState(6.5);
  const [areaSqFt, setAreaSqFt] = useState(100);
  const [soilType, setSoilType] = useState("loam");

  const results = useMemo(() => {
    const matching: PhRange[] = [];
    const needsAdjustment: (PhRange & { direction: "raise" | "lower"; targetPh: number })[] = [];

    for (const veg of PH_PREFERENCES) {
      if (currentPh >= veg.minPh && currentPh <= veg.maxPh) {
        matching.push(veg);
      } else {
        const direction = currentPh < veg.minPh ? "raise" : "lower";
        const targetPh = currentPh < veg.minPh ? veg.minPh : veg.maxPh;
        needsAdjustment.push({ ...veg, direction, targetPh });
      }
    }

    // Calculate amendment for the "ideal" range center of 6.5
    const idealPh = 6.5;
    const phDiff = Math.abs(currentPh - idealPh);
    const stepsOfHalf = phDiff / 0.5;
    const areaMultiplier = areaSqFt / 100;

    let amendmentType: "lime" | "sulfur" | "none" = "none";
    let amendmentLbs = 0;

    if (currentPh < 6.0) {
      amendmentType = "lime";
      amendmentLbs = LIME_RATES[soilType] * stepsOfHalf * areaMultiplier;
    } else if (currentPh > 7.0) {
      amendmentType = "sulfur";
      amendmentLbs = SULFUR_RATES[soilType] * stepsOfHalf * areaMultiplier;
    }

    return { matching, needsAdjustment, amendmentType, amendmentLbs, phDiff };
  }, [currentPh, areaSqFt, soilType]);

  const phLabel = getPhLabel(currentPh);
  const phIcon = getPhIcon(currentPh);

  return (
    <CalculatorLayout
      title="Soil pH Calculator"
      description="Find out which vegetables match your soil pH and how much lime or sulfur you need to adjust it for optimal growing conditions."
      lastUpdated="March 2026"
    >
      <CalculatorSchema
        name="Soil pH Calculator"
        description="Calculate which vegetables grow best at your soil pH and how much lime or sulfur is needed to adjust pH for your garden size and soil type."
        url="https://plantingcalc.com/soil-ph"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Soil pH Calculator", url: "https://plantingcalc.com/soil-ph" },
        ]}
      />

      {/* Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <SliderInput
            label="Current Soil pH"
            value={currentPh}
            onChange={setCurrentPh}
            min={4.0}
            max={9.0}
            step={0.1}
            unit="pH"
          />
        </div>

        <NumberInput
          label="Garden Area"
          value={areaSqFt}
          onChange={setAreaSqFt}
          min={1}
          max={10000}
          step={1}
          unit="sq ft"
        />
        <SelectInput
          label="Soil Type"
          value={soilType}
          onChange={setSoilType}
          options={SOIL_TYPES}
          helpText="Affects amendment rates"
        />
      </div>

      {/* Results */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Your Soil pH Results
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            label="pH Assessment"
            value={phLabel}
            unit=""
            highlight
            icon={phIcon}
          />
          <ResultCard
            label="Current pH"
            value={currentPh.toFixed(1)}
            unit="pH"
            icon="📊"
          />
          <ResultCard
            label="Vegetables That Match"
            value={String(results.matching.length)}
            unit={`of ${PH_PREFERENCES.length}`}
            icon="✅"
          />
          <ResultCard
            label={results.amendmentType === "lime" ? "Lime Needed" : results.amendmentType === "sulfur" ? "Sulfur Needed" : "Amendment"}
            value={results.amendmentType === "none" ? "None" : results.amendmentLbs.toFixed(1)}
            unit={results.amendmentType === "none" ? "" : "lbs"}
            icon={results.amendmentType === "lime" ? "⬆️" : results.amendmentType === "sulfur" ? "⬇️" : "👍"}
          />
        </div>

        {/* pH Scale Visual */}
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            pH Scale Position
          </h3>
          <div className="relative h-8 w-full overflow-hidden rounded-full bg-gradient-to-r from-red-400 via-yellow-300 via-40% via-green-400 via-60% via-blue-400 via-80% to-purple-400">
            <div
              className="absolute top-0 h-full w-1 bg-[var(--color-text)] shadow-md transition-all duration-300"
              style={{ left: `${((currentPh - 4.0) / 5.0) * 100}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-[var(--color-text-muted)]">
            <span>4.0 (Acidic)</span>
            <span>6.5 (Ideal)</span>
            <span>9.0 (Alkaline)</span>
          </div>
        </div>

        {/* Matching Vegetables */}
        {results.matching.length > 0 && (
          <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
              ✅ Vegetables That Grow Well at pH {currentPh.toFixed(1)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.matching.map((veg) => (
                <span
                  key={veg.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-800"
                >
                  {veg.icon} {veg.name}
                  <span className="text-xs text-green-600">({veg.minPh}-{veg.maxPh})</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Needs Adjustment */}
        {results.needsAdjustment.length > 0 && (
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
              ⚠️ Vegetables That Need pH Adjustment
            </h3>
            <div className="flex flex-wrap gap-2">
              {results.needsAdjustment.map((veg) => (
                <span
                  key={veg.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800"
                >
                  {veg.icon} {veg.name}
                  <span className="text-xs text-amber-600">
                    ({veg.direction === "raise" ? "raise" : "lower"} to {veg.minPh}-{veg.maxPh})
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Amendment Details */}
        {results.amendmentType !== "none" && (
          <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
              {results.amendmentType === "lime" ? "🪨 Lime Application to Raise pH" : "🧪 Sulfur Application to Lower pH"}
            </h3>
            <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
              <p>
                Your soil pH of {currentPh.toFixed(1)} is{" "}
                {results.amendmentType === "lime" ? "below" : "above"} the ideal range of 6.0 to 7.0 for most vegetables.
              </p>
              <p>
                To {results.amendmentType === "lime" ? "raise" : "lower"} pH to 6.5 in {soilType} soil:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Rate: {results.amendmentType === "lime" ? LIME_RATES[soilType] : SULFUR_RATES[soilType]} lbs per 100 sq ft per 0.5 pH change
                </li>
                <li>
                  pH adjustment needed: {results.phDiff.toFixed(1)} units
                </li>
                <li>
                  Your area: {areaSqFt} sq ft
                </li>
                <li className="font-semibold text-[var(--color-text)]">
                  Total {results.amendmentType === "lime" ? "lime" : "sulfur"} needed: {results.amendmentLbs.toFixed(1)} lbs
                </li>
              </ul>
              <p className="mt-3">
                Apply in fall for best results. Work into the top 6 to 8 inches of soil.{" "}
                {results.amendmentType === "lime"
                  ? "Pelletized lime is easier to spread than powdered lime."
                  : "Elemental sulfur works slowly over several months. Apply well before planting season."}
              </p>
            </div>
          </div>
        )}

        <ShareResults
          title={`Soil pH: ${currentPh.toFixed(1)} (${phLabel})`}
          text={`My soil pH is ${currentPh.toFixed(1)} (${phLabel}). ${results.matching.length} of ${PH_PREFERENCES.length} common vegetables match this pH.${results.amendmentType !== "none" ? ` Need ${results.amendmentLbs.toFixed(1)} lbs of ${results.amendmentType} for my ${areaSqFt} sq ft ${soilType} soil garden.` : ""}`}
        />
      </div>

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Recommended Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href={`https://www.amazon.com/s?k=soil+pH+test+kit&tag=${AMAZON_TAG}&ascsubtag=soil-ph`}
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
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Soil pH Test Kits</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Digital and strip test kits to measure your soil pH accurately at home.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$8 - $25</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=garden+lime+pelletized&tag=${AMAZON_TAG}&ascsubtag=soil-ph`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-gray-50 to-stone-100">
              <span className="text-5xl">🪨</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Pelletized Garden Lime</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Raise soil pH naturally. Easy-to-spread pellets for acidic soil correction.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$8 - $20</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=elemental+sulfur+garden+soil&tag=${AMAZON_TAG}&ascsubtag=soil-ph`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100">
              <span className="text-5xl">⬇️</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Elemental Sulfur</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Lower soil pH for acid-loving plants like blueberries and potatoes.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$10 - $25</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <FAQSection questions={soilPhFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How This Calculator Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This calculator compares your current soil pH against the preferred pH range for 23 common garden vegetables. Vegetables shown in the &quot;match&quot; list will grow well at your current pH without any soil amendment. Vegetables in the &quot;needs adjustment&quot; list require you to raise or lower your soil pH before planting for best results. Amendment rates are based on agricultural extension recommendations for the three main soil types: clay, loam, and sandy soil.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Soil pH Tips</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>Always test your soil pH before adding amendments. Home test kits cost under $15 and give you a reliable reading in minutes. Your local cooperative extension office also offers professional soil testing for $10 to $25.</li>
          <li>Lime raises pH (makes soil less acidic) and works best when applied in fall so it has time to react with the soil over winter. Pelletized lime is easier to spread evenly than powdered lime.</li>
          <li>Elemental sulfur lowers pH (makes soil more acidic) but works slowly, taking several months for soil bacteria to convert it. Apply well before planting season for best results.</li>
          <li>Clay soil requires more amendment per pH unit than sandy soil because clay has a higher buffering capacity. Loam falls in between. This is why soil type matters for calculating amendment amounts.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="soil-ph" />
      <RelatedCalculators currentPath="/soil-ph" />
    </CalculatorLayout>
  );
}
