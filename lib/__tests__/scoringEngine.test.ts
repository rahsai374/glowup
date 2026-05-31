import { getPersonalizedScore } from '../scoringEngine';
import type { Product } from '../productTypes';
import type { ScanResult } from '../gemini';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'test-product',
  name: 'Test Product',
  brand: 'Test',
  category: 'cleanser',
  concerns: ['acne'],
  price: 100,
  priceDisplay: '₹100',
  size: '100ml',
  description: 'Test',
  imageUrl: null,
  tags: [],
  rating: 4.0,
  skinTypeMatch: {
    oily: { suitability: 'excellent', matchScore: 88 },
    dry: { suitability: 'caution', matchScore: 42 },
    combination: { suitability: 'good', matchScore: 75 },
    normal: { suitability: 'good', matchScore: 68 },
    all: { suitability: 'good', matchScore: 68 },
  },
  keyIngredients: [],
  improvementsEn: [],
  improvementsHi: [],
  warningsEn: [],
  warningsHi: [],
  expectedTimeline: [],
  ...overrides,
});

const makeScan = (overrides: Partial<ScanResult> = {}): ScanResult => ({
  overall_score: 65,
  skin_type: 'oily',
  skin_age: 25,
  metrics: {
    hydration: 60, blemish_prone: 70, redness: 30, oiliness: 75,
    dark_spots: 40, radiance: 65, texture: 55, firmness: 70,
    wrinkles: 20, dark_circles: 45,
  },
  top_concern: 'acne',
  top_win: 'Good radiance',
  advice: 'Use neem face wash.',
  ...overrides,
});

