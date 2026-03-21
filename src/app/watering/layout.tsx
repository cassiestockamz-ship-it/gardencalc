import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watering Schedule Calculator",
  description:
    "Get a personalized watering schedule for your vegetable garden based on plants, climate, soil type, and growing method.",
  alternates: { canonical: "/watering" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
