import * as fs from 'fs';
import * as path from 'path';

const SEED = path.resolve(__dirname, '..', 'data', 'products-seed.json');
const IMAGES = path.resolve(__dirname, '..', 'data', 'product-images.json');

function main() {
  if (!fs.existsSync(IMAGES)) {
    console.error(`Missing ${IMAGES}. Run scripts/scrape-product-images.py first.`);
    process.exit(1);
  }

  const products: Array<{ id: string; imageUrl: string | null }> = JSON.parse(
    fs.readFileSync(SEED, 'utf-8')
  );
  const images: Record<string, string> = JSON.parse(fs.readFileSync(IMAGES, 'utf-8'));

  let updated = 0;
  let skipped = 0;
  for (const p of products) {
    const url = images[p.id];
    if (!url) continue;
    if (p.imageUrl === url) {
      skipped++;
      continue;
    }
    p.imageUrl = url;
    updated++;
  }

  fs.writeFileSync(SEED, JSON.stringify(products, null, 2) + '\n', 'utf-8');
  const missing = products.filter((p) => !p.imageUrl).length;
  console.log(
    `Updated: ${updated}, already-set: ${skipped}, still missing imageUrl: ${missing} / ${products.length}`
  );
}

main();
