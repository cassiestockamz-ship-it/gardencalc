# PlantingCalc — CLAUDE.md

## Thesis
**The planting calendar that reads your forecast.** Not a static zone chart. Not a 3-step wizard. A live, ZIP-aware gardening decision engine that tells you what to plant this week, what to cover tonight, and exactly how many days remain until your last frost. One ZIP, one screen, the exact decisions.

The competitive gap: Almanac.com dominates by brand, not UX. Johnny's, Burpee, Bonnie, SeedsNow all hide their calendars behind product catalogs. Nobody pairs live 14-day forecasts with specific crop-by-crop cover/harvest/plant actions. We already have the infrastructure (Open-Meteo 14-day + ERA5 historical, a 34-crop database, a frost-tolerance table). We now point the site at its own strength.

## Live URL
https://plantingcalc.com (canonical, www redirects to non-www)

## Stack
- Next.js 16.2.1 (App Router, Turbopack)
- React 19.2.4
- Tailwind CSS 4 (CSS-based config via `@theme inline` in globals.css)
- Lucide React (icon system, tree-shaken imports)
- Geist... no, Fraunces + Inter via `next/font/google`
- TypeScript (strict)
- `experimental.viewTransition: true` in next.config.ts for native View Transitions across navigations
- Vercel (hobby plan, scope `taylors-projects-6d8e0bd8`)

## Key Features

### The signature interaction
- **ZIP Ring Decoder** — 5 slots above the ZIP input (State, Zone, Latitude, Last Frost, Days Left) that light up progressively on keystroke. Pure client JS reads a bundled 3-digit ZIP prefix table (`src/lib/zipTable.ts`, ~900 prefixes) and paints slots before the network responds. When all 5 digits land, `/api/zone` is called and the Zone + Latitude slots upgrade to authoritative values. `vt-zip-decoder` view transition name. See [`src/components/ZipRingDecoder.tsx`](src/components/ZipRingDecoder.tsx).

### The atomic unit
- **CropCard** — a single crop rendered with action level (sow / watch / frost / pending), 3px top ribbon in action color, big action verb (SOW NOW, WAIT 8 DAYS, etc.), 3-tile data row (harvest days, spacing, zone range). Appears on the homepage WeekAhead, every live-data tool's output, and every zone guide's "best this week" strip. `vt-atomic-unit` view transition name. See [`src/components/CropCard.tsx`](src/components/CropCard.tsx).

### The one-screen cards
- **WeekAhead** — homepage hero output. Frost countdown bar (color state: sow → watch → frost as date approaches), avg 7-day low/high, next frost risk, top 3 CropCards. [`src/components/WeekAhead.tsx`](src/components/WeekAhead.tsx).
- **LiveWeekAhead** — the client wrapper combining ZipRingDecoder + WeekAhead + default CropCards + localStorage persistence. [`src/components/LiveWeekAhead.tsx`](src/components/LiveWeekAhead.tsx).
- **ZoneToolHeader** — the sticky tool-first header at the top of every zone guide. Frost countdown + 3-card "best this week" strip, filtered per-zone. Solves the prose-wall problem — every zone guide now opens with a working tool. [`src/components/ZoneToolHeader.tsx`](src/components/ZoneToolHeader.tsx).
- **StickyZipBar** — a thin persistent bar below the header that shows the saved ZIP context across every route once the user has entered a ZIP anywhere. Hidden on the homepage. `vt-sticky-zip`. [`src/components/StickyZipBar.tsx`](src/components/StickyZipBar.tsx).

### The decision engine
- [`src/lib/decisions.ts`](src/lib/decisions.ts) — pure functions, the brain.
  - `buildLocationContext(args)` — ZIP + zone + state + frost normals → LocationContext
  - `cropDecision(crop, ctx, forecast)` — one vegetable → `{ level, headline, detail, daysUntilAction }`
  - `weekAhead(ctx, forecast, crops, limit=3)` — homepage summary
  - `frostVerdict(forecast3day, crops)` — `all-clear | watch | action-needed` rollup
- [`src/lib/zipTable.ts`](src/lib/zipTable.ts) — bundled 3-digit ZIP prefix table. `lookupZipPrefix(partial)` returns `{ state, approxZone, approxLat }`.
- [`src/lib/frostDates.ts`](src/lib/frostDates.ts) — state-average last/first frost normals, `nextOccurrence`, `daysBetween`, `formatMonthDay`.
- [`src/lib/weather.ts`](src/lib/weather.ts) — Open-Meteo 14-day forecast + ERA5 historical (existing).
- [`src/app/api/zone/route.ts`](src/app/api/zone/route.ts) — USDA phzmapi.org lookup (existing).

### Tools rebuilt (tool-first layouts)
| Tool | Path | Status |
|---|---|---|
| Frost Alert | `/frost-alert` | ZipRingDecoder + verdict card + action-grouped crop lists, tool-first |
| Plant Today? | `/plant-today` | ZipRingDecoder + giant PLANT NOW/WAIT/NOT YET verdict, tool-first |
| Planting Dates | `/planting-dates` | ZipRingDecoder + Dataset schema, tool-first |
| Frost Probability | `/frost-probability` | ZipRingDecoder in place, tool-first |
| Seed Start Calendar | `/seed-start-calendar` | ZipRingDecoder in place, ICS export intact |
| Chill Hours | `/chill-hours` | Legacy input (followups) |
| Soil Calculator | `/soil-calculator` | Non-ZIP; layout order flipped via CalculatorLayout |
| + 15 more | various | Layout order flipped via CalculatorLayout |

