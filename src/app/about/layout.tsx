import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "About PlantingCalc | Free Gardening Calculators" },
  description:
    "Learn about PlantingCalc, our data sources (USDA zones, NOAA weather records, university extensions), and why you can trust our free gardening calculators.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
