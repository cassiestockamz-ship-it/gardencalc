import { NextRequest, NextResponse } from "next/server";

// Average last frost dates by zone (approximate, based on NOAA/USDA data)
// Format: month-day for last spring frost (50% probability)
const ZONE_FROST_DATES: Record<string, { lastFrost: string; firstFrost: string; growingSeason: number }> = {
  "1a": { lastFrost: "06-15", firstFrost: "08-15", growingSeason: 60 },
  "1b": { lastFrost: "06-01", firstFrost: "08-31", growingSeason: 90 },
  "2a": { lastFrost: "05-25", firstFrost: "09-05", growingSeason: 100 },
  "2b": { lastFrost: "05-20", firstFrost: "09-10", growingSeason: 110 },
  "3a": { lastFrost: "05-15", firstFrost: "09-15", growingSeason: 120 },
  "3b": { lastFrost: "05-10", firstFrost: "09-20", growingSeason: 130 },
  "4a": { lastFrost: "05-05", firstFrost: "09-25", growingSeason: 140 },
  "4b": { lastFrost: "04-28", firstFrost: "10-01", growingSeason: 155 },
  "5a": { lastFrost: "04-20", firstFrost: "10-07", growingSeason: 165 },
  "5b": { lastFrost: "04-15", firstFrost: "10-12", growingSeason: 175 },
  "6a": { lastFrost: "04-10", firstFrost: "10-17", growingSeason: 185 },
  "6b": { lastFrost: "04-05", firstFrost: "10-22", growingSeason: 195 },
  "7a": { lastFrost: "03-30", firstFrost: "10-28", growingSeason: 210 },
  "7b": { lastFrost: "03-22", firstFrost: "11-03", growingSeason: 220 },
  "8a": { lastFrost: "03-15", firstFrost: "11-10", growingSeason: 235 },
  "8b": { lastFrost: "03-07", firstFrost: "11-18", growingSeason: 245 },
  "9a": { lastFrost: "02-25", firstFrost: "11-28", growingSeason: 270 },
  "9b": { lastFrost: "02-15", firstFrost: "12-10", growingSeason: 290 },
  "10a": { lastFrost: "01-31", firstFrost: "12-20", growingSeason: 320 },
  "10b": { lastFrost: "01-15", firstFrost: "12-31", growingSeason: 345 },
  "11a": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
  "11b": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
  "12a": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
  "12b": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
  "13a": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
  "13b": { lastFrost: "01-01", firstFrost: "12-31", growingSeason: 365 },
};

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip");

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: "Invalid ZIP code. Please provide a 5-digit US ZIP code." }, { status: 400 });
  }

  try {
    // Fetch zone from phzmapi.org
    const zoneRes = await fetch(`https://phzmapi.org/${zip}.json`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!zoneRes.ok) {
      return NextResponse.json({ error: "ZIP code not found. Please try a different ZIP." }, { status: 404 });
    }

    const zoneData = await zoneRes.json();
    const zone = zoneData.zone?.toLowerCase();
    const tempRange = zoneData.temperature_range;
    const lat = zoneData.coordinates?.lat;
    const lon = zoneData.coordinates?.lon;

    if (!zone) {
      return NextResponse.json({ error: "Could not determine hardiness zone for this ZIP." }, { status: 404 });
    }

    // Look up frost dates from our table
    const frostData = ZONE_FROST_DATES[zone] || ZONE_FROST_DATES[zone.replace(/[ab]$/, "a")];

    if (!frostData) {
      return NextResponse.json({ error: `No frost data available for zone ${zone}.` }, { status: 404 });
    }

    // Calculate actual dates for this year
    const year = new Date().getFullYear();
    const lastFrostDate = new Date(`${year}-${frostData.lastFrost}T00:00:00`);
    const firstFrostDate = new Date(`${year}-${frostData.firstFrost}T00:00:00`);

    // If last frost is already past, it's fine — we still use it for calculations
    // If first frost is before last frost (zones 10+), adjust
    if (firstFrostDate < lastFrostDate) {
      firstFrostDate.setFullYear(year + 1);
    }

    return NextResponse.json({
      zip,
      zone: zoneData.zone,
      tempRange,
      lat,
      lon,
      lastFrost: lastFrostDate.toISOString().split("T")[0],
      firstFrost: firstFrostDate.toISOString().split("T")[0],
      growingSeason: frostData.growingSeason,
      lastFrostFormatted: lastFrostDate.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
      firstFrostFormatted: firstFrostDate.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
    });
  } catch (err) {
    console.error("Zone API error:", err);
    return NextResponse.json({ error: "Failed to look up zone data. Please try again." }, { status: 500 });
  }
}
