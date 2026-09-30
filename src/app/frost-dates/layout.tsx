import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frost Date Calculator by ZIP Code",
  description:
    "Find your typical last spring and first fall frost dates by ZIP code, your frost-free growing window, and how many days remain until the next frost.",
  openGraph: {
    title: "Frost Date Calculator by ZIP Code",
    description:
      "Find your typical last spring and first fall frost dates by ZIP code, your frost-free growing window, and how many days remain until the next frost.",
    images: [{ url: "/og/frost-dates", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/frost-dates" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
