import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "How Long Is Your Growing Season? Length Calculator by ZIP" },
  description:
    "Find your growing season length in days and weeks from your ZIP code or USDA zone, the typical frost-free window, and which vegetables fit inside it.",
  openGraph: {
    title: "How Long Is Your Growing Season? Length Calculator by ZIP",
    description:
      "Find your growing season length in days and weeks from your ZIP code or USDA zone, the typical frost-free window, and which vegetables fit inside it.",
    images: [{ url: "/og/growing-season", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/growing-season" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
