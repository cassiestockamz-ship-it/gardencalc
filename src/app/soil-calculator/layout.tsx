import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Raised Bed Soil Calculator (Cubic Feet, Yards and Bags)" },
  description:
    "How much soil for a raised bed? Enter your bed size for cubic feet, cubic yards and bag counts (1, 1.5, 2 cu ft and 40 lb), plus round, L-shaped and multiple beds.",
  openGraph: {
    title: "Raised Bed Soil Calculator (Cubic Feet, Yards and Bags)",
    description:
      "Calculate exactly how many cubic feet or yards of soil, compost, and amendments you need for your raised garden bed. Works for any size bed.",
    images: [{ url: "/og/soil-calculator", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/soil-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
