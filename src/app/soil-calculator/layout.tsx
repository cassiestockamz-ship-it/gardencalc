import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Raised Bed Soil Calculator (Cubic Feet, Yards and Bags)" },
  description:
    "How much soil for a raised bed or garden bed? Enter the size in feet or metres for cubic feet, yards, cubic metres and bag counts, with round, L-shaped, part-filled and multiple beds.",
  openGraph: {
    title: "Raised Bed Soil Calculator (Cubic Feet, Yards and Bags)",
    description:
      "How much soil for a raised bed or garden bed? Enter the size in feet or metres for cubic feet, yards, cubic metres and bag counts, with round, L-shaped, part-filled and multiple beds.",
    images: [{ url: "/og/soil-calculator", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/soil-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
