#!/usr/bin/env python3
"""Scrape Amazon India for first-result product image per catalog entry.

Writes results to data/product-images.json (id -> url) and failures to
data/product-images-failed.json. Both files are read on startup so the script
is resumable: re-run after a block/interruption and it skips already-processed
products.

Setup:
    pip install playwright
    playwright install chromium

Run:
    python scripts/scrape-product-images.py

Flags:
    --retry-failed   Re-attempt previously failed products (clears failed file)
    --limit N        Stop after N new captures (useful for sanity-check pass)
"""
import argparse
import asyncio
import json
import random
import sys
from pathlib import Path
from urllib.parse import quote_plus

from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

ROOT = Path(__file__).resolve().parent.parent
SEED = ROOT / "data" / "products-seed.json"
OUT = ROOT / "data" / "product-images.json"
FAILED = ROOT / "data" / "product-images-failed.json"

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
)


def load_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text())


def save_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


async def search_amazon(page, brand: str, name: str):
    """Return the src of the first organic product image, or None."""
    query = f"{brand} {name}"
    url = f"https://www.amazon.in/s?k={quote_plus(query)}"
    await page.goto(url, wait_until="domcontentloaded", timeout=30000)

    if "captcha" in page.url.lower() or await page.query_selector("form[action*='validateCaptcha']"):
        raise RuntimeError("amazon_captcha")

    selector = 'div[data-component-type="s-search-result"] img.s-image'
    try:
        await page.wait_for_selector(selector, timeout=10000)
    except PlaywrightTimeoutError:
        return None

    img = await page.query_selector(selector)
    if not img:
        return None
    return await img.get_attribute("src")


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--retry-failed", action="store_true")
    parser.add_argument("--limit", type=int, default=None)
    args = parser.parse_args()

    products = load_json(SEED, [])
    images = load_json(OUT, {})
    failed = {} if args.retry_failed else load_json(FAILED, {})

    remaining = [
        p for p in products
        if p["id"] not in images and p["id"] not in failed
    ]
    if not remaining:
        print("All products already processed. Nothing to do.")
        return

    if args.limit:
        remaining = remaining[: args.limit]

    print(f"Processing {len(remaining)} of {len(products)} products")
    print(f"  captured so far: {len(images)}")
    print(f"  previously failed (skipping unless --retry-failed): {len(load_json(FAILED, {}))}")
    print()

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=USER_AGENT,
            viewport={"width": 1280, "height": 800},
            locale="en-IN",
        )
        page = await context.new_page()

        for i, p in enumerate(remaining, 1):
            label = f"[{i:>3}/{len(remaining)}] {p['id']:<45}"
            try:
                src = await search_amazon(page, p["brand"], p["name"])
                if src:
                    images[p["id"]] = src
                    save_json(OUT, images)
                    print(f"{label} OK")
                else:
                    failed[p["id"]] = "no_result"
                    save_json(FAILED, failed)
                    print(f"{label} MISS")
            except RuntimeError as e:
                if "captcha" in str(e):
                    print(f"{label} BLOCKED (captcha) — stopping. Re-run later.")
                    break
                failed[p["id"]] = str(e)[:120]
                save_json(FAILED, failed)
                print(f"{label} ERR {e}")
            except Exception as e:
                failed[p["id"]] = f"{type(e).__name__}: {str(e)[:100]}"
                save_json(FAILED, failed)
                print(f"{label} ERR {type(e).__name__}")

            await asyncio.sleep(random.uniform(3.5, 7.0))

        await browser.close()

    print()
    print(f"Done. Total captured: {len(images)}, total failed: {len(failed)}")
    print(f"Next: npx ts-node scripts/merge-product-images.ts")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        sys.exit(130)
