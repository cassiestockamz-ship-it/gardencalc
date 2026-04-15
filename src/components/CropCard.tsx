import type { CropDecision, ActionLevel } from "@/lib/decisions";
import type { Vegetable } from "@/data/vegetables";

/**
 * CropCard — the atomic unit.
 *
 * A single crop rendered with its current action level, days-to-harvest,
 * spacing, and the reason it's in that state. Used on the homepage
 * WeekAhead grid, every live-data tool, and every zone guide "best this
 * week" strip. The 3px top ribbon carries the action color.
 */

type Size = "sm" | "md" | "lg";

interface Props {
  decision: CropDecision;
  size?: Size;
  zone?: string;
}

const LEVEL_CLASS: Record<ActionLevel, string> = {
  sow: "ribbon-sow",
  watch: "ribbon-watch",
  frost: "ribbon-frost",
  pending: "ribbon-neutral",
};

const LEVEL_LABEL: Record<ActionLevel, string> = {
  sow: "SOW",
  watch: "WATCH",
  frost: "FROST",
  pending: "ENTER ZIP",
};

const LEVEL_BADGE_CLASS: Record<ActionLevel, string> = {
  sow: "bg-[var(--color-sow-soft)] text-[var(--color-sow-ink)] border-[var(--color-sow-ring)]",
  watch: "bg-[var(--color-watch-soft)] text-[var(--color-watch-ink)] border-[var(--color-watch-ring)]",
  frost: "bg-[var(--color-frost-soft)] text-[var(--color-frost-ink)] border-[var(--color-frost-ring)]",
  pending: "bg-[var(--color-surface-alt)] text-[var(--color-text-faint)] border-[var(--color-border)]",
};

export default function CropCard({ decision, size = "md", zone }: Props) {
  const { crop, level, headline, detail } = decision;
  const compact = size === "sm";

  return (
    <article
      className={`pc-fade-up group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow hover:shadow-md ${LEVEL_CLASS[level]}`}
    >
      <div className={compact ? "p-3" : "p-4 sm:p-5"}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={compact ? "text-xl" : "text-2xl"} aria-hidden="true">
              {crop.icon}
            </span>
            <div>
              <h3
                className={`font-display font-semibold leading-tight text-[var(--color-text)] ${
                  compact ? "text-base" : "text-lg"
                }`}
              >
                {crop.name}
              </h3>
              {zone && (
                <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-text-faint)]">
                  Zone {zone}
                </p>
              )}
            </div>
          </div>
          <span
            className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${LEVEL_BADGE_CLASS[level]}`}
          >
            {LEVEL_LABEL[level]}
          </span>
        </div>

        <div className="mt-3">
          <p
            className={`font-display font-bold leading-tight text-[var(--color-text)] ${
              compact ? "text-base" : "text-xl"
            }`}
          >
            {headline}
          </p>
          <p className={`mt-1 text-[var(--color-text-muted)] ${compact ? "text-xs" : "text-sm"}`}>
            {detail}
          </p>
        </div>

        {!compact && (
          <dl className="mt-3 grid grid-cols-3 gap-1.5 border-t border-[var(--color-border)] pt-3 text-center">
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                Harvest
              </dt>
              <dd className="font-display text-sm font-bold tabular-nums text-[var(--color-text)]">
                {crop.daysToHarvest[0]}–{crop.daysToHarvest[1]}d
              </dd>
            </div>
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                Spacing
              </dt>
              <dd className="font-display text-sm font-bold tabular-nums text-[var(--color-text)]">
                {crop.spacingInches}&quot;
              </dd>
            </div>
            <div>
              <dt className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
                Zones
              </dt>
              <dd className="font-display text-sm font-bold tabular-nums text-[var(--color-text)]">
                {crop.minZone}–{crop.maxZone}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </article>
  );
}

/**
 * A pending-state CropCard used as a placeholder when the user hasn't
 * entered a ZIP yet. Shows the crop with neutral styling and a dash
 * instead of an action headline.
 */
export function PendingCropCard({
  crop,
  size = "md",
}: {
  crop: Vegetable;
  size?: Size;
}) {
  return (
    <CropCard
      size={size}
      decision={{
        crop,
        level: "pending",
        headline: "Enter a ZIP",
        detail: `${crop.daysToHarvest[0]}–${crop.daysToHarvest[1]} days to harvest. Space ${crop.spacingInches}" apart.`,
      }}
    />
  );
}
