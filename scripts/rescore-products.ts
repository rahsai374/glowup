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

const MAX_TAG_BOOST = Math.max(...Object.values(TAG_BONUS));

function tagBoost(tags: string[]): number {
  return tags.reduce((sum, t) => sum + (TAG_BONUS[t] ?? 0), 0);
}

function isRelevant(s: ProductSuitability): boolean {
  return s === 'excellent' || s === 'good';
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
  const headroom = isRelevant(match.suitability) ? MAX_TAG_BOOST : 0;
  const projectedSpan = Math.max(0, band.max - headroom - band.min);
  const projected = band.min + t * projectedSpan;
  const boost = isRelevant(match.suitability) ? tagBoost(productTags) : 0;
  const final = Math.min(band.max, Math.round(projected + boost));
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

function maxBase(products: Product[]): number {
  return Math.max(
    ...products.flatMap(p => Object.values(p.skinTypeMatch).map(m => m.matchScore))
  );
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');

  const seedPath = path.resolve(__dirname, '..', 'data', 'products-seed.json');
  const raw = fs.readFileSync(seedPath, 'utf-8');
  const products: Product[] = JSON.parse(raw);

  const beforeMax = maxBase(products);
  if (beforeMax <= 85 && !force) {
    console.error(
      `Refusing to rescore: current max base score is ${beforeMax} (≤ 85), suggesting ` +
      `data is already rescored. Re-run with --force to override.`
    );
    process.exit(1);
  }

  const rescored = rescoreCatalog(products);
  const afterMax = maxBase(rescored);

  if (dryRun) {
    console.log(
      `[dry-run] Would rescore ${rescored.length} products. ` +
      `Max base: ${beforeMax} → ${afterMax}. No file written.`
    );
    return;
  }

  fs.writeFileSync(seedPath, JSON.stringify(rescored, null, 2) + '\n', 'utf-8');
  console.log(`Rescored ${rescored.length} products. Max base: ${beforeMax} → ${afterMax}.`);
}

if (require.main === module) {
  main();
}
