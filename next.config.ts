import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    return [
      { source: "/disclosure", destination: "/disclaimer", permanent: true },
      { source: "/mulch-calculator", destination: "/soil-calculator", permanent: true },
      { source: "/yield-estimator", destination: "/harvest-date", permanent: true },
    ];
  },
};

export default nextConfig;
