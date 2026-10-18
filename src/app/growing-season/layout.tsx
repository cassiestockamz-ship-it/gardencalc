import type { Metadata } from "next";
import { ZONE_FROST_DATES } from "@/lib/zoneFrostDates";
const days = (z: string) => ZONE_FROST_DATES[z].growingSeason;

// Answer first (10-18): 0 clicks at pos 5 on "how long is a growing season" with the old title.
const TITLE = `How Long Is a Growing Season? ${days("3a")} to ${days("9b")} Days by ZIP`;
const DESCRIPTION =
  `Your growing season is the days between the last spring frost and the first fall frost: about ${days("3a")} days in zone 3a, ${days("5a")} in 5a, ${days("7a")} in 7a. Enter your ZIP for yours.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og/growing-season", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/growing-season" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
