import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact PlantingCalc with questions, corrections, media inquiries, or feedback about our gardening calculators.",
  alternates: { canonical: "https://plantingcalc.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
        Contact PlantingCalc
      </h1>

      <div className="mt-6 space-y-6 text-[var(--color-text-muted)]">
        <p>
          We read every message we get. Whether you&apos;ve spotted an error on a calculator, have a question about
          where our data comes from, or you&apos;re a journalist or extension agent who wants to cross-reference one
          of our guides, here&apos;s the best way to reach us.
        </p>

        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6">
          <h2 className="font-bold text-[var(--color-text)]">General contact</h2>
          <p className="mt-2">
            Email us at{" "}
            <a href="mailto:hello@plantingcalc.com" className="font-medium text-[var(--color-primary)] hover:underline">
              hello@plantingcalc.com
            </a>.
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]/80">
            We typically respond within 2–3 business days. For urgent plant-identification questions, especially
            involving consumed or medicinal plants, please contact your local university extension office. We&apos;re
            a reference site, not an on-call horticultural service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text)]">Data corrections</h2>
          <p className="mt-3">
            If a calculator returns a value you believe is wrong. A spacing recommendation that disagrees with a
            current extension publication, a zone assignment that doesn&apos;t match your ZIP, an outdated frost date ,
            please include the page URL and the specific discrepancy. We verify against the underlying source data
            before updating. See our <Link href="/methodology" className="text-[var(--color-primary)] underline">
            methodology page</Link> for how our calculators are built.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text)]">Privacy, legal, and takedown</h2>
          <p className="mt-3">
            For privacy questions see our <Link href="/privacy" className="text-[var(--color-primary)] underline">
            privacy policy</Link>. For legal notices, rights-holder inquiries, or takedown requests, email{" "}
            <a href="mailto:hello@plantingcalc.com" className="text-[var(--color-primary)] underline">hello@plantingcalc.com</a>
            {" "}with &quot;Legal&quot; in the subject line.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text)]">Press and extension agents</h2>
          <p className="mt-3">
            For media inquiries, interview requests, or extension-office cross-references on any of our zone guides,
            email us with &quot;Press&quot; in the subject line. We&apos;re happy to share our data sources, describe
            our methodology in detail, and provide direct links back to the underlying USDA, NOAA, or extension
            publications for any figure we cite.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--color-text)]">What PlantingCalc can&apos;t do for you</h2>
          <p className="mt-3">
            PlantingCalc is a reference site. We can&apos;t diagnose a sick plant from a photo, identify a foraged
            mushroom, give you a custom fertilizer prescription, or provide legally actionable advice on pesticide
            application. For any of those, please contact a qualified licensed professional or your local university
            extension office. See our <Link href="/disclaimer" className="text-[var(--color-primary)] underline">
            disclaimer</Link> for the full list of things we are and aren&apos;t.
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
