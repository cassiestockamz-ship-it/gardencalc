import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soil pH Calculator: Lime and Sulfur by Crop",
  description:
    "Enter your soil pH to see which vegetables grow well at it and how much lime or sulfur you need to adjust pH for your garden size and soil type.",
  openGraph: {
    title: "Soil pH Calculator: Lime and Sulfur by Crop",
    description:
      "Enter your soil pH to see which vegetables grow well at it and how much lime or sulfur you need to adjust pH for your garden size and soil type.",
    images: [{ url: "/og/soil-ph", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/soil-ph" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
