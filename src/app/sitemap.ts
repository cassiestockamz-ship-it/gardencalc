import type { MetadataRoute } from "next";
import { getZoneSlugs } from "@/data/zone-guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://plantingcalc.com";
  const now = "2026-03-29";
  const zoneSlugs = getZoneSlugs();

  const calculatorPaths = [
    "/soil-calculator",
    "/planting-dates",
    "/seed-spacing",
    "/companion-planting",
    "/fertilizer",
    "/watering",
    "/harvest-date",
    "/frost-dates",
    "/growing-season",
    "/succession-planting",
    "/seed-starting",
    "/bed-layout",
    "/square-foot",
    "/container-garden",
    "/mulch-calculator",
    "/sunlight",
    "/soil-ph",
    "/pest-guide",
    "/yield-estimator",
    "/canning",
    "/cost-savings",
  ];

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/calculators`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...calculatorPaths.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...zoneSlugs.map((slug) => ({
      url: `${baseUrl}/guides/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
