import { SkinType, Concern } from '@/lib/routineData';

export type ProductCategory =
  | 'cleanser'
  | 'moisturizer'
  | 'sunscreen'
  | 'serum'
  | 'toner'
  | 'exfoliator'
  | 'face_mask'
  | 'face_oil'
  | 'night_cream'
  | 'eye_cream'
  | 'lip_care'
  | 'spot_treatment';

export type ProductSuitability = 'excellent' | 'good' | 'caution' | 'avoid';

export interface SkinTypeMatch {
  suitability: ProductSuitability;
  matchScore: number;
}

export interface ProductIngredient {
  name: string;
  nameHi: string;
  benefitEn: string;
  benefitHi: string;
  rating: 'good' | 'neutral' | 'bad';
}

export interface ProductTimeline {
  weeksEn: string;
  weeksHi: string;
  resultEn: string;
  resultHi: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  concerns: Concern[];
  price: number;
  priceDisplay: string;
  size: string;
  description: string;
  imageUrl: string | null;
  tags: string[];
  rating: number;
  skinTypeMatch: Record<string, SkinTypeMatch>;
  keyIngredients: ProductIngredient[];
  improvementsEn: string[];
  improvementsHi: string[];
  warningsEn: string[];
  warningsHi: string[];
  expectedTimeline: ProductTimeline[];
}

export const CATEGORY_EMOJI: Record<ProductCategory, string> = {
  cleanser: '🧴',
  moisturizer: '💧',
  sunscreen: '☀️',
  serum: '💎',
  toner: '🌹',
  exfoliator: '✨',
  face_mask: '🧖',
  face_oil: '🫒',
  night_cream: '🌙',
  eye_cream: '👁️',
  lip_care: '💋',
  spot_treatment: '🎯',
};

export const CATEGORY_LABEL: Record<ProductCategory, { en: string; hi: string }> = {
  cleanser: { en: 'Cleanser', hi: 'क्लींज़र' },
  moisturizer: { en: 'Moisturizer', hi: 'मॉइस्चराइज़र' },
  sunscreen: { en: 'Sunscreen', hi: 'सनस्क्रीन' },
  serum: { en: 'Serum', hi: 'सीरम' },
  toner: { en: 'Toner', hi: 'टोनर' },
  exfoliator: { en: 'Exfoliator', hi: 'एक्सफोलिएटर' },
  face_mask: { en: 'Face Mask', hi: 'फेस मास्क' },
  face_oil: { en: 'Face Oil', hi: 'फेस ऑयल' },
  night_cream: { en: 'Night Cream', hi: 'नाइट क्रीम' },
  eye_cream: { en: 'Eye Cream', hi: 'आई क्रीम' },
  lip_care: { en: 'Lip Care', hi: 'लिप केयर' },
  spot_treatment: { en: 'Spot Treatment', hi: 'स्पॉट ट्रीटमेंट' },
};

export const SUITABILITY_CONFIG: Record<
  ProductSuitability,
  { labelEn: string; labelHi: string; bg: string; light: string; text: string; border: string }
> = {
  excellent: {
    labelEn: 'Excellent Match',
    labelHi: 'बेहतरीन मैच',
    bg: '#22C55E',
    light: '#F0FDF4',
    text: '#15803D',
    border: '#BBF7D0',
  },
  good: {
    labelEn: 'Good Match',
    labelHi: 'अच्छा मैच',
    bg: '#10B981',
    light: '#ECFDF5',
    text: '#047857',
    border: '#A7F3D0',
  },
  caution: {
    labelEn: 'Use With Caution',
    labelHi: 'सावधानी से उपयोग करें',
    bg: '#F97316',
    light: '#FFF7ED',
    text: '#C2410C',
    border: '#FED7AA',
  },
  avoid: {
    labelEn: 'Not Recommended',
    labelHi: 'अनुशंसित नहीं',
    bg: '#EF4444',
    light: '#FEF2F2',
    text: '#B91C1C',
    border: '#FECACA',
  },
};
