import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "When to Start Seeds Indoors Calculator",
  description:
    "Find when to start each vegetable seed indoors for your USDA hardiness zone, with transplant dates and harvest timelines for every crop.",
  openGraph: {
    title: "When to Start Seeds Indoors Calculator",
    description:
      "Find when to start each vegetable seed indoors for your USDA hardiness zone, with transplant dates and harvest timelines for every crop.",
    images: [{ url: "/og/seed-starting", width: 1200, height: 630 }],
  },
  alternates: { canonical: "/seed-starting" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
