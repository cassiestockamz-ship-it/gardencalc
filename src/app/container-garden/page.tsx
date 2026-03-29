"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SelectInput from "@/components/SelectInput";
import NumberInput from "@/components/NumberInput";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";
import { VEGETABLES } from "@/data/vegetables";

const AMAZON_TAG = "kawaiiguy0f-pc-20";

// Container size requirements by vegetable category
type ContainerSize = "large" | "medium" | "small";

interface ContainerReq {
  label: string;
  minGallons: number;
  minDiameterIn: number;
}

const CONTAINER_REQS: Record<ContainerSize, ContainerReq> = {
  large: { label: "Large (5+ gallon, 12\"+ diameter)", minGallons: 5, minDiameterIn: 12 },
  medium: { label: "Medium (3+ gallon, 10\"+ diameter)", minGallons: 3, minDiameterIn: 10 },
  small: { label: "Small (1+ gallon, 6\"+ diameter)", minGallons: 1, minDiameterIn: 6 },
};

// Map vegetable names to container size requirements
function getContainerSize(vegName: string): ContainerSize {
  const largePlants = [
    "Tomato", "Pepper", "Squash (Winter)", "Eggplant", "Zucchini",
    "Cucumber", "Watermelon", "Pumpkin", "Broccoli", "Cabbage",
    "Cauliflower", "Brussels Sprouts", "Sweet Corn", "Potato", "Sweet Potato",
  ];
  const smallPlants = [
    "Radish", "Arugula", "Cilantro", "Dill", "Parsley",
    "Carrot", "Green Bean (Bush)",
  ];

  if (largePlants.includes(vegName)) return "large";
  if (smallPlants.includes(vegName)) return "small";
  return "medium";
}

// Yield estimate per plant (lbs) - rough averages
function getYieldPerPlant(vegName: string): number {
  const yields: Record<string, number> = {
    "Tomato": 10, "Pepper": 3, "Cucumber": 5, "Zucchini": 8,
    "Squash (Winter)": 5, "Eggplant": 4, "Lettuce": 0.5, "Spinach": 0.3,
    "Kale": 1, "Swiss Chard": 1, "Arugula": 0.25, "Basil": 0.5,
    "Cilantro": 0.25, "Dill": 0.25, "Parsley": 0.5, "Radish": 0.1,
    "Carrot": 0.2, "Beet": 0.3, "Green Bean (Bush)": 0.5,
    "Green Bean (Pole)": 1, "Pea": 0.3, "Onion": 0.5, "Garlic": 0.15,
    "Broccoli": 1, "Cabbage": 2, "Cauliflower": 1.5, "Potato": 2,
  };
  return yields[vegName] || 0.5;
}

const containerGardenFAQ = [
  {
    question: "What size container do I need for tomatoes?",
    answer:
      "Tomatoes need a minimum 5-gallon container with at least a 12-inch diameter. For best results, use a 10 to 15-gallon container, which gives roots more room and retains moisture better. Determinate (bush) varieties are better suited to containers than indeterminate (vining) types. Always provide a cage or stake for support, and expect to water daily in hot weather.",
  },
  {
    question: "How often should I water container vegetables?",
    answer:
      "Container vegetables typically need watering once or twice daily during hot weather, since pots dry out much faster than garden beds. Stick your finger an inch into the soil. If it feels dry, water thoroughly until water drains from the bottom. Larger containers retain moisture longer than small ones. Self-watering containers or drip irrigation can help maintain consistent moisture levels.",
  },
  {
    question: "Can I grow vegetables in 5-gallon buckets?",
    answer:
      "Yes, 5-gallon buckets are one of the most popular and affordable container gardening options. They work well for tomatoes, peppers, eggplant, cucumbers, and most herbs. Drill 4 to 6 drainage holes in the bottom, use quality potting mix (not garden soil), and place them where they get 6 to 8 hours of sunlight. One plant per bucket is the general rule for large vegetables.",
  },
  {
    question: "What soil should I use for container gardening?",
    answer:
      "Use a quality potting mix, not regular garden soil or topsoil. Garden soil compacts in containers, blocking drainage and suffocating roots. A good potting mix contains peat moss or coco coir, perlite or vermiculite, and compost. For vegetables, choose a mix labeled for edibles or add slow-release fertilizer. Plan to refresh or replace potting mix each growing season since nutrients deplete quickly in containers.",
  },
  {
    question: "How many plants can I fit in one container?",
    answer:
      "The number of plants per container depends on both the container diameter and the plant's spacing needs. A 12-inch pot can hold one tomato or pepper, 3 to 4 lettuce plants, or 6 to 8 radishes. Overcrowding leads to competition for water, nutrients, and light, reducing your harvest. Our calculator above estimates plants per container based on your selected vegetable's spacing requirements and your container size.",
  },
];

