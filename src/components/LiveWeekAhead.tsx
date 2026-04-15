"use client";

import { useCallback, useEffect, useState } from "react";
import ZipRingDecoder, { type DecodedZip } from "./ZipRingDecoder";
import WeekAhead from "./WeekAhead";
import CropCard, { PendingCropCard } from "./CropCard";
import {
  buildLocationContext,
  weekAhead,
  type LocationContext,
  type WeekAheadSummary,
} from "@/lib/decisions";
import { fetchForecast14, lookupZip, type DailyForecast } from "@/lib/weather";
import { VEGETABLES } from "@/data/vegetables";

const DEFAULT_CROPS = [
  "Tomato",
  "Pepper",
  "Lettuce",
  "Basil",
  "Zucchini",
  "Cucumber",
];

const STORAGE_KEY = "pc_zip_context_v1";

/**
 * LiveWeekAhead — the homepage and tool hero component.
 *
 * Wraps ZipRingDecoder + WeekAhead + default CropCards. Restores the
 * user's ZIP from localStorage on mount so the site remembers them
 * across routes. Shows pending CropCards before a ZIP is entered so
 * the layout doesn't jump.
 */
export default function LiveWeekAhead() {
  const [zip, setZip] = useState("");
  const [ctx, setCtx] = useState<LocationContext | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [summary, setSummary] = useState<WeekAheadSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          zip: string;
          state: string;
          zone: string;
          lat: number;
          lng: number;
          place?: string;
        };
        if (saved.zip && /^\d{5}$/.test(saved.zip)) {
          setZip(saved.zip);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleResolved = useCallback(async (decoded: DecodedZip) => {
    setLoading(true);
    try {
      let place = decoded.state;
      const loc = await lookupZip(decoded.zip);
      if (loc) {
        place = loc.place;
      }
      const context = buildLocationContext({
        zip: decoded.zip,
        state: decoded.state || loc?.stateAbbr || "",
        place,
        zone: decoded.zone,
        lat: decoded.lat || loc?.lat || 0,
        lng: decoded.lng || loc?.lng || 0,
      });
      const fc =
        loc && loc.lat && loc.lng ? await fetchForecast14(loc.lat, loc.lng) : null;
      const f = fc ?? [];
      setCtx(context);
      setForecast(f);
      const crops = VEGETABLES.filter((v) => DEFAULT_CROPS.includes(v.name));
      setSummary(weekAhead(context, f, crops, 3));

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            zip: decoded.zip,
            state: context.state,
            zone: context.zone,
            lat: context.lat,
            lng: context.lng,
            place: context.place,
          })
        );
        window.dispatchEvent(new CustomEvent("pc:zip-updated"));
      } catch {
        /* ignore */
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const defaultCrops = VEGETABLES.filter((v) => DEFAULT_CROPS.includes(v.name));

  return (
    <div className="space-y-6">
      <ZipRingDecoder
        value={zip}
        onChange={setZip}
        onResolved={handleResolved}
        placeholder="Enter your ZIP to begin"
      />

      {summary && ctx ? (
        <WeekAhead summary={summary} />
      ) : (
        <section className="rounded-2xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-faint)]">
            Waiting for your ZIP
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            Your forecast-aware almanac
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Type your ZIP above. We read your live 14-day forecast, find your USDA hardiness zone, calculate your frost date, and show you exactly what to plant this week and what to cover tonight.
          </p>
        </section>
      )}

      {!summary && (
        <div className="grid gap-3 sm:grid-cols-3">
          {defaultCrops.slice(0, 3).map((crop) => (
            <PendingCropCard key={crop.name} crop={crop} size="sm" />
          ))}
        </div>
      )}

      {loading && (
        <p className="text-center text-xs text-[var(--color-text-faint)]">
          Reading forecast and zone data…
        </p>
      )}
    </div>
  );
}
