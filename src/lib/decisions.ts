/**
 * PlantingCalc decision engine.
 *
 * Pure functions that turn a ZIP location + live 14-day forecast into
 * concrete gardening actions. This is the severity-engine equivalent
 * of recallscanner/src/lib/severity.ts. Zero network calls at render
 * time. The tools feed data in, the engine returns structured verdicts.
 *
 * Three action levels:
 *   sow   — plant now, conditions are right
 *   watch — wait or start indoors, conditions will be right soon
 *   frost — frost risk in the window, cover or do not plant
 */

import type { DailyForecast } from "./weather";
import type { Vegetable } from "@/data/vegetables";
import { FROST_CROPS, assessCropAtTemp, type FrostCrop } from "@/data/frost-tolerance";
import { STATE_FROST, nextOccurrence, daysBetween, type FrostNormals } from "./frostDates";

export type ActionLevel = "sow" | "watch" | "frost" | "pending";

export interface CropDecision {
  crop: Vegetable;
  level: ActionLevel;
  headline: string;
  detail: string;
  daysUntilAction?: number;
  targetDate?: Date;
}

export interface LocationContext {
  zip: string;
  state: string;
  place?: string;
  zone: string;
  lat: number;
  lng: number;
  lastFrost: Date;
  firstFrost: Date;
  daysUntilLastFrost: number;
  daysUntilFirstFrost: number;
}

/**
 * Build a LocationContext from a ZIP and resolved location data. The
 * last frost and first frost are state-average fallbacks when a more
 * precise value is not available.
 */
export function buildLocationContext(args: {
  zip: string;
  state: string;
  place?: string;
  zone: string;
  lat: number;
  lng: number;
  now?: Date;
}): LocationContext {
  const now = args.now ?? new Date();
  const normals: FrostNormals =
    STATE_FROST[args.state.toUpperCase()] ?? {
      lastFrost: { month: 5, day: 1 },
      firstFrost: { month: 10, day: 10 },
      avgZone: args.zone,
    };
  const lastFrost = nextOccurrence(normals.lastFrost.month, normals.lastFrost.day, now);
  const firstFrost = nextOccurrence(normals.firstFrost.month, normals.firstFrost.day, now);
  return {
    zip: args.zip,
    state: args.state,
    place: args.place,
    zone: args.zone,
    lat: args.lat,
    lng: args.lng,
    lastFrost,
    firstFrost,
    daysUntilLastFrost: daysBetween(now, lastFrost),
    daysUntilFirstFrost: daysBetween(now, firstFrost),
  };
}

/**
 * Decide the action level for a single vegetable given a location and
 * the next 14 days of forecast. The decision walks through:
 *
 *   1. Frost risk in the window: any day with tempMinF below the crop's
 *      frost tolerance -> frost (do not plant, or cover if already in).
 *   2. Days until planting window: computed from the crop's directSow
 *      or transplant offset relative to last frost. Negative days mean
 *      the window is already open.
 *   3. Zone compatibility: the crop's minZone/maxZone range.
 */
export function cropDecision(
  crop: Vegetable,
  ctx: LocationContext,
  forecast: DailyForecast[],
  now: Date = new Date()
): CropDecision {
  const zoneNumber = parseInt(ctx.zone, 10);
  if (zoneNumber < crop.minZone) {
    return {
      crop,
      level: "frost",
      headline: "Too cold",
      detail: `${crop.name} needs zone ${crop.minZone} or warmer. You're in zone ${ctx.zone}.`,
    };
  }
  if (zoneNumber > crop.maxZone) {
    return {
      crop,
      level: "watch",
      headline: "Too warm",
      detail: `${crop.name} prefers zone ${crop.maxZone} or cooler. You're in zone ${ctx.zone}.`,
    };
  }

  const frostTolerance = frostToleranceForCrop(crop);
  const frostDays = forecast.filter((d) => d.tempMinF < frostTolerance + 2);
  if (frostDays.length > 0) {
    const worst = frostDays.reduce((a, b) => (a.tempMinF < b.tempMinF ? a : b));
    return {
      crop,
      level: "frost",
      headline: `Frost in ${daysBetween(now, new Date(worst.date))} days`,
      detail: `Forecast low of ${Math.round(worst.tempMinF)}°F on ${formatShort(new Date(worst.date))}. Cover or hold.`,
      targetDate: new Date(worst.date),
    };
  }

  const plantOffset = preferredOffsetWeeks(crop);
  if (plantOffset === null) {
    return {
      crop,
      level: "watch",
      headline: "No window",
      detail: "This crop does not have a planting window in your zone this year.",
    };
  }

  const plantDate = new Date(ctx.lastFrost);
  plantDate.setDate(plantDate.getDate() + plantOffset * 7);
  const daysUntil = daysBetween(now, plantDate);

  if (daysUntil <= 0) {
    const windowClosesAt = new Date(ctx.firstFrost);
    windowClosesAt.setDate(windowClosesAt.getDate() - (crop.daysToHarvest[0] + 7));
    if (windowClosesAt < now) {
      return {
        crop,
        level: "frost",
        headline: "Window closed",
        detail: `${crop.daysToHarvest[0]}-${crop.daysToHarvest[1]} days to harvest won't beat first frost.`,
      };
    }
    return {
      crop,
      level: "sow",
      headline: "Sow now",
      detail: `${crop.daysToHarvest[0]}-${crop.daysToHarvest[1]} days to harvest. Space ${crop.spacingInches}" apart.`,
      daysUntilAction: 0,
      targetDate: plantDate,
    };
  }

  if (daysUntil <= 21 && crop.indoorStart !== null) {
    const indoorDate = new Date(ctx.lastFrost);
    indoorDate.setDate(indoorDate.getDate() + crop.indoorStart * 7);
    if (indoorDate <= now) {
      return {
        crop,
        level: "sow",
        headline: "Start indoors",
        detail: `Begin seeds indoors now. Transplant outside in ${daysUntil} days.`,
        daysUntilAction: daysUntil,
        targetDate: plantDate,
      };
    }
  }

  return {
    crop,
    level: "watch",
    headline: `Wait ${daysUntil} day${daysUntil === 1 ? "" : "s"}`,
    detail: `Plant on or after ${formatShort(plantDate)}.`,
    daysUntilAction: daysUntil,
    targetDate: plantDate,
  };
}

