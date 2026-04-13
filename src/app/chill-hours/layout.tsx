import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chill Hours Tracker — Live Season Accumulation by ZIP | PlantingCalc",
  description:
    "Track fruit tree chill hour accumulation in real time for your ZIP. Compares against 30+ varieties including apples, peaches, cherries, pears and blueberries.",
  alternates: { canonical: "https://plantingcalc.com/chill-hours" },
  openGraph: {
    title: "Chill Hours Tracker — Live Season Accumulation",
    description:
      "Is your apple variety getting enough chill hours this winter? Live tracker for any US ZIP.",
    url: "https://plantingcalc.com/chill-hours",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
