import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planting Date Calculator by ZIP Code",
  description:
    "Enter your ZIP code to get personalized planting dates for 35+ vegetables based on your USDA hardiness zone and local frost dates. Free calculator. Try it now.",
  openGraph: {
    title: "Planting Date Calculator by ZIP Code",
    description:
      "Enter your ZIP code to get personalized planting dates for 35+ vegetables based on your USDA hardiness zone and local frost dates. Free calculator. Try it now.",
    images: [{ url: "/og/planting-dates", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/planting-dates" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
