import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raised Bed Soil Calculator",
  description:
    "Calculate exactly how many cubic feet or yards of soil, compost, and amendments you need for your raised garden bed. Works for any size bed.",
  openGraph: {
    title: "Raised Bed Soil Calculator",
    description:
      "Calculate exactly how many cubic feet or yards of soil, compost, and amendments you need for your raised garden bed. Works for any size bed.",
    images: [{ url: "/og/soil-calculator", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/soil-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
