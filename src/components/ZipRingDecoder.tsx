"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { lookupZipPrefix } from "@/lib/zipTable";
import { STATE_FROST, formatMonthDay, nextOccurrence, daysBetween } from "@/lib/frostDates";

/**
 * ZIP Ring Decoder — the signature interaction.
 *
 * Five slots above the ZIP input that light up as the user types.
 * Slots: State, Zone, Latitude, Last Frost, Days Until Last Frost.
 *
 * Pure client JS for the partial paint. On keystroke we read the
 * 3-digit prefix table and fill slots immediately, with no network
 * call. Once all 5 digits are entered we fire /api/zone and upgrade
 * the zone + lat slots to authoritative values.
 */

export interface DecodedZip {
  zip: string;
  state: string;
  place?: string;
  zone: string;
  lat: number;
  lng: number;
  lastFrostDate: Date;
  daysUntilLastFrost: number;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  onResolved?: (decoded: DecodedZip) => void;
  autoFocus?: boolean;
  placeholder?: string;
}

type SlotState = "empty" | "partial" | "exact";

interface SlotView {
  label: string;
  value: string;
  state: SlotState;
}

export default function ZipRingDecoder({
  value,
  onChange,
  onResolved,
  autoFocus = false,
  placeholder = "Enter ZIP",
}: Props) {
  const [resolved, setResolved] = useState<{
    zone: string;
    lat: number;
    lng: number;
    lastFrost: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFired = useRef<string>("");

  const partial = useMemo(() => lookupZipPrefix(value), [value]);

  useEffect(() => {
    if (!/^\d{5}$/.test(value)) {
      setResolved(null);
      lastFired.current = "";
      return;
    }
    if (lastFired.current === value) return;
    lastFired.current = value;
    setLoading(true);
    const ctrl = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/zone?zip=${value}`, { signal: ctrl.signal });
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.zone && data.lastFrost) {
          setResolved({
            zone: data.zone.toLowerCase(),
            lat: data.lat ?? partial?.approxLat ?? 0,
            lng: data.lon ?? 0,
            lastFrost: data.lastFrost,
          });
          if (onResolved) {
            const lastFrostDate = new Date(`${data.lastFrost}T00:00:00`);
            if (lastFrostDate < new Date()) {
              lastFrostDate.setFullYear(lastFrostDate.getFullYear() + 1);
            }
            onResolved({
              zip: value,
              state: partial?.state ?? "",
              zone: data.zone.toLowerCase(),
              lat: data.lat ?? partial?.approxLat ?? 0,
              lng: data.lon ?? 0,
              lastFrostDate,
              daysUntilLastFrost: daysBetween(new Date(), lastFrostDate),
            });
          }
        }
      } catch {
        /* ignored — partial paint remains */
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const slots: SlotView[] = useMemo(() => {
    const digits = value.length;
    const base: SlotView[] = [
      { label: "State", value: "·", state: "empty" },
      { label: "Zone", value: "·", state: "empty" },
      { label: "Latitude", value: "·", state: "empty" },
      { label: "Last Frost", value: "·", state: "empty" },
      { label: "Days Left", value: "·", state: "empty" },
    ];

    if (digits >= 3 && partial) {
      base[0] = { label: "State", value: partial.state, state: "exact" };
      base[1] = { label: "Zone", value: partial.approxZone, state: "partial" };
      base[2] = {
        label: "Latitude",
        value: `${partial.approxLat.toFixed(1)}°`,
        state: "partial",
      };
      const normals = STATE_FROST[partial.state];
      if (normals) {
        base[3] = {
          label: "Last Frost",
          value: formatMonthDay(normals.lastFrost.month, normals.lastFrost.day),
          state: "partial",
        };
        const nextDate = nextOccurrence(
          normals.lastFrost.month,
          normals.lastFrost.day
        );
        const days = daysBetween(new Date(), nextDate);
        base[4] = {
          label: "Days Left",
          value: days > 0 ? `${days}` : "Now",
          state: "partial",
        };
      }
    }

    if (resolved) {
      base[1] = { label: "Zone", value: resolved.zone, state: "exact" };
      base[2] = {
        label: "Latitude",
        value: `${resolved.lat.toFixed(1)}°`,
        state: "exact",
      };
      const lastFrostDate = new Date(`${resolved.lastFrost}T00:00:00`);
      const refDate =
        lastFrostDate < new Date()
          ? new Date(
              lastFrostDate.getFullYear() + 1,
              lastFrostDate.getMonth(),
              lastFrostDate.getDate()
            )
          : lastFrostDate;
      base[3] = {
        label: "Last Frost",
        value: refDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        state: "exact",
      };
      const days = daysBetween(new Date(), refDate);
      base[4] = {
        label: "Days Left",
        value: days > 0 ? `${days}` : "Now",
        state: "exact",
      };
    }

    return base;
  }, [value, partial, resolved]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/\D/g, "").slice(0, 5);
    onChange(next);
  };

  return (
    <div className="vt-zip-decoder w-full">
      {/* Decoder slots */}
      <div className="mb-2.5 grid grid-cols-5 gap-1.5 sm:gap-2">
        {slots.map((slot, i) => (
          <div
            key={slot.label}
            className={`rounded-lg border px-2 py-2 text-center transition-all duration-300 ${
              slot.state === "exact"
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] pc-slot-fill"
                : slot.state === "partial"
                ? "border-[var(--color-border-strong)] bg-[var(--color-surface-alt)]"
                : "border-[var(--color-border)] bg-[var(--color-surface-alt)]/40"
            }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-text-faint)] sm:text-[10px]">
              {slot.label}
            </div>
            <div
              className={`mt-0.5 font-display text-sm font-bold tabular-nums sm:text-base ${
                slot.state === "exact"
                  ? "text-[var(--color-primary-ink)]"
                  : slot.state === "partial"
                  ? "text-[var(--color-text)]"
                  : "text-[var(--color-text-faint)]"
              }`}
            >
              {slot.value}
            </div>
          </div>
        ))}
      </div>

      {/* ZIP input */}
      <div className="relative">
        <label htmlFor="zip-ring-input" className="sr-only">
          Enter your ZIP code
        </label>
        <input
          ref={inputRef}
          id="zip-ring-input"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          pattern="[0-9]{5}"
          maxLength={5}
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-4 text-center font-display text-2xl font-bold tracking-[0.3em] tabular-nums text-[var(--color-text)] placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 sm:text-3xl"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--color-text-faint)]">
            resolving…
          </div>
        )}
      </div>
    </div>
  );
}
