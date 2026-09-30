import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Succession Planting Calculator",
  description:
    "Plan staggered plantings for a continuous harvest. Pick a vegetable and zone to get each planting date, harvest window, and where harvests overlap.",
  openGraph: {
    title: "Succession Planting Calculator",
    description:
      "Plan staggered plantings for a continuous harvest. Pick a vegetable and zone to get each planting date, harvest window, and where harvests overlap.",
    images: [{ url: "/og/succession-planting", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/succession-planting" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
