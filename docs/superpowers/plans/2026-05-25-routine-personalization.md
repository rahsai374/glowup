# Routine Personalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded routine screen with a heuristic-based personalized routine driven by the user's scan result (skin type + top concern), featuring Indian home remedies and affordable drugstore products, plus a "Scan first" empty state when no scan exists.

**Architecture:** A flat step pool of 31 pre-seeded steps (in `lib/routineData.ts`) is filtered at runtime by skin type and concern via a pure `getRoutine()` function (`lib/routineEngine.ts`). The routine screen reads from `useScanStore`, calls `getRoutine()`, and renders personalized cards. No additional AI call is made. The Gemini prompt is updated to constrain `top_concern` to an enum so no fuzzy string matching is needed.

**Tech Stack:** TypeScript, Zustand (useScanStore), React Native, Expo Router, react-native-reanimated, i18next, Jest (unit tests for pure engine logic)

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `lib/gemini.ts` | Constrain `top_concern` to enum in Gemini prompt |
| Create | `lib/routineData.ts` | `RoutineStep` type + 31-step `STEP_POOL` |
| Create | `lib/routineEngine.ts` | `validateConcern()` + `getRoutine()` pure functions |
| Create | `lib/__tests__/routineEngine.test.ts` | Unit tests for engine logic |
| Modify | `i18n/en.json` | Add 3 empty-state string keys |
| Modify | `i18n/hi.json` | Add 3 empty-state string keys in Hindi |
| Modify | `app/routine.tsx` | Full rewrite — personalized steps + empty state |

---

## Task 1: Constrain `top_concern` in Gemini prompt

**Files:**
- Modify: `lib/gemini.ts`

- [ ] **Step 1: Update the prompt string**

In `lib/gemini.ts`, find the prompt template and change the `top_concern` line:

```ts
// Before (line ~56):
  "top_concern": "<string>",

// After:
  "top_concern": "<acne|dark_spots|pigmentation|dryness|anti_aging>",
```

Full updated prompt block (replace lines 34–60):

```ts
  const prompt = `You are a skin analysis AI. Analyze this face photo carefully.

User context:
- Main concern: ${mainConcern}
- Self-reported skin type: ${skinType}

Return ONLY valid JSON with no markdown, no explanation:
{
  "overall_score": <0-100>,
  "skin_type": "<oily|dry|combination|normal>",
  "skin_age": <number>,
  "metrics": {
    "hydration": <0-100>,
    "blemish_prone": <0-100>,
    "redness": <0-100>,
    "oiliness": <0-100>,
    "dark_spots": <0-100>,
    "radiance": <0-100>,
    "texture": <0-100>,
    "firmness": <0-100>,
    "wrinkles": <0-100>,
    "dark_circles": <0-100>
  },
  "top_concern": "<acne|dark_spots|pigmentation|dryness|anti_aging>",
  "top_win": "<string>",
  "advice": "<2 sentences max>"
}`;
```

- [ ] **Step 2: Commit**

```bash
git add lib/gemini.ts
git commit -m "fix: constrain top_concern to enum in Gemini prompt"
```

---

## Task 2: Create the step pool (`lib/routineData.ts`)

**Files:**
- Create: `lib/routineData.ts`

- [ ] **Step 1: Create the file with types and full 31-step pool**

Create `lib/routineData.ts` with this exact content:

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add lib/routineData.ts
git commit -m "feat: add routine step pool with 31 seeded steps"
```

---

## Task 3: Create the routine engine + tests (`lib/routineEngine.ts`)

**Files:**
- Create: `lib/routineEngine.ts`
- Create: `lib/__tests__/routineEngine.test.ts`

- [ ] **Step 1: Write the failing tests first**

Create `lib/__tests__/routineEngine.test.ts`:

```ts
import { validateConcern, getRoutine } from '../routineEngine';

describe('validateConcern', () => {
  it('returns valid concern as-is', () => {
    expect(validateConcern('acne')).toBe('acne');
    expect(validateConcern('dark_spots')).toBe('dark_spots');
    expect(validateConcern('pigmentation')).toBe('pigmentation');
    expect(validateConcern('dryness')).toBe('dryness');
    expect(validateConcern('anti_aging')).toBe('anti_aging');
  });

  it('returns all for any unknown string', () => {
    expect(validateConcern('random string')).toBe('all');
    expect(validateConcern('')).toBe('all');
    expect(validateConcern('uneven skin tone')).toBe('all');
  });
});

