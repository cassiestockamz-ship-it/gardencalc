import type { WeekAheadSummary } from "@/lib/decisions";
import CropCard from "./CropCard";

/**
 * WeekAhead — the one-screen verdict card.
 *
 * Shows for a given ZIP: a frost countdown bar, the week's average
 * low/high, any frost risk in the 7-day window, and the three most
 * useful crop decisions. This is the "here is your answer" card that
 * sits above the fold on the homepage, frost-alert, plant-today, and
 * every zone guide.
 */

interface Props {
  summary: WeekAheadSummary;
}

export default function WeekAhead({ summary }: Props) {
  const days = summary.daysUntilLastFrost;
  const isFall = days < 0 || days > 200;
  const label = isFall ? "Days to first frost" : "Days to last frost";
  const effectiveDays = isFall
    ? summary.daysUntilFirstFrost
    : summary.daysUntilLastFrost;

  // Color the countdown bar by urgency
  let countdownState: "sow" | "watch" | "frost" = "sow";
  if (effectiveDays <= 7) countdownState = "frost";
  else if (effectiveDays <= 21) countdownState = "watch";

  const pct = Math.max(0, Math.min(100, 100 - (effectiveDays / 120) * 100));

  return (
    <section
      className={`vt-week-ahead pc-fade-up overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm ribbon-${countdownState}`}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
              This week in your garden
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-[var(--color-text)] sm:text-3xl">
              {summary.place}
              <span className="ml-2 font-sans text-sm font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Zone {summary.zone}
              </span>
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

        {/* Countdown bar */}
        <div className="mt-4">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-alt)]">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-700`}
              style={{
                width: `${pct}%`,
                background: `var(--color-${countdownState})`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-faint)]">
            <span>Today</span>
            <span>{isFall ? "First frost" : "Last frost"}</span>
          </div>
        </div>

        {/* Metric row */}
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--color-border)] pt-4">
          <Metric
            label="7-day low"
            value={`${Math.round(summary.avgLowF)}°F`}
            tone={summary.avgLowF < 40 ? "watch" : "sow"}
          />
          <Metric
            label="7-day high"
            value={`${Math.round(summary.avgHighF)}°F`}
            tone="neutral"
          />
          <Metric
            label="Frost risk"
            value={
              summary.nextFrostLowF !== null
                ? `${Math.round(summary.nextFrostLowF)}°F`
                : "None"
            }
            tone={summary.nextFrostLowF !== null ? "frost" : "sow"}
          />
        </div>
      </div>

      {/* Top crop decisions */}
      {summary.topDecisions.length > 0 && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 p-4 sm:p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            What to do right now
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {summary.topDecisions.map((d) => (
              <CropCard key={d.crop.name} decision={d} size="sm" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "sow" | "watch" | "frost" | "neutral";
}) {
  const color =
    tone === "sow"
      ? "text-[var(--color-sow-ink)]"
      : tone === "watch"
      ? "text-[var(--color-watch-ink)]"
      : tone === "frost"
      ? "text-[var(--color-frost-ink)]"
      : "text-[var(--color-text)]";
  return (
    <div className="text-center">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
        {label}
      </dt>
      <dd className={`mt-0.5 font-display text-xl font-bold tabular-nums ${color}`}>
        {value}
      </dd>
    </div>
  );
}