function preferredOffsetWeeks(crop: Vegetable): number | null {
  if (crop.transplant !== null) return crop.transplant;
  if (crop.directSow !== null) return crop.directSow;
  if (crop.indoorStart !== null) return crop.indoorStart + 6;
  return null;
}

function frostToleranceForCrop(crop: Vegetable): number {
  const match = FROST_CROPS.find(
    (fc) => fc.name.toLowerCase().split(" ")[0] === crop.name.toLowerCase().split(" ")[0]
  );
  if (match) return match.minTempF;
  if (crop.category === "fruiting" && !["Corn (young)"].includes(crop.name)) return 33;
  if (crop.category === "legume") return 33;
  if (crop.category === "herb") return 40;
  return 28;
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Week-ahead summary: what's the next frost (if any), how many days until
 * the last spring frost, and the three most useful crop decisions for
 * the user right now. Used on the homepage WeekAhead card and on every
 * live-data tool as the "one screen answer."
 */
export interface WeekAheadSummary {
  place: string;
  zone: string;
  daysUntilLastFrost: number;
  daysUntilFirstFrost: number;
  nextFrostLowF: number | null;
  nextFrostDate: Date | null;
  avgLowF: number;
  avgHighF: number;
  topDecisions: CropDecision[];
}

export function weekAhead(
  ctx: LocationContext,
  forecast: DailyForecast[],
  crops: Vegetable[],
  limit = 3
): WeekAheadSummary {
  const sevenDay = forecast.slice(0, 7);
  const frostDay = sevenDay.find((d) => d.tempMinF <= 35);
  const avgLowF =
    sevenDay.length > 0
      ? sevenDay.reduce((s, d) => s + d.tempMinF, 0) / sevenDay.length
      : 50;
  const avgHighF =
    sevenDay.length > 0
      ? sevenDay.reduce((s, d) => s + d.tempMaxF, 0) / sevenDay.length
      : 70;

  const decisions = crops.map((c) => cropDecision(c, ctx, forecast));
  const sow = decisions.filter((d) => d.level === "sow");
  const watch = decisions.filter((d) => d.level === "watch");
  const frost = decisions.filter((d) => d.level === "frost");

  const top: CropDecision[] = [];
  top.push(...sow.slice(0, limit));
  if (top.length < limit) top.push(...watch.slice(0, limit - top.length));
  if (top.length < limit) top.push(...frost.slice(0, limit - top.length));

  return {
    place: ctx.place ?? ctx.state,
    zone: ctx.zone,
    daysUntilLastFrost: ctx.daysUntilLastFrost,
    daysUntilFirstFrost: ctx.daysUntilFirstFrost,
    nextFrostLowF: frostDay ? frostDay.tempMinF : null,
    nextFrostDate: frostDay ? new Date(frostDay.date) : null,
    avgLowF,
    avgHighF,
    topDecisions: top,
  };
}

/**
 * Frost verdict for the next 3 days against a list of frost crops.
 * Mirrors the recallscanner verdict pattern: one word, one number,
 * a tile summary. Used on /frost-alert and the homepage live demo.
 */
export type FrostVerdictLevel = "all-clear" | "watch" | "action-needed";

export interface FrostVerdict {
  level: FrostVerdictLevel;
  headline: string;
  lowestF: number;
  lowestDate: Date;
  atRisk: FrostCrop[];
  fine: FrostCrop[];
  cover: FrostCrop[];
  lost: FrostCrop[];
}

export function frostVerdict(
  forecast3day: DailyForecast[],
  crops: FrostCrop[]
): FrostVerdict | null {
  if (forecast3day.length === 0) return null;
  const lowest = forecast3day.reduce((a, b) => (a.tempMinF < b.tempMinF ? a : b));
  const lowF = lowest.tempMinF;

  const fine: FrostCrop[] = [];
  const cover: FrostCrop[] = [];
  const lost: FrostCrop[] = [];
  const harvest: FrostCrop[] = [];

  for (const crop of crops) {
    const action = assessCropAtTemp(crop, lowF);
    if (action === "fine") fine.push(crop);
    else if (action === "cover") cover.push(crop);
    else if (action === "lost") lost.push(crop);
    else harvest.push(crop);
  }

  const atRisk = [...cover, ...harvest, ...lost];

  let level: FrostVerdictLevel;
  let headline: string;
  if (lost.length > 0) {
    level = "action-needed";
    headline = `${lost.length} crop${lost.length === 1 ? "" : "s"} will die without cover`;
  } else if (cover.length + harvest.length > 0) {
    level = "watch";
    headline = `${cover.length + harvest.length} crop${
      cover.length + harvest.length === 1 ? "" : "s"
    } need action`;
  } else {
    level = "all-clear";
    headline = "All clear";
  }

  return {
    level,
    headline,
    lowestF: lowF,
    lowestDate: new Date(lowest.date),
    atRisk,
    fine,
    cover: [...cover, ...harvest],
    lost,
  };
}
