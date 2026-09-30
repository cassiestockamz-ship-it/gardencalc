import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sunlight Requirements Calculator",
  description:
    "Enter your daily sun hours and light quality to see which vegetables, herbs, and greens will thrive, which will get by, and which to skip.",
  openGraph: {
    title: "Sunlight Requirements Calculator",
    description:
      "Enter your daily sun hours and light quality to see which vegetables, herbs, and greens will thrive, which will get by, and which to skip.",
    images: [{ url: "/og/sunlight", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/sunlight" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
