import type { MetadataRoute } from "next";
import lastmods from "@/data/sitemap-lastmod.json";
import { getZoneSlugs } from "@/data/zone-guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://plantingcalc.com";
  // True last-change dates per route (scripts/sitemap-lastmod.mjs), never the build time
  const map = lastmods as Record<string, string>;
  const lm = (path: string) => map[path] ?? map['*'];
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
    { url: baseUrl, lastModified: lm('/'), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/calculators`, lastModified: lm('/calculators'), changeFrequency: "monthly", priority: 0.9 },
    ...calculatorPaths.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: lm(path),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${baseUrl}/guides`, lastModified: lm('/guides'), changeFrequency: "monthly", priority: 0.8 },
    ...zoneSlugs.map((slug) => ({
      url: `${baseUrl}/guides/${slug}`,
      lastModified: lm('/guides/[zone]'),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${baseUrl}/about`, lastModified: lm('/about'), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/methodology`, lastModified: lm('/methodology'), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: lm('/contact'), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: lm('/privacy'), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: lm('/terms'), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: lm('/disclaimer'), changeFrequency: "yearly", priority: 0.3 },
  ];
}
