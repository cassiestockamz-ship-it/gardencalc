#!/usr/bin/env python3
"""
Live visual QA for plantingcalc.com with console + network error capture.

Walks the critical routes on mobile (390x844) and desktop (1280x800),
takes full-page screenshots, extracts rendered text, captures console
errors and failed network requests, and reports findings.
"""
import asyncio
import re
from pathlib import Path
from playwright.async_api import async_playwright

OUT_DIR = Path(r"C:\Users\Amazon IRL\Downloads\pc-audit-2026-04-15")
OUT_DIR.mkdir(parents=True, exist_ok=True)

ROUTES = [
    ("home",             "https://plantingcalc.com/"),
    ("frost-alert",      "https://plantingcalc.com/frost-alert"),
    ("plant-today",      "https://plantingcalc.com/plant-today"),
    ("planting-dates",   "https://plantingcalc.com/planting-dates"),
    ("frost-probability","https://plantingcalc.com/frost-probability"),
    ("seed-start",       "https://plantingcalc.com/seed-start-calendar"),
    ("chill-hours",      "https://plantingcalc.com/chill-hours"),
    ("succession",       "https://plantingcalc.com/succession-planting"),
    ("harvest-date",     "https://plantingcalc.com/harvest-date"),
    ("soil-calculator",  "https://plantingcalc.com/soil-calculator"),
    ("guides-hub",       "https://plantingcalc.com/guides"),
    ("zone-7",           "https://plantingcalc.com/guides/zone-7"),
    ("zone-3",           "https://plantingcalc.com/guides/zone-3"),
    ("zone-10",          "https://plantingcalc.com/guides/zone-10"),
    ("calculators",      "https://plantingcalc.com/calculators"),
    ("about",            "https://plantingcalc.com/about"),
    ("disclaimer",       "https://plantingcalc.com/disclaimer"),
]

# Case-insensitive marker matching — handles text-transform: uppercase
MARKERS = {
    "home": [
        r"planting calendar that reads your forecast",
        r"enter a zip",
        r"live data tools",
        r"every calculator",
    ],
    "frost-alert": [r"frost alert", r"72.hour", r"common questions"],
    "plant-today": [r"plant today", r"common questions"],
    "planting-dates": [r"planting date"],
    "zone-7": [r"zone 7 planting guide", r"growing tips"],
    "zone-3": [r"zone 3 planting guide"],
    "guides-hub": [r"zone"],
    "chill-hours": [r"chill"],
    "succession": [r"succession"],
    "harvest-date": [r"harvest"],
}

VIEWPORTS = [("mobile", 390, 844), ("desktop", 1280, 800)]

# Known noise to ignore in console output
IGNORE_CONSOLE = [
    "preloaded using link preload but not used",
    "favicon",
    "adsbygoogle",  # AdSense script noise
    "pagead2",
    "doubleclick",
    "google-analytics",
    "project-dash-psi",  # our own tracker, may 500 sometimes
]

def is_noise(text):
    t = text.lower()
    return any(n in t for n in IGNORE_CONSOLE)

