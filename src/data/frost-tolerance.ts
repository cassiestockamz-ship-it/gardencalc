/**
 * Crop frost tolerance classification. Derived from USDA, Cornell Vegetable
 * Guidelines, Penn State Extension, and Johnny's Selected Seeds reference tables.
 *
 * Tiers:
 *   very-hardy:  survives 20°F and hard freezes. Plant out in late winter.
 *   hardy:       survives 28°F (light freeze). OK before last frost date.
 *   semi-hardy:  tolerates light frost 32°F but not freezes. Wait until last frost.
 *   tender:      damaged at 32°F. Wait until 1 week after last frost.
 *   very-tender: damaged below 50°F. Wait until soil hits 60°F.
 */

export type FrostTier =
  | "very-hardy"
  | "hardy"
  | "semi-hardy"
  | "tender"
  | "very-tender";

export interface FrostCrop {
  name: string;
  icon: string;
  tier: FrostTier;
  /** Minimum temperature in °F the plant survives without cover */
  minTempF: number;
  /** Survives a touch of light frost even without cover at this ripe stage */
  toleratesLightFrost: boolean;
  notes?: string;
}

export const FROST_CROPS: FrostCrop[] = [
  // very-hardy (survives 20°F)
  { name: "Kale", icon: "🥬", tier: "very-hardy", minTempF: 10, toleratesLightFrost: true, notes: "Flavor improves after frost" },
  { name: "Collards", icon: "🥬", tier: "very-hardy", minTempF: 12, toleratesLightFrost: true },
  { name: "Spinach", icon: "🥬", tier: "very-hardy", minTempF: 15, toleratesLightFrost: true },
  { name: "Garlic (planted bulb)", icon: "🧄", tier: "very-hardy", minTempF: -20, toleratesLightFrost: true, notes: "Overwinters easily" },
  { name: "Onions (sets)", icon: "🧅", tier: "very-hardy", minTempF: 15, toleratesLightFrost: true },
  { name: "Mache / corn salad", icon: "🌿", tier: "very-hardy", minTempF: 5, toleratesLightFrost: true },
  { name: "Parsnip", icon: "🥕", tier: "very-hardy", minTempF: 10, toleratesLightFrost: true },

  // hardy (survives 28°F)
  { name: "Broccoli", icon: "🥦", tier: "hardy", minTempF: 26, toleratesLightFrost: true },
  { name: "Cabbage", icon: "🥬", tier: "hardy", minTempF: 26, toleratesLightFrost: true },
  { name: "Brussels sprouts", icon: "🥬", tier: "hardy", minTempF: 22, toleratesLightFrost: true },
  { name: "Cauliflower", icon: "🥦", tier: "hardy", minTempF: 28, toleratesLightFrost: false },
  { name: "Swiss chard", icon: "🥬", tier: "hardy", minTempF: 25, toleratesLightFrost: true },
  { name: "Leeks", icon: "🧅", tier: "hardy", minTempF: 20, toleratesLightFrost: true },
  { name: "Carrots", icon: "🥕", tier: "hardy", minTempF: 20, toleratesLightFrost: true, notes: "Tops die but roots fine" },
  { name: "Turnips", icon: "🥔", tier: "hardy", minTempF: 22, toleratesLightFrost: true },
  { name: "Radish", icon: "🥗", tier: "hardy", minTempF: 26, toleratesLightFrost: true },
  { name: "Beets", icon: "🥔", tier: "hardy", minTempF: 26, toleratesLightFrost: true },
  { name: "Peas", icon: "🫛", tier: "hardy", minTempF: 28, toleratesLightFrost: true },
  { name: "Arugula", icon: "🥬", tier: "hardy", minTempF: 24, toleratesLightFrost: true },

  // semi-hardy (tolerates 32°F)
  { name: "Lettuce", icon: "🥬", tier: "semi-hardy", minTempF: 28, toleratesLightFrost: false },
  { name: "Potato foliage", icon: "🥔", tier: "semi-hardy", minTempF: 30, toleratesLightFrost: false, notes: "Will regrow from tuber" },
  { name: "Celery", icon: "🌿", tier: "semi-hardy", minTempF: 28, toleratesLightFrost: false },
  { name: "Parsley", icon: "🌿", tier: "semi-hardy", minTempF: 25, toleratesLightFrost: true },
  { name: "Green onions", icon: "🧅", tier: "semi-hardy", minTempF: 28, toleratesLightFrost: true },
  { name: "Bok choy", icon: "🥬", tier: "semi-hardy", minTempF: 28, toleratesLightFrost: false },

  // tender (damaged at 32°F)
  { name: "Tomatoes", icon: "🍅", tier: "tender", minTempF: 33, toleratesLightFrost: false, notes: "Cover or lose" },
  { name: "Peppers", icon: "🌶️", tier: "tender", minTempF: 33, toleratesLightFrost: false, notes: "Cover or lose" },
  { name: "Eggplant", icon: "🍆", tier: "tender", minTempF: 35, toleratesLightFrost: false, notes: "Very frost sensitive" },
  { name: "Beans (snap, lima)", icon: "🫘", tier: "tender", minTempF: 33, toleratesLightFrost: false },
  { name: "Corn (young)", icon: "🌽", tier: "tender", minTempF: 32, toleratesLightFrost: false },
  { name: "Potato tubers", icon: "🥔", tier: "tender", minTempF: 32, toleratesLightFrost: false, notes: "Harvest before hard freeze" },
  { name: "Zucchini", icon: "🥒", tier: "tender", minTempF: 33, toleratesLightFrost: false },
  { name: "Squash (summer)", icon: "🎃", tier: "tender", minTempF: 33, toleratesLightFrost: false },

  // very-tender (damaged below 50°F)
  { name: "Cucumber", icon: "🥒", tier: "very-tender", minTempF: 40, toleratesLightFrost: false, notes: "Stops growing below 50°F" },
  { name: "Basil", icon: "🌿", tier: "very-tender", minTempF: 40, toleratesLightFrost: false, notes: "Blackens below 40°F" },
  { name: "Okra", icon: "🌶️", tier: "very-tender", minTempF: 45, toleratesLightFrost: false },
  { name: "Melons", icon: "🍈", tier: "very-tender", minTempF: 45, toleratesLightFrost: false },
  { name: "Watermelon", icon: "🍉", tier: "very-tender", minTempF: 45, toleratesLightFrost: false },
  { name: "Pumpkin", icon: "🎃", tier: "very-tender", minTempF: 40, toleratesLightFrost: false, notes: "Vines die at 32°F" },
  { name: "Sweet potato", icon: "🍠", tier: "very-tender", minTempF: 50, toleratesLightFrost: false, notes: "Tropical; wait until soil 65°F" },
];

/**
 * Assess a forecast low temp against a crop. Returns action category.
 */
export type FrostAction = "fine" | "cover" | "harvest" | "lost";

export function assessCropAtTemp(crop: FrostCrop, forecastLowF: number): FrostAction {
  if (forecastLowF >= 35) return "fine";
  if (forecastLowF >= crop.minTempF + 3) return "fine";
  if (forecastLowF >= crop.minTempF) {
    return crop.toleratesLightFrost ? "fine" : "cover";
  }
  // Below crop's minimum survival temp
  if (crop.tier === "tender" || crop.tier === "very-tender") return "lost";
  if (forecastLowF >= crop.minTempF - 4) return "cover";
  return "harvest";
}

export const TIER_ORDER: FrostTier[] = [
  "very-tender",
  "tender",
  "semi-hardy",
  "hardy",
  "very-hardy",
];

export const TIER_LABEL: Record<FrostTier, string> = {
  "very-tender": "Very tender (damaged below 50°F)",
  tender: "Tender (damaged at 32°F)",
  "semi-hardy": "Semi-hardy (light frost OK)",
  hardy: "Hardy (28°F OK)",
  "very-hardy": "Very hardy (20°F OK)",
};
