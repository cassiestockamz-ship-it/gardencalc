import { NextRequest, NextResponse } from "next/server";
import { ZONE_FROST_DATES } from "@/lib/zoneFrostDates";

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
    // phzmapi.org returns coordinates as strings in some responses.
    // Coerce to numbers so the client never has to.
    const rawLat = zoneData.coordinates?.lat;
    const rawLon = zoneData.coordinates?.lon;
    const lat = typeof rawLat === "number" ? rawLat : Number(rawLat);
    const lon = typeof rawLon === "number" ? rawLon : Number(rawLon);

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
