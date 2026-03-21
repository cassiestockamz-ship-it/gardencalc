import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PlantingCalc",
  description:
    "Learn about PlantingCalc, our data sources (USDA, NOAA, agricultural extensions), and why you can trust our free gardening calculators.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