describe('getRoutine', () => {
  it('returns steps grouped by time of day', () => {
    const result = getRoutine('oily', 'acne');
    expect(result).toHaveProperty('morning');
    expect(result).toHaveProperty('night');
    expect(result).toHaveProperty('weekly');
  });

  it('morning steps include oily cleanser for oily skin', () => {
    const { morning } = getRoutine('oily', 'acne');
    expect(morning.some(s => s.id === 'morning-cleanse-oily')).toBe(true);
  });

  it('does not include oily cleanser for dry skin', () => {
    const { morning } = getRoutine('dry', 'acne');
    expect(morning.some(s => s.id === 'morning-cleanse-oily')).toBe(false);
    expect(morning.some(s => s.id === 'morning-cleanse-dry')).toBe(true);
  });

  it('includes concern-specific steps when concern matches', () => {
    const { morning } = getRoutine('oily', 'acne');
    expect(morning.some(s => s.id === 'morning-acne-spot-oily')).toBe(true);
  });

  it('does not include acne steps when concern is dryness', () => {
    const { morning } = getRoutine('oily', 'dryness');
    expect(morning.some(s => s.id === 'morning-acne-spot-oily')).toBe(false);
    expect(morning.some(s => s.id === 'morning-dryness-treatment')).toBe(true);
  });

  it('steps are sorted by priority within each slot', () => {
    const { morning } = getRoutine('oily', 'acne');
    for (let i = 1; i < morning.length; i++) {
      expect(morning[i].priority).toBeGreaterThanOrEqual(morning[i - 1].priority);
    }
  });

  it('every skin type + concern combo has at least 2 morning and 2 night steps', () => {
    const skinTypes = ['oily', 'dry', 'combination', 'normal'] as const;
    const concerns = ['acne', 'dark_spots', 'pigmentation', 'dryness', 'anti_aging', 'all'] as const;
    for (const st of skinTypes) {
      for (const c of concerns) {
        const { morning, night, weekly } = getRoutine(st, c);
        expect(morning.length).toBeGreaterThanOrEqual(2);
        expect(night.length).toBeGreaterThanOrEqual(2);
        expect(weekly.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('unknown concern falls back to all-concern routine', () => {
    const result1 = getRoutine('oily', 'all');
    const result2 = getRoutine('oily', 'unknown_thing');
    expect(result1.morning.length).toBe(result2.morning.length);
    expect(result1.night.length).toBe(result2.night.length);
  });
});
```

- [ ] **Step 2: Run the tests — expect them to fail**

```bash
npx jest lib/__tests__/routineEngine.test.ts --no-coverage
```

Expected: `Cannot find module '../routineEngine'`

- [ ] **Step 3: Create `lib/routineEngine.ts`**

```ts
import { STEP_POOL, RoutineStep, SkinType, Concern } from './routineData';

const VALID_CONCERNS: Concern[] = [
  'acne', 'dark_spots', 'pigmentation', 'dryness', 'anti_aging',
];

export function validateConcern(raw: string): Concern {
  return (VALID_CONCERNS as string[]).includes(raw) ? (raw as Concern) : 'all';
}

export interface RoutineByTime {
  morning: RoutineStep[];
  night: RoutineStep[];
  weekly: RoutineStep[];
}

export function getRoutine(skinType: string, topConcern: string): RoutineByTime {
  const concern = validateConcern(topConcern);
  const st = skinType as SkinType;

  const matchesStep = (step: RoutineStep): boolean => {
    const skinMatch =
      step.skinTypes.includes(st) || step.skinTypes.includes('all');
    const concernMatch =
      step.concerns.includes(concern) || step.concerns.includes('all');
    return skinMatch && concernMatch;
  };

  const sorted = STEP_POOL.filter(matchesStep).sort(
    (a, b) => a.priority - b.priority
  );

  const morning = sorted.filter(s => s.timeOfDay === 'morning');
  const night   = sorted.filter(s => s.timeOfDay === 'night');
  const weekly  = sorted.filter(s => s.timeOfDay === 'weekly');

  // Backfill: if any slot has fewer than 2 steps, add 'all'-concern base steps
  const backfill = (
    slot: RoutineStep[],
    time: 'morning' | 'night' | 'weekly'
  ): RoutineStep[] => {
    if (slot.length >= 2) return slot;
    const extras = STEP_POOL.filter(
      s =>
        s.timeOfDay === time &&
        (s.skinTypes.includes(st) || s.skinTypes.includes('all')) &&
        s.concerns.includes('all') &&
        !slot.some(existing => existing.id === s.id)
    );
    return [...slot, ...extras].sort((a, b) => a.priority - b.priority);
  };

  return {
    morning: backfill(morning, 'morning'),
    night:   backfill(night, 'night'),
    weekly:  backfill(weekly, 'weekly'),
  };
}
```

- [ ] **Step 4: Run the tests — expect them to pass**

```bash
npx jest lib/__tests__/routineEngine.test.ts --no-coverage
```

Expected output:
```
PASS lib/__tests__/routineEngine.test.ts
  validateConcern
    ✓ returns valid concern as-is
    ✓ returns all for any unknown string
  getRoutine
    ✓ returns steps grouped by time of day
    ✓ morning steps include oily cleanser for oily skin
    ✓ does not include oily cleanser for dry skin
    ✓ includes concern-specific steps when concern matches
    ✓ does not include acne steps when concern is dryness
    ✓ steps are sorted by priority within each slot
    ✓ every skin type + concern combo has at least 2 morning and 2 night steps
    ✓ unknown concern falls back to all-concern routine

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

- [ ] **Step 5: Commit**

```bash
git add lib/routineEngine.ts lib/__tests__/routineEngine.test.ts
git commit -m "feat: add routine engine with concern validation and step filtering"
```

---

## Task 4: Add i18n strings for the empty state

**Files:**
- Modify: `i18n/en.json`
- Modify: `i18n/hi.json`

- [ ] **Step 1: Add 3 keys to `i18n/en.json`**

Add these three lines before the closing `}`:

```json
  "routine_empty_title": "Your routine will glow here",
  "routine_empty_body": "We need to see your skin first to build a routine made just for you.",
  "routine_empty_cta": "Scan Now & GlowUp ✨"
```

- [ ] **Step 2: Add 3 keys to `i18n/hi.json`**

Add these three lines before the closing `}`:

```json
  "routine_empty_title": "आपका रूटीन यहाँ चमकेगा",
  "routine_empty_body": "आपकी त्वचा के लिए बना रूटीन पाने के लिए पहले स्कैन करें।",
  "routine_empty_cta": "अभी स्कैन करें और GlowUp करें ✨"
```

- [ ] **Step 3: Commit**

```bash
git add i18n/en.json i18n/hi.json
git commit -m "feat: add routine empty state i18n strings in en and hi"
```

---

## Task 5: Rewrite `app/routine.tsx`

**Files:**
- Modify: `app/routine.tsx`

- [ ] **Step 1: Replace the entire file content**

```tsx
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useScanStore } from '@/stores/useScanStore';
import AmbientBlobs from '@/components/AmbientBlobs';
import { getRoutine } from '@/lib/routineEngine';
import { RoutineStep } from '@/lib/routineData';

const TABS = ['morning', 'night', 'weekly'] as const;
type Tab = typeof TABS[number];
const TAB_ICONS: Record<Tab, string> = { morning: '☀️', night: '🌙', weekly: '📅' };

// ─── Empty state ──────────────────────────────────────────────────────────────

function NoScanEmptyState() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
      <Animated.Text entering={FadeInDown.delay(0).springify()} style={{ fontSize: 56, marginBottom: 24 }}>
        ✨
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(80).springify()}
        style={{
          fontSize: 24,
          fontFamily: 'Fraunces_700Bold',
          color: '#2D1810',
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        {t('routine_empty_title')}
      </Animated.Text>
      <Animated.Text
        entering={FadeInDown.delay(160).springify()}
        style={{
          fontSize: 15,
          fontFamily: 'PlusJakartaSans_400Regular',
          color: 'rgba(45,24,16,0.6)',
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: 40,
        }}
      >
        {t('routine_empty_body')}
      </Animated.Text>
      <Animated.View entering={FadeInDown.delay(240).springify()}>
        <TouchableOpacity
          onPress={() => router.push('/scan')}
          activeOpacity={0.85}
          style={{
            backgroundColor: '#E07856',
            borderRadius: 20,
            paddingVertical: 16,
            paddingHorizontal: 32,
            shadowColor: '#E07856',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: 'white' }}>
            {t('routine_empty_cta')}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────

interface StepCardProps {
  step: RoutineStep;
  index: number;
  expanded: boolean;
  onPress: () => void;
}

function StepCard({ step, index, expanded, onPress }: StepCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1.5,
          borderColor: expanded ? '#E07856' : 'rgba(224,120,86,0.1)',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
          elevation: 2,
        }}
      >
        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: expanded ? '#E07856' : '#FFF5EE',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'PlusJakartaSans_700Bold',
                color: expanded ? 'white' : '#E07856',
              }}
            >
              {index + 1}
            </Text>
          </View>
          <Text
            style={{
              flex: 1,
              fontSize: 15,
              fontFamily: 'PlusJakartaSans_600SemiBold',
              color: '#2D1810',
            }}
          >
            {step.title}
          </Text>
          <Text style={{ fontSize: 16, color: 'rgba(45,24,16,0.4)' }}>
            {expanded ? '↑' : '↓'}
          </Text>
        </View>

        {/* Expanded content */}
        {expanded && (
          <Animated.View
            entering={FadeInDown.springify()}
            style={{ marginTop: 12, gap: 10 }}
          >
            {/* Home remedy block */}
            <View
              style={{
                backgroundColor: '#F4FBF4',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: 'rgba(80,160,80,0.15)',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans_700Bold',
                  color: '#2D6A2D',
                  marginBottom: 6,
                }}
              >
                🏠 {step.remedy.label}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: 'PlusJakartaSans_400Regular',
                  color: 'rgba(45,24,16,0.7)',
                  lineHeight: 20,
                }}
              >
                {step.remedy.how}
              </Text>
            </View>

            {/* Product block */}
            <View
              style={{
                backgroundColor: '#FFF9F5',
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: 'rgba(212,165,116,0.2)',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'PlusJakartaSans_600SemiBold',
                  color: '#2D1810',
                  marginBottom: 8,
                }}
              >
                🛍️ {step.product.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: 'rgba(45,24,16,0.5)',
                    fontFamily: 'PlusJakartaSans_400Regular',
                    flex: 1,
                    marginRight: 8,
                  }}
                >
                  {step.product.tag}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'PlusJakartaSans_700Bold',
                    color: '#E07856',
                  }}
                >
                  {step.product.price}
                </Text>
              </View>

              {/* Amazon button — dummy for now */}
              <TouchableOpacity
                onPress={() => console.log('[TODO] Open Amazon link for:', step.product.name)}
                activeOpacity={0.85}
                style={{
                  backgroundColor: '#FF9900',
                  borderRadius: 12,
                  paddingVertical: 10,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'PlusJakartaSans_700Bold',
                    color: 'white',
                  }}
                >
                  Buy on Amazon →
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function RoutineScreen() {
  const [tab, setTab] = useState<Tab>('morning');
  const [expanded, setExpanded] = useState<number | null>(0);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const currentScan = useScanStore(s => s.currentScan);

  const routine = useMemo(() => {
    if (!currentScan) return null;
    return getRoutine(currentScan.skin_type, currentScan.top_concern);
  }, [currentScan]);

  const tabSteps = routine ? routine[tab] : [];

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />

      {/* Back button — always visible */}
      <View
        style={{
          position: 'absolute',
          top: insets.top + 16,
          left: 24,
          zIndex: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 10,
            shadowColor: '#2D1810',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 16 }}>←</Text>
        </TouchableOpacity>
      </View>

      {!routine ? (
        // ── No scan yet: full empty state ──
        <NoScanEmptyState />
      ) : (
        // ── Personalized routine ──
        <ScrollView
          style={{ flex: 1, zIndex: 10 }}
          contentContainerStyle={{
            paddingTop: insets.top + 72,
            paddingBottom: 60,
            paddingHorizontal: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Fraunces_700Bold',
              color: '#2D1810',
              marginBottom: 6,
            }}
          >
            {t('routine_title')}
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'PlusJakartaSans_400Regular',
              color: 'rgba(45,24,16,0.5)',
              marginBottom: 24,
            }}
          >
            {t('regimen_body')}
          </Text>

          {/* Tab bar */}
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 4,
              flexDirection: 'row',
              marginBottom: 28,
              shadowColor: '#2D1810',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            {TABS.map(t_ => (
              <TouchableOpacity
                key={t_}
                onPress={() => {
                  setTab(t_);
                  setExpanded(0);
                }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                  paddingVertical: 10,
                  borderRadius: 16,
                  backgroundColor: tab === t_ ? '#E07856' : 'transparent',
                }}
              >
                <Text style={{ fontSize: 14 }}>{TAB_ICONS[t_]}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'PlusJakartaSans_600SemiBold',
                    color: tab === t_ ? 'white' : 'rgba(45,24,16,0.6)',
                    textTransform: 'capitalize',
                  }}
                >
                  {t(t_)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Steps */}
          {tabSteps.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              index={i}
              expanded={expanded === i}
              onPress={() => setExpanded(expanded === i ? null : i)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/routine.tsx
git commit -m "feat: personalized routine screen with home remedies, products, and scan-first empty state"
```

---

## Done ✓

After all tasks complete:
- `lib/gemini.ts` — `top_concern` constrained to 5 enum values
- `lib/routineData.ts` — 31 seeded steps, all typed
- `lib/routineEngine.ts` — pure `getRoutine()` + `validateConcern()`, fully tested
- `app/routine.tsx` — reads scan store, renders personalized routine or empty state CTA
- `i18n/en.json` + `hi.json` — 3 empty-state keys each

**Prod checklist item to track separately:**
- `[ ]` Wire "Buy on Amazon" button with real affiliate deep links
