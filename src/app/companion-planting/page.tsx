"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SelectInput from "@/components/SelectInput";
import ShareResults from "@/components/ShareResults";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { COMPANION_PLANTS } from "@/data/companions";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import { companionFAQ } from "@/data/faq-data";

const AMAZON_TAG = "kawaiiguy0f-pc-20";

type Mode = "lookup" | "pair";

export default function CompanionPlantingPage() {
  const [mode, setMode] = useState<Mode>("lookup");
  const [selectedPlant, setSelectedPlant] = useState(COMPANION_PLANTS[0].name);
  const [plantA, setPlantA] = useState(COMPANION_PLANTS[0].name);
  const [plantB, setPlantB] = useState(COMPANION_PLANTS[1].name);

  const plantOptions = COMPANION_PLANTS.map((p) => ({
    value: p.name,
    label: `${p.icon} ${p.name}`,
  }));

  const plant = COMPANION_PLANTS.find((p) => p.name === selectedPlant) || COMPANION_PLANTS[0];

  // Get icon for a companion/foe name
  const getIcon = (name: string): string => {
    const found = COMPANION_PLANTS.find((p) => p.name === name);
    return found?.icon || "🌱";
  };

  // Pair check logic
  const pairResult = useMemo(() => {
    if (plantA === plantB) return { status: "same" as const, reason: "" };

    const a = COMPANION_PLANTS.find((p) => p.name === plantA);
    const b = COMPANION_PLANTS.find((p) => p.name === plantB);
    if (!a || !b) return { status: "unknown" as const, reason: "" };

    const aLikesB = a.companions.includes(b.name);
    const bLikesA = b.companions.includes(a.name);
    const aDislikesB = a.foes.includes(b.name);
    const bDislikesA = b.foes.includes(a.name);

    if (aDislikesB || bDislikesA) {
      const reasons: string[] = [];
      if (aDislikesB && a.notes) reasons.push(`${a.name}: ${a.notes}`);
      if (bDislikesA && b.notes) reasons.push(`${b.name}: ${b.notes}`);
      return { status: "bad" as const, reason: reasons.join(" | ") };
    }

    if (aLikesB || bLikesA) {
      const reasons: string[] = [];
      if (aLikesB && a.notes) reasons.push(`${a.name}: ${a.notes}`);
      if (bLikesA && b.notes) reasons.push(`${b.name}: ${b.notes}`);
      return { status: "good" as const, reason: reasons.join(" | ") };
    }

    return { status: "neutral" as const, reason: "No known interaction between these plants." };
  }, [plantA, plantB]);

  const statusConfig = {
    good: { icon: "\u2705", label: "Great Companions!", bg: "bg-green-50 border-green-300", text: "text-green-700" },
    bad: { icon: "\u274C", label: "Keep Apart!", bg: "bg-red-50 border-red-300", text: "text-red-700" },
    neutral: { icon: "\u2796", label: "Neutral", bg: "bg-gray-50 border-gray-300", text: "text-gray-600" },
    same: { icon: "\u2139\uFE0F", label: "Same Plant", bg: "bg-blue-50 border-blue-300", text: "text-blue-600" },
    unknown: { icon: "\u2753", label: "Unknown", bg: "bg-gray-50 border-gray-300", text: "text-gray-600" },
  };

  return (
    <CalculatorLayout
      title="Companion Planting Checker"
      description="Find out which plants grow well together and which to keep apart. Look up companions for any plant, or check if a specific pair is compatible."
      lastUpdated="March 2026"
      intro="Companion planting pairs vegetables, herbs, and flowers that benefit each other through pest repulsion, pollinator attraction, or nutrient sharing. Classic examples include tomatoes with basil, corn with beans and squash (the Three Sisters), and marigolds near most vegetables to repel harmful nematodes."
    >
      <CalculatorSchema
        name="Companion Planting Checker"
        description="Interactive companion planting guide for 30+ vegetables, herbs, and flowers. Check compatibility between any two plants or browse companions for each."
        url="https://plantingcalc.com/companion-planting"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "https://plantingcalc.com" }, { name: "Companion Planting", url: "https://plantingcalc.com/companion-planting" }]} />

      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMode("lookup")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "lookup"
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
          }`}
        >
          Browse Companions
        </button>
        <button
          onClick={() => setMode("pair")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            mode === "pair"
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
          }`}
        >
          Check a Pair
        </button>
      </div>

      {/* LOOKUP MODE */}
      {mode === "lookup" && (
        <>
          <div className="mt-6">
            <SelectInput
              label="Select a Plant"
              value={selectedPlant}
              onChange={setSelectedPlant}
              options={plantOptions}
              helpText={plant.notes}
            />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Good Companions */}
            <div className="rounded-xl border border-green-200 bg-green-50/50 p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-green-700">
                <span className="text-lg">{"\u2705"}</span> Good Companions
              </h3>
              {plant.companions.length > 0 ? (
                <div className="space-y-2">
                  {plant.companions.map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2.5 rounded-lg bg-white/70 px-3 py-2 text-sm transition-colors hover:bg-white"
                    >
                      <span className="text-lg">{getIcon(name)}</span>
                      <span className="font-medium text-[var(--color-text)]">{name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">No known companions listed.</p>
              )}
            </div>

            {/* Foes */}
            <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-red-700">
                <span className="text-lg">{"\u274C"}</span> Keep Away
              </h3>
              {plant.foes.length > 0 ? (
                <div className="space-y-2">
                  {plant.foes.map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2.5 rounded-lg bg-white/70 px-3 py-2 text-sm transition-colors hover:bg-white"
                    >
                      <span className="text-lg">{getIcon(name)}</span>
                      <span className="font-medium text-[var(--color-text)]">{name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--color-text-muted)]">No known foes. Plays well with others!</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {plant.notes && (
            <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
              <h3 className="mb-2 text-sm font-semibold text-[var(--color-text)]">
                Why it matters
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                <span className="mr-1.5 text-base">{plant.icon}</span>
                <strong>{plant.name}:</strong> {plant.notes}
              </p>
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                Companion planting leverages natural relationships between plants. Good companions may repel pests, attract pollinators, fix nitrogen, provide shade, or improve flavor. Foes may compete for nutrients, attract the same pests, or release growth-inhibiting chemicals.
              </p>
            </div>
          )}

          <ShareResults
            title={`${plant.name} Companions`}
            text={`${plant.name} grows well with: ${plant.companions.join(", ")}. Keep away from: ${plant.foes.join(", ") || "nothing!"}.`}
          />
        </>
      )}

      {/* PAIR CHECK MODE */}
      {mode === "pair" && (
        <>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <SelectInput
              label="First Plant"
              value={plantA}
              onChange={setPlantA}
              options={plantOptions}
            />
            <SelectInput
              label="Second Plant"
              value={plantB}
              onChange={setPlantB}
              options={plantOptions}
            />
          </div>

          {/* Compatibility Result */}
          <div className={`mt-8 rounded-xl border-2 p-6 text-center ${statusConfig[pairResult.status].bg}`}>
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">{COMPANION_PLANTS.find((p) => p.name === plantA)?.icon || "🌱"}</span>
              <span className="text-4xl">{statusConfig[pairResult.status].icon}</span>
              <span className="text-4xl">{COMPANION_PLANTS.find((p) => p.name === plantB)?.icon || "🌱"}</span>
            </div>
            <h3 className={`mt-4 text-xl font-bold ${statusConfig[pairResult.status].text}`}>
              {statusConfig[pairResult.status].label}
            </h3>
            <p className="mt-2 text-sm font-medium text-[var(--color-text)]">
              {plantA} + {plantB}
            </p>
            {pairResult.reason && (
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">{pairResult.reason}</p>
            )}
          </div>

          {/* Quick reference for both plants */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[plantA, plantB].map((pName) => {
              const p = COMPANION_PLANTS.find((c) => c.name === pName);
              if (!p) return null;
              return (
                <div key={pName} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-[var(--color-text)]">
                    <span>{p.icon}</span> {p.name}
                  </h4>
                  <div className="space-y-1 text-xs">
                    <p className="text-[var(--color-text-muted)]">
                      <span className="font-semibold text-green-600">Friends:</span>{" "}
                      {p.companions.slice(0, 5).join(", ")}{p.companions.length > 5 ? ` +${p.companions.length - 5} more` : ""}
                    </p>
                    <p className="text-[var(--color-text-muted)]">
                      <span className="font-semibold text-red-600">Foes:</span>{" "}
                      {p.foes.length > 0 ? p.foes.join(", ") : "None"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <ShareResults
            title={`${plantA} + ${plantB}: ${statusConfig[pairResult.status].label}`}
            text={`Companion planting check: ${plantA} and ${plantB} are ${pairResult.status === "good" ? "great companions" : pairResult.status === "bad" ? "not compatible" : "neutral"}. ${pairResult.reason}`}
          />
        </>
      )}

      {/* Affiliate Cards */}
      <div className="mt-10">
        <h2 className="mb-5 text-lg font-bold text-[var(--color-text)]">
          Recommended Resources
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={`https://www.amazon.com/s?k=companion+planting+book+garden&tag=${AMAZON_TAG}&ascsubtag=companion-planting`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
              <span className="text-5xl">📚</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Companion Planting Books</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">In-depth companion planting guides with charts, garden plans, and pest management strategies for every season.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$10 - $25</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
          <a
            href={`https://www.amazon.com/s?k=garden+planning+tools+layout&tag=${AMAZON_TAG}&ascsubtag=companion-planting`}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
              <span className="text-5xl">📐</span>
            </div>
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Recommended</span>
                <span className="rounded-full bg-[var(--color-surface-alt)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">Ad</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)]">Garden Planning Tools</h3>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">Garden bed planners, measuring tools, and layout guides to design the perfect companion planting arrangement.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-text)]">$12 - $35</span>
                <span className="text-sm font-medium text-[var(--color-primary)] group-hover:underline">View on Amazon &rarr;</span>
              </div>
            </div>
          </a>
        </div>
      </div>
      <FAQSection questions={companionFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">How Companion Planting Works</h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          Companion planting relationships are drawn from agricultural extension research, traditional farming practices, and documented scientific studies on allelopathy (chemical interactions between plants). Plants benefit each other through several mechanisms: nitrogen fixation (beans and peas feed neighboring plants), pest confusion (strong-scented herbs mask crop scents from pests), trap cropping (nasturtiums lure aphids away from vegetables), and pollinator attraction (flowers near crops improve fruit set). Antagonistic relationships typically involve chemical compounds — for example, black walnut trees release juglone, which inhibits tomato and pepper growth.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Putting Companions Into Practice</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>The Three Sisters (corn, beans, squash) is the most well-documented companion planting system — corn provides a trellis for beans, beans fix nitrogen for all three, and squash leaves shade the soil to retain moisture.</li>
          <li>Plant basil within 18 inches of tomatoes. Research from Purdue University shows basil repels thrips and may improve tomato flavor.</li>
          <li>Border your garden with marigolds — their roots release thiopene, a compound that suppresses harmful root-knot nematodes in the surrounding soil for up to a year.</li>
          <li>Use the <a href="/seed-spacing" className="text-[var(--color-primary)] hover:underline">spacing calculator</a> to plan how many companions fit alongside your main crops, and check the <a href="/watering" className="text-[var(--color-primary)] hover:underline">watering calculator</a> to balance water needs when pairing plants with different requirements.</li>
        </ul>
      </div>

      <RelatedCalculators currentPath="/companion-planting" />
    </CalculatorLayout>
  );
}
