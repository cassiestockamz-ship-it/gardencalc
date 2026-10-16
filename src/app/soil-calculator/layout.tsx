import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Raised Bed Soil Calculator (Cubic Feet, Yards and Bags)" },
  description:
    "How much soil for a raised bed? Enter the size for cubic feet, yards and bag counts. Handles round, L-shaped, part-filled and multiple beds.",
  openGraph: {
    title: "Raised Bed Soil Calculator (Cubic Feet, Yards and Bags)",
    description:
      "How much soil for a raised bed? Enter the size for cubic feet, yards and bag counts. Handles round, L-shaped, part-filled and multiple beds.",
    images: [{ url: "/og/soil-calculator", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/soil-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
