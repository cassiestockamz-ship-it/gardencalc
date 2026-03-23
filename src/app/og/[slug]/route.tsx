import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const PAGES: Record<string, { title: string; icon: string; subtitle: string }> = {
  home: { title: "PlantingCalc", icon: "🌱", subtitle: "Free Gardening Calculators & Planting Tools" },
  "soil-calculator": { title: "Soil Calculator", icon: "📦", subtitle: "How much soil does your raised bed need?" },
  "planting-dates": { title: "Planting Dates", icon: "📅", subtitle: "When to plant in your ZIP code" },
  "seed-spacing": { title: "Seed Spacing", icon: "🌱", subtitle: "How many plants fit in your garden bed?" },
  "companion-planting": { title: "Companion Planting", icon: "🤝", subtitle: "Which plants grow well together?" },
  fertilizer: { title: "Fertilizer Calculator", icon: "🧪", subtitle: "NPK ratios & feeding schedules" },
  watering: { title: "Watering Calculator", icon: "💧", subtitle: "Personalized watering schedules" },
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug] || PAGES.home;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>{page.icon}</div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#15803d",
            marginBottom: 8,
            textAlign: "center",
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          {page.title}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#5a6b4a",
            textAlign: "center",
            maxWidth: 800,
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          {page.subtitle}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 20,
            color: "#5a6b4a",
          }}
        >
          <span style={{ fontSize: 24 }}>🌱</span>
          <span>plantingcalc.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
