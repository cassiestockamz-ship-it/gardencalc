#!/usr/bin/env python3
"""Verify sticky ZIP bar countdown logic after the growing-season fix."""
import asyncio
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding="utf-8")


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 800})
        page = await ctx.new_page()
        await page.goto(
            "https://plantingcalc.com/",
            wait_until="domcontentloaded",
            timeout=30000,
        )
        await page.evaluate(
            "() => localStorage.setItem('pc_zip_context_v1', "
            "JSON.stringify({zip:'23434',state:'VA',zone:'8a',lat:36.7,lng:-76.6,place:'Suffolk, VA'}))"
        )
        await page.goto(
            "https://plantingcalc.com/soil-calculator",
            wait_until="networkidle",
            timeout=30000,
        )
        await page.wait_for_timeout(1500)
        bar_text = await page.evaluate(
            "() => { const b = document.querySelector('.vt-sticky-zip');"
            "return b ? b.innerText : 'none'; }"
        )
        clean = "".join(c for c in bar_text if ord(c) < 0x1F000)
        print("Sticky bar text (Suffolk VA, Apr 15):")
        print(f"  {clean.strip()}")
        await browser.close()


asyncio.run(main())
