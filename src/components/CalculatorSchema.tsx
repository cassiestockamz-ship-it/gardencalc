export default function CalculatorSchema({
  name,
  description,
  url,
  featureList,
}: {
  name: string;
  description: string;
  url: string;
  featureList?: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "SoftwareApplication"],
    name,
    description,
    url,
    applicationCategory: "CalculatorApplication",
    applicationSubCategory: "UtilityApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: featureList ?? [
      "Free to use",
      "No signup required",
      "USDA zone aware",
      "Shareable results",
    ],
    author: {
      "@type": "Organization",
      name: "PlantingCalc",
      url: "https://plantingcalc.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "PlantingCalc",
      url: "https://plantingcalc.com",
    },
    datePublished: "2026-03-21",
    dateModified: new Date().toISOString().split("T")[0],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
