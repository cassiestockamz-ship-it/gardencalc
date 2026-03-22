import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companion Planting Checker",
  description:
    "Check which vegetables, herbs, and flowers grow well together and which to keep apart. Interactive companion planting guide for 30+ plants.",
  openGraph: {
    title: "Companion Planting Checker",
    description:
      "Check which vegetables, herbs, and flowers grow well together and which to keep apart. Interactive companion planting guide for 30+ plants.",
  },
  alternates: { canonical: "/companion-planting" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
