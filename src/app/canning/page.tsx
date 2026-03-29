"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SelectInput from "@/components/SelectInput";
import SliderInput from "@/components/SliderInput";
import ResultCard from "@/components/ResultCard";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";
import { canningFAQ } from "@/data/faq-data";

const AMAZON_TAG = "kawaiiguy0f-pc-20";

type ProduceType = "tomatoes" | "green_beans" | "pickles" | "salsa" | "jam" | "applesauce" | "peaches" | "corn" | "beets" | "peppers";
type JarSize = "pint" | "quart";
type PreservationMethod = "water_bath" | "pressure" | "freezing";

interface YieldData {
  label: string;
  lbsPerQuart: number;
  lbsPerPint: number;
  processingMinutes: { water_bath: number; pressure: number; freezing: number };
  shelfMonths: number;
}

const PRODUCE_DATA: Record<ProduceType, YieldData> = {
  tomatoes: {
    label: "Tomatoes",
    lbsPerQuart: 3,
    lbsPerPint: 1.5,
    processingMinutes: { water_bath: 45, pressure: 25, freezing: 0 },
    shelfMonths: 18,
  },
  green_beans: {
    label: "Green Beans",
    lbsPerQuart: 2,
    lbsPerPint: 1,
    processingMinutes: { water_bath: 0, pressure: 25, freezing: 0 },
    shelfMonths: 14,
  },
  pickles: {
    label: "Pickles (Cucumbers)",
    lbsPerQuart: 1.5,
    lbsPerPint: 0.75,
    processingMinutes: { water_bath: 15, pressure: 10, freezing: 0 },
    shelfMonths: 12,
  },
  salsa: {
    label: "Salsa",
    lbsPerQuart: 3,
    lbsPerPint: 1.5,
    processingMinutes: { water_bath: 20, pressure: 15, freezing: 0 },
    shelfMonths: 14,
  },
  jam: {
    label: "Jam (Berries)",
    lbsPerQuart: 3,
    lbsPerPint: 1.5,
    processingMinutes: { water_bath: 10, pressure: 0, freezing: 0 },
    shelfMonths: 12,
  },
  applesauce: {
    label: "Applesauce",
    lbsPerQuart: 3,
    lbsPerPint: 1.5,
    processingMinutes: { water_bath: 20, pressure: 10, freezing: 0 },
    shelfMonths: 14,
  },
  peaches: {
    label: "Peaches",
    lbsPerQuart: 2.5,
    lbsPerPint: 1.25,
    processingMinutes: { water_bath: 30, pressure: 10, freezing: 0 },
    shelfMonths: 18,
  },
  corn: {
    label: "Corn",
    lbsPerQuart: 4.5,
    lbsPerPint: 2.25,
    processingMinutes: { water_bath: 0, pressure: 85, freezing: 0 },
    shelfMonths: 14,
  },
  beets: {
    label: "Beets",
    lbsPerQuart: 3,
    lbsPerPint: 1.5,
    processingMinutes: { water_bath: 0, pressure: 35, freezing: 0 },
    shelfMonths: 14,
  },
  peppers: {
    label: "Peppers",
    lbsPerQuart: 2,
    lbsPerPint: 1,
    processingMinutes: { water_bath: 0, pressure: 35, freezing: 0 },
    shelfMonths: 12,
  },
};

const PRODUCE_OPTIONS: { value: ProduceType; label: string }[] = [
  { value: "tomatoes", label: "Tomatoes" },
  { value: "green_beans", label: "Green Beans" },
  { value: "pickles", label: "Pickles (Cucumbers)" },
  { value: "salsa", label: "Salsa" },
  { value: "jam", label: "Jam (Berries)" },
  { value: "applesauce", label: "Applesauce" },
  { value: "peaches", label: "Peaches" },
  { value: "corn", label: "Corn" },
  { value: "beets", label: "Beets" },
  { value: "peppers", label: "Peppers" },
];

const JAR_OPTIONS: { value: JarSize; label: string }[] = [
  { value: "quart", label: "Quart (32 oz)" },
  { value: "pint", label: "Pint (16 oz)" },
];

const METHOD_OPTIONS: { value: PreservationMethod; label: string }[] = [
  { value: "water_bath", label: "Water Bath Canning" },
  { value: "pressure", label: "Pressure Canning" },
  { value: "freezing", label: "Freezing" },
];

