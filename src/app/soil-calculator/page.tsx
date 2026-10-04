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

// Bagged soil sizes. 40 lb bags of topsoil hold about 0.75 cu ft (read the bag label).
const BAG_SIZES = [
  { label: "1 cu ft bags", cuFt: 1 },
  { label: "1.5 cu ft bags", cuFt: 1.5 },
  { label: "2 cu ft bags", cuFt: 2 },
  { label: "40 lb bags (about 0.75 cu ft)", cuFt: 0.75 },
];

const bagsFor = (cuFt: number, bagCuFt: number) => Math.ceil(cuFt / bagCuFt - 1e-9);

// Server-rendered reference table (rectangular beds).
const TABLE_BEDS = [
  { w: 4, l: 8 },
  { w: 4, l: 4 },
  { w: 3, l: 6 },
];
const TABLE_DEPTHS = [6, 10, 12];

// Quick answer: a 4 x 8 ft bed, 12 inches deep.
const QA_CUFT = 4 * 8 * 1;

export default function SoilCalculatorPage() {
  const [preset, setPreset] = useState("0");
  const [shape, setShape] = useState<BedShape>("rectangle");
  const [widthFt, setWidthFt] = useState(4);
  const [lengthFt, setLengthFt] = useState(8);
  const [heightIn, setHeightIn] = useState(12);
  const [diameterFt, setDiameterFt] = useState(4);
  const [leg2WidthFt, setLeg2WidthFt] = useState(4);
  const [leg2LengthFt, setLeg2LengthFt] = useState(4);
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
        // L-shape = two rectangles that do not overlap (leg 1 + leg 2)
        areaSqFt = widthFt * lengthFt + leg2WidthFt * leg2LengthFt;
        perimeterFt = (lengthFt + widthFt + leg2LengthFt) * 2;
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

    const bags = BAG_SIZES.map((b) => ({ ...b, count: bagsFor(totalCuFt, b.cuFt) }));

    return {
      areaSqFt,
      perimeterFt,
      totalCuFt,
      totalCuYd,
      topsoilCuFt,
      compostCuFt,
      otherCuFt,
      bags,
      topsoilPct,
      compostPct,
      otherPct,
    };
  }, [shape, widthFt, lengthFt, heightIn, diameterFt, leg2WidthFt, leg2LengthFt, soilMix, customTopsoil, customCompost, numBeds]);

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

  return (
    <CalculatorLayout
      title="Raised Bed Soil Calculator (Cubic Feet, Yards and Bags)"
      description="Enter your bed size to see how many cubic feet, cubic yards and bags of soil you need, for one bed or several, rectangular, round or L-shaped."
      lastUpdated="October 2026"
      intro={`How much soil for a raised bed? A 4 x 8 ft bed 12 inches deep holds ${QA_CUFT} cubic feet (${(QA_CUFT / 27).toFixed(1)} cubic yards): ${bagsFor(QA_CUFT, 2)} bags of 2 cu ft, ${bagsFor(QA_CUFT, 1.5)} bags of 1.5 cu ft, or about ${bagsFor(QA_CUFT, 0.75)} bags of 40 lb topsoil. The formula is length x width x depth in feet; divide by 27 for cubic yards.`}
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
              label={shape === "square" ? "Side Length" : shape === "lshaped" ? "Leg 1 Width" : "Width"}
              value={widthFt}
              onChange={setWidthFt}
              min={1}
              max={30}
              step={0.5}
              unit="feet"
            />
            {shape !== "square" && (
              <NumberInput
                label={shape === "lshaped" ? "Leg 1 Length" : "Length"}
                value={lengthFt}
                onChange={setLengthFt}
                min={1}
                max={30}
                step={0.5}
                unit="feet"
                helpText={shape === "lshaped" ? "Measure the L as two rectangles that do not overlap" : undefined}
              />
            )}
            {shape === "lshaped" && (
              <>
                <NumberInput
                  label="Leg 2 Width"
                  value={leg2WidthFt}
                  onChange={setLeg2WidthFt}
                  min={1}
                  max={30}
                  step={0.5}
                  unit="feet"
                />
                <NumberInput
                  label="Leg 2 Length"
                  value={leg2LengthFt}
                  onChange={setLeg2LengthFt}
                  min={1}
                  max={30}
                  step={0.5}
                  unit="feet"
                  helpText="Only the part that sticks out past leg 1"
                />
              </>
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
          {results.bags.map((b) => (
            <ResultCard
              key={b.label}
              label={b.label}
              value={String(b.count)}
              unit="bags"
              icon="🛍️"
            />
          ))}
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

          {/* Legend: line items */}
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
            {results.otherPct > 0 && soilMix === "mellsbed" &&
              ["Peat moss (or coir)", "Coarse vermiculite"].map((name) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#d97706" }} />
                    <span className="font-medium text-[var(--color-text)]">{name} (33%)</span>
                  </div>
                  <span className="font-semibold text-[var(--color-text)]">{fmt(results.otherCuFt / 2)} cu ft</span>
                </div>
              ))}
            {results.otherPct > 0 && soilMix !== "mellsbed" && (
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
          text={`My ${shape} raised bed (${shape === "circle" ? `${diameterFt}ft diameter` : shape === "lshaped" ? `${widthFt}×${lengthFt}ft + ${leg2WidthFt}×${leg2LengthFt}ft` : `${widthFt}×${lengthFt}ft`}, ${heightIn}" deep${numBeds > 1 ? `, ×${numBeds} beds` : ""}) needs ${fmt(results.totalCuFt)} cubic feet of soil (${fmt(results.totalCuYd)} cubic yards).`}
        />
        <p className="text-sm text-[var(--color-muted)] mt-4">
          <a href="/planting-dates" className="text-[var(--color-primary)] hover:underline">Find out when to plant in your bed &rarr;</a>
        </p>
      </div>

      <section className="mt-10">
        <h2 className="mb-2 text-lg font-bold text-[var(--color-text)]">How Much Soil for Common Raised Bed Sizes</h2>
        <p className="mb-4 text-sm text-[var(--color-text-muted)]">
          Volume is length x width x depth. Bag counts are rounded up; add a little extra for settling.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-text)]">
                <th className="py-2 pr-3">Bed size</th>
                <th className="py-2 pr-3">Depth</th>
                <th className="py-2 pr-3">Cubic feet</th>
                <th className="py-2 pr-3">Cubic yards</th>
                <th className="py-2 pr-3">2 cu ft bags</th>
                <th className="py-2 pr-3">1.5 cu ft bags</th>
                <th className="py-2">40 lb bags</th>
              </tr>
            </thead>
            <tbody className="text-[var(--color-text-muted)]">
              {TABLE_BEDS.flatMap((b) =>
                TABLE_DEPTHS.map((d) => {
                  const cuFt = (b.w * b.l * d) / 12;
                  return (
                    <tr key={`${b.w}x${b.l}x${d}`} className="border-t border-[var(--color-border)]">
                      <td className="py-2 pr-3">{b.w} x {b.l} ft</td>
                      <td className="py-2 pr-3">{d} in</td>
                      <td className="py-2 pr-3">{fmt(cuFt)}</td>
                      <td className="py-2 pr-3">{(cuFt / 27).toFixed(2)}</td>
                      <td className="py-2 pr-3">{bagsFor(cuFt, 2)}</td>
                      <td className="py-2 pr-3">{bagsFor(cuFt, 1.5)}</td>
                      <td className="py-2">{bagsFor(cuFt, 0.75)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <FAQSection questions={soilFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How This Calculator Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This calculator computes soil volume using standard geometric formulas: length × width × depth for rectangular beds, π × r² × depth for round beds, and the sum of two rectangles for L-shaped beds. One cubic yard is 27 cubic feet. Bag counts divide the total by the bag volume printed on the bag and round up. A 40 lb bag of topsoil usually holds about 0.75 cubic feet, but bag sizes vary, so check the label. For several beds, compare the bag count with a bulk delivery priced by the cubic yard.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Tips for Filling Raised Beds</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>For beds deeper than 12 inches, fill the bottom third with logs, sticks, or leaves (hugelkultur method) to reduce soil cost and improve drainage.</li>
          <li>A 60/40 topsoil-to-compost ratio works for most vegetables. Mel&apos;s Mix (⅓ compost, ⅓ peat, ⅓ vermiculite) is popular for square-foot gardening; the breakdown above lists each part in cubic feet.</li>
          <li>Soil settles 10-15% in the first season. Consider overfilling slightly and topping off with compost each spring.</li>
          <li>Once your bed is filled, use our <a href="/planting-dates" className="text-[var(--color-primary)] hover:underline">planting date calculator</a> to find the best time to plant in your zone, then check <a href="/seed-spacing" className="text-[var(--color-primary)] hover:underline">seed spacing</a> to maximize your harvest.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="soil-calculator" />
      <RelatedCalculators currentPath="/soil-calculator" />
    </CalculatorLayout>
  );
}