async def audit_route(context, route_name, url, viewport_name, w, h):
    page = await context.new_page()
    await page.set_viewport_size({"width": w, "height": h})

    console_errors = []
    network_errors = []
    page.on("console", lambda msg: console_errors.append(f"{msg.type}: {msg.text}") if msg.type in ("error", "warning") and not is_noise(msg.text) else None)
    page.on("pageerror", lambda exc: console_errors.append(f"pageerror: {exc}"))
    page.on("requestfailed", lambda req: (
        network_errors.append(f"{req.method} {req.url} :: {req.failure}")
        if not is_noise(req.url) else None
    ))
    page.on("response", lambda resp: (
        network_errors.append(f"HTTP {resp.status} {resp.url}")
        if resp.status >= 500 and not is_noise(resp.url) else None
    ))

    issues = []
    try:
        resp = await page.goto(url, wait_until="networkidle", timeout=30000)
        if resp and resp.status >= 400:
            issues.append(f"HTTP {resp.status}")
    except Exception as e:
        issues.append(f"nav: {e}")
        await page.close()
        return {"issues": issues, "console": console_errors, "network": network_errors}

    await page.wait_for_timeout(900)
    await page.add_style_tag(content="* { animation-duration: 0s !important; transition-duration: 0s !important; scroll-behavior: auto !important; }")

    shot = OUT_DIR / f"{route_name}__{viewport_name}.png"
    try:
        await page.screenshot(path=str(shot), full_page=True)
    except Exception as e:
        issues.append(f"shot: {e}")

    if route_name in MARKERS:
        body = (await page.inner_text("body")).lower()
        for marker in MARKERS[route_name]:
            if not re.search(marker, body, re.IGNORECASE):
                issues.append(f"missing: {marker}")

    # Above-the-fold check for live-data tools on mobile
    if viewport_name == "mobile" and route_name in (
        "frost-alert", "plant-today", "planting-dates",
        "frost-probability", "seed-start", "chill-hours",
        "succession", "harvest-date",
    ):
        try:
            y = await page.evaluate("""() => {
                const el = document.querySelector('#zip-ring-input, input[inputmode=numeric], input[pattern]');
                if (!el) return -1;
                return Math.round(el.getBoundingClientRect().top);
            }""")
            if y < 0:
                issues.append("no ZIP input present")
            elif y > 600:
                issues.append(f"ZIP input below fold (y={y}px)")
        except Exception as e:
            issues.append(f"fold: {e}")

    # Em dashes in visible text (should be zero)
    try:
        em = await page.evaluate("() => (document.body.innerText.match(/\\u2014/g) || []).length")
        if em > 0:
            issues.append(f"em dashes in text: {em}")
    except Exception:
        pass

    # Affiliate leakage check — Amazon tag, disclosure, etc.
    try:
        body = await page.inner_text("body")
        if "kawaiiguy0f" in body.lower() or "amazon.com/dp" in body.lower():
            issues.append("amazon affiliate link visible")
        if "amzn.to" in body.lower():
            issues.append("amzn.to link visible")
    except Exception:
        pass

    await page.close()
    return {"issues": issues, "console": console_errors, "network": network_errors}

async def main():
    results = {}
    async with async_playwright() as p:
        user_data_dir = str(Path.home() / ".claude" / "playwright-profile-pc-audit")
        context = await p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=True,
            viewport={"width": 390, "height": 844},
        )

        # CRITICAL: Pre-seed localStorage with a cached ZIP context to
        # simulate a returning user. This catches crashes in useEffect/
        # useMemo code paths that only fire when a ZIP is already set on
        # page mount. (Bug found 2026-04-15: i.lat.toFixed not a function)
        seed_page = await context.new_page()
        await seed_page.goto("https://plantingcalc.com/", wait_until="domcontentloaded", timeout=30000)
        await seed_page.evaluate("""() => {
          localStorage.setItem('pc_zip_context_v1', JSON.stringify({
            zip: '55401',
            state: 'MN',
            zone: '4b',
            lat: 44.9,
            lng: -93.3,
            place: 'Minneapolis, MN'
          }));
        }""")
        await seed_page.close()
        print("\n=== Pre-seeded localStorage with ZIP 55401 (Minneapolis) ===")

        for viewport_name, w, h in VIEWPORTS:
            print(f"\n=== {viewport_name.upper()} {w}x{h} ===")
            for route_name, url in ROUTES:
                r = await audit_route(context, route_name, url, viewport_name, w, h)
                results[f"{route_name}__{viewport_name}"] = r
                ok = not r["issues"] and not r["console"] and not r["network"]
                flag = "OK  " if ok else "FAIL"
                extras = []
                if r["issues"]: extras.append(f"issues={r['issues']}")
                if r["console"]: extras.append(f"console={len(r['console'])}")
                if r["network"]: extras.append(f"network={len(r['network'])}")
                print(f"  {route_name:18s} {flag} {' '.join(extras)}")
        await context.close()

    print("\n=== CONSOLE / NETWORK DETAIL ===")
    for key, r in results.items():
        if r["console"] or r["network"]:
            print(f"\n{key}:")
            for c in r["console"][:5]:
                print(f"  console: {c[:200]}")
            for n in r["network"][:5]:
                print(f"  network: {n[:200]}")

    print(f"\nScreenshots: {OUT_DIR}")
    total = len(results)
    failed = sum(1 for r in results.values() if r["issues"] or r["console"] or r["network"])
    print(f"\n{failed}/{total} routes with issues")

if __name__ == "__main__":
    asyncio.run(main())
