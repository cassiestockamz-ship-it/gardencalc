# PlantingCalc -- Gardening Calculator Hub

## What This Is
Free gardening calculator hub at **plantingcalc.com**. Interactive calculators for home gardeners, powered by USDA hardiness zone data and agricultural extension research. Monetized with Amazon affiliate links and Google AdSense (ca-pub-7557739369186741, added 2026-03-29, pending review).

## Live URLs
- **Production:** https://plantingcalc.com
- **Vercel:** https://gardencalc.vercel.app
- **GitHub:** https://github.com/cassiestockamz-ship-it/gardencalc

## Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS 4 (CSS-based config via PostCSS)
- **Language:** TypeScript (strict)
- **Hosting:** Vercel (hobby plan, scope: taylors-projects-6d8e0bd8)
- **Analytics:** Project Dash tracker (site_id: `17156a6b-a5cd-4caf-ac2c-c9c3977b436f`)
- **Domain:** plantingcalc.com (non-www canonical, www->non-www redirect in vercel.json)

## Project Structure
```
src/
├── app/
│   ├── page.tsx                # Homepage (calculator cards grid)
│   ├── layout.tsx              # Root layout (nav, footer, Project Dash tracking)
│   ├── globals.css             # CSS variables + Tailwind
│   ├── icon.svg                # Favicon
│   ├── robots.ts               # robots.txt generator (allows AI bots)
│   ├── sitemap.ts              # sitemap.xml generator (calcs + zone guides)
│   ├── not-found.tsx           # 404 page
│   ├── soil-calculator/        # Calculator 1: Raised bed soil volume
│   ├── planting-dates/         # Calculator 2: Planting dates by ZIP
│   ├── seed-spacing/           # Calculator 3: Seed spacing & yield
│   ├── companion-planting/     # Calculator 4: Companion planting checker
│   ├── fertilizer/             # Calculator 5: NPK fertilizer calculator
│   ├── watering/               # Calculator 6: Watering schedule
│   ├── guides/                 # Zone guide hub + dynamic [zone] routes
│   │   ├── page.tsx            # Hub listing all zones
│   │   └── [zone]/page.tsx     # Individual zone guide (zones 1-13)
│   ├── og/[slug]/route.tsx     # Dynamic OG image generation
│   ├── api/subscribe/route.ts  # Email capture endpoint
│   ├── api/zone/route.ts       # Zone lookup API
│   ├── about/                  # About page
│   └── disclosure/             # Affiliate disclosure
├── components/
│   ├── CalculatorLayout.tsx    # Shared page wrapper
│   ├── CalculatorSchema.tsx    # JSON-LD WebApplication schema
│   ├── BreadcrumbSchema.tsx    # Breadcrumb JSON-LD
│   ├── RelatedCalculators.tsx  # Cross-links footer
│   ├── ResultCard.tsx          # Metric display card
│   ├── EmailCapture.tsx        # Email signup component
│   ├── FAQSection.tsx          # Collapsible FAQ with FAQPage schema
│   ├── ShareResults.tsx        # Share/copy results
│   ├── AffiliateDisclosure.tsx # Inline disclosure notice
│   ├── SelectInput.tsx         # Dropdown input
│   ├── NumberInput.tsx         # Number input with unit
│   ├── SliderInput.tsx         # Range slider
│   └── MobileMenu.tsx          # Mobile hamburger nav
├── data/
│   ├── vegetables.ts           # Vegetable database (planting info, zones)
│   ├── companions.ts           # Companion planting compatibility data
│   ├── fertilizer.ts           # NPK ratios and fertilizer data
│   ├── faq-data.ts             # FAQ questions per calculator
│   └── zone-guides.ts          # USDA zone data (zones 1-13, tips, veggies)
└── lib/                        # (empty -- utilities as needed)
```

## Calculators
| # | Calculator | Path | Status |
|---|-----------|------|--------|
| 1 | Raised Bed Soil Calculator | `/soil-calculator` | LIVE |
| 2 | Planting Date Calculator | `/planting-dates` | LIVE |
| 3 | Seed Spacing & Yield Calculator | `/seed-spacing` | LIVE |
| 4 | Companion Planting Checker | `/companion-planting` | LIVE |
| 5 | Fertilizer Calculator | `/fertilizer` | LIVE |
| 6 | Watering Schedule Calculator | `/watering` | LIVE |

## Zone Guides
- Hub at `/guides` listing all USDA hardiness zones
- Dynamic routes at `/guides/zone-{N}` for zones 1-13
- Each guide includes: temperature range, growing season length, best vegetables, challenge vegetables, tips
- Data sourced from USDA zone info + agricultural extension research

## Monetization
- **Amazon Associates** tag: `kawaiiguy0f-pc-20`
- Affiliate links embedded contextually in calculator results
- Products: gardening tools, soil, raised bed kits, watering supplies, fertilizers
- Per-page tracking via `ascsubtag={slug}`
- **Email capture:** subscribe endpoint at `/api/subscribe`

## Data Sources
- **USDA:** Hardiness zone data, frost dates
- **Agricultural extension services:** Planting schedules, spacing recommendations, companion planting research
- Data stored as TypeScript constants in `src/data/` -- update annually

## Key Patterns
- All calculator pages are `"use client"` components (React state for interactivity)
- `CalculatorSchema` component adds JSON-LD WebApplication structured data
- Root layout includes WebSite JSON-LD schema
- `RelatedCalculators` component cross-links calculators at page bottom
- `FAQSection` with collapsible FAQPage schema on each calculator
- CSS variables in `globals.css` for consistent green/garden theming
- robots.txt explicitly allows AI bots (GPTBot, ClaudeBot, PerplexityBot, Amazonbot)
- Project Dash analytics tracker inline in layout

## Run Locally
```bash
cd ~/gardencalc
npm run dev
# Opens at http://localhost:3000
```

## Deploy
```bash
cd ~/gardencalc
source ~/.claude/tokens.env
TK=$(echo "$VERCEL_TOKEN" | tr -d '\r\n')
npx vercel --prod --token "$TK" --scope taylors-projects-6d8e0bd8 --yes
```

## SEO Status
- robots.txt: yes
- sitemap.xml: yes (6 calculators + 13 zone guides + hub + about + disclosure)
- Structured data (JSON-LD): WebApplication + FAQPage + BreadcrumbList + WebSite
- Dynamic OG images: yes (via `/og/[slug]` route)
- Canonical URLs: non-www, www->non-www redirect
- AI bot friendly: GPTBot, ClaudeBot, PerplexityBot, Amazonbot allowed
- Zone guides: 13 SEO pages targeting "USDA zone X planting guide" keywords

## Adding a New Calculator
1. Create `src/app/<slug>/page.tsx` ("use client", import shared components)
2. Add FAQ data in `src/data/faq-data.ts`
3. Add to `RelatedCalculators` component
4. Add to homepage `calculators` array in `src/app/page.tsx`
5. Add nav link in `src/app/layout.tsx` + `src/components/MobileMenu.tsx`
6. Add to `src/app/sitemap.ts`
7. Build + deploy
