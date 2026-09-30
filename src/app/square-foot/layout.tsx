import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Square Foot Garden Calculator",
  description:
    "Plan a square foot garden bed with up to 5 vegetables. See plants per square, a suggested square allocation, and total plant count using SFG spacing.",
  openGraph: {
    title: "Square Foot Garden Calculator",
    description:
      "Plan a square foot garden bed with up to 5 vegetables. See plants per square, a suggested square allocation, and total plant count using SFG spacing.",
    images: [{ url: "/og/square-foot", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/square-foot" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
