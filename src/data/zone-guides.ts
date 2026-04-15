import { VEGETABLES, type Vegetable } from "./vegetables";

export interface ZoneGuideData {
  zone: number;
  slug: string;
  tempRange: string;
  description: string;
  growingSeasonWeeks: number;
  lastFrost: { month: number; day: number };
  firstFrost: { month: number; day: number };
  bestVegetables: Vegetable[];
  challengeVegetables: Vegetable[];
  tips: string[];
}

/**
 * Typical last spring frost and first fall frost by USDA hardiness zone.
 * These are 50th-percentile dates averaged across the populated portion
 * of each zone. The per-ZIP tool uses more precise values from the
 * USDA phzmapi and NOAA NCEI normals at runtime.
 */
const ZONE_FROST: Record<number, { lastFrost: [number, number]; firstFrost: [number, number] }> = {
  1: { lastFrost: [6, 15], firstFrost: [8, 15] },
  2: { lastFrost: [5, 25], firstFrost: [9, 5] },
  3: { lastFrost: [5, 15], firstFrost: [9, 15] },
  4: { lastFrost: [5, 5], firstFrost: [9, 25] },
  5: { lastFrost: [4, 20], firstFrost: [10, 7] },
  6: { lastFrost: [4, 10], firstFrost: [10, 17] },
  7: { lastFrost: [3, 30], firstFrost: [10, 28] },
  8: { lastFrost: [3, 15], firstFrost: [11, 10] },
  9: { lastFrost: [2, 25], firstFrost: [11, 28] },
  10: { lastFrost: [1, 31], firstFrost: [12, 20] },
  11: { lastFrost: [1, 1], firstFrost: [12, 31] },
  12: { lastFrost: [1, 1], firstFrost: [12, 31] },
  13: { lastFrost: [1, 1], firstFrost: [12, 31] },
};

