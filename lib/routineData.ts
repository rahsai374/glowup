import { REMEDY_MAP } from './remedyData';

export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'all';
export type Concern  = 'acne' | 'dark_spots' | 'pigmentation' | 'dryness' | 'anti_aging' | 'all';
export type TimeOfDay = 'morning' | 'night' | 'weekly';

export interface Remedy {
  label: string;
  how: string;
  why: string;
}

export interface RoutineStep {
  id: string;
  title: string;
  timeOfDay: TimeOfDay;
  priority: number;
  skinTypes: SkinType[];
  concerns: Concern[];
  productId?: string;
  remedies: Remedy[];
  product: {
    name: string;
    price: string;
    tag: string;
    amazonUrl: string | null;
  };
}

export const STEP_POOL: RoutineStep[] = [
  // ─── MORNING BASE (concern: all) ────────────────────────────────────────────
  {
    id: 'morning-cleanse-oily',
    title: 'Cleanse',
    timeOfDay: 'morning',
    priority: 1,
    skinTypes: ['oily', 'combination'],
    concerns: ['all'],
    productId: 'himalaya-neem-face-wash',
    remedies: REMEDY_MAP['morning-cleanse-oily'],
    product: {
      name: 'Himalaya Purifying Neem Face Wash',
      price: '₹75',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'morning-cleanse-dry',
    title: 'Cleanse',
    timeOfDay: 'morning',
    priority: 1,
    skinTypes: ['dry', 'normal'],
    concerns: ['all'],
    productId: 'himalaya-gentle-moisturizing-face-wash',
    remedies: REMEDY_MAP['morning-cleanse-dry'],
    product: {
      name: 'Himalaya Gentle Moisturizing Face Wash',
      price: '₹75',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'morning-tone-all',
    title: 'Tone',
    timeOfDay: 'morning',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['all'],
    productId: 'dabur-gulabari-rose-water',
    remedies: REMEDY_MAP['morning-tone-all'],
    product: {
      name: 'Dabur Gulabari Rose Water',
      price: '₹90',
      tag: 'Available at any chemist or grocery store',
      amazonUrl: null,
    },
  },
  {
    id: 'morning-moisturise-oily',
    title: 'Moisturise',
    timeOfDay: 'morning',
    priority: 3,
    skinTypes: ['oily'],
    concerns: ['all'],
    productId: 'himalaya-aloe-vera-gel',
    remedies: REMEDY_MAP['morning-moisturise-oily'],
    product: {
      name: 'Himalaya Aloe Vera Gel',
      price: '₹90',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'morning-moisturise-combination',
    title: 'Moisturise',
    timeOfDay: 'morning',
    priority: 3,
    skinTypes: ['combination'],
    concerns: ['all'],
    productId: 'himalaya-aloe-vera-gel',
    remedies: REMEDY_MAP['morning-moisturise-combination'],
    product: {
      name: 'Himalaya Aloe Vera Gel',
      price: '₹90',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'morning-moisturise-dry',
    title: 'Moisturise',
    timeOfDay: 'morning',
    priority: 3,
    skinTypes: ['dry'],
    concerns: ['all'],
    productId: 'biotique-bio-honey-cream',
    remedies: REMEDY_MAP['morning-moisturise-dry'],
    product: {
      name: 'Biotique Bio Honey Cream',
      price: '₹150',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },
  {
    id: 'morning-moisturise-normal',
    title: 'Moisturise',
    timeOfDay: 'morning',
    priority: 3,
    skinTypes: ['normal'],
    concerns: ['all'],
    productId: 'himalaya-light-moisturizer',
    remedies: REMEDY_MAP['morning-moisturise-normal'],
    product: {
      name: 'Himalaya Light Moisturizer',
      price: '₹120',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'morning-sunscreen-all',
    title: 'Sunscreen',
    timeOfDay: 'morning',
    priority: 4,
    skinTypes: ['all'],
    concerns: ['all'],
    productId: 'biotique-bio-sandalwood-sunscreen',
    remedies: REMEDY_MAP['morning-sunscreen-all'],
    product: {
      name: 'Biotique Bio Sandalwood SPF 50+ Sunscreen',
      price: '₹180',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },

  // ─── NIGHT BASE (concern: all) ──────────────────────────────────────────────
  {
    id: 'night-cleanse-oily',
    title: 'Cleanse',
    timeOfDay: 'night',
    priority: 1,
    skinTypes: ['oily', 'combination'],
    concerns: ['all'],
    productId: 'khadi-neem-tulsi-face-wash',
    remedies: REMEDY_MAP['night-cleanse-oily'],
    product: {
      name: 'Khadi Natural Neem & Tulsi Face Wash',
      price: '₹180',
      tag: 'Available online',
      amazonUrl: null,
    },
  },
  {
    id: 'night-cleanse-dry',
    title: 'Cleanse',
    timeOfDay: 'night',
    priority: 1,
    skinTypes: ['dry', 'normal'],
    concerns: ['all'],
    productId: 'himalaya-gentle-moisturizing-face-wash',
    remedies: REMEDY_MAP['night-cleanse-dry'],
    product: {
      name: 'Himalaya Gentle Moisturizing Face Wash',
      price: '₹75',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'night-nourish-oily',
    title: 'Night Gel',
    timeOfDay: 'night',
    priority: 3,
    skinTypes: ['oily', 'combination'],
    concerns: ['all'],
    productId: 'himalaya-aloe-vera-gel',
    remedies: REMEDY_MAP['night-nourish-oily'],
    product: {
      name: 'Himalaya Aloe Vera Gel',
      price: '₹90',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'night-nourish-dry',
    title: 'Night Oil',
    timeOfDay: 'night',
    priority: 3,
    skinTypes: ['dry'],
    concerns: ['all'],
    productId: 'biotique-bio-almond-oil',
    remedies: REMEDY_MAP['night-nourish-dry'],
    product: {
      name: 'Biotique Bio Almond Oil',
      price: '₹150',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },
  {
    id: 'night-nourish-normal',
    title: 'Night Cream',
    timeOfDay: 'night',
    priority: 3,
    skinTypes: ['normal'],
    concerns: ['all'],
    productId: 'himalaya-revitalizing-night-cream',
    remedies: REMEDY_MAP['night-nourish-normal'],
    product: {
      name: 'Himalaya Revitalizing Night Cream',
      price: '₹220',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },

  // ─── WEEKLY BASE (concern: all) ─────────────────────────────────────────────
  {
    id: 'weekly-exfoliate-oily',
    title: 'Exfoliate',
    timeOfDay: 'weekly',
    priority: 1,
    skinTypes: ['oily', 'combination'],
    concerns: ['all'],
    productId: 'himalaya-tan-removal-walnut-scrub',
    remedies: REMEDY_MAP['weekly-exfoliate-oily'],
    product: {
      name: 'Himalaya Tan Removal Walnut Scrub',
      price: '₹120',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'weekly-exfoliate-dry',
    title: 'Exfoliate',
    timeOfDay: 'weekly',
    priority: 1,
    skinTypes: ['dry', 'normal'],
    concerns: ['all'],
    productId: 'biotique-bio-papaya-scrub',
    remedies: REMEDY_MAP['weekly-exfoliate-dry'],
    product: {
      name: 'Biotique Bio Papaya Revitalising Scrub',
      price: '₹180',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },

  // ─── ACNE CONCERN STEPS ──────────────────────────────────────────────────────
  {
    id: 'morning-acne-spot-oily',
    title: 'Spot Treatment',
    timeOfDay: 'morning',
    priority: 2,
    skinTypes: ['oily', 'combination'],
    concerns: ['acne'],
    productId: 'biotique-winter-green-anti-acne-cream',
    remedies: REMEDY_MAP['morning-acne-spot-oily'],
    product: {
      name: 'Biotique Winter Green Spot Correcting Anti-Acne Cream',
      price: '₹150',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },
  {
    id: 'morning-acne-spot-dry',
    title: 'Spot Treatment',
    timeOfDay: 'morning',
    priority: 2,
    skinTypes: ['dry', 'normal'],
    concerns: ['acne'],
    productId: 'biotique-winter-green-anti-acne-cream',
    remedies: REMEDY_MAP['morning-acne-spot-dry'],
    product: {
      name: 'Biotique Winter Green Spot Correcting Anti-Acne Cream',
      price: '₹150',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },
  {
    id: 'night-acne-mask',
    title: 'Anti-Acne Night Treatment',
    timeOfDay: 'night',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['acne'],
    productId: 'vicco-turmeric-cream',
    remedies: REMEDY_MAP['night-acne-mask'],
    product: {
      name: 'Vicco Turmeric Skin Cream',
      price: '₹95',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'weekly-acne-mask',
    title: 'Purifying Mask',
    timeOfDay: 'weekly',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['acne'],
    productId: 'himalaya-neem-face-pack',
    remedies: REMEDY_MAP['weekly-acne-mask'],
    product: {
      name: 'Himalaya Purifying Neem Face Pack',
      price: '₹100',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },

  // ─── DARK SPOTS CONCERN STEPS ────────────────────────────────────────────────
  {
    id: 'morning-dark-spots-treatment',
    title: 'Brightening Treatment',
    timeOfDay: 'morning',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['dark_spots'],
    productId: 'himalaya-clear-complexion-day-cream',
    remedies: REMEDY_MAP['morning-dark-spots-treatment'],
    product: {
      name: 'Himalaya Clear Complexion Whitening Day Cream',
      price: '₹175',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'night-dark-spots-treatment',
    title: 'Spot Fading Night Treatment',
    timeOfDay: 'night',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['dark_spots'],
    productId: 'vicco-turmeric-cream',
    remedies: REMEDY_MAP['night-dark-spots-treatment'],
    product: {
      name: 'Vicco Turmeric Skin Cream',
      price: '₹95',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'weekly-dark-spots-mask',
    title: 'Brightening Mask',
    timeOfDay: 'weekly',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['dark_spots'],
    productId: 'biotique-bio-papaya-scrub',
    remedies: REMEDY_MAP['weekly-dark-spots-mask'],
    product: {
      name: 'Biotique Bio Papaya Revitalising Scrub',
      price: '₹180',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },

  // ─── PIGMENTATION CONCERN STEPS ──────────────────────────────────────────────
  {
    id: 'morning-pigmentation-treatment',
    title: 'Even Tone Treatment',
    timeOfDay: 'morning',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['pigmentation'],
    productId: 'biotique-bio-dandelion-serum',
    remedies: REMEDY_MAP['morning-pigmentation-treatment'],
    product: {
      name: 'Biotique Bio Dandelion Youth Anti-Ageing Serum',
      price: '₹240',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },
  {
    id: 'night-pigmentation-treatment',
    title: 'Brightening Night Treatment',
    timeOfDay: 'night',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['pigmentation'],
    productId: 'vicco-turmeric-cream',
    remedies: REMEDY_MAP['night-pigmentation-treatment'],
    product: {
      name: 'Vicco Turmeric Skin Cream',
      price: '₹95',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'weekly-pigmentation-mask',
    title: 'Ubtan Brightening Mask',
    timeOfDay: 'weekly',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['pigmentation'],
    productId: 'biotique-bio-papaya-scrub',
    remedies: REMEDY_MAP['weekly-pigmentation-mask'],
    product: {
      name: 'Biotique Bio Papaya Revitalising Scrub',
      price: '₹180',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },

  // ─── DRYNESS CONCERN STEPS ───────────────────────────────────────────────────
  {
    id: 'morning-dryness-treatment',
    title: 'Hydration Boost',
    timeOfDay: 'morning',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['dryness'],
    productId: 'biotique-bio-honey-cream',
    remedies: REMEDY_MAP['morning-dryness-treatment'],
    product: {
      name: 'Biotique Bio Honey Cream',
      price: '₹150',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },
  {
    id: 'night-dryness-treatment',
    title: 'Deep Nourish',
    timeOfDay: 'night',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['dryness'],
    productId: 'biotique-bio-almond-oil',
    remedies: REMEDY_MAP['night-dryness-treatment'],
    product: {
      name: 'Biotique Bio Almond Oil',
      price: '₹150',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },
  {
    id: 'weekly-dryness-mask',
    title: 'Hydrating Mask',
    timeOfDay: 'weekly',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['dryness'],
    productId: 'biotique-bio-honey-cream',
    remedies: REMEDY_MAP['weekly-dryness-mask'],
    product: {
      name: 'Biotique Bio Honey Cream',
      price: '₹150',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },

  // ─── ANTI-AGING CONCERN STEPS ────────────────────────────────────────────────
  {
    id: 'morning-anti-aging-treatment',
    title: 'Firming Treatment',
    timeOfDay: 'morning',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['anti_aging'],
    productId: 'biotique-bio-dandelion-serum',
    remedies: REMEDY_MAP['morning-anti-aging-treatment'],
    product: {
      name: 'Biotique Bio Dandelion Youth Anti-Ageing Serum',
      price: '₹240',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },
  {
    id: 'night-anti-aging-treatment',
    title: 'Nourishing Night Treatment',
    timeOfDay: 'night',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['anti_aging'],
    productId: 'himalaya-revitalizing-night-cream',
    remedies: REMEDY_MAP['night-anti-aging-treatment'],
    product: {
      name: 'Himalaya Revitalizing Night Cream',
      price: '₹220',
      tag: 'Available at any chemist',
      amazonUrl: null,
    },
  },
  {
    id: 'weekly-anti-aging-mask',
    title: 'Firming Mask',
    timeOfDay: 'weekly',
    priority: 2,
    skinTypes: ['all'],
    concerns: ['anti_aging'],
    productId: 'biotique-bio-almond-oil',
    remedies: REMEDY_MAP['weekly-anti-aging-mask'],
    product: {
      name: 'Biotique Bio Almond Oil',
      price: '₹150',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },
];
