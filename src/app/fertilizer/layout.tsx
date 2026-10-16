import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fertilizer Calculator",
  description:
    "Find the right NPK fertilizer ratio for your vegetable garden. Free calculator shows how much fertilizer to use by plant type and garden size.",
  openGraph: {
    title: "Fertilizer Calculator",
    description:
      "Find the right NPK fertilizer ratio for your vegetable garden. Free calculator shows how much fertilizer to use by plant type and garden size.",
    images: [{ url: "/og/fertilizer", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/fertilizer" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
