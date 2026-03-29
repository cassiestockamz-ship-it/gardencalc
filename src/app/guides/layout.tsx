import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s — PlantingCalc",
    default: "USDA Zone Growing Guides — PlantingCalc",
  },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
