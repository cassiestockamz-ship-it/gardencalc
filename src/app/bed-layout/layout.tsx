import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Garden Bed Layout Planner",
  description:
    "Enter your raised bed size and up to 3 vegetables to get a layout plan with plant counts, row spacing, and estimated yield.",
  openGraph: {
    title: "Garden Bed Layout Planner",
    description:
      "Enter your raised bed size and up to 3 vegetables to get a layout plan with plant counts, row spacing, and estimated yield.",
    images: [{ url: "/og/bed-layout", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/bed-layout" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
