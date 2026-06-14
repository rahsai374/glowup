import * as fs from 'fs';
import * as path from 'path';
import type { Product, SkinTypeMatch, ProductSuitability } from '../lib/productTypes';

const BANDS: Record<ProductSuitability, { min: number; max: number }> = {
  excellent: { min: 78, max: 85 },
  good:      { min: 65, max: 77 },
  caution:   { min: 45, max: 59 },
  avoid:     { min: 25, max: 44 },
};

const TAG_BONUS: Record<string, number> = {
  'dermat-recommended': 3,
  'premium-budget': 2,
  'bestseller': 1,
};

function tagBoost(tags: string[]): number {
  return tags.reduce((sum, t) => sum + (TAG_BONUS[t] ?? 0), 0);
}

export function rescoreSkinMatch(
  match: SkinTypeMatch,
  productTags: string[]
): SkinTypeMatch {
  const band = BANDS[match.suitability];
  const sourceMin: Record<ProductSuitability, number> = {
    excellent: 70, good: 55, caution: 35, avoid: 0,
  };
  const sourceMax: Record<ProductSuitability, number> = {
    excellent: 100, good: 89, caution: 64, avoid: 44,
  };
  const sMin = sourceMin[match.suitability];
  const sMax = sourceMax[match.suitability];
  const t = Math.min(1, Math.max(0, (match.matchScore - sMin) / Math.max(1, sMax - sMin)));
  const projected = band.min + t * (band.max - band.min);
  const boosted = projected + tagBoost(productTags);
  const final = Math.min(band.max, Math.round(boosted));
  return { suitability: match.suitability, matchScore: final };
}

function rescoreCatalog(products: Product[]): Product[] {
  return products.map((p) => ({
    ...p,
    skinTypeMatch: Object.fromEntries(
      Object.entries(p.skinTypeMatch).map(([skin, match]) => [
        skin,
        rescoreSkinMatch(match, p.tags),
      ])
    ),
  }));
}

function main() {
  const seedPath = path.resolve(__dirname, '..', 'data', 'products-seed.json');
  const raw = fs.readFileSync(seedPath, 'utf-8');
  const products: Product[] = JSON.parse(raw);
  const rescored = rescoreCatalog(products);
  fs.writeFileSync(seedPath, JSON.stringify(rescored, null, 2) + '\n', 'utf-8');
  console.log(`Rescored ${rescored.length} products. Max base score: ${
    Math.max(...rescored.flatMap(p => Object.values(p.skinTypeMatch).map(m => m.matchScore)))
  }`);
}

if (require.main === module) {
  main();
}
