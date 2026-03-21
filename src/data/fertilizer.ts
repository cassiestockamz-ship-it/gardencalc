export interface FertilizerProfile {
  name: string;
  icon: string;
  category: "leafy" | "fruiting" | "root" | "legume" | "allium" | "herb";
  feederType: "heavy" | "medium" | "light" | "nitrogen-fixer";
  npkRatio: [number, number, number]; // N-P-K recommended ratio
  lbsNPer1000sqft: number; // Pounds of nitrogen per 1000 sq ft per season
  feedFrequency: string; // e.g. "Every 2-3 weeks"
  notes: string;
}

export const FERTILIZER_PROFILES: FertilizerProfile[] = [
  // Heavy feeders
  { name: "Tomato", icon: "🍅", category: "fruiting", feederType: "heavy", npkRatio: [5, 10, 10], lbsNPer1000sqft: 4, feedFrequency: "Every 2 weeks after fruiting", notes: "Switch to high-P when flowering. Too much N = leaves, no fruit." },
  { name: "Pepper", icon: "🌶️", category: "fruiting", feederType: "heavy", npkRatio: [5, 10, 10], lbsNPer1000sqft: 3.5, feedFrequency: "Every 2-3 weeks", notes: "Similar to tomato. Avoid high-N after transplant." },
  { name: "Corn", icon: "🌽", category: "fruiting", feederType: "heavy", npkRatio: [10, 5, 5], lbsNPer1000sqft: 4, feedFrequency: "Side-dress when knee-high + at tassel", notes: "Heaviest nitrogen feeder in the garden." },
  { name: "Cabbage", icon: "🥬", category: "leafy", feederType: "heavy", npkRatio: [10, 5, 5], lbsNPer1000sqft: 3.5, feedFrequency: "Every 3 weeks", notes: "All brassicas are heavy feeders." },
  { name: "Broccoli", icon: "🥦", category: "leafy", feederType: "heavy", npkRatio: [10, 5, 5], lbsNPer1000sqft: 3.5, feedFrequency: "Every 3 weeks", notes: "Side-dress with nitrogen when heads form." },
  { name: "Cauliflower", icon: "🥦", category: "leafy", feederType: "heavy", npkRatio: [10, 5, 5], lbsNPer1000sqft: 3.5, feedFrequency: "Every 3 weeks", notes: "Most demanding brassica. Consistent feeding critical." },
  { name: "Eggplant", icon: "🍆", category: "fruiting", feederType: "heavy", npkRatio: [5, 10, 10], lbsNPer1000sqft: 3.5, feedFrequency: "Every 2-3 weeks", notes: "Similar needs to tomato and pepper." },
  { name: "Watermelon", icon: "🍉", category: "fruiting", feederType: "heavy", npkRatio: [5, 10, 10], lbsNPer1000sqft: 3, feedFrequency: "Every 2-3 weeks", notes: "High-P when vines start running." },
  { name: "Pumpkin", icon: "🎃", category: "fruiting", feederType: "heavy", npkRatio: [5, 10, 10], lbsNPer1000sqft: 3, feedFrequency: "Every 2-3 weeks", notes: "Heavy feeder, especially potassium for fruit development." },
  { name: "Squash", icon: "🎃", category: "fruiting", feederType: "heavy", npkRatio: [5, 10, 10], lbsNPer1000sqft: 3, feedFrequency: "Every 2-3 weeks", notes: "Both summer and winter squash are heavy feeders." },
  { name: "Cucumber", icon: "🥒", category: "fruiting", feederType: "heavy", npkRatio: [5, 10, 10], lbsNPer1000sqft: 3, feedFrequency: "Every 2 weeks", notes: "Feed consistently for continuous harvest." },

  // Medium feeders
  { name: "Lettuce", icon: "🥬", category: "leafy", feederType: "medium", npkRatio: [10, 5, 5], lbsNPer1000sqft: 2, feedFrequency: "Every 3-4 weeks", notes: "Prefers nitrogen for leaf growth. Light, frequent feeding." },
  { name: "Spinach", icon: "🥬", category: "leafy", feederType: "medium", npkRatio: [10, 5, 5], lbsNPer1000sqft: 2, feedFrequency: "Every 3-4 weeks", notes: "Moderate nitrogen for leaf production." },
  { name: "Kale", icon: "🥬", category: "leafy", feederType: "medium", npkRatio: [10, 5, 5], lbsNPer1000sqft: 2.5, feedFrequency: "Every 3-4 weeks", notes: "Benefits from nitrogen side-dressing mid-season." },
  { name: "Swiss Chard", icon: "🥬", category: "leafy", feederType: "medium", npkRatio: [10, 5, 5], lbsNPer1000sqft: 2, feedFrequency: "Every 3-4 weeks", notes: "Cut-and-come-again benefits from regular feeding." },
  { name: "Onion", icon: "🧅", category: "allium", feederType: "medium", npkRatio: [10, 20, 10], lbsNPer1000sqft: 2.5, feedFrequency: "Every 3 weeks until bulbing", notes: "High phosphorus for bulb development. Stop N when bulbing." },
  { name: "Garlic", icon: "🧄", category: "allium", feederType: "medium", npkRatio: [10, 10, 10], lbsNPer1000sqft: 2, feedFrequency: "Early spring + 1 month later", notes: "Feed in spring when growth resumes. Stop by late spring." },
  { name: "Potato", icon: "🥔", category: "root", feederType: "medium", npkRatio: [5, 10, 10], lbsNPer1000sqft: 2.5, feedFrequency: "At planting + when hilling", notes: "Too much N = lots of foliage, small tubers." },
  { name: "Sweet Potato", icon: "🍠", category: "root", feederType: "medium", npkRatio: [5, 10, 10], lbsNPer1000sqft: 2, feedFrequency: "At planting only", notes: "Don't overfertilize — produces vines instead of tubers." },

  // Light feeders
  { name: "Carrot", icon: "🥕", category: "root", feederType: "light", npkRatio: [5, 10, 10], lbsNPer1000sqft: 1, feedFrequency: "Once at planting", notes: "Too much N causes forked, hairy roots. Low-N is key." },
  { name: "Beet", icon: "🟣", category: "root", feederType: "light", npkRatio: [5, 10, 10], lbsNPer1000sqft: 1.5, feedFrequency: "Once at planting + mid-season", notes: "Moderate needs. Boron deficiency causes black spots." },
  { name: "Radish", icon: "🔴", category: "root", feederType: "light", npkRatio: [5, 10, 10], lbsNPer1000sqft: 0.5, feedFrequency: "None needed if soil is amended", notes: "Grows too fast to need much. Good soil prep is enough." },
  { name: "Turnip", icon: "🟣", category: "root", feederType: "light", npkRatio: [5, 10, 10], lbsNPer1000sqft: 1, feedFrequency: "Once at planting", notes: "Light feeder like other root vegetables." },
  { name: "Basil", icon: "🌿", category: "herb", feederType: "light", npkRatio: [5, 5, 5], lbsNPer1000sqft: 1, feedFrequency: "Every 4-6 weeks", notes: "Too much fertilizer reduces essential oils and flavor." },
  { name: "Parsley", icon: "🌿", category: "herb", feederType: "light", npkRatio: [5, 5, 5], lbsNPer1000sqft: 1, feedFrequency: "Every 4-6 weeks", notes: "Light feeder. Rich soil at planting is usually enough." },
  { name: "Cilantro", icon: "🌿", category: "herb", feederType: "light", npkRatio: [5, 5, 5], lbsNPer1000sqft: 0.5, feedFrequency: "None needed", notes: "Over-fertilizing causes bolting." },
  { name: "Dill", icon: "🌿", category: "herb", feederType: "light", npkRatio: [5, 5, 5], lbsNPer1000sqft: 0.5, feedFrequency: "None needed", notes: "Prefers lean soil. Self-seeds freely." },

  // Nitrogen fixers
  { name: "Green Bean", icon: "🫘", category: "legume", feederType: "nitrogen-fixer", npkRatio: [0, 10, 10], lbsNPer1000sqft: 0, feedFrequency: "None — fixes own nitrogen", notes: "Inoculate seeds with rhizobia. Adds N to soil for next crop." },
  { name: "Pea", icon: "🟢", category: "legume", feederType: "nitrogen-fixer", npkRatio: [0, 10, 10], lbsNPer1000sqft: 0, feedFrequency: "None — fixes own nitrogen", notes: "Fixes 50-130 lbs N/acre. Great preceding crop for heavy feeders." },
];

