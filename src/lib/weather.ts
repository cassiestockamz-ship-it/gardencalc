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
  // ACIS streams a 30-year grid request slowly (10 to 90 s on 2026-10-23);
  // the same range as 10-year chunks fetched in parallel returns in about 2 s.
  const ranges: [string, string][] = [];
  const endYear = Number(endDate.slice(0, 4));
  let from = startDate;
  while (from <= endDate) {
    const chunkEndYear = Math.min(Number(from.slice(0, 4)) + 9, endYear);
    const to = chunkEndYear === endYear ? endDate : `${chunkEndYear}-12-31`;
    ranges.push([from, to]);
    from = `${chunkEndYear + 1}-01-01`;
  }
  try {
    const chunks = await Promise.all(
      ranges.map(async ([sdate, edate]) => {
        const r = await fetch("https://data.rcc-acis.org/GridData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            loc: `${lng},${lat}`,
            sdate,
            edate,
            grid: "21",
            elems: "mint,maxt",
          }),
        });
        if (!r.ok) throw new Error(`ACIS ${r.status}`);
        const j = await r.json();
        return (j.data ?? []) as [string, number, number][];
      })
    );
    const dates: string[] = [];
    const tmin: number[] = [];
    const tmax: number[] = [];
    for (const rows of chunks) {
      for (const [d, lo, hi] of rows) {
        // ACIS marks missing values as -999; skip those days.
        if (lo <= -999 || hi <= -999) continue;
        dates.push(d);
        tmin.push(lo);
        tmax.push(hi);
      }
    }
    return { dates, tmin, tmax };
  } catch {
    return null;
  }
}
