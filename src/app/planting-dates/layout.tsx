import type { Metadata } from "next";
import { VEGETABLES } from "@/data/vegetables";

// 10-18: searchers type "planting calendar by zip code" (pos 22-28); the result is a zone planting calendar.
const TITLE = `Planting Calendar by ZIP Code: When to Plant ${VEGETABLES.length} Vegetables`;
const DESCRIPTION = `Enter your ZIP code for a planting calendar of ${VEGETABLES.length} vegetables: when to start seeds indoors, transplant and sow outdoors, from your local frost dates.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og/planting-dates", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/planting-dates" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
