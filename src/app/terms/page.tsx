import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "PlantingCalc terms of use. Rules for using our free gardening calculators, limits on our information, and how to contact us.",
  alternates: { canonical: "https://plantingcalc.com/terms" },
};

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-6 text-[var(--color-text-muted)]">
        <section>
          <p>
            These Terms of Use (&quot;Terms&quot;) govern your access to and use of <strong className="text-[var(--color-text)]">PlantingCalc</strong>,
            operated at <a href="https://plantingcalc.com" className="text-[var(--color-primary)] underline">plantingcalc.com</a>
            {" "}(&quot;we&quot;, &quot;us&quot;, the &quot;Service&quot;). By using the Service you agree to these Terms.
            If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">1. What PlantingCalc Is</h2>
          <p className="mt-3">
            PlantingCalc is a free, independent collection of gardening calculators and growing guides for home gardeners
            in the United States. We calculate soil volumes, planting dates, seed spacing, companion planting compatibility,
            fertilizer needs, watering schedules, and related planning information from USDA hardiness zone data, NOAA
            frost-date normals, and university agricultural extension publications. We are not a government agency,
            university extension office, seed company, or licensed agronomist, and the Service is not a substitute for
            professional horticultural advice.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">2. No Warranty on Accuracy</h2>
          <p className="mt-3">
            Every calculator and growing guide on PlantingCalc is a general-purpose estimate built on averaged public
            data. Real gardens are affected by microclimate, soil composition, pest pressure, weather variability,
            cultivar-specific behavior, and a long list of other factors that no calculator can perfectly predict. We
            make reasonable efforts to keep our data current and our formulas well-grounded in published research, but
            we provide the Service <strong className="text-[var(--color-text)]">as is</strong> and without warranty of
            any kind. Do not rely on PlantingCalc as the sole source of truth for a gardening decision with significant
            financial, ecological, or health consequences. When in doubt, contact your local university extension office.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">3. Not Professional Advice</h2>
          <p className="mt-3">
            PlantingCalc publishes general information about home gardening. Nothing on the Service is horticultural,
            agricultural, legal, medical, nutritional, or pesticide/chemical-application advice. Consult a qualified
            professional before making decisions that depend on any of the above — for example, before applying a
            chemical fertilizer or pesticide, before foraging or consuming plants based on our identification, or before
            making a significant financial commitment to a gardening project.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">4. Acceptable Use</h2>
          <p className="mt-3">You agree not to:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Scrape, mirror, or republish substantial portions of the Service without our written permission.</li>
            <li>Interfere with the Service, its security, or any servers or networks connected to it.</li>
            <li>Use the Service to send unsolicited commercial communications.</li>
            <li>Use any automated system to submit requests at a rate intended to disrupt normal operation.</li>
            <li>Impersonate another person or misrepresent your affiliation with any organization.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">5. Third-Party Links and Data</h2>
          <p className="mt-3">
            The Service links to third-party sites and calls third-party APIs (USDA, NOAA, university extensions, and
            commerce partners). We do not control those services and are not responsible for their content, policies,
            accuracy, or practices. Visiting an external link or relying on third-party data is at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">6. Intellectual Property</h2>
          <p className="mt-3">
            Original written content, layout, calculator logic, design, and original analysis on PlantingCalc are ours
            and protected by copyright. Underlying USDA, NOAA, and university extension data is in the public domain or
            used under fair-use terms. Product names, logos, and trademarks mentioned on the Service are the property of
            their respective owners and are used here for descriptive and editorial purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">7. Limitation of Liability</h2>
          <p className="mt-3">
            To the fullest extent permitted by law, PlantingCalc and its operators are not liable for any direct,
            indirect, incidental, consequential, special, or punitive damages arising from your use of the Service,
            reliance on its content, or inability to access it. This includes but is not limited to damages related to
            crop failure, garden yield, financial loss, personal injury, property damage, lost data, or lost time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">8. Changes to These Terms</h2>
          <p className="mt-3">
            We may update these Terms from time to time. Material changes will be reflected in the &quot;Last
            updated&quot; date at the top of this page. Continued use of the Service after an update means you accept
            the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">9. Contact</h2>
          <p className="mt-3">
            Questions about these Terms can be sent via our{" "}
            <Link href="/contact" className="text-[var(--color-primary)] underline">contact page</Link>.
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
