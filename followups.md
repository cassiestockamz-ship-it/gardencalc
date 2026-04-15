# PlantingCalc — Follow-ups

Work deliberately punted from the 2026-04-15 forecast-aware rebuild. These were flagged with "this would be a great spot for X, write it down and move on."

## Monetization (whole category out of scope)
- [ ] Re-add Amazon affiliate product cards on calculator result pages (frost blankets on frost-alert, raised bed kits on soil-calculator, etc.). Tag: `kawaiiguy0f-pc-20`. Put them UNDER the verdict card, never above, and gate behind a feature flag so the AdSense recovery playbook doesn't break.
- [ ] Ad slot placements once AdSense approves (currently pending). One inline per tool, one bottom. Do NOT touch the homepage hero or the `WeekAhead` card.
- [ ] Email capture optimization. Right now `EmailCapture` is used on planting-dates and zone guides as a banner. Move to an exit-intent trigger for the homepage and an inline "get alerts when your last frost is in 7 days" on frost-alert.
- [ ] Substack/newsletter integration. Weekly forecast-aware digest: "Zone 7 gardeners, your last frost is in 12 days. Here's what to start indoors this weekend."

## Live-data tool coverage
- [ ] **Chill Hours tracker (`/chill-hours`)** — still uses the legacy ZIP input. Swap in ZipRingDecoder.
- [ ] **Succession Planting (`/succession-planting`)** — not a live-data tool, but would benefit from a ZIP-aware "start date by crop" that ties into the decision engine.
- [ ] **Seed Starting (`/seed-starting`)** — consolidate with seed-start-calendar or clearly differentiate.
- [ ] **Harvest Date (`/harvest-date`)** — ZIP-aware countdown to first frost vs crop days-to-maturity.

## Signature interactions / polish
- [ ] **Embeddable widget.** The strongest white-space finding from the competitor audit. Build a `/embed/frost-alert?zip=NNNNN` iframe-friendly page that bloggers can drop into garden posts with a link back. Passive SEO backlink generator.
- [ ] **CSV export of planting dates.** ICS already exists on seed-start-calendar. Extend to `/planting-dates` with a per-ZIP CSV.
- [ ] **"Zone Quick Lookup" CTA on the guides hub.** Right now `/guides` is 13 static cards. Add a "Don't know your zone? Enter ZIP →" decoder bar at the top that jumps straight to `/guides/zone-X`.
- [ ] **ZipRingDecoder upgrade: show detected zone number in a larger font with a subtle hover-reveal of the temperature range.** Current slots are equal-weight; the zone should be the hero slot.
- [ ] **Frost countdown as a standalone widget** in the site header for logged-in users. "Your frost: 48 days" always visible after first ZIP entry.

## Content / SEO
- [ ] **Author page + Person schema.** Currently `/about` has no author entity. Add author bio, sameAs links (Pinterest, Twitter), Person schema so Google can attach E-E-A-T credit.
- [ ] **Guide hub Dataset schema.** The `/guides` hub should emit a Dataset schema covering "planting dates across 13 USDA zones" that points at the whole /guides/[zone] collection.
- [ ] **Frost Dates tool (`/frost-dates`)** needs the new tokens and may have old copy.
- [ ] **Internal linking audit.** Every zone guide should link to 3-5 related tools. Every tool should link to the relevant zone guide. Right now cross-linking is spot-checked, not systematic.
- [ ] **Guide hub copy.** `/guides/page.tsx` still has some educational prose that got auto-fixed by the em-dash script. Re-read and tighten.

## Design follow-ups
- [ ] **Micro-copy polish on CropCard.** "WAIT 8 DAYS" is good. "SOW NOW" is good. "TOO COLD" for zones-out-of-range could be gentler — maybe "SKIP THIS CROP" with a suggestion alternative.
- [ ] **Mobile nav.** NavDropdown + MobileMenu still use green-only; update to sage and test the drawer on a phone.
- [ ] **Icon replacement.** Using emoji for crops is fine but feels slightly off-brand against Fraunces display. Consider a custom icon set (lucide-react `leaf`, `sprout`, `carrot`, `flower-2`) on a later pass.
- [ ] **Favicon + OG image refresh.** Current `icon.svg` is the old green leaf. Swap to sage + terracotta mark.
- [ ] **Dark mode.** Tokens are OKLCH-ready but not wired. One pass on `@media (prefers-color-scheme: dark)` variants.

## Data freshness
- [ ] **Refresh crop database quarterly.** Vegetables.ts, frost-tolerance.ts, companions.ts, fertilizer.ts, chill-varieties.ts should all have a "last updated" date and a re-check process against the extension-office source each quarter.
- [ ] **USDA zone map 2023 update** — confirm `phzmapi.org` is returning the 2023 refresh, not the 2012 map.

## Tech debt
- [ ] **View Transitions test matrix.** Navigate home → tool → zone guide → tool → home and verify the header, logo, decoder, and sticky ZIP bar all morph cleanly on Chrome/Firefox/Safari. Currently unverified across browsers.
- [ ] **LCP budget check.** Target is <1.5s. Run a Lighthouse audit and tune the Fraunces preload if needed.
- [ ] **ZIP prefix table is incomplete.** ~900 entries, missing Alaska/Hawaii and some rural PR/Virgin Islands prefixes. Add a fallback UI state when `lookupZipPrefix` returns null.
- [ ] **Delete legacy pages not rebuilt.** `/bed-layout`, `/square-foot`, etc. still use old green tokens via CalculatorLayout's flip. They work but feel visually inconsistent with the new hero tools. Pass-through restyle later.

## Infra
- [ ] Kill the orphaned postcss workers check in CI. Prevent the 7.9GB incident from recurring by adding a pre-build check.
- [ ] Purge Cloudflare cache after deploy — not strictly required (ISR handles freshness) but a clean sweep would kill any edge-cached old homepage.

---

**Scope discipline:** none of this blocks the current deploy. These are the next session's to-do list, not this one's loose ends.
