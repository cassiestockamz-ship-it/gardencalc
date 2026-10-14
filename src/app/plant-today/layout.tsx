import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Can I Plant Today? 7-Day Forecast Check | PlantingCalc" },
  description:
    "Is it safe to plant today at your ZIP? Uses your live 7-day forecast and estimated soil temperature for a red/yellow/green answer crop by crop.",
  alternates: { canonical: "https://plantingcalc.com/plant-today" },
  openGraph: {
    title: "Can I Plant Today? Live forecast check",
    description:
      "Red/yellow/green decision for planting any crop today at your ZIP, based on the live 7-day forecast.",
    url: "https://plantingcalc.com/plant-today",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
