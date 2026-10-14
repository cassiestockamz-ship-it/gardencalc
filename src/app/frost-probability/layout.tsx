import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Frost Probability Calculator by ZIP | PlantingCalc" },
  description:
    "Real frost probability for any date at your ZIP, computed from 30 years of daily temperatures, not just an average last frost date.",
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
