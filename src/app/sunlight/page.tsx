"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
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

type LightQuality = "full-sun" | "partial-shade" | "mostly-shade" | "dappled";

const LIGHT_OPTIONS: { value: string; label: string }[] = [
  { value: "full-sun", label: "Full Sun (open sky, no obstructions)" },
  { value: "partial-shade", label: "Partial Shade (some tree cover or structures)" },
  { value: "mostly-shade", label: "Mostly Shade (heavy tree canopy or north-facing)" },
  { value: "dappled", label: "Dappled (filtered light through tree leaves)" },
];

// Sunlight requirements lookup: maps vegetable names to their sun category
// "full" = 6+ hours, "partial" = 4-6 hours, "shade" = 2-4 hours
type SunCategory = "full" | "partial" | "shade";

const SUN_REQUIREMENTS: Record<string, SunCategory> = {
  // Full sun (6+ hours)
  "Tomato": "full",
  "Pepper": "full",
  "Squash (Winter)": "full",
  "Sweet Corn": "full",
  "Green Bean (Bush)": "full",
  "Green Bean (Pole)": "full",
  "Cucumber": "full",
  "Watermelon": "full",
  "Zucchini": "full",
  "Eggplant": "full",
  "Pumpkin": "full",
  "Sweet Potato": "full",
  "Potato": "full",
  // Partial sun (4-6 hours)
  "Lettuce": "partial",
  "Spinach": "partial",
  "Pea": "partial",
  "Kale": "partial",
  "Swiss Chard": "partial",
  "Beet": "partial",
  "Carrot": "partial",
  "Broccoli": "partial",
  "Cabbage": "partial",
  "Cauliflower": "partial",
  "Brussels Sprouts": "partial",
  "Turnip": "partial",
  "Arugula": "partial",
  "Onion": "partial",
  "Leek": "partial",
  "Parsnip": "partial",
  // Shade tolerant (2-4 hours)
  "Cilantro": "shade",
  "Parsley": "shade",
  "Basil": "shade",
  "Dill": "shade",
  "Radish": "shade",
  "Garlic": "shade",
};

// Duplicate entries for vegetables that appear in multiple categories
// (lettuce, spinach, kale also tolerate shade)
const ALSO_SHADE_TOLERANT = ["Lettuce", "Spinach", "Kale"];

function getEffectiveSunHours(hours: number, quality: LightQuality): number {
  // Adjust effective hours based on light quality
  switch (quality) {
    case "full-sun":
      return hours;
    case "partial-shade":
      return hours * 0.8;
    case "mostly-shade":
      return hours * 0.6;
    case "dappled":
      return hours * 0.7;
  }
}

function getLightCategory(effectiveHours: number): string {
  if (effectiveHours >= 6) return "Full Sun";
  if (effectiveHours >= 4) return "Partial Sun";
  if (effectiveHours >= 2) return "Light Shade";
  return "Deep Shade";
}

interface PlantMatch {
  name: string;
  icon: string;
  category: string;
  sunNeed: SunCategory;
  status: "perfect" | "marginal" | "insufficient";
}

function classifyPlant(
  plantName: string,
  sunNeed: SunCategory,
  effectiveHours: number
): "perfect" | "marginal" | "insufficient" {
  const isAlsoShadeTolerant = ALSO_SHADE_TOLERANT.includes(plantName);

  if (sunNeed === "full") {
    if (effectiveHours >= 6) return "perfect";
    if (effectiveHours >= 4) return "marginal";
    return "insufficient";
  }

  if (sunNeed === "partial") {
    if (effectiveHours >= 4 && effectiveHours <= 8) return "perfect";
    if (effectiveHours >= 3 || effectiveHours > 8) return "marginal";
    if (isAlsoShadeTolerant && effectiveHours >= 2) return "marginal";
    return "insufficient";
  }

  // shade tolerant
  if (effectiveHours >= 2) return "perfect";
  if (effectiveHours >= 1) return "marginal";
  return "insufficient";
}

