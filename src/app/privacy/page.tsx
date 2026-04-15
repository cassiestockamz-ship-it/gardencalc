import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PlantingCalc privacy policy. What we collect, what we don't, how cookies and analytics work, and how to contact us about your data.",
  alternates: { canonical: "https://plantingcalc.com/privacy" },
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-6 text-[var(--color-text-muted)]">
        <section>
          <p>
            This privacy policy describes how <strong className="text-[var(--color-text)]">PlantingCalc</strong>{" "}
            (&quot;we&quot;, &quot;us&quot;, the &quot;Service&quot;) handles information about visitors and users of{" "}
            <a href="https://plantingcalc.com" className="text-[var(--color-primary)] underline">plantingcalc.com</a>.
            By using the Service you agree to the practices described here. We keep this policy short and concrete because
            the answer to most privacy questions about PlantingCalc is: we don&apos;t collect what we don&apos;t need.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">What we do not collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-[var(--color-text)]">We do not require an account.</strong> Every calculator on
              PlantingCalc works without login, sign-up, or any form of identity verification.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">We do not store the values you enter into calculators.</strong>
              {" "}Bed dimensions, ZIP codes, plant selections, and everything else you type into our tools is processed
              in your browser or sent to our API for a one-shot lookup and then discarded. We do not build a profile of
              your garden.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">We do not sell, rent, or share email addresses.</strong>
              {" "}Not with advertisers, not with data brokers, not with anyone.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">What we collect</h2>
          <p className="mt-3">
            Two narrow categories of data, both used to keep the site running and improving:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-[var(--color-text)]">Anonymous page-view analytics.</strong> When you visit a page,
              an inline script sends an anonymous event to our own analytics backend (Project Dash). It records the page
              path, a randomly generated per-session ID, rough device type (mobile / tablet / desktop), and the referrer
              URL if your browser supplied one. We do not receive your IP, we do not set a persistent cookie for this, and
              we do not tie these events to any identity. You can disable tracking by appending <code>?notrack=1</code>{" "}
              to any URL on this site, which sets a local opt-out flag in your browser.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Opt-in email addresses.</strong> If you voluntarily submit your
              email address through one of our subscribe forms, we store the address plus the source page of the signup
              in our database. We use the address only to send the mailing list you opted into. You can unsubscribe from
              any email we send, and unsubscribing deletes your address from our active list.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Cookies and similar technologies</h2>
          <p className="mt-3">
            PlantingCalc itself does not set tracking cookies. We use two pieces of client-side storage:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              A short per-tab <strong className="text-[var(--color-text)]">session ID</strong> in <code>sessionStorage</code>,
              used only to deduplicate analytics events within a single visit. It is cleared when you close the tab.
            </li>
            <li>
              A <strong className="text-[var(--color-text)]">do-not-track flag</strong> in <code>localStorage</code>, set
              when you visit any URL with <code>?notrack=1</code>. It permanently disables analytics for that browser.
            </li>
          </ul>
          <p className="mt-3">
            Third-party services we embed (see below) may set their own cookies. Those are governed by the respective
            service&apos;s privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Third-party services we use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-[var(--color-text)]">Google AdSense</strong> may display contextual advertisements
              on some pages. Google&apos;s advertising cookies and technologies are governed by{" "}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">
                Google&apos;s advertising policies
              </a>. You can manage personalized advertising preferences at{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline">
                adssettings.google.com
              </a>.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Vercel</strong> hosts the site and may log standard HTTP
              request metadata (IP, user agent, path) as part of normal server operation. See Vercel&apos;s privacy
              policy for details.
            </li>
            <li>
              <strong className="text-[var(--color-text)]">Public APIs we call</strong>. USDA phzmapi.org for zone
              lookup and NOAA climate normals for frost dates. When you use the planting-dates calculator, your ZIP code
              is sent to these public services for a one-shot lookup and is not retained by us.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Children&apos;s privacy</h2>
          <p className="mt-3">
            PlantingCalc is not directed to children under 13. We do not knowingly collect personal information from
            children. If you believe a child has submitted personal information to us, please contact us and we will
            delete it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Your rights</h2>
          <p className="mt-3">
            If you are in a jurisdiction that grants you rights over personal data (for example, the EU under GDPR or
            California under CCPA), you can ask us what we hold about you, ask us to correct or delete it, and opt out
            of any processing that relies on consent. Because we collect so little personally identifiable information,
            these requests are usually trivial for us to fulfill. The main piece of data tied to an identifier is your
            email list subscription, which you can remove yourself at any time via the unsubscribe link in our emails.
            For anything else, <Link href="/contact" className="text-[var(--color-primary)] underline">contact us</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Changes to this policy</h2>
          <p className="mt-3">
            We may update this policy from time to time. Material changes will be reflected in the &quot;Last
            updated&quot; date above. Continued use of the Service after an update means you accept the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[var(--color-text)]">Contact</h2>
          <p className="mt-3">
            Questions about this privacy policy can be sent via our{" "}
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
