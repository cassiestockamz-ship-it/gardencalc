"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SelectInput from "@/components/SelectInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";
import { VEGETABLES } from "@/data/vegetables";
import { seedStartingFAQ } from "@/data/faq-data";

const AMAZON_TAG = "kawaiiguy0f-pc-20";

// Last frost dates by zone (approximate averages)
const ZONE_FROST_DATES: Record<string, string | null> = {
  "3": "2026-05-10",
  "4": "2026-05-01",
  "5": "2026-04-15",
  "6": "2026-04-10",
  "7": "2026-04-01",
  "8": "2026-03-15",
  "9": "2026-03-01",
  "10": "2026-02-15",
  "11": null, // year-round
  "12": null,
  "13": null,
};

const ZONE_OPTIONS = [
  { value: "", label: "Select your zone..." },
  { value: "3", label: "Zone 3 - Last frost: May 10" },
  { value: "4", label: "Zone 4 - Last frost: May 1" },
  { value: "5", label: "Zone 5 - Last frost: Apr 15" },
  { value: "6", label: "Zone 6 - Last frost: Apr 10" },
  { value: "7", label: "Zone 7 - Last frost: Apr 1" },
  { value: "8", label: "Zone 8 - Last frost: Mar 15" },
  { value: "9", label: "Zone 9 - Last frost: Mar 1" },
  { value: "10", label: "Zone 10 - Last frost: Feb 15" },
  { value: "11", label: "Zone 11 - Year-round growing" },
  { value: "12", label: "Zone 12 - Year-round growing" },
  { value: "13", label: "Zone 13 - Year-round growing" },
];

