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
 * and chill-hour accumulation. Uses Open-Meteo's Historical Weather API which
 * pulls from ERA5 reanalysis (1940+) — the same data NOAA's climatology tables
 * are built from.
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
    const url =
      `https://archive-api.open-meteo.com/v1/archive` +
      `?latitude=${lat}&longitude=${lng}` +
      `&start_date=${startDate}&end_date=${endDate}` +
      `&daily=temperature_2m_min,temperature_2m_max` +
      `&temperature_unit=fahrenheit&timezone=auto`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const j = await r.json();
    return {
      dates: j.daily?.time ?? [],
      tmin: j.daily?.temperature_2m_min ?? [],
      tmax: j.daily?.temperature_2m_max ?? [],
    };
  } catch {
    return null;
  }
}
