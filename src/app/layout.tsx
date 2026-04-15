import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import NavDropdown from "@/components/NavDropdown";
import StickyZipBar from "@/components/StickyZipBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://plantingcalc.com"),
  alternates: { canonical: "/" },
  title: {
    default: "PlantingCalc: The Planting Calendar That Reads Your Forecast",
    template: "%s: PlantingCalc",
  },
  description:
    "Free gardening calculators that read your live 14-day forecast. One ZIP tells you what to plant this week, what to cover tonight, and exactly how many days remain until your last frost.",
  openGraph: {
    type: "website",
    siteName: "PlantingCalc",
    title: "PlantingCalc: The Planting Calendar That Reads Your Forecast",
    description:
      "Enter a ZIP. Get this week's exact gardening decisions. Live 14-day forecast, frost probability from 30 years of NOAA data, USDA hardiness zones.",
    images: [{ url: "/og/home", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlantingCalc: The Planting Calendar That Reads Your Forecast",
    description:
      "Live forecast-driven gardening decisions. One ZIP, one screen.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  } as Metadata["robots"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7557739369186741" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-[var(--color-primary-ink)] focus:rounded focus:shadow-lg">
          Skip to content
        </a>
        {/* Header */}
        <header className="vt-header sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]/92 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link
              href="/"
              className="vt-header-logo flex items-center gap-2 font-display text-xl font-bold tracking-tight text-[var(--color-text)]"
            >
              <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M12 8c-3 0-5-2-5-5 3 0 5 2 5 5z"/><path d="M12 12c3 0 5-2 5-5-3 0-5 2-5 5z"/><path d="M12 16c-3 0-5-2-5-5 3 0 5 2 5 5z"/></svg>
              </span>
              PlantingCalc
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              <NavDropdown />
              <Link href="/guides" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary-ink)]">
                Zone Guides
              </Link>
              <Link href="/frost-alert" className="ml-1 whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-primary-dark)]">
                Frost Alert
              </Link>
            </nav>
            <MobileMenu />
          </div>
        </header>

        <StickyZipBar />

        <main id="main-content" className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="font-display text-lg font-bold text-[var(--color-text)]">
                PlantingCalc
              </p>
              <p className="max-w-lg text-xs text-[var(--color-text-muted)]">
                Live forecasts from Open-Meteo, 30-year frost normals from ERA5 reanalysis, USDA plant hardiness zones, crop data from university extension publications. An independent publisher. Calculations are estimates. Your local extension office is always the gold standard for region-specific advice.
              </p>
              <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[var(--color-text-muted)]">
                <Link href="/guides" className="underline hover:text-[var(--color-text)]">Zone Guides</Link>
                <Link href="/calculators" className="underline hover:text-[var(--color-text)]">All Calculators</Link>
                <Link href="/about" className="underline hover:text-[var(--color-text)]">About</Link>
                <Link href="/methodology" className="underline hover:text-[var(--color-text)]">How We Research</Link>
                <Link href="/contact" className="underline hover:text-[var(--color-text)]">Contact</Link>
                <Link href="/privacy" className="underline hover:text-[var(--color-text)]">Privacy</Link>
                <Link href="/terms" className="underline hover:text-[var(--color-text)]">Terms</Link>
                <Link href="/disclaimer" className="underline hover:text-[var(--color-text)]">Disclaimer</Link>
              </nav>
              <p className="text-xs text-[var(--color-text-faint)]">
                &copy; {new Date().getFullYear()} PlantingCalc. Not affiliated with USDA, NOAA, or any government or university agency.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
