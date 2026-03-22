import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watering Schedule Calculator",
  description:
    "Calculate exactly how much and how often to water your vegetable garden. Free tool based on plant type, climate zone, soil, and growing method. Try it now.",
  openGraph: {
    title: "Watering Schedule Calculator",
    description:
      "Calculate exactly how much and how often to water your vegetable garden. Free tool based on plant type, climate zone, soil, and growing method. Try it now.",
  },
  alternates: { canonical: "/watering" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