### Zone guides
- Hub at `/guides`, dynamic routes at `/guides/zone-{N}` for zones 1-13
- Every zone guide opens with `ZoneToolHeader` (live frost countdown + "best this week in Zone N" CropCards)
- Tips + full vegetable table + calculator cross-links follow below the tool
- Each zone has typed `lastFrost` and `firstFrost` month/day values in [`src/data/zone-guides.ts`](src/data/zone-guides.ts)

## Design System — Almanac Morning

- **Palette:** warm sage (`#4a7c59`) primary, terracotta (`#c4714e`) accent, cream (`#faf9f6`) bg, warm taupe borders
- **Action levels:** `sow` (sage), `watch` (amber `#d9951f`), `frost` (terracotta-red `#c4411f`), each with `-soft`, `-ink`, `-ring` variants
- **Type:** Fraunces (display) + Inter (body) via `next/font/google`, `--font-inter` and `--font-fraunces` CSS variables, `.font-display` utility
- **Ribbons:** `.ribbon-sow`, `.ribbon-watch`, `.ribbon-frost`, `.ribbon-neutral` — 3px top stripe via `box-shadow: inset 0 3px 0 0 color`
- **Motion:** `.pc-fade-up`, `.pc-pulse-once`, `.pc-slot-fill`, `.pc-count-sweep` — all respect `prefers-reduced-motion`
- **Utilities:** `.cv-auto` (content-visibility), `.tabular-nums`, `.guide-prose` for long-form article body
- **View Transitions named classes:** `vt-header`, `vt-header-logo`, `vt-zip-decoder`, `vt-week-ahead`, `vt-sticky-zip`
- See [`src/app/globals.css`](src/app/globals.css)

## Schema.org markup

- **Homepage:** WebSite (with SearchAction), WebApplication, FAQPage (with SpeakableSpecification)
- **Planting Dates:** Dataset (USDA + NOAA source, spatial + variable coverage), WebApplication, BreadcrumbList, FAQPage
- **Zone guides (`/guides/[zone]`):** Article, HowTo (5 steps, P2W), WebPage with SpeakableSpecification, BreadcrumbList
- **Calculator pages:** WebApplication, FAQPage, BreadcrumbList
- **Root layout metadata:** OpenGraph, canonical, robots with max-image-preview: large

## Prose discipline (IMPORTANT)
Every user-visible prose file on this site has been swept for AI tells using the banned-patterns list at `~/.claude/fiction-patterns/banned_patterns.md`. **Zero em dashes** and **zero banned words** in user-visible prose. Code comments retain em dashes because they're dev-only. 24 em dashes remain in the repo — all in code comments. Verified via `grep` post-deploy.

## Scripts
- `scripts/strip-em-dashes.mjs` — one-shot AI-tell sweep that rewrites em dashes in non-comment regions
- `scripts/fix-mangled-commas.mjs` — post-strip fixer that turns ` , ` into `: ` (titles) or `. ` (prose) based on context
- `scripts/strip-affiliates.mjs` — legacy (pre-monetization-rework)

## Monetization (out of scope this session)
- Google AdSense script in `<head>` (pending approval as of 2026-04-13)
- No affiliate cards, no ad slots, no email capture optimization in scope this session — see [`followups.md`](followups.md) for the punt list

## Run Locally
```bash
cd ~/gardencalc
npm run build && npm run start
# Use `next start` for visual QA, NOT `next dev` — postcss worker leak
# See feedback_kill_dev_servers.md in global memory
```

## Deploy
```bash
cd ~/gardencalc
source ~/.claude/tokens.env
TK=$(echo "$VERCEL_TOKEN" | tr -d '\r\n')
"C:/Users/Amazon IRL/AppData/Roaming/npm/vercel.cmd" --prod --token "$TK" --scope taylors-projects-6d8e0bd8 --yes
```

## What to Read on Session Start
- This CLAUDE.md
- Memory: `google-seo-master-strategy-2026.md`, `adsense-low-value-content-recovery-playbook.md`
- [`src/lib/decisions.ts`](src/lib/decisions.ts) — the decision engine (the product thesis in code)
- [`src/lib/zipTable.ts`](src/lib/zipTable.ts) — client-side ZIP prefix lookup
- [`src/lib/weather.ts`](src/lib/weather.ts) — Open-Meteo client
- [`src/components/ZipRingDecoder.tsx`](src/components/ZipRingDecoder.tsx) — signature interaction
- [`src/components/CropCard.tsx`](src/components/CropCard.tsx) — atomic unit
- [`src/app/globals.css`](src/app/globals.css) — Almanac Morning tokens
- [`followups.md`](followups.md) — what got punted

## Project History
- **2026-04-15:** Full rebuild as the forecast-aware almanac. New thesis, new design system, new decision engine, signature ZipRingDecoder, CropCard atomic unit, zone guides rebuilt with tool-first headers, AI-tell sweep, Dataset/HowTo/Speakable/Article schema stack.
- **2026-03-29:** AdSense script added (pending)
- **2026-03-21:** Initial stack: 22 calculators, 13 zone guides
