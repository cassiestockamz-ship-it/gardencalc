import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://plantingcalc.com"),
  alternates: { canonical: "/" },
  title: {
    default: "PlantingCalc — Free Gardening Calculators & Planting Tools",
    template: "%s — PlantingCalc",
  },
  description:
    "Free gardening calculators: raised bed soil volume, planting dates by ZIP code, seed spacing, companion planting, and more. Powered by USDA zone data.",
  openGraph: {
    type: "website",
    siteName: "PlantingCalc",
    title: "PlantingCalc — Free Gardening Calculators",
    description:
      "Calculate soil volume, planting dates, seed spacing, and more. Powered by USDA hardiness zone data.",
    images: [{ url: "/og/home", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlantingCalc — Free Gardening Calculators",
    description:
      "Calculate soil volume, planting dates, seed spacing, and more.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7557739369186741" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var s=sessionStorage.getItem('_sid');if(!s){s=Math.random().toString(36).slice(2)+Date.now().toString(36);sessionStorage.setItem('_sid',s)}var d=screen.width<768?'mobile':screen.width<1024?'tablet':'desktop';fetch('https://project-dash-psi.vercel.app/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({site_id:'17156a6b-a5cd-4caf-ac2c-c9c3977b436f',path:location.pathname,referrer:document.referrer||null,device_type:d,session_id:s}),keepalive:true}).catch(function(){})}catch(e){}})();` }} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-green-700 focus:rounded focus:shadow-lg">
          Skip to content
        </a>
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight text-[var(--color-text)]"
            >
              <span className="text-2xl" aria-hidden="true">
                🌱
              </span>
              PlantingCalc
            </Link>
            <nav className="hidden items-center gap-0.5 md:flex">
              <Link href="/soil-calculator" className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] lg:px-2.5 lg:py-2 lg:text-sm">
                Soil
              </Link>
              <Link href="/planting-dates" className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] lg:px-2.5 lg:py-2 lg:text-sm">
                Planting Dates
              </Link>
              <Link href="/seed-spacing" className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] lg:px-2.5 lg:py-2 lg:text-sm">
                Spacing
              </Link>
              <Link href="/companion-planting" className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] lg:px-2.5 lg:py-2 lg:text-sm">
                Companions
              </Link>
              <Link href="/fertilizer" className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] lg:px-2.5 lg:py-2 lg:text-sm">
                Fertilizer
              </Link>
              <Link href="/watering" className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] lg:px-2.5 lg:py-2 lg:text-sm">
                Watering
              </Link>
            </nav>
            <MobileMenu />
          </div>
        </header>

        <main id="main-content" className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-sm font-medium text-[var(--color-text)]">
                🌱 PlantingCalc
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Built with USDA zone data &amp; agricultural extension research
              </p>
              <p className="max-w-lg text-xs text-[var(--color-text-muted)]">
                Disclaimer: Calculations are estimates based on average
                conditions. Actual results vary by soil type, microclimate,
                and local conditions. Always consult your local extension
                office for region-specific advice.
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Some links are affiliate links. See our{" "}
                <Link
                  href="/disclosure"
                  className="underline hover:text-[var(--color-text)]"
                >
                  disclosure
                </Link>
                .
              </p>
              <nav className="flex flex-wrap justify-center gap-4 text-xs text-[var(--color-text-muted)]">
                <Link
                  href="/guides"
                  className="underline hover:text-[var(--color-text)]"
                >
                  Zone Guides
                </Link>
                <Link
                  href="/about"
                  className="underline hover:text-[var(--color-text)]"
                >
                  About
                </Link>
                <Link
                  href="/disclosure"
                  className="underline hover:text-[var(--color-text)]"
                >
                  Disclosure
                </Link>
              </nav>
              <p className="text-xs text-[var(--color-text-muted)]">
                &copy; {new Date().getFullYear()} PlantingCalc. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
