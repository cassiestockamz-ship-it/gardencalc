import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planting Date Calculator by ZIP Code",
  description:
    "Enter your ZIP code to get personalized planting dates for 35+ vegetables. Based on USDA hardiness zones and local frost dates.",
  openGraph: {
    title: "Planting Date Calculator by ZIP Code",
    description:
      "Enter your ZIP code to get personalized planting dates for 35+ vegetables. Based on USDA hardiness zones and local frost dates.",
  },
  alternates: { canonical: "/planting-dates" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
