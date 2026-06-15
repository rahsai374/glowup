/**
 * Retranslate Devanagari Hindi → Roman Hindi per CLAUDE.md rule:
 *   "Hindi translations use Roman Hindi (transliterated script like 'karo',
 *    'karne ke liye') + English terms — not Devanagari."
 *
 * Strategy: for each product, collect all `*Hi` strings paired with their
 * `*En` siblings, send to Gemini 2.5 Flash with strict instructions to
 * return parallel Roman-Hindi strings, write back, save after EACH product
 * so the run is resumable.
 *
 * Run:
 *   npx ts-node scripts/retranslate-hindi.ts          # all products
 *   npx ts-node scripts/retranslate-hindi.ts --limit 3
 *   npx ts-node scripts/retranslate-hindi.ts --only minimalist-peptide-eye-cream
 */
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const SEED = path.resolve(__dirname, '..', 'data', 'products-seed.json');
const CHECKPOINT = path.resolve(__dirname, '..', 'data', 'hindi-retranslate-checkpoint.json');

const DEVANAGARI = /[ऀ-ॿ]/;

interface Pair { en: string; hi: string; path: string }

function collectPairs(product: any): Pair[] {
  const pairs: Pair[] = [];
  const pushPair = (en: string, hi: string, p: string) => {
    if (typeof en === 'string' && typeof hi === 'string' && DEVANAGARI.test(hi)) {
      pairs.push({ en, hi, path: p });
    }
  };

  (product.improvementsEn ?? []).forEach((en: string, i: number) => {
    pushPair(en, product.improvementsHi?.[i], `improvementsHi[${i}]`);
  });
  (product.warningsEn ?? []).forEach((en: string, i: number) => {
    pushPair(en, product.warningsHi?.[i], `warningsHi[${i}]`);
  });
  (product.keyIngredients ?? []).forEach((ing: any, i: number) => {
    pushPair(ing.name, ing.nameHi, `keyIngredients[${i}].nameHi`);
    pushPair(ing.benefitEn, ing.benefitHi, `keyIngredients[${i}].benefitHi`);
  });
  (product.expectedTimeline ?? []).forEach((t: any, i: number) => {
    pushPair(t.weeksEn, t.weeksHi, `expectedTimeline[${i}].weeksHi`);
    pushPair(t.resultEn, t.resultHi, `expectedTimeline[${i}].resultHi`);
  });
  return pairs;
}

function applyPair(product: any, p: string, value: string) {
  // Tiny path resolver for our known shapes.
  const arrMatch = p.match(/^([a-zA-Z]+)\[(\d+)\]$/);
  if (arrMatch) {
    const [, key, idx] = arrMatch;
    product[key][Number(idx)] = value;
    return;
  }
  const nestedMatch = p.match(/^([a-zA-Z]+)\[(\d+)\]\.([a-zA-Z]+)$/);
  if (nestedMatch) {
    const [, key, idx, sub] = nestedMatch;
    product[key][Number(idx)][sub] = value;
    return;
  }
  throw new Error(`Unsupported path: ${p}`);
}

const PROMPT = (pairs: Pair[]) => `You convert Devanagari Hindi to Roman-Hindi for a skincare app.

RULES (strict — follow EXACTLY):
1. Use Roman script (English letters), NOT Devanagari (हिंदी).
2. Common English skincare/beauty terms stay in English: skin, pimples, acne, oily, dry, breakout, glow, redness, moisturizer, cleanser, serum, exfoliator, sensitive, irritation, etc.
3. Hindi verbs/connectors/everyday words are transliterated: karo, hota hai, karne ke liye, ke saath, kam, zyada, halka, mat karo, nahi.
4. Tone: casual everyday speaking Hindi as written in WhatsApp messages — NOT formal/literary.
5. Numbers stay as digits ("1 week" → "1 hafta", not "ek hafta").
6. Preserve special chars (₹, %, °, +, /, etc.) from the English source.
7. Output ONLY a JSON array of strings, same length and order as input. No commentary.

INPUT (English → existing Devanagari Hindi pairs, you produce Roman-Hindi for each):
${JSON.stringify(pairs.map(p => ({ en: p.en, currentHi: p.hi })), null, 2)}

OUTPUT: JSON array of ${pairs.length} Roman-Hindi strings in the same order.`;

async function translate(model: any, pairs: Pair[]): Promise<string[]> {
  const result = await model.generateContent(PROMPT(pairs));
  const text = result.response.text().trim();
  // Strip ```json fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const arr = JSON.parse(cleaned);
  if (!Array.isArray(arr) || arr.length !== pairs.length) {
    throw new Error(`Expected ${pairs.length} strings, got ${arr.length}`);
  }
  if (arr.some(s => typeof s !== 'string' || DEVANAGARI.test(s))) {
    throw new Error('Gemini returned Devanagari or non-string entries');
  }
  return arr;
}

async function main() {
  const args = process.argv.slice(2);
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : null;
  const onlyIdx = args.indexOf('--only');
  const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    console.error('Missing EXPO_PUBLIC_GEMINI_API_KEY in .env');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const products: any[] = JSON.parse(fs.readFileSync(SEED, 'utf-8'));
  const checkpoint: { done: string[] } = fs.existsSync(CHECKPOINT)
    ? JSON.parse(fs.readFileSync(CHECKPOINT, 'utf-8'))
    : { done: [] };
  const done = new Set(checkpoint.done);

  let candidates = products.filter(p => {
    if (only) return p.id === only;
    if (done.has(p.id)) return false;
    return collectPairs(p).length > 0;
  });
  if (limit) candidates = candidates.slice(0, limit);

  console.log(`Retranslating ${candidates.length} of ${products.length} products (${done.size} already done)`);

  let ok = 0;
  let failed = 0;
  const failures: { id: string; err: string }[] = [];

  for (let i = 0; i < candidates.length; i++) {
    const p = candidates[i];
    const pairs = collectPairs(p);
    const label = `[${(i + 1).toString().padStart(3)}/${candidates.length}] ${p.id.padEnd(45)} (${pairs.length} strings)`;

    let attempt = 0;
    let success = false;
    while (attempt < 3 && !success) {
      attempt++;
      try {
        const translations = await translate(model, pairs);
        pairs.forEach((pp, idx) => applyPair(p, pp.path, translations[idx]));
        done.add(p.id);
        fs.writeFileSync(SEED, JSON.stringify(products, null, 2) + '\n', 'utf-8');
        fs.writeFileSync(CHECKPOINT, JSON.stringify({ done: [...done] }, null, 2), 'utf-8');
        console.log(`${label} OK`);
        ok++;
        success = true;
      } catch (e: any) {
        if (attempt >= 3) {
          console.log(`${label} FAIL (${attempt} tries): ${e.message}`);
          failed++;
          failures.push({ id: p.id, err: e.message });
        } else {
          await new Promise(r => setTimeout(r, 1500 * attempt));
        }
      }
    }

    // Gentle pacing to be polite to the API
    await new Promise(r => setTimeout(r, 300));
  }

  console.log();
  console.log(`Done. Translated: ${ok}, failed: ${failed}, total processed across runs: ${done.size}`);
  if (failures.length) {
    console.log('Failures:');
    failures.forEach(f => console.log(`  ${f.id}: ${f.err}`));
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
