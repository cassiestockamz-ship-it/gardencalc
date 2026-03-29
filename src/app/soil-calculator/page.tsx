"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import NumberInput from "@/components/NumberInput";
import SelectInput from "@/components/SelectInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";
import { soilFAQ } from "@/data/faq-data";

const AMAZON_TAG = "kawaiiguy0f-pc-20";

type BedShape = "rectangle" | "square" | "circle" | "lshaped";
type SoilMix = "standard" | "mellsbed" | "hugelkultur" | "custom";

const SOIL_MIXES: Record<SoilMix, { label: string; topsoil: number; compost: number; other: number; otherLabel: string; description: string }> = {
  standard: {
    label: "Standard Mix (60/40)",
    topsoil: 0.6,
    compost: 0.4,
    other: 0,
    otherLabel: "",
    description: "60% topsoil, 40% compost. Great all-purpose mix.",
  },
  mellsbed: {
    label: "Mel's Mix (Square Foot)",
    topsoil: 0,
    compost: 0.333,
    other: 0.667,
    otherLabel: "Peat Moss + Vermiculite",
    description: "⅓ compost, ⅓ peat moss, ⅓ vermiculite. Popular SFG method.",
  },
  hugelkultur: {
    label: "Hugelkultur (layered)",
    topsoil: 0.4,
    compost: 0.3,
    other: 0.3,
    otherLabel: "Wood/Logs",
    description: "40% topsoil, 30% compost, 30% wood/logs on bottom.",
  },
  custom: {
    label: "Custom Ratio",
    topsoil: 0.5,
    compost: 0.3,
    other: 0.2,
    otherLabel: "Other Amendment",
    description: "Set your own soil mix ratio.",
  },
};

const COMMON_SIZES = [
  { label: "Custom Size", w: 0, l: 0, h: 0 },
  { label: '4\' × 4\' × 6"', w: 4, l: 4, h: 6 },
  { label: '4\' × 8\' × 6"', w: 4, l: 8, h: 6 },
  { label: '4\' × 8\' × 12"', w: 4, l: 8, h: 12 },
  { label: '3\' × 6\' × 12"', w: 3, l: 6, h: 12 },
  { label: '4\' × 12\' × 12"', w: 4, l: 12, h: 12 },
  { label: '2\' × 8\' × 18"', w: 2, l: 8, h: 18 },
];

// Average cost per cubic foot
const COST_PER_CUFT = {
  topsoil: 0.75,
  compost: 1.5,
  peat: 2.0,
  vermiculite: 3.5,
  wood: 0,
};

