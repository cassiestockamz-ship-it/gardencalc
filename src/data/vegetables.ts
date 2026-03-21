export interface Vegetable {
  name: string;
  category: "leafy" | "root" | "fruiting" | "legume" | "allium" | "herb" | "brassica";
  icon: string;
  // Weeks relative to last frost (negative = before, positive = after)
  indoorStart: number | null; // null = direct sow only
  transplant: number | null;  // null = don't transplant
  directSow: number | null;
  // Growing info
  daysToHarvest: [number, number]; // min, max
  spacingInches: number; // in-row spacing
  rowSpacingInches: number;
  depthInches: number;
  minZone: number;
  maxZone: number;
  notes: string;
}

export const VEGETABLES: Vegetable[] = [
  // Leafy greens
  { name: "Lettuce", category: "leafy", icon: "🥬", indoorStart: -6, transplant: -2, directSow: -2, daysToHarvest: [30, 60], spacingInches: 6, rowSpacingInches: 12, depthInches: 0.25, minZone: 2, maxZone: 11, notes: "Succession plant every 2 weeks" },
  { name: "Spinach", category: "leafy", icon: "🥬", indoorStart: -6, transplant: -4, directSow: -4, daysToHarvest: [37, 45], spacingInches: 4, rowSpacingInches: 12, depthInches: 0.5, minZone: 2, maxZone: 9, notes: "Prefers cool weather, bolts in heat" },
  { name: "Kale", category: "brassica", icon: "🥬", indoorStart: -6, transplant: -2, directSow: -2, daysToHarvest: [55, 75], spacingInches: 18, rowSpacingInches: 24, depthInches: 0.5, minZone: 2, maxZone: 9, notes: "Frost improves flavor" },
  { name: "Swiss Chard", category: "leafy", icon: "🥬", indoorStart: -4, transplant: 0, directSow: -2, daysToHarvest: [50, 60], spacingInches: 12, rowSpacingInches: 18, depthInches: 0.5, minZone: 2, maxZone: 10, notes: "Cut-and-come-again harvest" },
  { name: "Arugula", category: "leafy", icon: "🥬", indoorStart: null, transplant: null, directSow: -3, daysToHarvest: [21, 40], spacingInches: 4, rowSpacingInches: 10, depthInches: 0.25, minZone: 3, maxZone: 11, notes: "Fast grower, succession plant" },

  // Brassicas
  { name: "Broccoli", category: "brassica", icon: "🥦", indoorStart: -8, transplant: -2, directSow: -4, daysToHarvest: [60, 90], spacingInches: 18, rowSpacingInches: 30, depthInches: 0.5, minZone: 2, maxZone: 9, notes: "Harvest side shoots after main head" },
  { name: "Cabbage", category: "brassica", icon: "🥬", indoorStart: -8, transplant: -2, directSow: -4, daysToHarvest: [70, 100], spacingInches: 18, rowSpacingInches: 30, depthInches: 0.5, minZone: 1, maxZone: 9, notes: "Start indoors for spring crop" },
  { name: "Cauliflower", category: "brassica", icon: "🥦", indoorStart: -8, transplant: -2, directSow: null, daysToHarvest: [55, 80], spacingInches: 18, rowSpacingInches: 30, depthInches: 0.5, minZone: 2, maxZone: 9, notes: "Blanch heads by tying leaves" },
  { name: "Brussels Sprouts", category: "brassica", icon: "🥬", indoorStart: -8, transplant: -2, directSow: null, daysToHarvest: [90, 120], spacingInches: 24, rowSpacingInches: 30, depthInches: 0.5, minZone: 2, maxZone: 9, notes: "Frost sweetens the sprouts" },

  // Fruiting
  { name: "Tomato", category: "fruiting", icon: "🍅", indoorStart: -8, transplant: 2, directSow: null, daysToHarvest: [60, 85], spacingInches: 24, rowSpacingInches: 36, depthInches: 0.25, minZone: 3, maxZone: 11, notes: "Stake or cage for support" },
  { name: "Pepper", category: "fruiting", icon: "🌶️", indoorStart: -10, transplant: 2, directSow: null, daysToHarvest: [60, 90], spacingInches: 18, rowSpacingInches: 24, depthInches: 0.25, minZone: 3, maxZone: 11, notes: "Needs warm soil (65°F+)" },
  { name: "Cucumber", category: "fruiting", icon: "🥒", indoorStart: -4, transplant: 2, directSow: 2, daysToHarvest: [50, 70], spacingInches: 12, rowSpacingInches: 48, depthInches: 1, minZone: 3, maxZone: 11, notes: "Trellis for space saving" },
  { name: "Zucchini", category: "fruiting", icon: "🥒", indoorStart: -3, transplant: 2, directSow: 2, daysToHarvest: [45, 60], spacingInches: 36, rowSpacingInches: 48, depthInches: 1, minZone: 3, maxZone: 11, notes: "Very productive, harvest young" },
  { name: "Squash (Winter)", category: "fruiting", icon: "🎃", indoorStart: -3, transplant: 2, directSow: 2, daysToHarvest: [80, 110], spacingInches: 36, rowSpacingInches: 72, depthInches: 1, minZone: 3, maxZone: 10, notes: "Needs lots of space" },
  { name: "Eggplant", category: "fruiting", icon: "🍆", indoorStart: -10, transplant: 3, directSow: null, daysToHarvest: [65, 80], spacingInches: 24, rowSpacingInches: 30, depthInches: 0.25, minZone: 4, maxZone: 11, notes: "Needs warm soil (70°F+)" },
  { name: "Watermelon", category: "fruiting", icon: "🍉", indoorStart: -3, transplant: 2, directSow: 2, daysToHarvest: [70, 90], spacingInches: 60, rowSpacingInches: 72, depthInches: 1, minZone: 3, maxZone: 11, notes: "Needs long warm season" },
  { name: "Pumpkin", category: "fruiting", icon: "🎃", indoorStart: -3, transplant: 2, directSow: 2, daysToHarvest: [90, 120], spacingInches: 60, rowSpacingInches: 96, depthInches: 1, minZone: 3, maxZone: 9, notes: "Count back from desired harvest" },

  // Root vegetables
  { name: "Carrot", category: "root", icon: "🥕", indoorStart: null, transplant: null, directSow: -3, daysToHarvest: [60, 80], spacingInches: 2, rowSpacingInches: 12, depthInches: 0.25, minZone: 3, maxZone: 10, notes: "Thin seedlings to 2 inches apart" },
  { name: "Beet", category: "root", icon: "🟣", indoorStart: null, transplant: null, directSow: -3, daysToHarvest: [50, 65], spacingInches: 4, rowSpacingInches: 12, depthInches: 0.5, minZone: 2, maxZone: 10, notes: "Soak seeds 24hr before planting" },
  { name: "Radish", category: "root", icon: "🔴", indoorStart: null, transplant: null, directSow: -4, daysToHarvest: [22, 30], spacingInches: 2, rowSpacingInches: 8, depthInches: 0.5, minZone: 2, maxZone: 10, notes: "Fastest vegetable to harvest" },
  { name: "Potato", category: "root", icon: "🥔", indoorStart: null, transplant: null, directSow: -2, daysToHarvest: [70, 120], spacingInches: 12, rowSpacingInches: 30, depthInches: 4, minZone: 3, maxZone: 10, notes: "Hill soil as plants grow" },
  { name: "Sweet Potato", category: "root", icon: "🍠", indoorStart: -8, transplant: 3, directSow: null, daysToHarvest: [90, 120], spacingInches: 12, rowSpacingInches: 36, depthInches: 0, minZone: 5, maxZone: 11, notes: "Plant slips, not seeds" },
  { name: "Turnip", category: "root", icon: "🟣", indoorStart: null, transplant: null, directSow: -3, daysToHarvest: [40, 60], spacingInches: 4, rowSpacingInches: 12, depthInches: 0.5, minZone: 2, maxZone: 9, notes: "Great fall crop" },
  { name: "Parsnip", category: "root", icon: "🥕", indoorStart: null, transplant: null, directSow: -4, daysToHarvest: [100, 130], spacingInches: 4, rowSpacingInches: 18, depthInches: 0.5, minZone: 2, maxZone: 9, notes: "Slow to germinate, be patient" },

  // Legumes
  { name: "Green Bean (Bush)", category: "legume", icon: "🫘", indoorStart: null, transplant: null, directSow: 1, daysToHarvest: [50, 60], spacingInches: 4, rowSpacingInches: 18, depthInches: 1, minZone: 2, maxZone: 11, notes: "Don't soak seeds before planting" },
  { name: "Green Bean (Pole)", category: "legume", icon: "🫘", indoorStart: null, transplant: null, directSow: 1, daysToHarvest: [60, 70], spacingInches: 6, rowSpacingInches: 30, depthInches: 1, minZone: 2, maxZone: 11, notes: "Provide trellis or poles" },
  { name: "Pea", category: "legume", icon: "🟢", indoorStart: null, transplant: null, directSow: -5, daysToHarvest: [55, 70], spacingInches: 3, rowSpacingInches: 18, depthInches: 1, minZone: 2, maxZone: 9, notes: "Likes cool weather, inoculate seeds" },

  // Alliums
  { name: "Onion", category: "allium", icon: "🧅", indoorStart: -10, transplant: -4, directSow: -4, daysToHarvest: [90, 120], spacingInches: 4, rowSpacingInches: 12, depthInches: 0.5, minZone: 3, maxZone: 9, notes: "Match day-length variety to latitude" },
  { name: "Garlic", category: "allium", icon: "🧄", indoorStart: null, transplant: null, directSow: -6, daysToHarvest: [240, 270], spacingInches: 6, rowSpacingInches: 12, depthInches: 2, minZone: 3, maxZone: 8, notes: "Plant in fall for summer harvest" },
  { name: "Leek", category: "allium", icon: "🧅", indoorStart: -10, transplant: -2, directSow: null, daysToHarvest: [100, 130], spacingInches: 6, rowSpacingInches: 18, depthInches: 0.5, minZone: 3, maxZone: 9, notes: "Blanch stems by hilling soil" },

  // Herbs
  { name: "Basil", category: "herb", icon: "🌿", indoorStart: -6, transplant: 2, directSow: 2, daysToHarvest: [50, 75], spacingInches: 12, rowSpacingInches: 18, depthInches: 0.25, minZone: 4, maxZone: 11, notes: "Pinch flowers to extend harvest" },
  { name: "Cilantro", category: "herb", icon: "🌿", indoorStart: null, transplant: null, directSow: -2, daysToHarvest: [45, 70], spacingInches: 4, rowSpacingInches: 12, depthInches: 0.25, minZone: 2, maxZone: 11, notes: "Bolts in heat, succession plant" },
  { name: "Dill", category: "herb", icon: "🌿", indoorStart: null, transplant: null, directSow: -2, daysToHarvest: [40, 60], spacingInches: 6, rowSpacingInches: 12, depthInches: 0.25, minZone: 2, maxZone: 9, notes: "Self-seeds freely" },
  { name: "Parsley", category: "herb", icon: "🌿", indoorStart: -8, transplant: -2, directSow: -3, daysToHarvest: [70, 90], spacingInches: 8, rowSpacingInches: 12, depthInches: 0.25, minZone: 2, maxZone: 11, notes: "Slow to germinate (2-3 weeks)" },

  // Corn
  { name: "Sweet Corn", category: "fruiting", icon: "🌽", indoorStart: null, transplant: null, directSow: 2, daysToHarvest: [60, 90], spacingInches: 12, rowSpacingInches: 30, depthInches: 1.5, minZone: 3, maxZone: 11, notes: "Plant in blocks for pollination" },
];

export const CATEGORIES: Record<string, { label: string; color: string }> = {
  leafy: { label: "Leafy Greens", color: "#22c55e" },
  brassica: { label: "Brassicas", color: "#16a34a" },
  fruiting: { label: "Fruiting", color: "#ef4444" },
  root: { label: "Root Vegetables", color: "#d97706" },
  legume: { label: "Legumes", color: "#84cc16" },
  allium: { label: "Alliums", color: "#a855f7" },
  herb: { label: "Herbs", color: "#14b8a6" },
};
