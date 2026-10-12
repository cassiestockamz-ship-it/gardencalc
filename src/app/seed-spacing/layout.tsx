import type { Metadata } from "next";
import { VEGETABLES } from "@/data/vegetables";
const sp = (name: string) => VEGETABLES.find((v) => v.name === name)!.spacingInches;

const TITLE = "Seed Spacing Calculator: Plants per Bed for 35 Vegetables";
const DESCRIPTION =
  `Seed spacing in inches: carrot ${sp("Carrot")}, lettuce ${sp("Lettuce")}, tomato ${sp("Tomato")}. Enter your bed size to see how many plants fit, seed depth, and expected yield.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og/seed-spacing", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/seed-spacing" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
