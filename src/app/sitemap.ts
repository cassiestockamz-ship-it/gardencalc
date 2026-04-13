import type { MetadataRoute } from "next";
import { getZoneSlugs } from "@/data/zone-guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://plantingcalc.com";
  const now = new Date().toISOString().split("T")[0];
  const zoneSlugs = getZoneSlugs();

  const calculatorPaths = [
    "/frost-alert",
    "/plant-today",
    "/frost-probability",
    "/seed-start-calendar",
    "/chill-hours",
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
    "/sunlight",
    "/soil-ph",
    "/pest-guide",
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
    { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