function addWeeks(dateStr: string, weeks: number): Date {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function diffWeeks(d1: Date, d2: Date): number {
  return Math.round((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24 * 7));
}

function isWithinTwoWeeks(d: Date): boolean {
  const now = new Date();
  const diffDays = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= -7 && diffDays <= 14;
}

interface SeedEntry {
  name: string;
  icon: string;
  category: string;
  indoorWeeks: number;
  startDate: Date;
  transplantDate: Date | null;
  daysToHarvest: [number, number];
  notes: string;
  highlighted: boolean;
}

export default function SeedStartingPage() {
  const [zone, setZone] = useState("");

  const lastFrostStr = zone ? ZONE_FROST_DATES[zone] : undefined;
  const isYearRound = zone !== "" && lastFrostStr === null;

  const seedSchedule: SeedEntry[] = useMemo(() => {
    if (!zone || isYearRound) return [];
    if (!lastFrostStr) return [];

    const entries: SeedEntry[] = [];

    for (const veg of VEGETABLES) {
      if (veg.indoorStart === null) continue;

      const startDate = addWeeks(lastFrostStr, veg.indoorStart);
      const transplantDate = veg.transplant !== null ? addWeeks(lastFrostStr, veg.transplant) : null;

      entries.push({
        name: veg.name,
        icon: veg.icon,
        category: veg.category,
        indoorWeeks: Math.abs(veg.indoorStart),
        startDate,
        transplantDate,
        daysToHarvest: veg.daysToHarvest,
        notes: veg.notes,
        highlighted: isWithinTwoWeeks(startDate),
      });
    }

    entries.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    return entries;
  }, [zone, lastFrostStr, isYearRound]);

  const totalIndoor = seedSchedule.length;
  const highlightedCount = seedSchedule.filter((e) => e.highlighted).length;

  const nextToStart = useMemo(() => {
    const now = new Date();
    return seedSchedule.find((e) => e.startDate.getTime() >= now.getTime()) || null;
  }, [seedSchedule]);

  const weeksUntilTransplant = useMemo(() => {
    if (!lastFrostStr) return 0;
    const lastFrost = new Date(lastFrostStr + "T00:00:00");
    const now = new Date();
    const weeks = diffWeeks(lastFrost, now);
    return Math.max(0, weeks);
  }, [lastFrostStr]);

  const lastFrostFormatted = lastFrostStr
    ? new Date(lastFrostStr + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <CalculatorLayout
      title="Indoor Seed Starting Calendar"
      description="Find out exactly when to start each vegetable seed indoors based on your USDA hardiness zone. Get personalized start dates, transplant dates, and harvest timelines."
      lastUpdated="March 2026"
      intro="Starting seeds indoors gives warm-season crops like tomatoes, peppers, and eggplant the head start they need to produce a full harvest. The key is timing: start too early and seedlings get leggy, start too late and you lose weeks of growing season. Select your zone below to see a complete seed starting schedule."
    >
      <CalculatorSchema
        name="Indoor Seed Starting Calendar"
        description="Find out when to start vegetable seeds indoors based on your USDA hardiness zone, with transplant dates and harvest timelines."
        url="https://plantingcalc.com/seed-starting"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Seed Starting Calendar", url: "https://plantingcalc.com/seed-starting" },
        ]}
      />

      {/* Zone Selector */}
      <div className="max-w-sm">
        <SelectInput
          label="Your USDA Hardiness Zone"
          value={zone}
          onChange={setZone}
          options={ZONE_OPTIONS}
          helpText="Not sure? Check the planting dates calculator to look up your zone by ZIP code."
        />
      </div>

      {/* Year-round message */}
      {isYearRound && (
        <div className="mt-6 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-5">
          <p className="text-sm font-medium text-[var(--color-text)]">
            Zone {zone} has year-round growing conditions with no typical frost date. You can start seeds indoors or sow directly outdoors at almost any time. Focus on succession planting every 2 to 3 weeks for continuous harvests.
          </p>
        </div>
      )}

      {/* Result Cards */}
      {zone && !isYearRound && seedSchedule.length > 0 && (
        <>
          <div className="mt-6 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-4">
            <p className="text-sm text-[var(--color-text)]">
              <span className="font-semibold">Zone {zone}</span> last frost date:{" "}
              <span className="font-bold text-[var(--color-primary)]">{lastFrostFormatted}</span>
              {weeksUntilTransplant > 0 && (
                <span className="ml-2 text-[var(--color-text-muted)]">
                  ({weeksUntilTransplant} weeks away)
                </span>
              )}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <ResultCard
              label="Seeds to Start Indoors"
              value={String(totalIndoor)}
              unit="vegetables"
              icon="🌱"
            />
            <ResultCard
              label="Start Now"
              value={String(highlightedCount)}
              unit={highlightedCount === 1 ? "vegetable" : "vegetables"}
              highlight={highlightedCount > 0}
              icon="🔥"
            />
            <ResultCard
              label={nextToStart ? "Next Up" : "All Past"}
              value={nextToStart ? nextToStart.name : "None"}
              unit={nextToStart ? fmtDate(nextToStart.startDate) : ""}
              icon="📅"
            />
          </div>

          {/* Calendar Table */}
          <div className="mt-8 overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-sm" style={{ minWidth: 700 }}>
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                  <th className="px-4 py-3 text-left font-semibold text-[var(--color-text)]">
                    Vegetable
                  </th>
                  <th className="px-3 py-3 text-center font-semibold text-[var(--color-text)]">
                    Weeks Before Frost
                  </th>
                  <th className="px-3 py-3 text-center font-semibold text-[var(--color-text)]">
                    Start Indoors
                  </th>
                  <th className="px-3 py-3 text-center font-semibold text-[var(--color-text)]">
                    Transplant Date
                  </th>
                  <th className="px-3 py-3 text-center font-semibold text-[var(--color-text)]">
                    Days to Harvest
                  </th>
                  <th className="px-3 py-3 text-center font-semibold text-[var(--color-text)]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {seedSchedule.map((entry) => {
                  const now = new Date();
                  const isPast =
                    (entry.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) < -7;

                  return (
                    <tr
                      key={entry.name}
                      className={`border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[var(--color-surface-alt)] ${
                        entry.highlighted
                          ? "bg-green-50/60"
                          : isPast
                            ? "opacity-50"
                            : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{entry.icon}</span>
                          <div>
                            <div className="font-semibold text-[var(--color-text)]">
                              {entry.name}
                            </div>
                            <div className="text-[10px] text-[var(--color-text-muted)]">
                              {entry.notes}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm font-medium text-[var(--color-text)]">
                          {entry.indoorWeeks}
                        </span>
                        <span className="ml-0.5 text-xs text-[var(--color-text-muted)]">wks</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`text-sm font-semibold ${
                            entry.highlighted
                              ? "text-green-700"
                              : "text-[var(--color-text)]"
                          }`}
                        >
                          {fmtDate(entry.startDate)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {entry.transplantDate ? (
                          <span className="text-sm text-[var(--color-text-muted)]">
                            {fmtDate(entry.transplantDate)}
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--color-text-muted)]">N/A</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm text-[var(--color-text-muted)]">
                          {entry.daysToHarvest[0]}-{entry.daysToHarvest[1]}
                        </span>
                        <span className="ml-0.5 text-xs text-[var(--color-text-muted)]">days</span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {entry.highlighted ? (
                          <span className="inline-block rounded-full border border-green-300 bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
                            Start Now!
                          </span>
                        ) : isPast ? (
                          <span className="inline-block rounded-full border bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-400">
                            Past
                          </span>
                        ) : (
                          <span className="inline-block rounded-full border bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600">
                            Upcoming
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ShareResults
            title={`Zone ${zone} Indoor Seed Starting Calendar`}
            text={`Zone ${zone} seed starting schedule: ${totalIndoor} vegetables to start indoors. Last frost: ${lastFrostFormatted}. ${highlightedCount} to start right now!`}
          />
        </>
      )}

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Seed Starting Essentials
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href={`https://www.amazon.com/s?k=LED+grow+light+seed+starting&tag=${AMAZON_TAG}&ascsubtag=seed-starting`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-violet-50 to-purple-100">
              <span className="text-5xl">💡</span>
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Recommended
                </span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                  Ad
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                LED Grow Lights
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Full-spectrum grow lights give seedlings the light intensity they need to grow strong and stocky instead of leggy.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$20 - $60</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                  View on Amazon &rarr;
                </span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=seed+starting+tray+with+dome&tag=${AMAZON_TAG}&ascsubtag=seed-starting`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-5xl">🌱</span>
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Recommended
                </span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                  Ad
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                Seed Starting Trays
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Cell trays with humidity domes keep soil moist during germination. Look for trays with drainage holes and sturdy construction.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$10 - $25</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                  View on Amazon &rarr;
                </span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=seedling+heat+mat&tag=${AMAZON_TAG}&ascsubtag=seed-starting`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
              <span className="text-5xl">🔥</span>
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Recommended
                </span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                  Ad
                </span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">
                Seedling Heat Mats
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Heat mats warm soil 10 to 20 degrees above room temperature, speeding up germination for peppers, tomatoes, and eggplant.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$15 - $35</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">
                  View on Amazon &rarr;
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <EmailCapture variant="banner" context="seed-starting" />
      <FAQSection questions={seedStartingFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How This Calendar Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This seed starting calendar calculates your indoor start dates by counting backwards from your zone&apos;s average last frost date. Each vegetable has a recommended number of weeks to grow indoors before transplanting outside. For example, tomatoes and peppers need 8 to 10 weeks indoors, while cucumbers and squash only need 3 to 4 weeks. The calendar also shows your transplant date and estimated days to harvest after transplanting so you can plan your full growing season.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Tips for Starting Seeds Indoors</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>Use a sterile seed starting mix, not garden soil. Garden soil can harbor disease pathogens and compacts too easily in small cells.</li>
          <li>Provide 14 to 16 hours of light per day with a grow light positioned 2 to 4 inches above seedlings. A sunny window alone is usually not enough and leads to leggy, weak plants.</li>
          <li>Bottom water by setting trays in a shallow dish of water for 10 to 15 minutes. This encourages roots to grow downward and reduces the risk of damping off disease.</li>
          <li>Harden off seedlings for 7 to 10 days before transplanting. Start with 1 hour of outdoor shade, gradually increasing sun exposure and time each day.</li>
          <li>Once you know your transplant dates, use the <a href="/seed-spacing" className="text-[var(--color-primary)] hover:underline">seed spacing calculator</a> to plan how many transplants you need for your garden beds.</li>
        </ul>
      </div>

      <RelatedCalculators currentPath="/seed-starting" />
    </CalculatorLayout>
  );
}
