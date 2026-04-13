import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Can I Plant Today? Live 14-Day Forecast Check | PlantingCalc",
  description:
    "Is it safe to plant tomatoes today at your ZIP? This tool pulls your live 14-day weather forecast, estimates soil temperature, and gives you a red/yellow/green answer crop by crop.",
  alternates: { canonical: "https://plantingcalc.com/plant-today" },
  openGraph: {
    title: "Can I Plant Today? Live forecast check",
    description:
      "Red/yellow/green decision for planting any crop today at your ZIP, based on the live 14-day forecast.",
    url: "https://plantingcalc.com/plant-today",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
