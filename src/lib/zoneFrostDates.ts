// Typical last/first frost (MM-DD) and season days by USDA subzone. /api/zone and the sticky ZIP bar both read this, so every ZIP shows one date.
import { STATE_FROST } from "@/lib/frostDates";
export const ZONE_FROST_DATES: Record<string, { lastFrost: string; firstFrost: string; growingSeason: number }> = {
  "1a": { lastFrost: "06-15", firstFrost: "08-15", growingSeason: 60 },
  "1b": { lastFrost: "06-01", firstFrost: "08-31", growingSeason: 90 },
  "2a": { lastFrost: "05-25", firstFrost: "09-05", growingSeason: 100 },
  "2b": { lastFrost: "05-20", firstFrost: "09-10", growingSeason: 110 },
  "3a": { lastFrost: "05-15", firstFrost: "09-15", growingSeason: 120 },
  "3b": { lastFrost: "05-10", firstFrost: "09-20", growingSeason: 130 },
  "4a": { lastFrost: "05-05", firstFrost: "09-25", growingSeason: 140 },
  "4b": { lastFrost: "04-28", firstFrost: "10-01", growingSeason: 155 },
  "5a": { lastFrost: "04-20", firstFrost: "10-07", growingSeason: 165 },
  "5b": { lastFrost: "04-15", firstFrost: "10-12", growingSeason: 175 },
  "6a": { lastFrost: "04-10", firstFrost: "10-17", growingSeason: 185 },
  "6b": { lastFrost: "04-05", firstFrost: "10-22", growingSeason: 195 },
  "7a": { lastFrost: "03-30", firstFrost: "10-28", growingSeason: 210 },
  "7b": { lastFrost: "03-22", firstFrost: "11-03", growingSeason: 220 },
  "8a": { lastFrost: "03-15", firstFrost: "11-10", growingSeason: 235 },
  "8b": { lastFrost: "03-07", firstFrost: "11-18", growingSeason: 245 },
  "9a": { lastFrost: "02-25", firstFrost: "11-28", growingSeason: 270 },
  "9b": { lastFrost: "02-15", firstFrost: "12-10", growingSeason: 290 },
  "10a": { lastFrost: "01-31", firstFrost: "12-20", growingSeason: 320 },
  "10b": { lastFrost: "01-15", firstFrost: "12-31", growingSeason: 345 },
  "11a": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
  "11b": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
  "12a": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
  "12b": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
  "13a": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
  "13b": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
};

/** Subzone entry for a zone string like "5a" or "5"; a bare number reads its "a" half. */
export function zoneFrostEntry(zone: string | number | undefined | null) {
  const key = String(zone ?? "").trim().toLowerCase();
  if (!key) return undefined;
  return ZONE_FROST_DATES[key] || ZONE_FROST_DATES[key.replace(/[ab]$/, "") + "a"];
}

/** Last/first frost as month/day for a ZIP's subzone, else the state average. One source for every ZIP tool. */
export function frostNormalsFor(zone: string | number | undefined | null, state?: string) {
  const sub = zoneFrostEntry(zone);
  const md = (s: string) => ({ month: Number(s.slice(0, 2)), day: Number(s.slice(3, 5)) });
  if (sub) return { lastFrost: md(sub.lastFrost), firstFrost: md(sub.firstFrost) };
  const st = state ? STATE_FROST[state.toUpperCase()] : undefined;
  return st ? { lastFrost: st.lastFrost, firstFrost: st.firstFrost } : undefined;
}
