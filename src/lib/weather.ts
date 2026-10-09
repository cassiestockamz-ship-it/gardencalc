/**
 * Shared weather + location utilities for PlantingCalc.
 *
 * - zippopotam.us → lat/lng (free, no key, CORS-enabled)
 * - api.weather.gov (NWS) → live daily forecast, via /api/forecast
 * - open-meteo.com/v1/climate → historical daily normals (1991-2020)
 */

export interface LocationResult {
  lat: number;
  lng: number;
  place: string;
  stateAbbr: string;
  zip: string;
}

export async function lookupZip(zip: string): Promise<LocationResult | null> {
  if (!/^\d{5}$/.test(zip)) return null;
  try {
    const r = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!r.ok) return null;
    const j = await r.json();
    const place = j.places?.[0];
    if (!place) return null;
    return {
      lat: Number(place.latitude),
      lng: Number(place.longitude),
      place: `${place["place name"]}, ${place["state abbreviation"]}`,
      stateAbbr: place["state abbreviation"],
      zip,
    };
  } catch {
    return null;
  }
}

export interface DailyForecast {
  date: string;
  tempMinF: number;
  tempMaxF: number;
  precipIn?: number;
  windMphMax?: number;
}

/**
 * About 7-day daily min/max forecast from the National Weather Service,
 * through our own /api/forecast route (NWS asks for a User-Agent). US only.
 * Name kept so callers do not change.
 */
export async function fetchForecast14(
  lat: number,
  lng: number
): Promise<DailyForecast[] | null> {
  try {
    const r = await fetch(`/api/forecast?lat=${lat}&lng=${lng}`);
    if (!r.ok) return null;
    const j = await r.json();
    const dates: string[] = j.dates ?? [];
    const tmin: number[] = j.tmin ?? [];
    const tmax: number[] = j.tmax ?? [];
    if (!dates.length) return null;
    return dates.map((d, i) => ({ date: d, tempMinF: tmin[i], tempMaxF: tmax[i] }));
  } catch {
    return null;
  }
}

/**
 * Historical daily temperature at a location, used to estimate frost probability
 * and chill-hour accumulation. Uses NOAA's Regional Climate Centers ACIS
 * GridData service (PRISM daily grid, about 4 km, 1981 onward; public data).
 */
export async function fetchHistoricalDaily(
  lat: number,
  lng: number,
  startDate: string, // YYYY-MM-DD
  endDate: string
): Promise<
  | {
      dates: string[];
      tmin: number[];
      tmax: number[];
    }
  | null
> {
  try {
    const r = await fetch("https://data.rcc-acis.org/GridData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loc: `${lng},${lat}`,
        sdate: startDate,
        edate: endDate,
        grid: "21",
        elems: "mint,maxt",
      }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const rows: [string, number, number][] = j.data ?? [];
    const dates: string[] = [];
    const tmin: number[] = [];
    const tmax: number[] = [];
    for (const [d, lo, hi] of rows) {
      // ACIS marks missing values as -999; skip those days.
      if (lo <= -999 || hi <= -999) continue;
      dates.push(d);
      tmin.push(lo);
      tmax.push(hi);
    }
    return { dates, tmin, tmax };
  } catch {
    return null;
  }
}
