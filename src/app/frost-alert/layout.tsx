import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frost Alert: Cover Or Lose (by ZIP) | PlantingCalc",
  description:
    "Frost warning tonight? Enter your ZIP, check your 72-hour forecast, and get a prioritized cover-or-lose list for your garden. Free, live data, no signup.",
  alternates: { canonical: "https://plantingcalc.com/frost-alert" },
  openGraph: {
    title: "Frost Alert: Cover Or Lose",
    description:
      "Live 72-hour frost check for your ZIP. Shows you exactly what to cover tonight.",
    url: "https://plantingcalc.com/frost-alert",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
