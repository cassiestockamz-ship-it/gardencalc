import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Harvest Date Calculator: Days to Harvest for 35 Vegetables" },
  description:
    "How many days until harvest? Pick a vegetable and planting date to estimate your harvest window, adjusted for your ZIP code, zone, and growing conditions.",
  openGraph: {
    title: "Harvest Date Calculator: Days to Harvest for 35 Vegetables",
    description:
      "How many days until harvest? Pick a vegetable and planting date to estimate your harvest window, adjusted for your ZIP code, zone, and growing conditions.",
    images: [{ url: "/og/harvest-date", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/harvest-date" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