const sunlightFAQ = [
  {
    question: "How many hours of sunlight do most vegetables need?",
    answer:
      "Most fruiting vegetables like tomatoes, peppers, squash, and cucumbers need at least 6 to 8 hours of direct sunlight per day. Leafy greens such as lettuce, spinach, and kale can grow well with 4 to 6 hours. Herbs like cilantro, parsley, and mint are the most shade-tolerant and can produce with as little as 2 to 4 hours of direct light.",
  },
  {
    question: "What is the difference between full sun, partial shade, and dappled light?",
    answer:
      "Full sun means 6 or more hours of direct, unobstructed sunlight per day. Partial shade means 4 to 6 hours of direct sun, often with shade during the hottest afternoon hours. Dappled light is sunlight filtered through tree leaves, which reduces intensity but spreads light throughout the day. Mostly shade means fewer than 4 hours of direct sun, typically in north-facing areas or under heavy tree canopy.",
  },
  {
    question: "Can I grow tomatoes in partial shade?",
    answer:
      "Tomatoes can survive in partial shade (4 to 6 hours of sun), but they will produce significantly fewer and smaller fruits compared to full-sun conditions. If partial shade is your only option, choose cherry or grape tomato varieties, which are more productive in lower light. Position plants where they receive morning sun rather than afternoon sun for the best results.",
  },
  {
    question: "How can I increase sunlight in a shady garden?",
    answer:
      "Several strategies can help maximize available light. Prune lower branches of nearby trees to raise the canopy and let more light reach ground level. Use reflective mulch (white plastic or aluminum) around plants to bounce light onto leaves from below. Paint nearby fences or walls white to reflect additional light. Grow in containers so you can move plants to follow the sun throughout the season. Raised beds positioned at the sunniest edge of your yard also help.",
  },
  {
    question: "Does morning sun or afternoon sun matter more for vegetables?",
    answer:
      "Morning sun is generally better for most vegetables. Morning light is cooler and less intense, which helps plants photosynthesize without heat stress. Afternoon sun, especially in hot climates, can be too intense and cause wilting or sunscald. If your garden only gets partial sun, morning sun with afternoon shade is the ideal pattern. The exception is heat-loving crops like peppers and melons, which benefit from strong afternoon warmth in cooler climates.",
  },
];

