import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frost Probability Calculator — NOAA-style exceedance | PlantingCalc",
  description:
    "Want to know the actual probability of frost on May 3rd at your location? This tool runs 30 years of historical daily temperatures for your ZIP and returns the real frost probability, not just the average last frost date.",
  alternates: { canonical: "https://plantingcalc.com/frost-probability" },
  openGraph: {
    title: "Frost Probability Calculator",
    description:
      "Real frost probability for your ZIP on any date, computed from 30 years of daily temperature records.",
    url: "https://plantingcalc.com/frost-probability",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
