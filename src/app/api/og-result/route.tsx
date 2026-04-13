import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Dynamic result card for calculator outputs.
 * Usage: /api/og-result?headline=May+14&label=Safe+transplant+date&sub=Zone+6b+%28NY%29&calc=frost-probability
 */
export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const headline = (searchParams.get("headline") ?? "—").slice(0, 40);
  const label = (searchParams.get("label") ?? "Result").slice(0, 80);
  const sub = (searchParams.get("sub") ?? "").slice(0, 140);
  const calc = (searchParams.get("calc") ?? "plantingcalc").slice(0, 60);

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 55%, #bbf7d0 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 22,
            fontWeight: 700,
            color: "#15803d",
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "flex" }}>🌱</span>
          <span style={{ display: "flex" }}>PlantingCalc</span>
        </div>

        {/* Label */}
        <div
          style={{
            marginTop: 72,
            fontSize: 28,
            color: "#4b5563",
            fontWeight: 500,
            display: "flex",
          }}
        >
          {label}
        </div>

        {/* Big headline number/date */}
        <div
          style={{
            fontSize: 148,
            fontWeight: 900,
            color: "#14532d",
            letterSpacing: -4,
            lineHeight: 1,
            marginTop: 8,
            display: "flex",
          }}
        >
          {headline}
        </div>

        {/* Subtitle */}
        {sub && (
          <div
            style={{
              marginTop: 20,
              fontSize: 28,
              color: "#374151",
              fontWeight: 400,
              maxWidth: 1000,
              lineHeight: 1.3,
              display: "flex",
            }}
          >
            {sub}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 72,
            right: 72,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#4b5563",
          }}
        >
          <span style={{ display: "flex" }}>plantingcalc.com/{calc}</span>
          <span style={{ display: "flex", color: "#15803d", fontWeight: 600 }}>
            Check your ZIP →
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