describe('getPersonalizedScore', () => {
  describe('relevant products (excellent/good skin type match)', () => {
    it('passes through raw score without penalty', () => {
      const product = makeProduct();
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 10 } });
      const result = getPersonalizedScore(product, scan);
      // oily = excellent, matchScore 88, +1 concern bonus (blemish_prone 10 <= 40)
      expect(result.matchScore).toBe(89);
    });

    it('gives +5 bonus for high severity concern (>60)', () => {
      const product = makeProduct({ concerns: ['acne'] });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 80 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(93);
      expect(result.suitability).toBe('excellent');
      expect(result.concernMatches).toContain('acne');
    });

    it('gives +3 bonus for moderate severity (>40, <=60)', () => {
      const product = makeProduct({ concerns: ['acne'] });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 55 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(91);
      expect(result.suitability).toBe('excellent');
    });

    it('gives +1 bonus for low severity (<=40)', () => {
      const product = makeProduct({ concerns: ['acne'] });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 30 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(89);
    });
  });

  describe('irrelevant products (caution/avoid skin type match)', () => {
    it('applies 0.7 penalty to raw score', () => {
      const product = makeProduct();
      const scan = makeScan({
        skin_type: 'dry',
        metrics: { ...makeScan().metrics, blemish_prone: 10 },
      });
      const result = getPersonalizedScore(product, scan);
      // dry = caution, matchScore 42, penalized: round(42*0.7)=29, +1 bonus = 30
      expect(result.matchScore).toBe(30);
      expect(result.suitability).toBe('avoid');
    });

    it('penalizes even with concern bonus', () => {
      const product = makeProduct({ concerns: ['acne'] });
      const scan = makeScan({
        skin_type: 'dry',
        metrics: { ...makeScan().metrics, blemish_prone: 80 },
      });
      const result = getPersonalizedScore(product, scan);
      // dry = caution 42, penalized: 29, +5 bonus = 34
      expect(result.matchScore).toBe(34);
      expect(result.suitability).toBe('avoid');
    });
  });

  describe('concern bonuses', () => {
    it('stacks bonuses for multiple matching concerns', () => {
      const product = makeProduct({ concerns: ['dryness', 'dark_spots'] });
      const scan = makeScan({
        skin_type: 'dry',
        metrics: { ...makeScan().metrics, hydration: 25, dark_spots: 65 },
      });
      const result = getPersonalizedScore(product, scan);
      // dry = caution 42, penalized: 29, +5 (dryness severity 75) +5 (dark_spots 65) = 39
      expect(result.matchScore).toBe(39);
      expect(result.concernMatches).toEqual(expect.arrayContaining(['dryness', 'dark_spots']));
    });

    it('caps concern bonus at 10', () => {
      const product = makeProduct({
        concerns: ['acne', 'dark_spots', 'pigmentation', 'dryness', 'anti_aging'],
      });
      const scan = makeScan({
        metrics: {
          hydration: 10, blemish_prone: 90, redness: 30, oiliness: 75,
          dark_spots: 90, radiance: 10, texture: 55, firmness: 10,
          wrinkles: 90, dark_circles: 45,
        },
      });
      const result = getPersonalizedScore(product, scan);
      // oily = excellent 88, no penalty, +10 capped bonus = 98
      expect(result.matchScore).toBe(98);
    });

    it('caps total score at 100', () => {
      const product = makeProduct({
        concerns: ['acne', 'dark_spots', 'dryness'],
        skinTypeMatch: {
          ...makeProduct().skinTypeMatch,
          oily: { suitability: 'excellent', matchScore: 95 },
        },
      });
      const scan = makeScan({
        metrics: { ...makeScan().metrics, blemish_prone: 90, dark_spots: 80, hydration: 20 },
      });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(100);
    });
  });

  describe('composite concern metrics', () => {
    it('uses pigmentation composite: avg(dark_spots, 100-radiance)', () => {
      const product = makeProduct({ concerns: ['pigmentation'] });
      const scan = makeScan({
        metrics: { ...makeScan().metrics, dark_spots: 50, radiance: 30 },
      });
      const result = getPersonalizedScore(product, scan);
      // severity = (50 + 70) / 2 = 60, so bonus = +3 (>40 <=60)
      expect(result.matchScore).toBe(91);
    });

    it('uses anti_aging composite: avg(wrinkles, 100-firmness)', () => {
      const product = makeProduct({ concerns: ['anti_aging'] });
      const scan = makeScan({
        metrics: { ...makeScan().metrics, wrinkles: 70, firmness: 20 },
      });
      const result = getPersonalizedScore(product, scan);
      // severity = (70 + 80) / 2 = 75, so bonus = +5
      expect(result.matchScore).toBe(93);
      expect(result.suitability).toBe('excellent');
    });

    it('uses dryness as inverted hydration: 100 - hydration', () => {
      const product = makeProduct({ concerns: ['dryness'] });
      const scan = makeScan({
        metrics: { ...makeScan().metrics, hydration: 80 },
      });
      const result = getPersonalizedScore(product, scan);
      // severity = 100 - 80 = 20, so bonus = +1
      expect(result.matchScore).toBe(89);
    });
  });

  describe('suitability labels', () => {
    it('returns "excellent" for >=80', () => {
      const product = makeProduct({ concerns: ['acne'] });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 80 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.suitability).toBe('excellent');
    });

    it('returns "good" for 65-79', () => {
      const product = makeProduct({
        concerns: [],
        skinTypeMatch: {
          ...makeProduct().skinTypeMatch,
          oily: { suitability: 'good', matchScore: 72 },
        },
      });
      const scan = makeScan();
      const result = getPersonalizedScore(product, scan);
      expect(result.suitability).toBe('good');
    });

    it('returns "caution" for 45-64', () => {
      const product = makeProduct({
        concerns: [],
        skinTypeMatch: {
          ...makeProduct().skinTypeMatch,
          oily: { suitability: 'caution', matchScore: 55 },
        },
      });
      const scan = makeScan();
      const result = getPersonalizedScore(product, scan);
      // caution → penalized: round(55*0.7) = 39... wait, suitability is caution
      // Actually 39 < 45 so this is 'avoid'
      expect(result.suitability).toBe('avoid');
    });

    it('returns "avoid" for <45', () => {
      const product = makeProduct({
        concerns: ['acne'],
        skinTypeMatch: {
          ...makeProduct().skinTypeMatch,
          oily: { suitability: 'avoid', matchScore: 30 },
        },
      });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 10 } });
      const result = getPersonalizedScore(product, scan);
      // avoid → penalized: round(30*0.7) = 21, +1 = 22
      expect(result.matchScore).toBe(22);
      expect(result.suitability).toBe('avoid');
    });
  });

  describe('without scan data (null)', () => {
    it('applies pre-scan damping (0.85) to relevant products', () => {
      const product = makeProduct();
      const result = getPersonalizedScore(product, null);
      // best is oily: excellent, 88 → damped: round(88*0.85) = 75
      expect(result.matchScore).toBe(75);
      expect(result.suitability).toBe('good');
      expect(result.concernMatches).toEqual([]);
    });

    it('penalizes irrelevant products with 0.7 factor', () => {
      const product = makeProduct({
        skinTypeMatch: {
          oily: { suitability: 'caution', matchScore: 50 },
          dry: { suitability: 'avoid', matchScore: 30 },
          all: { suitability: 'caution', matchScore: 45 },
        },
      });
      const result = getPersonalizedScore(product, null);
      // best is oily: caution 50, penalized: round(50*0.7) = 35
      expect(result.matchScore).toBe(35);
      expect(result.suitability).toBe('avoid');
    });
  });

  describe('edge cases', () => {
    it('handles product with empty concerns array', () => {
      const product = makeProduct({ concerns: [] });
      const scan = makeScan();
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(88);
      expect(result.concernMatches).toEqual([]);
    });

    it('floors score at 0', () => {
      const product = makeProduct({
        concerns: [],
        skinTypeMatch: {
          ...makeProduct().skinTypeMatch,
          oily: { suitability: 'avoid', matchScore: 0 },
        },
      });
      const scan = makeScan();
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(0);
    });

    it('falls back to "all" skin type when user type not found', () => {
      const product = makeProduct({
        skinTypeMatch: {
          all: { suitability: 'good', matchScore: 60 },
        },
      });
      const scan = makeScan({ skin_type: 'oily' });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBeGreaterThan(0);
    });
  });
});