const ZONE_INFO: Record<number, { temp: string; desc: string; seasonWeeks: number; tips: string[] }> = {
  1: {
    temp: "-60°F to -50°F",
    desc: "Extreme cold with very short growing seasons. Interior Alaska. Snow cover persists well into spring.",
    seasonWeeks: 8,
    tips: [
      "Start everything indoors 8-10 weeks before last frost. Your outdoor window is narrow.",
      "Use cold frames, hoop houses, or greenhouses to extend the season by 4-6 weeks on each end.",
      "Focus on fast-maturing varieties: 'Early Girl' tomatoes, 'Provider' beans, 'Sugar Ann' peas.",
      "Mulch heavily with straw to retain soil warmth once the ground thaws.",
    ],
  },
  2: {
    temp: "-50°F to -40°F",
    desc: "Very cold winters with 10-12 weeks of growing season. Northern Minnesota, Montana, parts of Alaska.",
    seasonWeeks: 11,
    tips: [
      "Wall o' Water or cloches can let you transplant tomatoes 2-3 weeks early.",
      "Root vegetables (carrots, beets, turnips) store well and can handle light frost in fall.",
      "Garlic planted in fall overwinters well and produces larger bulbs than spring planting.",
      "Choose short-season varieties: look for 'days to harvest' under 70 on seed packets.",
    ],
  },
  3: {
    temp: "-40°F to -30°F",
    desc: "Cold winters, moderate summers. Upper Midwest, northern New England, parts of the Rockies.",
    seasonWeeks: 13,
    tips: [
      "Start warm-season crops (tomatoes, peppers) indoors 8 weeks before last frost for best results.",
      "Direct-sow cool-season crops (peas, spinach, lettuce) as soon as soil can be worked in spring.",
      "Raised beds warm up faster than in-ground. A real advantage for extending the season.",
      "Fall planting of garlic and overwinter spinach can double your productive months.",
    ],
  },
  4: {
    temp: "-30°F to -20°F",
    desc: "Cold winters with a solid 4-month growing season. Much of the northern U.S.: Iowa, southern Minnesota, northern Oregon.",
    seasonWeeks: 16,
    tips: [
      "You have enough season for most vegetables including melons if you start them indoors.",
      "Succession plant lettuce and radishes every 2-3 weeks from April through September.",
      "Consider a simple plastic hoop tunnel for extending the season 3-4 weeks in fall.",
      "Plant cover crops (winter rye, clover) after harvest to build soil for next year.",
    ],
  },
  5: {
    temp: "-20°F to -10°F",
    desc: "Moderate cold winters, 5+ month growing season. Central U.S., southern New England, Pacific Northwest interior.",
    seasonWeeks: 20,
    tips: [
      "Most vegetables grow well in Zone 5. This is a very productive gardening zone.",
      "Sweet potatoes and long-season melons are possible with black plastic mulch to warm soil.",
      "Fall gardening is underrated: plant brassicas and root crops in July for October harvest.",
      "Perennial herbs (thyme, sage, chives) overwinter reliably with mulch protection.",
    ],
  },
  6: {
    temp: "-10°F to 0°F",
    desc: "Moderate climate with 6-month growing season. Mid-Atlantic, central states, Pacific Northwest coast.",
    seasonWeeks: 24,
    tips: [
      "Almost everything grows in Zone 6. Focus on timing and succession planting for maximum yield.",
      "Start a fall garden in August: broccoli, cabbage, kale, and Brussels sprouts thrive in cool fall air.",
      "Consider overwintering crops under row cover: spinach, garlic, and onions handle Zone 6 winters.",
      "Artichokes can be grown as annuals if started indoors 10 weeks early.",
    ],
  },
  7: {
    temp: "0°F to 10°F",
    desc: "Mild winters, long growing season. Virginia, Tennessee, Oklahoma, parts of the Southwest.",
    seasonWeeks: 28,
    tips: [
      "Two full growing seasons are possible: cool-season crops in spring/fall, warm-season in summer.",
      "Direct-sow beans and corn as late as early July for a second harvest before frost.",
      "Mulch is critical in summer to retain moisture. 3-4 inches of straw or wood chips.",
      "Fall-planted garlic and overwintered onion sets produce excellent harvests.",
    ],
  },
  8: {
    temp: "10°F to 20°F",
    desc: "Mild climate with 8+ month growing season. Coastal South, Texas, Arizona, Pacific coast.",
    seasonWeeks: 32,
    tips: [
      "Heat is your main challenge, not cold. Afternoon shade cloth helps summer tomatoes and peppers.",
      "Plant cool-season crops (lettuce, peas, broccoli) in fall for winter harvest. A Zone 8 advantage.",
      "Okra, sweet potatoes, and southern peas thrive in Zone 8 summer heat.",
      "Irrigation management is key: deep watering 2-3 times per week beats daily shallow watering.",
    ],
  },
  9: {
    temp: "20°F to 30°F",
    desc: "Year-round growing possible. Gulf Coast, southern Texas, inland California, southern Arizona.",
    seasonWeeks: 40,
    tips: [
      "You can grow food every month of the year. Plan seasonal rotations for continuous harvest.",
      "Heat-loving crops (okra, sweet potatoes, peppers) produce for 6+ months in Zone 9.",
      "Cool-season crops do best from October through March. Skip them in summer heat.",
      "Citrus, figs, and subtropical fruit trees are reliable perennial producers.",
    ],
  },
  10: {
    temp: "30°F to 40°F",
    desc: "Frost-free most years. Southern Florida, coastal California, Hawaii (lower elevations).",
    seasonWeeks: 48,
    tips: [
      "Standard cool-season crops (broccoli, cabbage) grow only in the coolest months (December-February).",
      "Tropical vegetables (yardlong beans, chayote, taro) are excellent additions to Zone 10 gardens.",
      "Soil building is critical. Add compost regularly, as warm-climate soils decompose organic matter fast.",
      "Shade structures extend the growing season for heat-sensitive crops into summer.",
    ],
  },
  11: {
    temp: "40°F to 50°F",
    desc: "Tropical. Hawaii, southernmost Florida, Puerto Rico. No frost.",
    seasonWeeks: 52,
    tips: [
      "Growing seasons are defined by wet/dry cycles rather than temperature.",
      "Tropical crops excel: papaya, bananas, taro, cassava, breadfruit grow year-round.",
      "Standard temperate vegetables (tomatoes, peppers, beans) produce year-round but may need pest management.",
      "Soil acidity is common in tropical zones. Test and lime regularly.",
    ],
  },
  12: {
    temp: "50°F to 60°F",
    desc: "Tropical maritime. Coastal Hawaii, US Virgin Islands. Warm year-round.",
    seasonWeeks: 52,
    tips: [
      "Focus on tropical crops: breadfruit, taro, cassava, tropical spinach (Malabar), chaya.",
      "Standard temperate vegetables need shade in afternoon and may require cooling strategies.",
      "Raised beds with imported soil mix often outperform native coral or volcanic soils.",
      "Rain catchment is valuable. Tropical rainfall is seasonal and intense.",
    ],
  },
  13: {
    temp: "60°F to 70°F",
    desc: "Hot tropical. Southern Hawaii, equatorial territories. Year-round warmth.",
    seasonWeeks: 52,
    tips: [
      "Tropical perennials (moringa, papaya, banana, breadfruit) are your most productive crops.",
      "Many temperate vegetables struggle in constant heat. Choose heat-adapted varieties.",
      "Shade cloth (30-50%) extends what you can grow significantly.",
      "Compost and organic mulch are essential. Decomposition is extremely fast in hot, humid conditions.",
    ],
  },
};

export function getAllZoneGuides(): ZoneGuideData[] {
  return Object.entries(ZONE_INFO).map(([zoneStr, info]) => {
    const zone = Number(zoneStr);
    const bestVegetables = VEGETABLES.filter(
      (v) => v.minZone <= zone && v.maxZone >= zone
    );
    const challengeVegetables = VEGETABLES.filter(
      (v) => v.minZone === zone || v.maxZone === zone
    );
    const frost = ZONE_FROST[zone] ?? ZONE_FROST[5];

    return {
      zone,
      slug: `zone-${zone}`,
      tempRange: info.temp,
      description: info.desc,
      growingSeasonWeeks: info.seasonWeeks,
      lastFrost: { month: frost.lastFrost[0], day: frost.lastFrost[1] },
      firstFrost: { month: frost.firstFrost[0], day: frost.firstFrost[1] },
      bestVegetables,
      challengeVegetables,
      tips: info.tips,
    };
  });
}

export function getZoneGuide(slug: string): ZoneGuideData | undefined {
  return getAllZoneGuides().find((z) => z.slug === slug);
}

export function getZoneSlugs(): string[] {
  return Object.keys(ZONE_INFO).map((z) => `zone-${z}`);
}