export default function CanningCalculatorPage() {
  const [produce, setProduce] = useState<ProduceType>("tomatoes");
  const [harvestLbs, setHarvestLbs] = useState(20);
  const [jarSize, setJarSize] = useState<JarSize>("quart");
  const [method, setMethod] = useState<PreservationMethod>("water_bath");

  const results = useMemo(() => {
    const data = PRODUCE_DATA[produce];
    const lbsPerJar = jarSize === "quart" ? data.lbsPerQuart : data.lbsPerPint;
    const jarsNeeded = Math.ceil(harvestLbs / lbsPerJar);

    const jarsPerBatch = jarSize === "quart" ? 7 : 9;
    const batchCount = Math.ceil(jarsNeeded / jarsPerBatch);

    const processingTime = data.processingMinutes[method];

    // For freezing, estimate 5 min prep per jar
    const timePerBatch = method === "freezing" ? 5 * jarsPerBatch : processingTime;

    // Add prep time: 15 min per batch for loading/unloading canner, 30 min heat-up for canning
    const prepPerBatch = method === "freezing" ? 10 : 30;
    const totalMinutes = batchCount * (timePerBatch + prepPerBatch);
    const totalHours = totalMinutes / 60;

    // Check if method is valid for this produce
    const methodValid = processingTime > 0 || method === "freezing";

    const shelfLife = method === "freezing" ? 12 : data.shelfMonths;

    return {
      jarsNeeded,
      batchCount,
      processingTime,
      timePerBatch,
      totalMinutes,
      totalHours,
      methodValid,
      shelfLife,
      lbsPerJar,
      jarsPerBatch,
    };
  }, [produce, harvestLbs, jarSize, method]);

  const data = PRODUCE_DATA[produce];

  // Warning for invalid method/produce combos
  const methodWarning = !results.methodValid
    ? `${data.label} cannot be safely preserved with ${method === "water_bath" ? "water bath canning" : "this method"}. Use ${produce === "green_beans" || produce === "corn" || produce === "beets" || produce === "peppers" ? "pressure canning" : "water bath canning"} or freezing instead.`
    : null;

  return (
    <CalculatorLayout
      title="Canning & Preserving Calculator"
      description="Estimate how many jars you need to preserve your garden harvest. Covers water bath canning, pressure canning, and freezing."
      lastUpdated="March 2026"
      intro="A 20-pound harvest of tomatoes fills roughly 7 quart jars using water bath canning, taking about 2 hours across a single batch. This calculator helps you plan jars, batches, processing time, and shelf life for 10 common garden crops so nothing goes to waste."
    >
      <CalculatorSchema
        name="Canning & Preserving Calculator"
        description="Calculate how many jars you need to preserve your garden harvest. Supports water bath canning, pressure canning, and freezing for 10 produce types."
        url="https://plantingcalc.com/canning"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://plantingcalc.com" }, { name: "Canning Calculator", url: "https://plantingcalc.com/canning" }]} />

      {/* Inputs */}
      <div className="grid gap-6 sm:grid-cols-2">
        <SelectInput
          label="Produce Type"
          value={produce}
          onChange={(v) => setProduce(v as ProduceType)}
          options={PRODUCE_OPTIONS}
          helpText={`${data.label}: ${data.lbsPerQuart} lbs per quart, ${data.lbsPerPint} lbs per pint`}
        />

        <SelectInput
          label="Jar Size"
          value={jarSize}
          onChange={(v) => setJarSize(v as JarSize)}
          options={JAR_OPTIONS}
          helpText={`Canner holds ${jarSize === "quart" ? "7 quarts" : "9 pints"} per batch`}
        />

        <div className="sm:col-span-2">
          <SliderInput
            label="Harvest Amount"
            value={harvestLbs}
            onChange={setHarvestLbs}
            min={5}
            max={100}
            step={5}
            unit="lbs"
          />
        </div>

        <SelectInput
          label="Preservation Method"
          value={method}
          onChange={(v) => setMethod(v as PreservationMethod)}
          options={METHOD_OPTIONS}
        />
      </div>

      {/* Method warning */}
      {methodWarning && (
        <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Safety Note:</strong> {methodWarning}
        </div>
      )}

      {/* Results */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Your Canning Plan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            label="Jars Needed"
            value={String(results.jarsNeeded)}
            unit={jarSize === "quart" ? "quart jars" : "pint jars"}
            highlight
            icon="🫙"
          />
          <ResultCard
            label="Batches"
            value={String(results.batchCount)}
            unit={`${results.jarsPerBatch} jars per batch`}
            icon="♨️"
          />
          <ResultCard
            label="Time per Batch"
            value={String(results.timePerBatch + (method === "freezing" ? 10 : 30))}
            unit="minutes (incl. prep)"
            icon="⏱️"
          />
          <ResultCard
            label="Total Time"
            value={results.totalHours < 1 ? String(results.totalMinutes) : results.totalHours.toFixed(1)}
            unit={results.totalHours < 1 ? "minutes" : "hours"}
            icon="🕐"
          />
        </div>

        {/* Summary breakdown */}
        <div className="mt-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
            Breakdown
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-muted)]">Produce</span>
              <span className="font-semibold text-[var(--color-text)]">{data.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-muted)]">Harvest</span>
              <span className="font-semibold text-[var(--color-text)]">{harvestLbs} lbs</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-muted)]">Yield Rate</span>
              <span className="font-semibold text-[var(--color-text)]">{results.lbsPerJar} lbs per {jarSize}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-muted)]">Processing Time</span>
              <span className="font-semibold text-[var(--color-text)]">
                {method === "freezing" ? "N/A (freezing)" : results.methodValid ? `${results.processingTime} min per batch` : "Not recommended"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-muted)]">Estimated Shelf Life</span>
              <span className="font-semibold text-[var(--color-text)]">{results.shelfLife} months</span>
            </div>
          </div>
        </div>

        <ShareResults
          title={`Canning Plan: ${results.jarsNeeded} jars of ${data.label}`}
          text={`My ${harvestLbs} lbs of ${data.label.toLowerCase()} will fill ${results.jarsNeeded} ${jarSize} jars in ${results.batchCount} batch${results.batchCount !== 1 ? "es" : ""}, taking about ${results.totalHours >= 1 ? results.totalHours.toFixed(1) + " hours" : results.totalMinutes + " minutes"} total.`}
        />
      </div>

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Recommended Canning Supplies
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <a
            href={`https://www.amazon.com/s?k=Ball+mason+jars+canning&tag=${AMAZON_TAG}&ascsubtag=canning`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
              <span className="text-5xl">🫙</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Ball Mason Jars</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Pint and quart canning jars with lids and bands. The gold standard for home canning.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$10 - $25</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=pressure+canner&tag=${AMAZON_TAG}&ascsubtag=canning`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
              <span className="text-5xl">♨️</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Pressure Canners</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Essential for low-acid foods like green beans, corn, and beets. Safe and reliable models.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$80 - $200</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=canning+kit+starter+set&tag=${AMAZON_TAG}&ascsubtag=canning`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-5xl">🧰</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Canning Starter Kits</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Jar lifter, funnel, bubble remover, lid wand, and tongs. Everything you need to get started.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$15 - $35</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <FAQSection questions={canningFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How This Calculator Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          This calculator estimates the number of jars needed by dividing your harvest weight by the average pounds-per-jar yield for each produce type. Yield rates are based on USDA and Ball canning guide recommendations. Batch counts assume a standard water bath or pressure canner that holds 7 quart jars or 9 pint jars. Total time includes both processing time and approximately 30 minutes of prep per batch for heating the canner, loading jars, and cooling.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Tips for Successful Canning</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>Always use tested recipes from the USDA, Ball, or your local cooperative extension. Do not modify acid levels, processing times, or jar sizes from tested recipes.</li>
          <li>Low-acid foods (green beans, corn, beets, peppers) require pressure canning for safe preservation. Water bath canning is only safe for high-acid foods like tomatoes, pickles, jams, and fruit.</li>
          <li>Check jar seals after cooling. Press the center of the lid. If it does not flex up and down, the seal is good. Unsealed jars should be refrigerated and used within a week.</li>
          <li>Label every jar with the contents and date. Use the oldest jars first. Most home-canned goods maintain best quality for 12 to 18 months when stored in a cool, dark place.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="canning-calculator" />
      <RelatedCalculators currentPath="/canning" />
    </CalculatorLayout>
  );
}
