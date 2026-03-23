import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Companion Planting Checker",
  description:
    "Free companion planting chart for 30+ vegetables, herbs, and flowers. Check which plants grow well together and which to keep apart. Interactive checker — try it now.",
  openGraph: {
    title: "Companion Planting Checker",
    description:
      "Free companion planting chart for 30+ vegetables, herbs, and flowers. Check which plants grow well together and which to keep apart. Interactive checker — try it now.",
    images: [{ url: "/og/companion-planting", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/companion-planting" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
