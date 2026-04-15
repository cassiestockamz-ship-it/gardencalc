/**
 * State-average last-frost and first-frost date normals.
 *
 * These are fallback values used when we don't yet have a ZIP-specific
 * date from the bundled prefix table or the /api/zone endpoint. Dates
 * are expressed as (month, day) and represent the average date across
 * the populated regions of each state.
 *
 * Sources: NOAA NCEI climate normals (1991-2020), cross-referenced with
 * university extension publications. These are averages. Individual
 * gardens vary by microclimate, elevation, and proximity to water.
 */

export interface FrostNormals {
  /** Average last spring frost (the killing frost most gardeners plan around) */
  lastFrost: { month: number; day: number };
  /** Average first fall frost */
  firstFrost: { month: number; day: number };
  /** Average USDA hardiness zone across the populated portion of the state */
  avgZone: string;
}

export const STATE_FROST: Record<string, FrostNormals> = {
  AL: { lastFrost: { month: 3, day: 20 }, firstFrost: { month: 11, day: 5 },  avgZone: "8a" },
  AK: { lastFrost: { month: 5, day: 25 }, firstFrost: { month: 9, day: 10 },  avgZone: "4a" },
  AZ: { lastFrost: { month: 3, day: 15 }, firstFrost: { month: 11, day: 15 }, avgZone: "9a" },
  AR: { lastFrost: { month: 4, day: 5 },  firstFrost: { month: 10, day: 25 }, avgZone: "7b" },
  CA: { lastFrost: { month: 2, day: 20 }, firstFrost: { month: 12, day: 1 },  avgZone: "9b" },
  CO: { lastFrost: { month: 5, day: 15 }, firstFrost: { month: 9, day: 25 },  avgZone: "5b" },
  CT: { lastFrost: { month: 4, day: 25 }, firstFrost: { month: 10, day: 15 }, avgZone: "6b" },
  DE: { lastFrost: { month: 4, day: 15 }, firstFrost: { month: 10, day: 25 }, avgZone: "7b" },
  FL: { lastFrost: { month: 2, day: 10 }, firstFrost: { month: 12, day: 15 }, avgZone: "10a" },
  GA: { lastFrost: { month: 3, day: 30 }, firstFrost: { month: 11, day: 1 },  avgZone: "8a" },
  HI: { lastFrost: { month: 1, day: 1 },  firstFrost: { month: 12, day: 31 }, avgZone: "12a" },
  ID: { lastFrost: { month: 5, day: 10 }, firstFrost: { month: 10, day: 1 },  avgZone: "6a" },
  IL: { lastFrost: { month: 4, day: 25 }, firstFrost: { month: 10, day: 10 }, avgZone: "6a" },
  IN: { lastFrost: { month: 4, day: 25 }, firstFrost: { month: 10, day: 10 }, avgZone: "6a" },
  IA: { lastFrost: { month: 5, day: 1 },  firstFrost: { month: 10, day: 5 },  avgZone: "5b" },
  KS: { lastFrost: { month: 4, day: 20 }, firstFrost: { month: 10, day: 15 }, avgZone: "6b" },
  KY: { lastFrost: { month: 4, day: 20 }, firstFrost: { month: 10, day: 20 }, avgZone: "6b" },
  LA: { lastFrost: { month: 3, day: 10 }, firstFrost: { month: 11, day: 15 }, avgZone: "9a" },
  ME: { lastFrost: { month: 5, day: 15 }, firstFrost: { month: 9, day: 25 },  avgZone: "5a" },
  MD: { lastFrost: { month: 4, day: 15 }, firstFrost: { month: 10, day: 20 }, avgZone: "7a" },
  MA: { lastFrost: { month: 4, day: 30 }, firstFrost: { month: 10, day: 10 }, avgZone: "6b" },
  MI: { lastFrost: { month: 5, day: 10 }, firstFrost: { month: 10, day: 5 },  avgZone: "5b" },
  MN: { lastFrost: { month: 5, day: 15 }, firstFrost: { month: 9, day: 25 },  avgZone: "4a" },
  MS: { lastFrost: { month: 3, day: 25 }, firstFrost: { month: 11, day: 5 },  avgZone: "8a" },
  MO: { lastFrost: { month: 4, day: 20 }, firstFrost: { month: 10, day: 15 }, avgZone: "6b" },
  MT: { lastFrost: { month: 5, day: 20 }, firstFrost: { month: 9, day: 15 },  avgZone: "4b" },
  NE: { lastFrost: { month: 5, day: 1 },  firstFrost: { month: 10, day: 1 },  avgZone: "5a" },
  NV: { lastFrost: { month: 4, day: 25 }, firstFrost: { month: 10, day: 10 }, avgZone: "7a" },
  NH: { lastFrost: { month: 5, day: 15 }, firstFrost: { month: 9, day: 30 },  avgZone: "5b" },
  NJ: { lastFrost: { month: 4, day: 20 }, firstFrost: { month: 10, day: 20 }, avgZone: "7a" },
  NM: { lastFrost: { month: 4, day: 25 }, firstFrost: { month: 10, day: 15 }, avgZone: "7a" },
  NY: { lastFrost: { month: 5, day: 5 },  firstFrost: { month: 10, day: 10 }, avgZone: "6a" },
  NC: { lastFrost: { month: 4, day: 10 }, firstFrost: { month: 10, day: 25 }, avgZone: "7b" },
  ND: { lastFrost: { month: 5, day: 20 }, firstFrost: { month: 9, day: 15 },  avgZone: "4a" },
  OH: { lastFrost: { month: 5, day: 1 },  firstFrost: { month: 10, day: 10 }, avgZone: "6a" },
  OK: { lastFrost: { month: 4, day: 5 },  firstFrost: { month: 10, day: 25 }, avgZone: "7a" },
  OR: { lastFrost: { month: 4, day: 20 }, firstFrost: { month: 10, day: 20 }, avgZone: "8a" },
  PA: { lastFrost: { month: 4, day: 30 }, firstFrost: { month: 10, day: 10 }, avgZone: "6b" },
  RI: { lastFrost: { month: 4, day: 25 }, firstFrost: { month: 10, day: 15 }, avgZone: "6b" },
  SC: { lastFrost: { month: 3, day: 30 }, firstFrost: { month: 11, day: 5 },  avgZone: "8a" },
  SD: { lastFrost: { month: 5, day: 10 }, firstFrost: { month: 9, day: 25 },  avgZone: "4b" },
  TN: { lastFrost: { month: 4, day: 10 }, firstFrost: { month: 10, day: 25 }, avgZone: "7a" },
  TX: { lastFrost: { month: 3, day: 15 }, firstFrost: { month: 11, day: 20 }, avgZone: "8b" },
  UT: { lastFrost: { month: 5, day: 5 },  firstFrost: { month: 10, day: 5 },  avgZone: "6b" },
  VT: { lastFrost: { month: 5, day: 15 }, firstFrost: { month: 9, day: 25 },  avgZone: "5a" },
  VA: { lastFrost: { month: 4, day: 15 }, firstFrost: { month: 10, day: 20 }, avgZone: "7a" },
  WA: { lastFrost: { month: 4, day: 20 }, firstFrost: { month: 10, day: 20 }, avgZone: "8a" },
  WV: { lastFrost: { month: 5, day: 1 },  firstFrost: { month: 10, day: 10 }, avgZone: "6a" },
  WI: { lastFrost: { month: 5, day: 10 }, firstFrost: { month: 10, day: 1 },  avgZone: "5a" },
  WY: { lastFrost: { month: 5, day: 25 }, firstFrost: { month: 9, day: 15 },  avgZone: "4b" },
  DC: { lastFrost: { month: 4, day: 10 }, firstFrost: { month: 10, day: 25 }, avgZone: "7b" },
};

export function frostNormalsForState(stateAbbr: string): FrostNormals | null {
  return STATE_FROST[stateAbbr.toUpperCase()] ?? null;
}

/**
 * Convert a (month, day) pair to a Date in the given year. If the date has
 * already passed this year, returns next year's occurrence.
 */
export function nextOccurrence(
  month: number,
  day: number,
  from: Date = new Date()
): Date {
  const year = from.getFullYear();
  const candidate = new Date(year, month - 1, day);
  if (candidate < from) {
    return new Date(year + 1, month - 1, day);
  }
  return candidate;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function formatMonthDay(month: number, day: number): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[month - 1]} ${day}`;
}
