// Typical last/first frost (MM-DD) by USDA subzone; season days are computed from the two dates. /api/zone and the sticky ZIP bar both read this, so every ZIP shows one date.
import { STATE_FROST } from "@/lib/frostDates";
const DAYS_BEFORE_MONTH = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const dayOfYear = (d: { month: number; day: number }) => DAYS_BEFORE_MONTH[d.month - 1] + d.day;

/** Frost-free days from last to first frost. Jan 1 to Dec 31 means no typical frost: 365. The one season-length formula. */
export function frostFreeDays(lastFrost: { month: number; day: number }, firstFrost: { month: number; day: number }): number {
  if (lastFrost.month === 1 && lastFrost.day === 1 && firstFrost.month === 12 && firstFrost.day === 31) return 365;
  return dayOfYear(firstFrost) - dayOfYear(lastFrost);
}

const md = (s: string) => ({ month: Number(s.slice(0, 2)), day: Number(s.slice(3, 5)) });

const SUBZONE_FROST: Record<string, { lastFrost: string; firstFrost: string }> = {
  "1a": { lastFrost: "06-15", firstFrost: "08-15" },
  "1b": { lastFrost: "06-01", firstFrost: "08-31" },
  "2a": { lastFrost: "05-25", firstFrost: "09-05" },
  "2b": { lastFrost: "05-20", firstFrost: "09-10" },
  "3a": { lastFrost: "05-15", firstFrost: "09-15" },
  "3b": { lastFrost: "05-10", firstFrost: "09-20" },
  "4a": { lastFrost: "05-05", firstFrost: "09-25" },
  "4b": { lastFrost: "04-28", firstFrost: "10-01" },
  "5a": { lastFrost: "04-20", firstFrost: "10-07" },
  "5b": { lastFrost: "04-15", firstFrost: "10-12" },
  "6a": { lastFrost: "04-10", firstFrost: "10-17" },
  "6b": { lastFrost: "04-05", firstFrost: "10-22" },
  "7a": { lastFrost: "03-30", firstFrost: "10-28" },
  "7b": { lastFrost: "03-22", firstFrost: "11-03" },
  "8a": { lastFrost: "03-15", firstFrost: "11-10" },
  "8b": { lastFrost: "03-07", firstFrost: "11-18" },
  "9a": { lastFrost: "02-25", firstFrost: "11-28" },
  "9b": { lastFrost: "02-15", firstFrost: "12-10" },
  "10a": { lastFrost: "01-31", firstFrost: "12-20" },
  "10b": { lastFrost: "01-15", firstFrost: "12-31" },
  "11a": { lastFrost: "01-01", firstFrost: "12-31" },
  "11b": { lastFrost: "01-01", firstFrost: "12-31" },
  "12a": { lastFrost: "01-01", firstFrost: "12-31" },
  "12b": { lastFrost: "01-01", firstFrost: "12-31" },
  "13a": { lastFrost: "01-01", firstFrost: "12-31" },
  "13b": { lastFrost: "01-01", firstFrost: "12-31" },
};

export const ZONE_FROST_DATES: Record<string, { lastFrost: string; firstFrost: string; growingSeason: number }> = Object.fromEntries(
  Object.entries(SUBZONE_FROST).map(([k, v]) => [k, { ...v, growingSeason: frostFreeDays(md(v.lastFrost), md(v.firstFrost)) }]),
);

/** Subzone entry for a zone string like "5a" or "5"; a bare number reads its "a" half. */
export function zoneFrostEntry(zone: string | number | undefined | null) {
  const key = String(zone ?? "").trim().toLowerCase();
  if (!key) return undefined;
  return ZONE_FROST_DATES[key] || ZONE_FROST_DATES[key.replace(/[ab]$/, "") + "a"];
}

/** Last/first frost as month/day for a ZIP's subzone, else the state average. One source for every ZIP tool. */
export function frostNormalsFor(zone: string | number | undefined | null, state?: string) {
  const sub = zoneFrostEntry(zone);
  if (sub) return { lastFrost: md(sub.lastFrost), firstFrost: md(sub.firstFrost) };
  const st = state ? STATE_FROST[state.toUpperCase()] : undefined;
  return st ? { lastFrost: st.lastFrost, firstFrost: st.firstFrost } : undefined;
}