export default function SoilCalculatorPage() {
  const [preset, setPreset] = useState("0");
  const [shape, setShape] = useState<BedShape>("rectangle");
  const [widthFt, setWidthFt] = useState(4);
  const [lengthFt, setLengthFt] = useState(8);
  const [heightIn, setHeightIn] = useState(12);
  const [diameterFt, setDiameterFt] = useState(4);
  const [soilMix, setSoilMix] = useState<SoilMix>("standard");
  const [customTopsoil, setCustomTopsoil] = useState(50);
  const [customCompost, setCustomCompost] = useState(30);
  const [numBeds, setNumBeds] = useState(1);

  const handlePreset = (val: string) => {
    setPreset(val);
    const idx = parseInt(val);
    if (idx > 0 && COMMON_SIZES[idx]) {
      const s = COMMON_SIZES[idx];
      setWidthFt(s.w);
      setLengthFt(s.l);
      setHeightIn(s.h);
      setShape("rectangle");
    }
  };

  const results = useMemo(() => {
    const heightFt = heightIn / 12;
    let areaSqFt: number;
    let perimeterFt: number;

    switch (shape) {
      case "circle":
        areaSqFt = Math.PI * (diameterFt / 2) ** 2;
        perimeterFt = Math.PI * diameterFt;
        break;
      case "square":
        areaSqFt = widthFt * widthFt;
        perimeterFt = widthFt * 4;
        break;
      case "lshaped":
        // L-shape approximation: 75% of rectangle
        areaSqFt = widthFt * lengthFt * 0.75;
        perimeterFt = (widthFt + lengthFt) * 2 * 1.2;
        break;
      default: // rectangle
        areaSqFt = widthFt * lengthFt;
        perimeterFt = (widthFt + lengthFt) * 2;
    }

    const totalCuFt = areaSqFt * heightFt * numBeds;
    const totalCuYd = totalCuFt / 27;

    // Soil mix breakdown
    const mix = SOIL_MIXES[soilMix];
    let topsoilPct = mix.topsoil;
    let compostPct = mix.compost;
    let otherPct = mix.other;

    if (soilMix === "custom") {
      topsoilPct = customTopsoil / 100;
      compostPct = customCompost / 100;
      otherPct = Math.max(0, 1 - topsoilPct - compostPct);
    }

    const topsoilCuFt = totalCuFt * topsoilPct;
    const compostCuFt = totalCuFt * compostPct;
    const otherCuFt = totalCuFt * otherPct;

    // Bags estimate (typical bags: 1 cu ft, 1.5 cu ft, 2 cu ft)
    const bags1cuft = Math.ceil(totalCuFt);
    const bags2cuft = Math.ceil(totalCuFt / 2);

    // Weight estimate (loose soil ~40 lbs/cu ft)
    const weightLbs = totalCuFt * 40;

    // Cost estimate
    const costTopsoil = topsoilCuFt * COST_PER_CUFT.topsoil;
    const costCompost = compostCuFt * COST_PER_CUFT.compost;
    let costOther = 0;
    if (soilMix === "mellsbed") {
      costOther = otherCuFt * ((COST_PER_CUFT.peat + COST_PER_CUFT.vermiculite) / 2);
    }
    const totalCost = costTopsoil + costCompost + costOther;

    return {
      areaSqFt,
      perimeterFt,
      totalCuFt,
      totalCuYd,
      topsoilCuFt,
      compostCuFt,
      otherCuFt,
      bags1cuft,
      bags2cuft,
      weightLbs,
      totalCost,
      topsoilPct,
      compostPct,
      otherPct,
    };
  }, [shape, widthFt, lengthFt, heightIn, diameterFt, soilMix, customTopsoil, customCompost, numBeds]);

  const mix = SOIL_MIXES[soilMix];

  const presetOptions = COMMON_SIZES.map((s, i) => ({
    value: String(i),
    label: s.label,
  }));

  const shapeOptions: { value: BedShape; label: string }[] = [
    { value: "rectangle", label: "Rectangle" },
    { value: "square", label: "Square" },
    { value: "circle", label: "Circle / Round" },
    { value: "lshaped", label: "L-Shaped" },
  ];

  const mixOptions: { value: SoilMix; label: string }[] = [
    { value: "standard", label: "Standard Mix (60/40)" },
    { value: "mellsbed", label: "Mel's Mix (Square Foot)" },
    { value: "hugelkultur", label: "Hugelkultur (layered)" },
    { value: "custom", label: "Custom Ratio" },
  ];

  const fmt = (n: number) => n.toFixed(1);
  const fmtCost = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <CalculatorLayout
      title="Raised Bed Soil Calculator"
      description="Calculate exactly how much soil, compost, and amendments you need for your raised garden bed."
      lastUpdated="March 2026"
      intro="A standard 4×8 foot raised bed that's 12 inches deep needs about 32 cubic feet of soil — roughly 1.2 cubic yards or 16 bags of 2-cubic-foot bagged soil. The ideal mix is 60% topsoil and 40% compost, costing approximately $40-80 depending on your source."
    >
      <CalculatorSchema
        name="Raised Bed Soil Calculator"
        description="Calculate how many cubic feet or yards of soil you need for a raised garden bed. Supports multiple bed shapes and soil mix recipes."
        url="https://plantingcalc.com/soil-calculator"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://plantingcalc.com" }, { name: "Soil Calculator", url: "https://plantingcalc.com/soil-calculator" }]} />

      {/* Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectInput
          label="Common Bed Sizes"
          value={preset}
          onChange={handlePreset}
          options={presetOptions}
          helpText="Pick a preset or enter custom dimensions below"
        />

        <SelectInput
          label="Bed Shape"
          value={shape}
          onChange={(v) => setShape(v as BedShape)}
          options={shapeOptions}
        />

        {shape === "circle" ? (
          <NumberInput
            label="Diameter"
            value={diameterFt}
            onChange={setDiameterFt}
            min={1}
            max={30}
            step={0.5}
            unit="feet"
          />
        ) : (
          <>
            <NumberInput
              label={shape === "square" ? "Side Length" : "Width"}
              value={widthFt}
              onChange={setWidthFt}
              min={1}
              max={30}
              step={0.5}
              unit="feet"
            />
            {shape !== "square" && (
              <NumberInput
                label="Length"
                value={lengthFt}
                onChange={setLengthFt}
                min={1}
                max={30}
                step={0.5}
                unit="feet"
              />
            )}
          </>
        )}

        <NumberInput
          label="Height / Depth"
          value={heightIn}
          onChange={setHeightIn}
          min={3}
          max={48}
          step={1}
          unit="inches"
          helpText="Most vegetables need at least 6–12 inches of soil"
        />

        <NumberInput
          label="Number of Beds"
          value={numBeds}
          onChange={setNumBeds}
          min={1}
          max={20}
          step={1}
          unit="beds"
        />

        <SelectInput
          label="Soil Mix Recipe"
          value={soilMix}
          onChange={(v) => setSoilMix(v as SoilMix)}
          options={mixOptions}
          helpText={mix.description}
        />

        {soilMix === "custom" && (
          <>
            <NumberInput
              label="Topsoil %"
              value={customTopsoil}
              onChange={setCustomTopsoil}
              min={0}
              max={100}
              step={5}
              unit="%"
            />
            <NumberInput
              label="Compost %"
              value={customCompost}
              onChange={setCustomCompost}
              min={0}
              max={100 - customTopsoil}
              step={5}
              unit="%"
              helpText={`Remaining ${Math.max(0, 100 - customTopsoil - customCompost)}% = other amendments`}
            />
          </>
        )}
      </div>

      {/* Results */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          You Need
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResultCard
            label="Total Volume"
            value={fmt(results.totalCuFt)}
            unit="cubic feet"
            highlight
            icon="📦"
          />
          <ResultCard
            label="Total Volume"
            value={fmt(results.totalCuYd)}
            unit="cubic yards"
            icon="🚛"
          />
          <ResultCard
            label="Approx. Weight"
            value={Math.round(results.weightLbs).toLocaleString()}
            unit="lbs"
            icon="⚖️"
          />
          <ResultCard
            label="1 cu ft Bags Needed"
            value={String(results.bags1cuft)}
            unit="bags"
            icon="🛍️"
          />
          <ResultCard
            label="2 cu ft Bags Needed"
            value={String(results.bags2cuft)}
            unit="bags"
            icon="🛍️"
          />
          <ResultCard
            label="Est. Cost"
            value={fmtCost.format(results.totalCost)}
            unit="materials"
            icon="💰"
          />
        </div>

        {/* Soil Mix Breakdown */}
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            Soil Mix Breakdown{numBeds > 1 ? ` (${numBeds} beds total)` : ""}
          </h3>

          {/* Stacked bar */}
          <div className="mb-4 flex h-8 w-full overflow-hidden rounded-full">
            {results.topsoilPct > 0 && (
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${results.topsoilPct * 100}%`, backgroundColor: "#92400e" }}
                title={`Topsoil: ${fmt(results.topsoilCuFt)} cu ft`}
              />
            )}
            {results.compostPct > 0 && (
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${results.compostPct * 100}%`, backgroundColor: "#16a34a" }}
                title={`Compost: ${fmt(results.compostCuFt)} cu ft`}
              />
            )}
            {results.otherPct > 0 && (
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${results.otherPct * 100}%`, backgroundColor: "#d97706" }}
                title={`${mix.otherLabel || "Other"}: ${fmt(results.otherCuFt)} cu ft`}
              />
            )}
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {results.topsoilPct > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#92400e" }} />
                  <span className="font-medium text-[var(--color-text)]">Topsoil ({Math.round(results.topsoilPct * 100)}%)</span>
                </div>
                <span className="font-semibold text-[var(--color-text)]">{fmt(results.topsoilCuFt)} cu ft</span>
              </div>
            )}
            {results.compostPct > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#16a34a" }} />
                  <span className="font-medium text-[var(--color-text)]">Compost ({Math.round(results.compostPct * 100)}%)</span>
                </div>
                <span className="font-semibold text-[var(--color-text)]">{fmt(results.compostCuFt)} cu ft</span>
              </div>
            )}
            {results.otherPct > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#d97706" }} />
                  <span className="font-medium text-[var(--color-text)]">{mix.otherLabel || "Other"} ({Math.round(results.otherPct * 100)}%)</span>
                </div>
                <span className="font-semibold text-[var(--color-text)]">{fmt(results.otherCuFt)} cu ft</span>
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
            Bed area: {fmt(results.areaSqFt)} sq ft &middot; Perimeter: {fmt(results.perimeterFt)} ft
          </p>
        </div>

        <ShareResults
          title={`Soil Needed: ${fmt(results.totalCuFt)} cu ft`}
          text={`My ${shape} raised bed (${shape === "circle" ? `${diameterFt}ft diameter` : `${widthFt}×${lengthFt}ft`}, ${heightIn}" deep${numBeds > 1 ? `, ×${numBeds} beds` : ""}) needs ${fmt(results.totalCuFt)} cubic feet of soil (${fmt(results.totalCuYd)} cubic yards).`}
        />
        <p className="text-sm text-[var(--color-muted)] mt-4">
          <a href="/planting-dates" className="text-[var(--color-primary)] hover:underline">Find out when to plant in your bed &rarr;</a>
        </p>
      </div>

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Recommended Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={`https://www.amazon.com/s?k=raised+garden+bed+kit&tag=${AMAZON_TAG}&ascsubtag=soil-calculator`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-5xl">🪴</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Raised Garden Bed Kits</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Cedar and galvanized steel raised bed kits in popular sizes. Easy assembly, no tools needed.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$35 - $120</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=garden+soil+raised+bed+mix&tag=${AMAZON_TAG}&ascsubtag=soil-calculator`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
              <span className="text-5xl">🌿</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Raised Bed Soil Mix</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Premium raised bed soil mixes with compost, peat, and nutrients. Ready to fill and plant.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$15 - $40 per bag</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
        </div>
      </div>
      <FAQSection questions={soilFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How This Calculator Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This calculator computes soil volume using standard geometric formulas: length × width × height for rectangular beds, π × r² × height for circular beds, and a 75% area factor for L-shaped beds. Weight estimates use an average of 40 lbs per cubic foot of garden soil mix. Cost estimates are based on typical retail pricing: topsoil at $0.75/cu ft, compost at $1.50/cu ft, and peat moss/vermiculite at $2.00-$3.50/cu ft. Bulk delivery (by the cubic yard) is usually 30-50% cheaper than bagged soil for beds larger than 4×8 feet.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Tips for Filling Raised Beds</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>For beds deeper than 12 inches, fill the bottom third with logs, sticks, or leaves (hugelkultur method) to reduce soil cost and improve drainage.</li>
          <li>A 60/40 topsoil-to-compost ratio works for most vegetables. Mel&apos;s Mix (⅓ compost, ⅓ peat, ⅓ vermiculite) is popular for square-foot gardening but costs 2-3x more.</li>
          <li>Soil settles 10-15% in the first season. Consider overfilling slightly and topping off with compost each spring.</li>
          <li>Once your bed is filled, use our <a href="/planting-dates" className="text-[var(--color-primary)] hover:underline">planting date calculator</a> to find the best time to plant in your zone, then check <a href="/seed-spacing" className="text-[var(--color-primary)] hover:underline">seed spacing</a> to maximize your harvest.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="soil-calculator" />
      <RelatedCalculators currentPath="/soil-calculator" />
    </CalculatorLayout>
  );
}
