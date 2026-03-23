import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seed Spacing & Yield Calculator",
  description:
    "Calculate how many plants fit in your garden bed, estimated yield, seed depth, and row spacing for 35+ vegetables. Visual spacing diagrams included.",
  openGraph: {
    title: "Seed Spacing & Yield Calculator",
    description:
      "Calculate how many plants fit in your garden bed, estimated yield, seed depth, and row spacing for 35+ vegetables. Visual spacing diagrams included.",
    images: [{ url: "/og/seed-spacing", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/seed-spacing" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
