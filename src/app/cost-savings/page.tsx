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
import { VEGETABLES } from "@/data/vegetables";
import { costSavingsFAQ } from "@/data/faq-data";

// Grocery prices per lb (national averages)
const GROCERY_PRICE_PER_LB: Record<string, number> = {
  "Tomato": 3.5,
  "Pepper": 3.0,
  "Lettuce": 2.5,
  "Basil": 15,
  "Cilantro": 15,
  "Dill": 15,
  "Parsley": 15,
  "Zucchini": 2.0,
  "Cucumber": 2.0,
  "Green Bean (Bush)": 3.0,
  "Green Bean (Pole)": 3.0,
  "Kale": 3.5,
  "Carrot": 1.5,
  "Potato": 1.0,
  "Onion": 1.5,
  "Sweet Corn": 0.5,
  "Pea": 4.0,
  "Spinach": 5.0,
  "Radish": 2.0,
};

const DEFAULT_GROCERY_PRICE = 2.5;

// Yield per plant in lbs (same as seed-spacing / bed-layout hardcoded data)
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

const NONE_VALUE = "__none__";

const vegOptions = [
  { value: NONE_VALUE, label: "None" },
  ...VEGETABLES.map((v) => ({ value: v.name, label: `${v.icon} ${v.name}` })),
];

const SLOT_DEFAULTS: string[] = [
  "Tomato",
  "Pepper",
  "Zucchini",
  "Lettuce",
  "Basil",
  "Cucumber",
];

