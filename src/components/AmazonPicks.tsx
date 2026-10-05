const TAG = "kawaiiguy0f-pc-20";

export interface AmazonPick {
  asin: string;
  name: string;
  role: string;
  note: string;
}

/** Amazon product links for a buying-intent calculator. No prices: they change daily. */
export default function AmazonPicks({ heading, intro, picks }: { heading: string; intro: string; picks: AmazonPick[] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-2 text-lg font-bold text-[var(--color-text)]">{heading}</h2>
      <p className="mb-4 text-sm text-[var(--color-text-muted)]">{intro}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {picks.map((p) => (
          <div key={p.asin} className="flex flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">{p.role}</p>
            <p className="mt-1 font-semibold text-[var(--color-text)]">{p.name}</p>
            <p className="mt-1 flex-1 text-sm text-[var(--color-text-muted)]">{p.note}</p>
            <a
              href={`https://www.amazon.com/dp/${p.asin}?tag=${TAG}`}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="mt-3 inline-block self-start rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Check price on Amazon
            </a>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-[var(--color-text-muted)]">
        As an Amazon Associate PlantingCalc earns from qualifying purchases. Picks are based on product listings and published specs.
      </p>
    </section>
  );
}
