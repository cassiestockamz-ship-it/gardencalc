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
import { mulchFAQ } from "@/data/faq-data";

type MaterialType = "woodchips" | "bark" | "straw" | "compost" | "leafmulch";

const MATERIALS: Record<
  MaterialType,
  { label: string; costPerYard: number; lbsPerYard: number; bagCost: number }
> = {
  woodchips: {
    label: "Wood Chip Mulch",
    costPerYard: 30,
    lbsPerYard: 600,
    bagCost: 5,
  },
  bark: {
    label: "Shredded Bark",
    costPerYard: 40,
    lbsPerYard: 500,
    bagCost: 6,
  },
  straw: {
    label: "Straw",
    costPerYard: 35,
    lbsPerYard: 400,
    bagCost: 8,
  },
  compost: {
    label: "Compost",
    costPerYard: 45,
    lbsPerYard: 800,
    bagCost: 7,
  },
  leafmulch: {
    label: "Leaf Mulch",
    costPerYard: 25,
    lbsPerYard: 450,
    bagCost: 4,
  },
};

const BAG_SIZE_CUFT = 2;

export default function MulchCalculatorPage() {
  const [lengthFt, setLengthFt] = useState(10);
  const [widthFt, setWidthFt] = useState(4);
  const [depthIn, setDepthIn] = useState(3);
  const [material, setMaterial] = useState<MaterialType>("woodchips");

  const results = useMemo(() => {
    const depthFt = depthIn / 12;
    const areaSqFt = lengthFt * widthFt;
    const totalCuFt = areaSqFt * depthFt;
    const totalCuYd = totalCuFt / 27;
    const bags = Math.ceil(totalCuFt / BAG_SIZE_CUFT);

    const mat = MATERIALS[material];
    const bulkCost = totalCuYd * mat.costPerYard;
    const baggedCost = bags * mat.bagCost;
    const weightLbs = totalCuYd * mat.lbsPerYard;

    return {
      areaSqFt,
      totalCuFt,
      totalCuYd,
      bags,
      bulkCost,
      baggedCost,
      weightLbs,
    };
  }, [lengthFt, widthFt, depthIn, material]);

  const mat = MATERIALS[material];

  const materialOptions: { value: MaterialType; label: string }[] = [
    { value: "woodchips", label: "Wood Chip Mulch" },
    { value: "bark", label: "Shredded Bark" },
    { value: "straw", label: "Straw" },
    { value: "compost", label: "Compost" },
    { value: "leafmulch", label: "Leaf Mulch" },
  ];

  const fmt = (n: number) => n.toFixed(1);
  const fmtCost = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <CalculatorLayout
      title="Mulch & Compost Calculator"
      description="Calculate how much mulch or compost you need for your garden beds, including cost estimates for bulk and bagged options."
      lastUpdated="March 2026"
      intro="A 10x4-foot garden bed mulched 3 inches deep needs about 10 cubic feet of material, or roughly 0.4 cubic yards. That is 5 standard 2-cubic-foot bags. Bulk delivery is almost always cheaper for areas larger than 100 square feet."
    >
      <CalculatorSchema
        name="Mulch & Compost Calculator"
        description="Calculate how many cubic yards or bags of mulch or compost you need for your garden beds. Includes cost estimates for bulk and bagged options."
        url="https://plantingcalc.com/mulch-calculator"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          {
            name: "Mulch Calculator",
            url: "https://plantingcalc.com/mulch-calculator",
          },
        ]}
      />

      {/* Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <NumberInput
          label="Area Length"
          value={lengthFt}
          onChange={setLengthFt}
          min={1}
          max={200}
          step={1}
          unit="feet"
        />

        <NumberInput
          label="Area Width"
          value={widthFt}
          onChange={setWidthFt}
          min={1}
          max={200}
          step={1}
          unit="feet"
        />

        <div className="sm:col-span-2">
          <SliderInput
            label="Desired Depth"
            value={depthIn}
            onChange={setDepthIn}
            min={1}
            max={6}
            step={1}
            unit="inches"
          />
        </div>

        <SelectInput
          label="Material Type"
          value={material}
          onChange={(v) => setMaterial(v as MaterialType)}
          options={materialOptions}
          helpText={`${mat.label}: ~${mat.lbsPerYard} lbs per cubic yard, $${mat.costPerYard}/yard bulk`}
        />
      </div>

      {/* Results */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          You Need
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            label="Cubic Yards"
            value={fmt(results.totalCuYd)}
            unit="cubic yards"
            highlight
            icon="🚛"
          />
          <ResultCard
            label="Bags Needed"
            value={String(results.bags)}
            unit="2 cu ft bags"
            icon="🛍️"
          />
          <ResultCard
            label="Bulk Cost"
            value={fmtCost.format(results.bulkCost)}
            unit="by the yard"
            icon="💰"
          />
          <ResultCard
            label="Bagged Cost"
            value={fmtCost.format(results.baggedCost)}
            unit="store bags"
            icon="🏷️"
          />
        </div>

        {/* Detail breakdown */}
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            Calculation Breakdown
          </h3>
          <div className="space-y-2 text-sm text-[var(--color-text-muted)]">
            <div className="flex justify-between">
              <span>Bed area</span>
              <span className="font-semibold text-[var(--color-text)]">
                {fmt(results.areaSqFt)} sq ft
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total volume</span>
              <span className="font-semibold text-[var(--color-text)]">
                {fmt(results.totalCuFt)} cu ft ({fmt(results.totalCuYd)} cu yd)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated weight</span>
              <span className="font-semibold text-[var(--color-text)]">
                {Math.round(results.weightLbs).toLocaleString()} lbs
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bulk savings vs. bagged</span>
              <span className="font-semibold text-[var(--color-primary)]">
                {results.baggedCost > results.bulkCost
                  ? `Save ${fmtCost.format(results.baggedCost - results.bulkCost)}`
                  : "About the same"}
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
            Material: {mat.label} &middot; Depth: {depthIn}&quot; &middot;{" "}
            {lengthFt}&apos; x {widthFt}&apos;
          </p>
        </div>

        <ShareResults
          title={`Mulch Needed: ${fmt(results.totalCuYd)} cubic yards`}
          text={`My ${lengthFt}x${widthFt}-foot bed at ${depthIn}" deep needs ${fmt(results.totalCuYd)} cubic yards of ${mat.label.toLowerCase()} (${results.bags} bags). Bulk cost: ${fmtCost.format(results.bulkCost)}, bagged: ${fmtCost.format(results.baggedCost)}.`}
        />
      </div>

      <FAQSection questions={mulchFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          How This Calculator Works
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This calculator computes mulch or compost volume using the formula:
          length x width x depth. It converts cubic feet to cubic yards (divide
          by 27) and calculates the number of standard 2-cubic-foot bags needed.
          Bulk pricing is based on typical landscape supply yard rates, while
          bagged pricing reflects average retail bag costs. Weight estimates vary
          by material: compost is the heaviest at around 800 lbs per cubic yard,
          while straw is the lightest at roughly 400 lbs per cubic yard.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          Mulching Tips
        </h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>
            Apply 2 to 3 inches of mulch around vegetables and flowers. Deeper
            layers (4 to 6 inches) work well for pathways and around trees.
          </li>
          <li>
            Keep mulch 2 to 3 inches away from plant stems and tree trunks to
            prevent rot and pest problems.
          </li>
          <li>
            Refresh mulch annually in spring. Most organic mulches break down
            over one to two growing seasons, adding nutrients back to the soil.
          </li>
          <li>
            Consider your goals: wood chips are best for weed suppression,
            compost adds the most nutrients, and straw is ideal for vegetable
            gardens because it breaks down quickly.
          </li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="mulch-calculator" />
      <RelatedCalculators currentPath="/mulch-calculator" />
    </CalculatorLayout>
  );
}
