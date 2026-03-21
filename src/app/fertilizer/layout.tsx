import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fertilizer Calculator",
  description:
    "Find the right fertilizer and NPK ratio for your vegetables. Calculates how much fertilizer you need based on garden size and plant type.",
  alternates: { canonical: "/fertilizer" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