export default function SunlightCalculatorPage() {
  const [sunHours, setSunHours] = useState(6);
  const [lightQuality, setLightQuality] = useState<string>("full-sun");

  const effectiveHours = useMemo(
    () => getEffectiveSunHours(sunHours, lightQuality as LightQuality),
    [sunHours, lightQuality]
  );

  const lightCategory = useMemo(() => getLightCategory(effectiveHours), [effectiveHours]);

  const results = useMemo(() => {
    const matches: PlantMatch[] = [];

    for (const veg of VEGETABLES) {
      const sunNeed = SUN_REQUIREMENTS[veg.name];
      if (!sunNeed) continue;

      const status = classifyPlant(veg.name, sunNeed, effectiveHours);
      matches.push({
        name: veg.name,
        icon: veg.icon,
        category: veg.category,
        sunNeed,
        status,
      });
    }

    return {
      perfect: matches.filter((m) => m.status === "perfect"),
      marginal: matches.filter((m) => m.status === "marginal"),
      insufficient: matches.filter((m) => m.status === "insufficient"),
    };
  }, [effectiveHours]);

  const sunNeedLabel = (need: SunCategory) => {
    switch (need) {
      case "full":
        return "6+ hrs";
      case "partial":
        return "4-6 hrs";
      case "shade":
        return "2-4 hrs";
    }
  };

  return (
    <CalculatorLayout
      title="Sunlight Requirements Calculator"
      description="Find out which vegetables, herbs, and greens match your garden's light conditions. Enter your sunlight hours and light quality to see which plants will thrive, which will survive, and which to avoid."
      lastUpdated="March 2026"
      intro="Every plant has a minimum sunlight threshold for healthy growth and fruit production. Fruiting crops like tomatoes and peppers demand full sun, while leafy greens and herbs can produce well in partial shade. This calculator matches your specific light conditions to the right plants so you do not waste time or money on crops that will struggle."
    >
      <CalculatorSchema
        name="Sunlight Requirements Calculator"
        description="Interactive sunlight calculator for gardeners. Enter your sun hours and light quality to find vegetables, herbs, and greens that match your growing conditions."
        url="https://plantingcalc.com/sunlight"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Sunlight Requirements", url: "https://plantingcalc.com/sunlight" },
        ]}
      />

      {/* Inputs */}
      <div className="space-y-6">
        <SliderInput
          label="Hours of Direct Sun Per Day"
          value={sunHours}
          onChange={setSunHours}
          min={0}
          max={14}
          step={0.5}
          unit="hrs"
        />
        <SelectInput
          label="Light Quality"
          value={lightQuality}
          onChange={setLightQuality}
          options={LIGHT_OPTIONS}
          helpText="Light quality adjusts how effective your sun hours are. Dappled or shaded light is less intense than open-sky direct sun."
        />
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ResultCard
          label="Your Light Category"
          value={lightCategory}
          unit=""
          highlight
          icon="☀️"
        />
        <ResultCard
          label="Effective Sun Hours"
          value={effectiveHours.toFixed(1)}
          unit="hrs/day"
          icon="🔆"
        />
        <ResultCard
          label="Perfect Matches"
          value={String(results.perfect.length)}
          unit="plants"
          highlight
          icon="✅"
        />
        <ResultCard
          label="Will Grow (Marginal)"
          value={String(results.marginal.length)}
          unit="plants"
          icon="🌤️"
        />
      </div>

      {/* Perfect Match */}
      {results.perfect.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
            <span>✅</span> Perfect Match ({results.perfect.length})
          </h2>
          <p className="mb-4 text-sm text-[var(--color-text-muted)]">
            These plants are ideal for your light conditions and should thrive with {effectiveHours.toFixed(1)} effective sun hours.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.perfect.map((plant) => (
              <div
                key={plant.name}
                className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50/50 px-4 py-3 transition-shadow hover:shadow-md"
              >
                <span className="text-2xl">{plant.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{plant.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Needs {sunNeedLabel(plant.sunNeed)} direct sun
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Will Grow (Marginal) */}
      {results.marginal.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
            <span>🌤️</span> Will Grow (Marginal) ({results.marginal.length})
          </h2>
          <p className="mb-4 text-sm text-[var(--color-text-muted)]">
            These plants can grow in your conditions but may produce less or grow more slowly than in their ideal light range.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.marginal.map((plant) => (
              <div
                key={plant.name}
                className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3 transition-shadow hover:shadow-md"
              >
                <span className="text-2xl">{plant.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{plant.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Needs {sunNeedLabel(plant.sunNeed)} direct sun
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not Enough Light */}
      {results.insufficient.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
            <span>❌</span> Not Enough Light ({results.insufficient.length})
          </h2>
          <p className="mb-4 text-sm text-[var(--color-text-muted)]">
            These plants are unlikely to produce well in your current light conditions. Consider increasing light or choosing alternatives above.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.insufficient.map((plant) => (
              <div
                key={plant.name}
                className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 opacity-70"
              >
                <span className="text-2xl">{plant.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{plant.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Needs {sunNeedLabel(plant.sunNeed)} direct sun
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips for Maximizing Light */}
      <div className="mt-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--color-text)]">
          <span>💡</span> Tips for Maximizing Sunlight
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>
            <strong>Reflective mulch:</strong> White plastic or aluminum-coated mulch reflects light back up onto plant leaves, effectively increasing the light your plants receive by 10 to 20 percent.
          </li>
          <li>
            <strong>Prune nearby trees:</strong> Removing lower branches (called "limbing up") raises the canopy and allows more direct sunlight to reach your garden, especially during morning hours.
          </li>
          <li>
            <strong>Container mobility:</strong> Growing in pots or rolling planters lets you move plants throughout the day to follow the sun. This is especially useful on patios, balconies, or yards with shifting shade patterns.
          </li>
          <li>
            <strong>Paint walls and fences white:</strong> Light-colored surfaces near your garden reflect additional sunlight onto your plants, which can make a meaningful difference in tight urban spaces.
          </li>
          <li>
            <strong>Raised beds at the sunny edge:</strong> Position raised beds along the south-facing edge of your yard (in the Northern Hemisphere) to capture the most direct light throughout the day.
          </li>
          <li>
            <strong>Succession planting by season:</strong> Take advantage of seasonal sun angles. Plant sun-loving crops in summer when days are longest, and transition to shade-tolerant greens in spring and fall when the sun is lower.
          </li>
        </ul>
      </div>

      <ShareResults
        title="My Sunlight Results"
        text={`With ${sunHours} hours of ${lightQuality.replace("-", " ")} (${effectiveHours.toFixed(1)} effective hours): ${results.perfect.length} perfect matches, ${results.marginal.length} marginal, ${results.insufficient.length} not enough light.`}
      />

      <FAQSection questions={sunlightFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">Understanding Sunlight for Gardening</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          Sunlight is the primary energy source for plant growth through photosynthesis. The amount and quality of light your garden receives determines which crops will thrive and which will struggle. Fruiting vegetables like tomatoes, peppers, and squash need the most energy to produce fruit, so they require 6 or more hours of direct sunlight. Leafy greens like lettuce and spinach primarily grow leaves, which requires less energy, making them well-suited to 4 to 6 hours of sun. Herbs and shade-tolerant greens can photosynthesize efficiently even in low-light conditions with just 2 to 4 hours of direct sun.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Measuring Your Garden's Sunlight</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>Track sunlight manually by checking your garden every hour from sunrise to sunset and noting which areas are in direct sun versus shade. Do this on a clear day during the growing season for the most accurate reading.</li>
          <li>Digital sun meters (placed in the garden for a full day) give precise measurements and are especially useful for gardens with complex shade patterns from trees, buildings, or fences.</li>
          <li>Remember that sun patterns change with the seasons. A spot that gets 8 hours of sun in June may only get 4 hours in March or October when the sun is lower in the sky.</li>
          <li>Use the <a href="/planting-dates" className="text-[var(--color-primary)] hover:underline">planting date calculator</a> to time your crops, and check the <a href="/companion-planting" className="text-[var(--color-primary)] hover:underline">companion planting guide</a> to pair shade-tolerant and sun-loving plants together strategically.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="sunlight" />
      <RelatedCalculators currentPath="/sunlight" />
    </CalculatorLayout>
  );
}
