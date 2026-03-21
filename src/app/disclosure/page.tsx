export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
        Affiliate Disclosure
      </h1>

      <div className="mt-6 space-y-6 text-[var(--color-text-muted)]">
        <p>
          PlantingCalc is reader-supported. When you buy through links on our
          site, we may earn an affiliate commission at no extra cost to you.
          This helps us keep our calculators free and our data up to date.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-text)]">
          Programs We Participate In
        </h2>
        <p>
          We participate in the Amazon Services LLC Associates Program, an
          affiliate advertising program designed to provide a means for sites
          to earn advertising fees by advertising and linking to Amazon.com.
        </p>

        <h2 className="text-xl font-bold text-[var(--color-text)]">
          Editorial Independence
        </h2>
        <p>
          Our calculator results are never influenced by affiliate
          relationships. Every recommendation and calculation is based solely
          on data from the USDA, NOAA, and peer-reviewed agricultural
          research. Affiliate links are clearly identified and never affect the
          output of any tool on this site.
        </p>
      </div>
    </div>
  );
}
