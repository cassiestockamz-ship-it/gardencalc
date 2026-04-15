import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seed Start Calendar: Indoor + Transplant Dates by ZIP (with ICS) | PlantingCalc",
  description:
    "Enter your ZIP. Get a personalized seed starting calendar for 40+ vegetables with indoor start, harden-off, and transplant dates. Download as an ICS calendar file.",
  alternates: { canonical: "https://plantingcalc.com/seed-start-calendar" },
  openGraph: {
    title: "Seed Start Calendar: with ICS download",
    description:
      "Personalized seed starting calendar by ZIP. Download all dates directly to Google Calendar or Apple Calendar.",
    url: "https://plantingcalc.com/seed-start-calendar",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
