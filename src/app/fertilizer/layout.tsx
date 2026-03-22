import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fertilizer Calculator",
  description:
    "Find the right NPK fertilizer ratio for your vegetable garden. Free calculator shows exactly how much fertilizer you need based on plant type and garden size. Try it now.",
  openGraph: {
    title: "Fertilizer Calculator",
    description:
      "Find the right NPK fertilizer ratio for your vegetable garden. Free calculator shows exactly how much fertilizer you need based on plant type and garden size. Try it now.",
  },
  alternates: { canonical: "/fertilizer" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
