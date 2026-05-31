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
  describe('with scan data', () => {
    it('applies damping factor 0.75 to base score', () => {
      const product = makeProduct();
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 10 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(67);
    });

    it('gives +5 bonus for high severity concern match (>60)', () => {
      const product = makeProduct({ concerns: ['acne'] });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 80 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(71);
      expect(result.suitability).toBe('excellent');
      expect(result.concernMatches).toContain('acne');
    });

    it('gives +3 bonus for moderate severity (>40, <=60)', () => {
      const product = makeProduct({ concerns: ['acne'] });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 55 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(69);
      expect(result.suitability).toBe('good');
    });

    it('gives +1 bonus for low severity (<=40)', () => {
      const product = makeProduct({ concerns: ['acne'] });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 30 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(67);
    });

    it('stacks bonuses for multiple matching concerns', () => {
      const product = makeProduct({ concerns: ['dryness', 'dark_spots'] });
      const scan = makeScan({
        skin_type: 'dry',
        metrics: { ...makeScan().metrics, hydration: 25, dark_spots: 65 },
      });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(42);
      expect(result.concernMatches).toEqual(expect.arrayContaining(['dryness', 'dark_spots']));
    });

    it('caps concern bonus at 15', () => {
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
      expect(result.matchScore).toBe(81);
    });

    it('caps total score at 85', () => {
      const product = makeProduct({
        concerns: ['acne', 'dark_spots', 'dryness'],
        skinTypeMatch: {
          ...makeProduct().skinTypeMatch,
          oily: { suitability: 'excellent', matchScore: 98 },
        },
      });
      const scan = makeScan({
        metrics: { ...makeScan().metrics, blemish_prone: 90, dark_spots: 80, hydration: 20 },
      });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(85);
    });

    it('uses pigmentation composite: avg(dark_spots, 100-radiance)', () => {
      const product = makeProduct({ concerns: ['pigmentation'] });
      const scan = makeScan({
        metrics: { ...makeScan().metrics, dark_spots: 50, radiance: 30 },
      });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(69);
    });

    it('uses anti_aging composite: avg(wrinkles, 100-firmness)', () => {
      const product = makeProduct({ concerns: ['anti_aging'] });
      const scan = makeScan({
        metrics: { ...makeScan().metrics, wrinkles: 70, firmness: 20 },
      });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(71);
      expect(result.suitability).toBe('excellent');
    });

    it('uses dryness as inverted hydration: 100 - hydration', () => {
      const product = makeProduct({ concerns: ['dryness'] });
      const scan = makeScan({
        metrics: { ...makeScan().metrics, hydration: 80 },
      });
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(67);
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

  describe('suitability labels', () => {
    it('returns "excellent" for 70-85', () => {
      const product = makeProduct({ concerns: ['acne'] });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 80 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.suitability).toBe('excellent');
    });

    it('returns "good" for 55-69', () => {
      const product = makeProduct({ concerns: ['acne'] });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 30 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.suitability).toBe('good');
    });

    it('returns "caution" for 35-54', () => {
      const product = makeProduct({
        concerns: ['acne'],
        skinTypeMatch: {
          ...makeProduct().skinTypeMatch,
          oily: { suitability: 'caution', matchScore: 55 },
        },
      });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 10 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.suitability).toBe('caution');
    });

    it('returns "avoid" for <35', () => {
      const product = makeProduct({
        concerns: ['acne'],
        skinTypeMatch: {
          ...makeProduct().skinTypeMatch,
          oily: { suitability: 'avoid', matchScore: 30 },
        },
      });
      const scan = makeScan({ metrics: { ...makeScan().metrics, blemish_prone: 10 } });
      const result = getPersonalizedScore(product, scan);
      expect(result.suitability).toBe('avoid');
    });
  });

  describe('without scan data (null)', () => {
    it('returns damped static score with no concern bonus', () => {
      const product = makeProduct();
      const result = getPersonalizedScore(product, null);
      expect(result.matchScore).toBe(66);
      expect(result.concernMatches).toEqual([]);
    });

    it('derives suitability from damped score', () => {
      const product = makeProduct();
      const result = getPersonalizedScore(product, null);
      expect(result.suitability).toBe('good');
    });
  });

  describe('edge cases', () => {
    it('handles product with empty concerns array', () => {
      const product = makeProduct({ concerns: [] });
      const scan = makeScan();
      const result = getPersonalizedScore(product, scan);
      expect(result.matchScore).toBe(66);
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
  });
});
