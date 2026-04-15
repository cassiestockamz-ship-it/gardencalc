"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STATE_FROST, nextOccurrence, daysBetween, formatMonthDay } from "@/lib/frostDates";

const STORAGE_KEY = "pc_zip_context_v1";

interface SavedZip {
  zip: string;
  state: string;
  zone: string;
  lat: number;
  lng: number;
  place?: string;
}

/**
 * StickyZipBar — a thin persistent bar that appears below the main
 * header once the user has entered a ZIP anywhere on the site. Stores
 * the ZIP context in localStorage so navigation across routes keeps
 * the bar in place. Tap to change.
 */
export default function StickyZipBar() {
  const [saved, setSaved] = useState<SavedZip | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setSaved(null);
          return;
        }
        const parsed = JSON.parse(raw) as SavedZip;
        if (parsed && /^\d{5}$/.test(parsed.zip)) {
          setSaved(parsed);
        }
      } catch {
        setSaved(null);
      }
    };
    load();
    const handler = () => load();
    window.addEventListener("pc:zip-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("pc:zip-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    setHidden(path === "/");
  }, [saved]);

  if (!saved || hidden) return null;

  const normals = STATE_FROST[saved.state];
  let daysLabel = "";
  if (normals) {
    const d = nextOccurrence(normals.lastFrost.month, normals.lastFrost.day);
    const days = daysBetween(new Date(), d);
    daysLabel =
      days > 0
        ? `${days} days to last frost (${formatMonthDay(normals.lastFrost.month, normals.lastFrost.day)})`
        : "Last frost has passed";
  }

  return (
    <div className="vt-sticky-zip border-b border-[var(--color-border)] bg-[var(--color-primary-soft)] text-[var(--color-primary-ink)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6 sm:text-sm">
        <div className="flex items-center gap-2 truncate">
          <span aria-hidden="true">📍</span>
          <span className="truncate font-medium">
            {saved.place ?? `${saved.state}`}
            <span className="mx-1.5 text-[var(--color-text-faint)]">·</span>
            <span>Zone {saved.zone}</span>
            {daysLabel && (
              <>
                <span className="mx-1.5 hidden text-[var(--color-text-faint)] sm:inline">·</span>
                <span className="hidden sm:inline">{daysLabel}</span>
              </>
            )}
          </span>
        </div>
        <Link
          href="/"
          className="whitespace-nowrap rounded-md border border-[var(--color-primary)]/30 bg-white/60 px-2 py-1 text-[11px] font-semibold hover:bg-white"
        >
          Change
        </Link>
      </div>
    </div>
  );
}
