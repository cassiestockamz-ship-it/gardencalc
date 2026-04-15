"use client";

import { useMemo } from "react";
import CropCard from "./CropCard";
import type { Vegetable } from "@/data/vegetables";
import type { ActionLevel, CropDecision } from "@/lib/decisions";
import { nextOccurrence, daysBetween } from "@/lib/frostDates";

interface Props {
  zone: number;
  lastFrost: { month: number; day: number };
  firstFrost: { month: number; day: number };
  growingSeasonWeeks: number;
  vegetables: Vegetable[];
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * ZoneToolHeader — the sticky tool-first header at the top of every
 * zone guide. Renders a live frost countdown and a 3-card strip of
 * what to plant this week in this zone. Pure client component, no
 * network calls. Operates on the zone's typical last frost date.
 */
export default function ZoneToolHeader({
  zone,
  lastFrost,
  firstFrost,
  growingSeasonWeeks,
  vegetables,
}: Props) {
  const { daysToLast, daysToFirst, countdownState, pct, label, effectiveDays } =
    useMemo(() => {
      const now = new Date();
      const last = nextOccurrence(lastFrost.month, lastFrost.day, now);
      const first = nextOccurrence(firstFrost.month, firstFrost.day, now);
      const daysToLast = daysBetween(now, last);
      const daysToFirst = daysBetween(now, first);
      const isFall = daysToLast > 200;
      const effective = isFall ? daysToFirst : daysToLast;
      let state: "sow" | "watch" | "frost" = "sow";
      if (effective <= 7) state = "frost";
      else if (effective <= 21) state = "watch";
      const pct = Math.max(0, Math.min(100, 100 - (effective / 120) * 100));
      return {
        daysToLast,
        daysToFirst,
        countdownState: state,
        pct,
        label: isFall ? "Days to first frost" : "Days to last frost",
        effectiveDays: effective,
      };
    }, [lastFrost, firstFrost]);

  const topDecisions = useMemo<CropDecision[]>(() => {
    const now = new Date();
    const last = nextOccurrence(lastFrost.month, lastFrost.day, now);
    const first = nextOccurrence(firstFrost.month, firstFrost.day, now);

    const decisions: CropDecision[] = [];
    for (const v of vegetables) {
      if (zone < v.minZone || zone > v.maxZone) continue;
      const plantOffset =
        v.transplant !== null
          ? v.transplant
          : v.directSow !== null
          ? v.directSow
          : v.indoorStart !== null
          ? v.indoorStart + 6
          : null;
      if (plantOffset === null) continue;

      const plantDate = new Date(last);
      plantDate.setDate(plantDate.getDate() + plantOffset * 7);
      const daysUntil = daysBetween(now, plantDate);

      const harvestCutoff = new Date(first);
      harvestCutoff.setDate(harvestCutoff.getDate() - (v.daysToHarvest[0] + 7));
      if (plantDate > harvestCutoff) continue;

      let level: ActionLevel;
      let headline: string;
      let detail: string;
      if (daysUntil <= 0) {
        level = "sow";
        headline = "Sow now";
        detail = `${v.daysToHarvest[0]}-${v.daysToHarvest[1]} days to harvest.`;
      } else if (daysUntil <= 21 && v.indoorStart !== null) {
        level = "sow";
        headline = "Start indoors";
        detail = `Transplant outside in ${daysUntil} days.`;
      } else if (daysUntil <= 42) {
        level = "watch";
        headline = `Wait ${daysUntil} days`;
        detail = `Plant on or after ${MONTH_NAMES[plantDate.getMonth()]} ${plantDate.getDate()}.`;
      } else {
        continue;
      }
      decisions.push({
        crop: v,
        level,
        headline,
        detail,
        daysUntilAction: daysUntil,
        targetDate: plantDate,
      });
    }

    decisions.sort((a, b) => {
      const order: Record<ActionLevel, number> = {
        sow: 0,
        watch: 1,
        frost: 2,
        pending: 3,
      };
      const ao = order[a.level];
      const bo = order[b.level];
      if (ao !== bo) return ao - bo;
      return (a.daysUntilAction ?? 0) - (b.daysUntilAction ?? 0);
    });

    return decisions.slice(0, 3);
  }, [zone, lastFrost, firstFrost, vegetables]);

  return (
    <section
      className={`vt-week-ahead pc-fade-up mb-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm ribbon-${countdownState}`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
              Typical Zone {zone}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-[var(--color-text)] sm:text-3xl">
              {growingSeasonWeeks}-week growing season
            </h2>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
              {label}
            </div>
            <div className="font-display text-3xl font-bold tabular-nums text-[var(--color-text)] sm:text-4xl">
              {effectiveDays > 0 ? effectiveDays : 0}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-alt)]">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700"
              style={{
                width: `${pct}%`,
                background: `var(--color-${countdownState})`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-faint)]">
            <span>Today</span>
            <span>{daysToFirst < daysToLast ? "First frost" : "Last frost"}</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-4 text-center">
          <Metric label="Last frost" value={`${MONTH_NAMES[lastFrost.month - 1]} ${lastFrost.day}`} />
          <Metric label="First frost" value={`${MONTH_NAMES[firstFrost.month - 1]} ${firstFrost.day}`} />
          <Metric label="Season" value={`${growingSeasonWeeks}w`} />
        </div>
      </div>

      {topDecisions.length > 0 && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 p-4 sm:p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            Best this week in Zone {zone}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {topDecisions.map((d) => (
              <CropCard key={d.crop.name} decision={d} size="sm" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
      </dt>
      <dd className="mt-0.5 font-display text-base font-bold tabular-nums text-[var(--color-text)]">
        {value}
      </dd>
    </div>
  );
}