export const FEEDER_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  heavy: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: "Heavy Feeder" },
  medium: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: "Medium Feeder" },
  light: { bg: "bg-green-50 border-green-200", text: "text-green-700", label: "Light Feeder" },
  "nitrogen-fixer": { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", label: "N-Fixer" },
};

// Common organic fertilizer products with NPK values
export const COMMON_FERTILIZERS = [
  { name: "10-10-10 (Balanced)", npk: [10, 10, 10], organic: false },
  { name: "5-10-10 (Fruiting)", npk: [5, 10, 10], organic: false },
  { name: "10-5-5 (Leafy)", npk: [10, 5, 5], organic: false },
  { name: "Blood Meal", npk: [12, 0, 0], organic: true },
  { name: "Bone Meal", npk: [3, 15, 0], organic: true },
  { name: "Fish Emulsion", npk: [5, 1, 1], organic: true },
  { name: "Compost (avg)", npk: [1, 1, 1], organic: true },
  { name: "Worm Castings", npk: [1, 0, 0], organic: true },
  { name: "Kelp Meal", npk: [1, 0, 2], organic: true },
  { name: "Espoma Tomato-Tone", npk: [3, 4, 6], organic: true },
  { name: "Espoma Garden-Tone", npk: [3, 4, 4], organic: true },
  { name: "Dr. Earth Vegetable", npk: [4, 6, 3], organic: true },
];
