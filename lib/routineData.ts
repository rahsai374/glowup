export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'all';
export type Concern  = 'acne' | 'dark_spots' | 'pigmentation' | 'dryness' | 'anti_aging' | 'all';
export type TimeOfDay = 'morning' | 'night' | 'weekly';

export interface RoutineStep {
  id: string;
  title: string;
  timeOfDay: TimeOfDay;
  priority: number;
  skinTypes: SkinType[];
  concerns: Concern[];
  productId?: string;  // references Product.id in catalog
  remedy: {
    label: string;
    how: string;
  };
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
    remedy: {
      label: 'Besan + rose water',
      how: 'Mix 1 tsp besan with enough rose water to form a paste. Massage gently in circles for 60s, rinse with cold water.',
    },
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
    remedy: {
      label: 'Raw milk + honey wash',
      how: 'Mix 1 tbsp raw milk with 4–5 drops of honey. Apply gently, rinse with lukewarm water.',
    },
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
    remedy: {
      label: 'Rose water spritz',
      how: 'Pour chilled rose water into a small spray bottle. Spritz on face or apply with cotton pad after cleansing.',
    },
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
    remedy: {
      label: 'Fresh aloe vera gel',
      how: 'Scoop fresh gel from an aloe leaf or use store aloe. Apply a thin layer on face, let absorb for 2 mins.',
    },
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
    remedy: {
      label: 'Aloe vera gel (T-zone focus)',
      how: 'Apply aloe vera gel only on the T-zone (forehead, nose, chin). Use a light touch on cheeks.',
    },
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
    remedy: {
      label: 'Coconut oil + rose water blend',
      how: 'Mix 4–5 drops of coconut oil with 1 tsp rose water in palm. Pat gently onto damp skin.',
    },
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
    remedy: {
      label: 'Aloe vera + 2 drops coconut oil',
      how: 'Mix aloe vera gel with a tiny amount of coconut oil. Apply evenly and let absorb.',
    },
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
    remedy: {
      label: 'Zinc oxide DIY (optional)',
      how: 'Mix 1 tsp zinc oxide powder (available at any chemist) into your moisturizer for basic SPF. Not a substitute for dedicated sunscreen outdoors.',
    },
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
    remedy: {
      label: 'Multani mitti wash',
      how: 'Mix 1 tsp multani mitti with rose water. Apply, leave 2 mins, rinse. Removes excess oil without stripping.',
    },
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
    remedy: {
      label: 'Curd + honey cleanser',
      how: 'Mix 1 tsp fresh curd with 4 drops honey. Massage in, rinse with cool water. Keeps skin soft.',
    },
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
    remedy: {
      label: 'Aloe vera gel overnight',
      how: 'Apply fresh aloe vera gel as a thin layer before sleep. Wipe off excess in morning if needed.',
    },
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
    remedy: {
      label: 'Warm coconut oil massage',
      how: 'Warm a few drops of coconut oil between palms. Massage upward on face for 2–3 mins before sleep.',
    },
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
    remedy: {
      label: 'Aloe vera + 2 drops castor oil',
      how: 'Mix aloe gel with a drop or two of castor oil. Apply evenly and sleep.',
    },
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
    remedy: {
      label: 'Multani mitti + neem mask',
      how: 'Mix 2 tsp multani mitti, 1 tsp neem powder, rose water. Apply, leave 10 mins, rinse. Do once a week max.',
    },
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
    remedy: {
      label: 'Curd + sugar scrub',
      how: 'Mix 1 tsp sugar with 1 tbsp curd. Gently scrub in circles for 30–45s. Rinse. Do once a week only.',
    },
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
    remedy: {
      label: 'Neem + haldi paste on spots',
      how: 'Mix a pinch of haldi with neem powder and water. Apply only on pimples, leave 10 mins, rinse before moisturizer.',
    },
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
    remedy: {
      label: 'Honey + neem spot dot',
      how: 'Dab a tiny bit of raw honey mixed with neem oil on individual spots. Leave 15 mins, rinse gently.',
    },
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
    remedy: {
      label: 'Vicco turmeric overnight spot',
      how: 'Apply a thin layer of Vicco turmeric cream on problem areas. Its natural antiseptic formula works overnight.',
    },
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
    remedy: {
      label: 'Multani mitti + neem + haldi',
      how: 'Mix 2 tsp multani mitti, 1 tsp neem powder, pinch of haldi, rose water. Apply 10–12 mins. Rinse with cold water.',
    },
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
    remedy: {
      label: 'Potato juice + rose water',
      how: 'Grate 1 potato, squeeze juice. Mix with equal rose water. Apply with cotton on dark spots, leave 15 mins, rinse.',
    },
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
    remedy: {
      label: 'Haldi + honey paste on spots',
      how: 'Mix a pinch of haldi with raw honey. Dab only on dark spots. Leave overnight or 30 mins, rinse.',
    },
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
    remedy: {
      label: 'Papaya pulp mask',
      how: 'Mash ripe papaya and apply as a face mask. Leave 15 mins. Papaya enzymes gently brighten skin.',
    },
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
    remedy: {
      label: 'Kasturi haldi + curd paste',
      how: 'Mix ½ tsp kasturi haldi (not regular haldi) with 1 tsp curd. Apply on full face, leave 15 mins, rinse.',
    },
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
    remedy: {
      label: 'Besan + kasturi haldi + curd ubtan',
      how: 'Mix 1 tsp besan, pinch kasturi haldi, 1 tsp curd. Apply to face, leave 20 mins, rinse. Classic Indian ubtan.',
    },
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
    remedy: {
      label: 'Besan + kasturi haldi + saffron milk',
      how: 'Mix 2 tsp besan, pinch kasturi haldi, 2–3 saffron strands soaked in 1 tsp warm milk. Apply, dry 15 mins, scrub off gently.',
    },
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
    remedy: {
      label: 'Glycerin + rose water',
      how: 'Mix 3 drops of glycerin (₹30 at any chemist) with rose water. Pat on damp skin before moisturizer.',
    },
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
    remedy: {
      label: 'Warm coconut + almond oil blend',
      how: 'Mix equal parts coconut oil and almond oil. Warm slightly. Massage onto face in upward strokes. Sleep with it on.',
    },
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
    remedy: {
      label: 'Curd + honey + aloe mask',
      how: 'Mix 1 tbsp curd, 1 tsp honey, 1 tsp aloe vera gel. Apply thickly. Leave 20 mins, rinse with cool water.',
    },
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
    remedy: {
      label: 'Upward facial massage with almond oil',
      how: 'Warm 3–4 drops almond oil between palms. Using fingertips, massage in upward circular motions for 3 mins. Improves circulation.',
    },
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
    remedy: {
      label: 'Castor + coconut oil blend',
      how: 'Mix 1 part castor oil with 2 parts coconut oil. Apply before sleep. Castor oil is rich in fatty acids for skin repair.',
    },
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
    remedy: {
      label: 'Egg white + honey mask',
      how: 'Beat 1 egg white with 1 tsp honey. Apply in upward strokes. Leave until dry (10–12 mins). Rinse with cool water.',
    },
    product: {
      name: 'Biotique Bio Almond Oil',
      price: '₹150',
      tag: 'Available at chemists and online',
      amazonUrl: null,
    },
  },
];
