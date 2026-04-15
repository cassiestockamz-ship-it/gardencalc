import { ReactNode } from "react";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  lastUpdated?: string;
  intro?: string;
  answerBlock?: ReactNode;
}

/**
 * Tool-first calculator shell. Title + tool come first. Any editorial
 * "quick answer" prose moves below the tool into a <details> block,
 * open by default on desktop, collapsed on mobile.
 */
export default function CalculatorLayout({
  title,
  description,
  children,
  lastUpdated,
  intro,
  answerBlock,
}: CalculatorLayoutProps) {
  const effectiveAnswer = answerBlock ?? (intro ? <p>{intro}</p> : null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Compact hero */}
      <div className="mb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-muted)] sm:text-lg">
          {description}
        </p>
      </div>

      {/* The tool — above the fold */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm sm:p-7">
        {children}
      </div>

      {/* Editorial quick answer — BELOW the tool */}
      {effectiveAnswer && (
        <details
          className="group mt-6 rounded-2xl border-l-4 border-[var(--color-primary)] bg-[var(--color-surface-alt)]/70 p-5 sm:p-6"
          data-speakable="true"
        >
          <summary className="cursor-pointer list-none">
            <span className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                Quick answer
              </span>
              <span className="text-sm text-[var(--color-text-muted)] group-open:rotate-180 transition-transform">
                &#9662;
              </span>
            </span>
          </summary>
          <div className="mt-3 text-sm leading-relaxed text-[var(--color-text)] [&>p]:my-0">
            {effectiveAnswer}
          </div>
        </details>
      )}

      {lastUpdated && (
        <p className="mt-4 text-center text-xs text-[var(--color-text-faint)]">
          Data last updated: {lastUpdated}
        </p>
      )}
    </div>
  );
}
