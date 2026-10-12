import type { Metadata } from "next";
import { VEGETABLES } from "@/data/vegetables";
const dth = (name: string) => VEGETABLES.find((v) => v.name === name)!.daysToHarvest.join(" to ");

const TITLE = "Harvest Calculator: Days to Harvest for 35 Vegetables";
const DESCRIPTION =
  `Days to harvest from planting: radish ${dth("Radish")}, lettuce ${dth("Lettuce")}, tomato ${dth("Tomato")}. Pick a crop and planting date to see your harvest window for your ZIP.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og/harvest-date", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/harvest-date" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
