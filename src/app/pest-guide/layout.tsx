import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vegetable Garden Pest Guide",
  description:
    "Identify common vegetable garden pests by plant and symptom, with organic control options, prevention tips, and companion planting strategies.",
  openGraph: {
    title: "Vegetable Garden Pest Guide",
    description:
      "Identify common vegetable garden pests by plant and symptom, with organic control options, prevention tips, and companion planting strategies.",
    images: [{ url: "/og/pest-guide", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/pest-guide" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