export default function ContainerGardenPage() {
  const [selectedVeg, setSelectedVeg] = useState("Tomato");
  const [diameterIn, setDiameterIn] = useState(12);
  const [depthIn, setDepthIn] = useState(12);
  const [numContainers, setNumContainers] = useState(3);

  const vegOptions = VEGETABLES.map((v) => ({
    value: v.name,
    label: `${v.icon} ${v.name}`,
  }));

  const results = useMemo(() => {
    const veg = VEGETABLES.find((v) => v.name === selectedVeg);
    if (!veg) return null;

    const containerSize = getContainerSize(selectedVeg);
    const req = CONTAINER_REQS[containerSize];

    // Calculate soil volume per container (cylinder: pi * r^2 * h)
    const radiusIn = diameterIn / 2;
    const volumeCuIn = Math.PI * radiusIn * radiusIn * depthIn;
    const volumeGallons = volumeCuIn / 231; // 231 cubic inches per gallon
    const volumeCuFt = volumeCuIn / 1728; // 1728 cubic inches per cubic foot

    const totalSoilGallons = volumeGallons * numContainers;
    const totalSoilCuFt = volumeCuFt * numContainers;

    // Plants per container based on spacing vs container area
    const containerAreaSqIn = Math.PI * radiusIn * radiusIn;
    const plantAreaSqIn = veg.spacingInches * veg.spacingInches;
    // Use ~70% of container area for effective planting (edge buffer)
    const effectiveArea = containerAreaSqIn * 0.7;
    const plantsPerContainer = Math.max(1, Math.floor(effectiveArea / plantAreaSqIn));

    const totalPlants = plantsPerContainer * numContainers;

    // Check if container is big enough
    const isBigEnough = diameterIn >= req.minDiameterIn && volumeGallons >= req.minGallons;

    // Yield estimate
    const yieldPerPlant = getYieldPerPlant(selectedVeg);
    const totalYieldLbs = totalPlants * yieldPerPlant;

    // Bags of potting mix needed (typical bag is 1 cubic foot)
    const bagsNeeded = Math.ceil(totalSoilCuFt);

    return {
      volumeGallons,
      volumeCuFt,
      totalSoilGallons,
      totalSoilCuFt,
      plantsPerContainer,
      totalPlants,
      isBigEnough,
      containerSize,
      req,
      totalYieldLbs,
      bagsNeeded,
      yieldPerPlant,
      vegIcon: veg.icon,
    };
  }, [selectedVeg, diameterIn, depthIn, numContainers]);

  if (!results) return null;

  const fmt = (n: number) => n.toFixed(1);

  return (
    <CalculatorLayout
      title="Container Garden Calculator"
      description="Plan your container vegetable garden. Calculate soil volume, plants per pot, and whether your containers are the right size."
      lastUpdated="March 2026"
      intro="Container gardening is perfect for patios, balconies, and small spaces. A standard 12-inch pot holds about 5 gallons of soil and works for most vegetables. Larger plants like tomatoes and peppers do best in 5-gallon (12-inch) or bigger containers, while herbs and radishes thrive in pots as small as 6 inches across."
    >
      <CalculatorSchema
        name="Container Garden Calculator"
        description="Calculate how much soil you need, how many plants fit per pot, and whether your container is big enough for your chosen vegetable."
        url="https://plantingcalc.com/container-garden"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Container Garden Calculator", url: "https://plantingcalc.com/container-garden" },
        ]}
      />

      {/* Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectInput
          label="Vegetable"
          value={selectedVeg}
          onChange={setSelectedVeg}
          options={vegOptions}
          helpText={`${results.req.label} recommended`}
        />

        <NumberInput
          label="Number of Containers"
          value={numContainers}
          onChange={setNumContainers}
          min={1}
          max={20}
          step={1}
          unit="pots"
        />

        <SliderInput
          label="Container Diameter"
          value={diameterIn}
          onChange={setDiameterIn}
          min={6}
          max={24}
          step={1}
          unit="in"
        />

        <SliderInput
          label="Container Depth"
          value={depthIn}
          onChange={setDepthIn}
          min={6}
          max={18}
          step={1}
          unit="in"
        />
      </div>

      {/* Container Size Warning */}
      {!results.isBigEnough && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">&#x26A0;&#xFE0F;</span>
            <div>
              <h3 className="font-semibold text-amber-900">Container Too Small</h3>
              <p className="mt-1 text-sm text-amber-800">
                {selectedVeg} needs at least a {results.req.minGallons}-gallon container with a {results.req.minDiameterIn}-inch diameter.
                Your current container is {fmt(results.volumeGallons)} gallons with a {diameterIn}-inch diameter.
                Consider using a larger pot for better results.
              </p>
              <p className="mt-2 text-sm font-medium text-amber-900">
                Recommended: {results.req.minDiameterIn}+ inch diameter, {results.req.minGallons}+ gallon pot
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Your Container Garden Plan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            label="Plants Per Container"
            value={String(results.plantsPerContainer)}
            unit={selectedVeg.toLowerCase()}
            highlight
            icon={results.vegIcon}
          />
          <ResultCard
            label="Total Plants"
            value={String(results.totalPlants)}
            unit={`across ${numContainers} pot${numContainers > 1 ? "s" : ""}`}
            icon="🌱"
          />
          <ResultCard
            label="Total Soil Needed"
            value={fmt(results.totalSoilGallons)}
            unit={`gal (${fmt(results.totalSoilCuFt)} cu ft)`}
            icon="🪴"
          />
          <ResultCard
            label="Container Verdict"
            value={results.isBigEnough ? "Good Fit" : "Too Small"}
            unit={`${fmt(results.volumeGallons)} gal per pot`}
            icon={results.isBigEnough ? "\u2705" : "\u274C"}
          />
        </div>

        {/* Additional Details */}
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            Detailed Breakdown
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Soil per container</span>
                <span className="font-medium text-[var(--color-text)]">{fmt(results.volumeGallons)} gal / {fmt(results.volumeCuFt)} cu ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Total soil needed</span>
                <span className="font-medium text-[var(--color-text)]">{fmt(results.totalSoilGallons)} gal / {fmt(results.totalSoilCuFt)} cu ft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Bags of potting mix (1 cu ft)</span>
                <span className="font-medium text-[var(--color-text)]">{results.bagsNeeded} bag{results.bagsNeeded !== 1 ? "s" : ""}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Est. yield per plant</span>
                <span className="font-medium text-[var(--color-text)]">{fmt(results.yieldPerPlant)} lbs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Est. total yield</span>
                <span className="font-medium text-[var(--color-text)]">{fmt(results.totalYieldLbs)} lbs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Min container size</span>
                <span className="font-medium text-[var(--color-text)]">{results.req.minGallons} gal / {results.req.minDiameterIn}" diameter</span>
              </div>
            </div>
          </div>
        </div>

        <ShareResults
          title={`Container Garden: ${results.totalPlants} ${selectedVeg} plants`}
          text={`My container garden plan: ${results.totalPlants} ${selectedVeg} plants in ${numContainers} pot${numContainers > 1 ? "s" : ""} (${diameterIn}" diameter, ${depthIn}" deep). Total soil needed: ${fmt(results.totalSoilGallons)} gallons.`}
        />
      </div>

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Recommended Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href={`https://www.amazon.com/s?k=fabric+grow+bags+vegetables&tag=${AMAZON_TAG}&ascsubtag=container-garden`}
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
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Fabric Grow Bags</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Breathable fabric pots for vegetables. Better drainage and air pruning for healthier roots.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$15 - $30</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=potting+mix+vegetables+container&tag=${AMAZON_TAG}&ascsubtag=container-garden`}
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
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Container Potting Mix</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Premium potting mix designed for containers. Lightweight with perlite for drainage.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$12 - $25 per bag</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=self+watering+planter+vegetables&tag=${AMAZON_TAG}&ascsubtag=container-garden`}
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
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Self-Watering Planters</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Built-in water reservoir keeps plants hydrated. Great for busy gardeners and hot climates.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$20 - $50</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <FAQSection questions={containerGardenFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How This Calculator Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This calculator uses standard cylinder volume formulas (pi x radius squared x depth) to determine soil volume in gallons and cubic feet. Plant capacity is estimated by comparing each vegetable&apos;s recommended spacing to the usable planting area of the container (roughly 70% of total surface area, accounting for edge buffer). Container size requirements are based on root depth and spread needs: large fruiting plants like tomatoes need at least 5 gallons, medium crops like lettuce need 3 gallons, and compact plants like radishes grow fine in 1-gallon pots.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Tips for Container Gardening Success</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>Always use potting mix, not garden soil. Potting mix is lighter, drains better, and is free of weed seeds and diseases.</li>
          <li>Ensure every container has drainage holes. Sitting water causes root rot, which is the most common reason container plants die.</li>
          <li>Containers dry out faster than garden beds. During summer heat, you may need to water twice daily. Consider self-watering pots or drip irrigation.</li>
          <li>Feed container vegetables every 2 to 3 weeks with a balanced liquid fertilizer. Nutrients leach out with each watering.</li>
          <li>Group containers by water needs. Place thirsty plants like tomatoes together and drought-tolerant herbs separately.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="container-garden" />
      <RelatedCalculators currentPath="/container-garden" />
    </CalculatorLayout>
  );
}