export default function CostSavingsPage() {
  // Vegetable slots (up to 6)
  const [veg1, setVeg1] = useState(SLOT_DEFAULTS[0]);
  const [veg2, setVeg2] = useState(SLOT_DEFAULTS[1]);
  const [veg3, setVeg3] = useState(SLOT_DEFAULTS[2]);
  const [veg4, setVeg4] = useState(SLOT_DEFAULTS[3]);
  const [veg5, setVeg5] = useState(SLOT_DEFAULTS[4]);
  const [veg6, setVeg6] = useState(SLOT_DEFAULTS[5]);

  // Plants per vegetable
  const [plants1, setPlants1] = useState(4);
  const [plants2, setPlants2] = useState(4);
  const [plants3, setPlants3] = useState(4);
  const [plants4, setPlants4] = useState(4);
  const [plants5, setPlants5] = useState(4);
  const [plants6, setPlants6] = useState(4);

  // Costs
  const [seedCostPerVariety, setSeedCostPerVariety] = useState(3);
  const [soilCost, setSoilCost] = useState(50);
  const [waterCostPerMonth, setWaterCostPerMonth] = useState(10);
  const [seasonMonths, setSeasonMonths] = useState(5);

  const slots = useMemo(() => {
    return [
      { name: veg1, plants: plants1 },
      { name: veg2, plants: plants2 },
      { name: veg3, plants: plants3 },
      { name: veg4, plants: plants4 },
      { name: veg5, plants: plants5 },
      { name: veg6, plants: plants6 },
    ].filter((s) => s.name !== NONE_VALUE);
  }, [veg1, veg2, veg3, veg4, veg5, veg6, plants1, plants2, plants3, plants4, plants5, plants6]);

  const results = useMemo(() => {
    let totalYieldLbs = 0;
    let totalGroceryValue = 0;
    let totalSeedCost = 0;

    const activeCount = slots.length;
    totalSeedCost = activeCount * seedCostPerVariety;

    const breakdown: { name: string; plants: number; yieldLbs: number; groceryValue: number }[] = [];

    for (const slot of slots) {
      const yieldPerPlant = YIELD_PER_PLANT[slot.name] || 0.5;
      const yieldLbs = slot.plants * yieldPerPlant;
      const pricePerLb = GROCERY_PRICE_PER_LB[slot.name] || DEFAULT_GROCERY_PRICE;
      const groceryValue = yieldLbs * pricePerLb;

      totalYieldLbs += yieldLbs;
      totalGroceryValue += groceryValue;
      breakdown.push({ name: slot.name, plants: slot.plants, yieldLbs, groceryValue });
    }

    const totalWaterCost = waterCostPerMonth * seasonMonths;
    const totalGardenCost = totalSeedCost + soilCost + totalWaterCost;
    const netSavings = totalGroceryValue - totalGardenCost;
    const roiPct = totalGardenCost > 0 ? ((totalGroceryValue - totalGardenCost) / totalGardenCost) * 100 : 0;
    const costPerLbGarden = totalYieldLbs > 0 ? totalGardenCost / totalYieldLbs : 0;
    const avgStorePricePerLb = totalYieldLbs > 0 ? totalGroceryValue / totalYieldLbs : 0;

    return {
      totalYieldLbs,
      totalGroceryValue,
      totalSeedCost,
      totalWaterCost,
      totalGardenCost,
      netSavings,
      roiPct,
      costPerLbGarden,
      avgStorePricePerLb,
      breakdown,
    };
  }, [slots, seedCostPerVariety, soilCost, waterCostPerMonth, seasonMonths]);

  const fmtCost = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
  const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`;

  return (
    <CalculatorLayout
      title="Garden Cost Savings Calculator"
      description="Estimate how much money your home garden saves compared to buying produce at the grocery store."
      lastUpdated="March 2026"
      intro="A well-planned home vegetable garden can save you $500 to $2,000+ per year on groceries. High-value crops like tomatoes, herbs, and peppers offer the best return on investment, often producing $10 to $15 worth of produce for every $1 spent on seeds."
    >
      <CalculatorSchema
        name="Garden Cost Savings Calculator"
        description="Calculate how much money your home garden saves versus buying produce at the grocery store. Compare garden costs to grocery prices for up to 6 vegetables."
        url="https://plantingcalc.com/cost-savings"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Cost Savings Calculator", url: "https://plantingcalc.com/cost-savings" },
        ]}
      />

      {/* Vegetable Selection */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">Select Your Vegetables</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <SelectInput label="Vegetable 1" value={veg1} onChange={setVeg1} options={vegOptions} />
            {veg1 !== NONE_VALUE && (
              <NumberInput label="Plants" value={plants1} onChange={setPlants1} min={1} max={50} step={1} unit="plants" />
            )}
          </div>
          <div className="space-y-3">
            <SelectInput label="Vegetable 2" value={veg2} onChange={setVeg2} options={vegOptions} />
            {veg2 !== NONE_VALUE && (
              <NumberInput label="Plants" value={plants2} onChange={setPlants2} min={1} max={50} step={1} unit="plants" />
            )}
          </div>
          <div className="space-y-3">
            <SelectInput label="Vegetable 3" value={veg3} onChange={setVeg3} options={vegOptions} />
            {veg3 !== NONE_VALUE && (
              <NumberInput label="Plants" value={plants3} onChange={setPlants3} min={1} max={50} step={1} unit="plants" />
            )}
          </div>
          <div className="space-y-3">
            <SelectInput label="Vegetable 4" value={veg4} onChange={setVeg4} options={vegOptions} />
            {veg4 !== NONE_VALUE && (
              <NumberInput label="Plants" value={plants4} onChange={setPlants4} min={1} max={50} step={1} unit="plants" />
            )}
          </div>
          <div className="space-y-3">
            <SelectInput label="Vegetable 5" value={veg5} onChange={setVeg5} options={vegOptions} />
            {veg5 !== NONE_VALUE && (
              <NumberInput label="Plants" value={plants5} onChange={setPlants5} min={1} max={50} step={1} unit="plants" />
            )}
          </div>
          <div className="space-y-3">
            <SelectInput label="Vegetable 6" value={veg6} onChange={setVeg6} options={vegOptions} />
            {veg6 !== NONE_VALUE && (
              <NumberInput label="Plants" value={plants6} onChange={setPlants6} min={1} max={50} step={1} unit="plants" />
            )}
          </div>
        </div>
      </div>

      {/* Cost Inputs */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">Garden Costs</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <NumberInput
            label="Seed/Plant Cost per Variety"
            value={seedCostPerVariety}
            onChange={setSeedCostPerVariety}
            min={0}
            max={20}
            step={0.5}
            unit="$"
            helpText="Average cost of a seed packet or starter plant"
          />
          <NumberInput
            label="Soil & Amendment Startup Cost"
            value={soilCost}
            onChange={setSoilCost}
            min={0}
            max={500}
            step={5}
            unit="$"
            helpText="One-time cost for soil, compost, and amendments"
          />
          <NumberInput
            label="Water Cost per Month"
            value={waterCostPerMonth}
            onChange={setWaterCostPerMonth}
            min={0}
            max={50}
            step={1}
            unit="$/mo"
            helpText="Estimated additional water bill for your garden"
          />
          <SliderInput
            label="Growing Season Length"
            value={seasonMonths}
            onChange={setSeasonMonths}
            min={3}
            max={9}
            step={1}
            unit="months"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">Your Savings Estimate</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResultCard
            label="Grocery Value of Harvest"
            value={fmtCost.format(results.totalGroceryValue)}
            unit="retail value"
            highlight
            icon="🛒"
          />
          <ResultCard
            label="Total Garden Cost"
            value={fmtCost.format(results.totalGardenCost)}
            unit={`seeds ${fmtCost.format(results.totalSeedCost)} + soil ${fmtCost.format(soilCost)} + water ${fmtCost.format(results.totalWaterCost)}`}
            icon="🌱"
          />
          <ResultCard
            label="Net Savings"
            value={fmtCost.format(results.netSavings)}
            unit={results.netSavings >= 0 ? "saved vs grocery" : "over grocery cost"}
            highlight={results.netSavings > 0}
            icon={results.netSavings >= 0 ? "💰" : "📉"}
          />
          <ResultCard
            label="Return on Investment"
            value={fmtPct(results.roiPct)}
            unit="ROI"
            icon="📈"
          />
          <ResultCard
            label="Garden Cost per lb"
            value={fmtCost.format(results.costPerLbGarden)}
            unit="per lb (your garden)"
            icon="🥬"
          />
          <ResultCard
            label="Store Cost per lb"
            value={fmtCost.format(results.avgStorePricePerLb)}
            unit="per lb (grocery avg)"
            icon="🏪"
          />
        </div>

        {/* Per-Vegetable Breakdown */}
        {results.breakdown.length > 0 && (
          <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
              Per-Vegetable Breakdown
            </h3>
            <div className="space-y-3">
              {results.breakdown.map((item) => {
                const pricePerLb = GROCERY_PRICE_PER_LB[item.name] || DEFAULT_GROCERY_PRICE;
                const veg = VEGETABLES.find((v) => v.name === item.name);
                const icon = veg?.icon || "🌱";
                return (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{icon}</span>
                      <span className="font-medium text-[var(--color-text)]">
                        {item.name} ({item.plants} plants)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-[var(--color-text)]">
                        {item.yieldLbs.toFixed(1)} lbs
                      </span>
                      <span className="ml-2 text-[var(--color-text-muted)]">
                        = {fmtCost.format(item.groceryValue)} @ {fmtCost.format(pricePerLb)}/lb
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3 text-sm font-bold text-[var(--color-text)]">
              <span>Total Expected Harvest</span>
              <span>{results.totalYieldLbs.toFixed(1)} lbs ({fmtCost.format(results.totalGroceryValue)} value)</span>
            </div>
          </div>
        )}

        <ShareResults
          title={`Garden Savings: ${fmtCost.format(results.netSavings)}`}
          text={`My home garden could save ${fmtCost.format(results.netSavings)} this season! Expected harvest: ${results.totalYieldLbs.toFixed(1)} lbs worth ${fmtCost.format(results.totalGroceryValue)} at grocery prices, with only ${fmtCost.format(results.totalGardenCost)} in garden costs (${fmtPct(results.roiPct)} ROI).`}
        />
      </div>

      <FAQSection questions={costSavingsFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How This Calculator Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This calculator estimates your garden savings by multiplying the expected yield per plant (based on agricultural extension data) by the number of plants you grow, then comparing the total grocery value of that harvest against your actual garden costs. Grocery prices are based on national averages for conventional produce. Your actual savings may be higher if you buy organic, shop at premium stores, or live in a high cost-of-living area.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Tips to Maximize Garden Savings</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>Focus on high-value crops: herbs, tomatoes, peppers, and leafy greens deliver the most savings per square foot.</li>
          <li>Start from seeds instead of buying transplants to cut your per-variety cost from $4-6 down to $2-3.</li>
          <li>Preserve surplus harvests by freezing, canning, or dehydrating to extend savings into winter months.</li>
          <li>Use our <a href="/companion-planting" className="text-[var(--color-primary)] hover:underline">companion planting checker</a> to pair plants for better yields, and our <a href="/seed-spacing" className="text-[var(--color-primary)] hover:underline">seed spacing calculator</a> to fit more plants in your beds.</li>
          <li>Compost kitchen scraps to reduce your soil amendment costs to near zero after the first year.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="cost-savings" />
      <RelatedCalculators currentPath="/cost-savings" />
    </CalculatorLayout>
  );
}
