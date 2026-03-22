import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://plantingcalc.com";

  return [
    { url: baseUrl, lastModified: '2026-03-22', changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/soil-calculator`, lastModified: '2026-03-22', changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/planting-dates`, lastModified: '2026-03-22', changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/seed-spacing`, lastModified: '2026-03-22', changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/companion-planting`, lastModified: '2026-03-22', changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/fertilizer`, lastModified: '2026-03-22', changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/watering`, lastModified: '2026-03-22', changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: '2026-03-22', changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/disclosure`, lastModified: '2026-03-22', changeFrequency: "yearly", priority: 0.3 },
  ];
}
