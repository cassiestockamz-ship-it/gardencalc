import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "PlantingCalc disclaimer. Data accuracy, non-affiliation with USDA or NOAA, editorial independence, and the limits of our calculators.",
  alternates: { canonical: "https://plantingcalc.com/disclaimer" },
};

export default function DisclaimerPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
        Disclaimer
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-6 text-[var(--color-text-muted)]">
        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Independence and non-affiliation</h2>
          <p className="mt-3">
            PlantingCalc is an independent, privately operated gardening reference site. We are not affiliated with,
            endorsed by, or sponsored by the U.S. Department of Agriculture (USDA), the National Oceanic and Atmospheric
            Administration (NOAA), any state university or cooperative extension office, any seed company, any nursery,
            any government agency, or any commercial gardening brand. Any brand names, product names, or logos that
            appear on this site are used for identification and editorial purposes only. All trademarks belong to their
            respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Data sources and accuracy</h2>
          <p className="mt-3">
            Our calculators and growing guides are built on publicly available data from the USDA Plant Hardiness Zone
            Map, NOAA 30-year climate normals for frost dates, and peer-reviewed agricultural extension publications
            from land-grant universities. We do not alter the underlying government datasets themselves. We reformat
            and compute on them so they&apos;re easier to apply to a real backyard garden.
          </p>
          <p className="mt-3">
            While we work to keep the data current and the formulas well-calibrated, the Service is provided{" "}
            <strong className="text-[var(--color-text)]">as is</strong>. Agricultural data ages over time, zones change
            on multi-year review cycles, and published averages hide significant regional variance. PlantingCalc makes
            no warranty, express or implied, that its calculations are accurate, complete, current, or fit for any
            particular purpose. For gardening decisions with significant financial, ecological, or health consequences,
            verify with your local extension office, licensed nursery, or soil testing laboratory.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Calculators are estimates, not prescriptions</h2>
          <p className="mt-3">
            A calculator that returns &quot;plant tomatoes the week of May 15&quot; is returning an <em>estimate</em>
            {" "}built on averaged regional data. Your specific microclimate. A south-facing wall, a cold pocket, a
            container on a hot roof, a raised bed with atypical soil. Can shift the correct date by one to three weeks
            in either direction. Treat every output as a starting point, not a prescription, and adjust based on what
            you observe in your own garden over multiple seasons.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Not professional advice</h2>
          <p className="mt-3">
            PlantingCalc publishes general information about home gardening. Nothing on the site is horticultural,
            agricultural, medical, nutritional, or pesticide/chemical-application advice. We are not agronomists or
            extension agents, and reading this site does not create a professional relationship of any kind. For
            individualized advice. Especially about chemical applications, soil remediation, or any plant that will
            be consumed. Speak to a qualified licensed professional.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Plant identification and foraging</h2>
          <p className="mt-3">
            Some PlantingCalc content mentions specific plant species and cultivars. None of it is intended as a foraging
            guide or as identification advice for consumed or medicinal plants. Plant identification errors can be fatal.
            If you cannot identify a plant with total certainty, do not consume it and do not apply it to a person or
            animal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Editorial analysis</h2>
          <p className="mt-3">
            Some pages on PlantingCalc include original editorial analysis. For example, plain-language explainers for
            each growing zone, commentary on how a specific calculator should be used in practice, and discussion of
            common failure modes. Those sections represent our own interpretation of the underlying data at the time of
            writing and are clearly separated from the raw calculator outputs. They are not pronouncements from USDA,
            NOAA, or any university extension.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Advertising</h2>
          <p className="mt-3">
            PlantingCalc carries no affiliate links, no sponsored product recommendations, and no product-review
            content. The site may display contextual advertising via Google AdSense on some pages. Any such ads
            will be clearly bounded and will never influence calculator outputs, growing-zone recommendations, or
            editorial analysis. We do not accept payment from plant breeders, seed companies, nurseries, or any
            other source in exchange for a placement, a mention, or a ranking in any calculator output.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Errors and corrections</h2>
          <p className="mt-3">
            If you believe a page on PlantingCalc contains an error, for example an incorrect zone assignment, a
            miscalculated spacing recommendation, an outdated frost-date value, or a factual problem in an editorial
            section, please{" "}
            <Link href="/contact" className="text-[var(--color-primary)] underline">contact us</Link> with the page
            URL and a description of the problem. We review every correction request and update against the
            underlying source data.
          </p>
        </section>
      </div>

      <div className="mt-10 border-t border-[var(--color-border)] pt-6">
        <Link href="/" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
