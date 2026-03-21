import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "PlantingCalc affiliate disclosure. Learn how we earn revenue while keeping our gardening calculators free.",
  alternates: { canonical: "/disclosure" },
};

export default function DisclosureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
