import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://plantingcalc.com";
  const now = new Date().toISOString();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/soil-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/planting-dates`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/seed-spacing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/companion-planting`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/fertilizer`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/watering`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
