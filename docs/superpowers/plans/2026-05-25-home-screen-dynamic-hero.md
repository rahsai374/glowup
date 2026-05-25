# Home Screen Dynamic Hero + Progress-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static GlowUp home screen with a progress-first layout featuring a score trend hero, streak strip, context-aware dynamic action card, and concern-filtered daily tip.

**Architecture:** Pure helper functions (`lib/home/`) derive all state before rendering — no logic in JSX. Presentational components (`components/home/`) receive props only, no direct store access. The home screen orchestrator (`app/(tabs)/index.tsx`) reads stores, calls helpers, and composes components.

**Tech Stack:** Expo SDK 54 + TypeScript + Expo Router v3 + react-native-svg (sparkline) + Zustand v5 + react-native-reanimated (animations) + i18next

---

## Task 1: Shared types

**Files:**
- Create: `lib/home/types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// lib/home/types.ts

export type SkinConcern =
  | 'acne'
  | 'darkSpots'
  | 'dryness'
  | 'aging'
  | 'dullness'
  | 'general';

export interface MicroTip {
  id: string;
  emoji: string;
  category: string;
  title: string;
  body: string;
  concerns: SkinConcern[];
}

export type HeroState =
  | { kind: 'first-scan' }
  | { kind: 'routine-in-progress'; period: 'am' | 'pm'; done: number; total: number }
  | { kind: 'stale-scan'; daysSince: number }
  | { kind: 'fresh-scan'; topConcern: string }
  | { kind: 'default-rescan' };
```

- [ ] **Step 2: Commit**

```bash
git add lib/home/types.ts
git commit -m "feat: add shared home screen types (HeroState, MicroTip, SkinConcern)"
```

---

## Task 2: Tips data

**Files:**
- Create: `data/tips.json`

- [ ] **Step 1: Create the tips pool**

```bash
mkdir -p data
```

Create `data/tips.json`:

```json
[
  {
    "id": "spf-morning",
    "emoji": "☀️",
    "category": "Sun Protection",
    "title": "Apply SPF 30+ every morning",
    "body": "Even on cloudy days, UV rays penetrate and cause premature aging and dark spots.",
    "concerns": ["darkSpots", "aging", "general"]
  },
  {
    "id": "vitc-serum",
    "emoji": "🍊",
    "category": "Brightening",
    "title": "Vitamin C before sunscreen",
    "body": "Applying vitamin C serum under SPF doubles UV protection and fades spots over 4–6 weeks.",
    "concerns": ["darkSpots", "dullness"]
  },
  {
    "id": "niacinamide-acne",
    "emoji": "🧪",
    "category": "Acne Care",
    "title": "Niacinamide controls oil",
    "body": "5% niacinamide serum reduces sebum production and minimizes pores without irritation.",
    "concerns": ["acne"]
  },
  {
    "id": "salicylic-wash",
    "emoji": "🫧",
    "category": "Acne Care",
    "title": "Salicylic acid face wash",
    "body": "Use a 2% salicylic acid cleanser in the morning to unclog pores and reduce breakouts.",
    "concerns": ["acne"]
  },
  {
    "id": "no-touch-face",
    "emoji": "🙅",
    "category": "Acne Care",
    "title": "Hands off your face",
    "body": "Touching your face transfers bacteria and oils, worsening breakouts. Clean pillowcases weekly too.",
    "concerns": ["acne"]
  },
  {
    "id": "benzoyl-spot",
    "emoji": "🎯",
    "category": "Acne Care",
    "title": "Spot-treat with benzoyl peroxide",
    "body": "Apply 2.5% benzoyl peroxide directly on active pimples at night — kills bacteria within 48 hours.",
    "concerns": ["acne"]
  },
  {
    "id": "kojic-spots",
    "emoji": "🟤",
    "category": "Brightening",
    "title": "Kojic acid for dark spots",
    "body": "Apply kojic acid serum to hyperpigmented areas twice daily. Results visible in 4–8 weeks.",
    "concerns": ["darkSpots"]
  },
  {
    "id": "sunscreen-reapply",
    "emoji": "🔆",
    "category": "Sun Protection",
    "title": "Reapply SPF every 2 hours",
    "body": "Sunscreen wears off. Reapplying every 2 hours outdoors prevents new dark spots from forming.",
    "concerns": ["darkSpots", "aging"]
  },
  {
    "id": "azelaic-pigment",
    "emoji": "✨",
    "category": "Brightening",
    "title": "Azelaic acid fades pigmentation",
    "body": "10% azelaic acid reduces melanin production and is safe for sensitive skin during the day.",
    "concerns": ["darkSpots", "dullness"]
  },
  {
    "id": "humidifier-dryness",
    "emoji": "💨",
    "category": "Hydration",
    "title": "Use a humidifier at night",
    "body": "A bedroom humidifier at 40–60% humidity prevents transepidermal water loss while you sleep.",
    "concerns": ["dryness"]
  },
  {
    "id": "ceramide-moisturiser",
    "emoji": "🏺",
    "category": "Hydration",
    "title": "Ceramide moisturiser locks in water",
    "body": "Apply a ceramide-rich moisturiser within 60 seconds of washing your face to seal in moisture.",
    "concerns": ["dryness"]
  },
  {
    "id": "gentle-cleanser-dry",
    "emoji": "🚿",
    "category": "Cleansing",
    "title": "Switch to a cream cleanser",
    "body": "Foaming cleansers strip natural oils. A cream or oil cleanser keeps the skin barrier intact.",
    "concerns": ["dryness"]
  },
  {
    "id": "hyaluronic-damp",
    "emoji": "💧",
    "category": "Hydration",
    "title": "Apply hyaluronic acid on damp skin",
    "body": "HA pulls moisture from the air into your skin. Apply immediately after washing for maximum hydration.",
    "concerns": ["dryness", "general"]
  },
  {
    "id": "retinol-aging",
    "emoji": "🌙",
    "category": "Anti-Aging",
    "title": "Start retinol — the gold standard",
    "body": "0.025% retinol 2× per week boosts cell turnover, fades lines, and firms skin over 12 weeks.",
    "concerns": ["aging"]
  },
  {
    "id": "peptide-serum",
    "emoji": "🔬",
    "category": "Anti-Aging",
    "title": "Peptide serum in the morning",
    "body": "Peptides signal skin to produce more collagen. Layer under moisturiser for firmer, plumper skin.",
    "concerns": ["aging"]
  },
  {
    "id": "eye-cream-tapping",
    "emoji": "👁️",
    "category": "Anti-Aging",
    "title": "Tap eye cream — don't rub",
    "body": "The skin around the eye is 4× thinner. Tap with your ring finger to avoid tugging and wrinkling.",
    "concerns": ["aging"]
  },
  {
    "id": "sleep-position",
    "emoji": "😴",
    "category": "Lifestyle",
    "title": "Sleep on your back",
    "body": "Side-sleeping creases the same facial areas every night, accelerating wrinkle formation over time.",
    "concerns": ["aging"]
  },
  {
    "id": "gua-sha-radiance",
    "emoji": "💎",
    "category": "Radiance",
    "title": "Gua sha boosts circulation",
    "body": "2 minutes of gua sha daily increases blood flow, reduces puffiness, and gives skin a natural glow.",
    "concerns": ["dullness"]
  },
  {
    "id": "aha-exfoliant",
    "emoji": "🧖🏽",
    "category": "Exfoliation",
    "title": "Exfoliate with AHA once a week",
    "body": "Glycolic or lactic acid removes dead cells that make skin look dull. Use at night, SPF next morning.",
    "concerns": ["dullness", "darkSpots"]
  },
  {
    "id": "jade-roller-dullness",
    "emoji": "🪨",
    "category": "Radiance",
    "title": "Cold jade roller to depuff",
    "body": "Refrigerate your jade roller and use it in the morning to reduce puffiness and wake up skin tone.",
    "concerns": ["dullness"]
  },
  {
    "id": "diet-antioxidants",
    "emoji": "🥗",
    "category": "Diet",
    "title": "Eat antioxidant-rich foods",
    "body": "Vitamin C from citrus and turmeric from Indian spices protect skin from oxidative stress and dullness.",
    "concerns": ["dullness", "general"]
  },
  {
    "id": "water-intake",
    "emoji": "💦",
    "category": "Hydration",
    "title": "Drink 8 glasses of water",
    "body": "Adequate hydration improves skin elasticity and reduces fine lines. Set hourly reminders if you forget.",
    "concerns": ["general"]
  },
  {
    "id": "sleep-repair",
    "emoji": "🛌",
    "category": "Lifestyle",
    "title": "7–9 hours of sleep",
    "body": "Skin repairs itself overnight. Poor sleep raises cortisol, causing breakouts and a dull complexion.",
    "concerns": ["general"]
  },
  {
    "id": "double-cleanse",
    "emoji": "✌️",
    "category": "Cleansing",
    "title": "Double cleanse at night",
    "body": "Oil cleanser first, then water-based cleanser. Removes sunscreen and pollution without over-stripping.",
    "concerns": ["general"]
  },
  {
    "id": "pillowcase-silk",
    "emoji": "🛏️",
    "category": "Lifestyle",
    "title": "Switch to a silk pillowcase",
    "body": "Silk reduces friction and moisture absorption compared to cotton, keeping skin hydrated overnight.",
    "concerns": ["general", "aging"]
  },
  {
    "id": "patch-test",
    "emoji": "🩹",
    "category": "Skincare Basics",
    "title": "Patch test new products",
    "body": "Apply a new product behind your ear for 24 hours before full-face use to avoid allergic reactions.",
    "concerns": ["general"]
  },
  {
    "id": "sunscreen-indoors",
    "emoji": "🪟",
    "category": "Sun Protection",
    "title": "Wear SPF indoors too",
    "body": "UVA rays penetrate glass windows and cause aging. Apply SPF every morning even if you stay home.",
    "concerns": ["general", "aging", "darkSpots"]
  },
  {
    "id": "stress-skin",
    "emoji": "🧘",
    "category": "Lifestyle",
    "title": "Manage stress for clearer skin",
    "body": "Cortisol from stress triggers oil production and inflammation. 10 minutes of daily breathing helps.",
    "concerns": ["acne", "general"]
  },
  {
    "id": "clean-brushes",
    "emoji": "🖌️",
    "category": "Hygiene",
    "title": "Clean makeup brushes weekly",
    "body": "Dirty brushes harbour bacteria that cause breakouts. Wash with mild shampoo and air-dry.",
    "concerns": ["acne"]
  },
  {
    "id": "toner-balance",
    "emoji": "⚖️",
    "category": "Skincare Basics",
    "title": "Use an alcohol-free toner",
    "body": "A pH-balancing toner after cleansing prepares skin to absorb serums and moisturisers better.",
    "concerns": ["general", "dryness"]
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add data/tips.json
git commit -m "feat: add tips data pool (30 tips, 6 concern tags)"
```

---

## Task 3: `getGreeting` helper + test

**Files:**
- Create: `lib/home/getGreeting.ts`
- Test: `lib/__tests__/getGreeting.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/getGreeting.test.ts`:

```typescript
import { getGreeting } from '../home/getGreeting';

describe('getGreeting', () => {
  it('returns morning for hour 5', () => {
    expect(getGreeting(5)).toBe('morning');
  });
  it('returns morning for hour 11', () => {
    expect(getGreeting(11)).toBe('morning');
  });
  it('returns afternoon for hour 12', () => {
    expect(getGreeting(12)).toBe('afternoon');
  });
  it('returns afternoon for hour 16', () => {
    expect(getGreeting(16)).toBe('afternoon');
  });
  it('returns evening for hour 17', () => {
    expect(getGreeting(17)).toBe('evening');
  });
  it('returns evening for hour 21', () => {
    expect(getGreeting(21)).toBe('evening');
  });
  it('returns night for hour 22', () => {
    expect(getGreeting(22)).toBe('night');
  });
  it('returns night for hour 4', () => {
    expect(getGreeting(4)).toBe('night');
  });
  it('returns night for hour 0', () => {
    expect(getGreeting(0)).toBe('night');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest lib/__tests__/getGreeting.test.ts --no-coverage
```

Expected: FAIL with "Cannot find module '../home/getGreeting'"

- [ ] **Step 3: Implement the helper**

Create `lib/home/getGreeting.ts`:

```typescript
// lib/home/getGreeting.ts

export type GreetingPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Returns the greeting period for a given local hour (0-23).
 * Caller maps the result to an i18n key.
 */
export function getGreeting(hour: number): GreetingPeriod {
  if (hour >= 5 && hour <= 11) return 'morning';
  if (hour >= 12 && hour <= 16) return 'afternoon';
  if (hour >= 17 && hour <= 21) return 'evening';
  return 'night';
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest lib/__tests__/getGreeting.test.ts --no-coverage
```

Expected: PASS — 9 tests passed

- [ ] **Step 5: Commit**

```bash
git add lib/home/getGreeting.ts lib/__tests__/getGreeting.test.ts
git commit -m "feat: add getGreeting pure helper with boundary tests"
```

---

## Task 4: `selectHeroState` helper + test

**Files:**
- Create: `lib/home/selectHeroState.ts`
- Test: `lib/__tests__/selectHeroState.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/selectHeroState.test.ts`:

```typescript
import { selectHeroState, SelectHeroStateArgs } from '../home/selectHeroState';

const base: SelectHeroStateArgs = {
  scanCount: 1,
  daysSinceLastScan: 3,
  lastScanTopConcern: 'Dark spots',
  nowHour: 14,
  routineToday: {
    am: { done: 2, total: 3 },
    pm: { done: 0, total: 3 },
  },
};

describe('selectHeroState', () => {
  it('returns first-scan when scanCount is 0', () => {
    const result = selectHeroState({ ...base, scanCount: 0 });
    expect(result).toEqual({ kind: 'first-scan' });
  });

  it('returns routine-in-progress am when morning and am routine incomplete', () => {
    const result = selectHeroState({
      ...base,
      nowHour: 8,
      routineToday: { am: { done: 1, total: 4 }, pm: { done: 0, total: 4 } },
    });
    expect(result).toEqual({ kind: 'routine-in-progress', period: 'am', done: 1, total: 4 });
  });

  it('does NOT return routine-in-progress am when morning routine is complete', () => {
    const result = selectHeroState({
      ...base,
      nowHour: 9,
      routineToday: { am: { done: 3, total: 3 }, pm: { done: 0, total: 3 } },
    });
    // falls through to stale-scan or default
    expect(result.kind).not.toBe('routine-in-progress');
  });

  it('returns routine-in-progress pm when evening and pm routine incomplete', () => {
    const result = selectHeroState({
      ...base,
      nowHour: 20,
      daysSinceLastScan: 3,
      routineToday: { am: { done: 3, total: 3 }, pm: { done: 1, total: 4 } },
    });
    expect(result).toEqual({ kind: 'routine-in-progress', period: 'pm', done: 1, total: 4 });
  });

  it('returns stale-scan when last scan is more than 7 days ago', () => {
    const result = selectHeroState({ ...base, daysSinceLastScan: 9, nowHour: 14 });
    expect(result).toEqual({ kind: 'stale-scan', daysSince: 9 });
  });

  it('returns fresh-scan when scan is <1 day old and has topConcern', () => {
    const result = selectHeroState({
      ...base,
      daysSinceLastScan: 0.5,
      lastScanTopConcern: 'Dark spots',
      nowHour: 14,
    });
    expect(result).toEqual({ kind: 'fresh-scan', topConcern: 'Dark spots' });
  });

  it('falls through to default-rescan when scan is fresh but topConcern is null', () => {
    const result = selectHeroState({
      ...base,
      daysSinceLastScan: 0.5,
      lastScanTopConcern: null,
      nowHour: 14,
    });
    expect(result).toEqual({ kind: 'default-rescan' });
  });

  it('returns default-rescan for a 3-day-old scan at afternoon', () => {
    const result = selectHeroState({ ...base, nowHour: 14, daysSinceLastScan: 3 });
    expect(result).toEqual({ kind: 'default-rescan' });
  });

  it('first-scan takes priority over everything else', () => {
    const result = selectHeroState({
      ...base,
      scanCount: 0,
      daysSinceLastScan: 0.1,
      nowHour: 8,
    });
    expect(result).toEqual({ kind: 'first-scan' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest lib/__tests__/selectHeroState.test.ts --no-coverage
```

Expected: FAIL with "Cannot find module '../home/selectHeroState'"

- [ ] **Step 3: Implement the helper**

Create `lib/home/selectHeroState.ts`:

```typescript
// lib/home/selectHeroState.ts

import { HeroState } from './types';

export interface SelectHeroStateArgs {
  scanCount: number;
  daysSinceLastScan: number | null;
  lastScanTopConcern: string | null;
  nowHour: number;
  routineToday: {
    am: { done: number; total: number };
    pm: { done: number; total: number };
  };
}

/**
 * Derives the correct dynamic hero card state from app context.
 * Precedence: first-scan → routine-in-progress → stale-scan → fresh-scan → default-rescan
 */
export function selectHeroState(args: SelectHeroStateArgs): HeroState {
  const { scanCount, daysSinceLastScan, lastScanTopConcern, nowHour, routineToday } = args;

  // 1. No scans at all
  if (scanCount === 0) return { kind: 'first-scan' };

  // 2. Morning routine incomplete
  if (nowHour >= 5 && nowHour <= 11 && routineToday.am.done < routineToday.am.total) {
    return {
      kind: 'routine-in-progress',
      period: 'am',
      done: routineToday.am.done,
      total: routineToday.am.total,
    };
  }

  // 3. Evening routine incomplete
  if (nowHour >= 18 && nowHour <= 23 && routineToday.pm.done < routineToday.pm.total) {
    return {
      kind: 'routine-in-progress',
      period: 'pm',
      done: routineToday.pm.done,
      total: routineToday.pm.total,
    };
  }

  // 4. Stale scan (> 7 days)
  if (daysSinceLastScan !== null && daysSinceLastScan > 7) {
    return { kind: 'stale-scan', daysSince: Math.round(daysSinceLastScan) };
  }

  // 5. Fresh scan (< 1 day) with a valid concern
  if (daysSinceLastScan !== null && daysSinceLastScan < 1 && lastScanTopConcern !== null) {
    return { kind: 'fresh-scan', topConcern: lastScanTopConcern };
  }

  return { kind: 'default-rescan' };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest lib/__tests__/selectHeroState.test.ts --no-coverage
```

Expected: PASS — 9 tests passed

- [ ] **Step 5: Commit**

```bash
git add lib/home/selectHeroState.ts lib/__tests__/selectHeroState.test.ts
git commit -m "feat: add selectHeroState helper with full precedence tests"
```

---

## Task 5: `selectDailyTip` helper + test

**Files:**
- Create: `lib/home/selectDailyTip.ts`
- Test: `lib/__tests__/selectDailyTip.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/selectDailyTip.test.ts`:

```typescript
import { selectDailyTip } from '../home/selectDailyTip';
import { MicroTip, SkinConcern } from '../home/types';

const makeTip = (id: string, concerns: SkinConcern[]): MicroTip => ({
  id,
  emoji: '✨',
  category: 'Test',
  title: `Tip ${id}`,
  body: `Body ${id}`,
  concerns,
});

const TIPS: MicroTip[] = [
  makeTip('acne-1', ['acne']),
  makeTip('acne-2', ['acne']),
  makeTip('general-1', ['general']),
  makeTip('general-2', ['general']),
  makeTip('spots-1', ['darkSpots']),
];

describe('selectDailyTip', () => {
  it('filters by userConcern and picks deterministically', () => {
    const tip = selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 1 });
    expect(tip.concerns).toContain('acne');
  });

  it('returns a different tip for a different dayOfYear (modulo rotation)', () => {
    const tip1 = selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 1 });
    const tip2 = selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 2 });
    // 2 acne tips: day 1 → index 1%2=1, day 2 → index 2%2=0 — different
    expect(tip1.id).not.toBe(tip2.id);
  });

  it('returns same tip for same dayOfYear (deterministic)', () => {
    const tip1 = selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 42 });
    const tip2 = selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 42 });
    expect(tip1.id).toBe(tip2.id);
  });

  it('falls back to general tips when userConcern is null', () => {
    const tip = selectDailyTip({ tips: TIPS, userConcern: null, dayOfYear: 1 });
    expect(tip.concerns).toContain('general');
  });

  it('falls back to general when concern has no matching tips', () => {
    const tip = selectDailyTip({ tips: TIPS, userConcern: 'dullness', dayOfYear: 1 });
    expect(tip.concerns).toContain('general');
  });

  it('returns a tip even when dayOfYear is 1 (no off-by-one crash)', () => {
    expect(() =>
      selectDailyTip({ tips: TIPS, userConcern: 'acne', dayOfYear: 1 })
    ).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest lib/__tests__/selectDailyTip.test.ts --no-coverage
```

Expected: FAIL with "Cannot find module '../home/selectDailyTip'"

- [ ] **Step 3: Implement the helper**

Create `lib/home/selectDailyTip.ts`:

```typescript
// lib/home/selectDailyTip.ts

import { MicroTip, SkinConcern } from './types';

interface SelectDailyTipArgs {
  tips: MicroTip[];
  userConcern: SkinConcern | null;
  dayOfYear: number; // 1–366, caller provides — no date logic here
}

/**
 * Selects a daily tip deterministically based on concern and day of year.
 * Falls back to 'general' tips when concern is null or yields no results.
 */
export function selectDailyTip({ tips, userConcern, dayOfYear }: SelectDailyTipArgs): MicroTip {
  let filtered = userConcern ? tips.filter((t) => t.concerns.includes(userConcern)) : [];

  if (filtered.length === 0) {
    filtered = tips.filter((t) => t.concerns.includes('general'));
  }

  // Safety: if still empty (malformed data), return first tip
  if (filtered.length === 0) return tips[0];

  return filtered[dayOfYear % filtered.length];
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest lib/__tests__/selectDailyTip.test.ts --no-coverage
```

Expected: PASS — 6 tests passed

- [ ] **Step 5: Commit**

```bash
git add lib/home/selectDailyTip.ts lib/__tests__/selectDailyTip.test.ts
git commit -m "feat: add selectDailyTip helper with concern filtering and fallback tests"
```

---

## Task 6: `useScanStore` — add selectors + test

**Files:**
- Modify: `stores/useScanStore.ts`
- Test: `lib/__tests__/useScanStore.selectors.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/useScanStore.selectors.test.ts`:

```typescript
import { daysSinceLastScan, scansInLastNDays, scoreHistoryLastN } from '../../stores/useScanStore';
import { ScanRecord } from '../../stores/useScanStore';

const makeRecord = (daysAgo: number, score: number): ScanRecord => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id: `scan-${daysAgo}`,
    overall_score: score,
    skin_type: 'oily',
    skin_age: 25,
    metrics: {
      hydration: 70, blemish_prone: 30, redness: 20, oiliness: 60,
      dark_spots: 25, radiance: 65, texture: 70, firmness: 75, wrinkles: 15, dark_circles: 30,
    },
    top_concern: 'Acne',
    top_win: 'Great hydration',
    advice: 'Keep going',
    createdAt: d,
  };
};

describe('useScanStore selectors', () => {
  describe('daysSinceLastScan', () => {
    it('returns null for empty history', () => {
      expect(daysSinceLastScan([])).toBeNull();
    });
    it('returns ~0 for a scan done today', () => {
      const result = daysSinceLastScan([makeRecord(0, 80)]);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result!).toBeLessThan(1);
    });
    it('returns ~3 for a scan done 3 days ago', () => {
      const result = daysSinceLastScan([makeRecord(3, 80)]);
      expect(result!).toBeGreaterThanOrEqual(2.9);
      expect(result!).toBeLessThan(4);
    });
  });

  describe('scansInLastNDays', () => {
    it('returns 0 for empty history', () => {
      expect(scansInLastNDays([], 7)).toBe(0);
    });
    it('counts scans within window', () => {
      const history = [makeRecord(1, 80), makeRecord(5, 75), makeRecord(10, 70)];
      expect(scansInLastNDays(history, 7)).toBe(2);
    });
    it('excludes scans outside window', () => {
      const history = [makeRecord(8, 80)];
      expect(scansInLastNDays(history, 7)).toBe(0);
    });
  });

  describe('scoreHistoryLastN', () => {
    it('returns empty array for empty history', () => {
      expect(scoreHistoryLastN([], 5)).toEqual([]);
    });
    it('returns scores oldest-first', () => {
      const history = [makeRecord(0, 85), makeRecord(3, 80), makeRecord(7, 75)];
      expect(scoreHistoryLastN(history, 3)).toEqual([75, 80, 85]);
    });
    it('limits to N scores', () => {
      const history = [
        makeRecord(0, 90), makeRecord(1, 85), makeRecord(2, 80),
        makeRecord(3, 75), makeRecord(4, 70), makeRecord(5, 65), makeRecord(6, 60), makeRecord(7, 55),
      ];
      const result = scoreHistoryLastN(history, 5);
      expect(result).toHaveLength(5);
      expect(result[result.length - 1]).toBe(90); // most recent is last
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest lib/__tests__/useScanStore.selectors.test.ts --no-coverage
```

Expected: FAIL — exported names not found

- [ ] **Step 3: Add selectors to `useScanStore.ts`**

The selectors are pure functions that take `ScanRecord[]` — they don't need to be inside Zustand. Add them as named exports below the store:

```typescript
// stores/useScanStore.ts
import { create } from 'zustand';
import { ScanResult } from '@/lib/gemini';

export interface ScanRecord extends ScanResult {
  id: string;
  createdAt: Date;
  imageUrl?: string;
}

interface ScanStore {
  currentScan: ScanRecord | null;
  scanHistory: ScanRecord[];
  setCurrentScan: (scan: ScanRecord) => void;
  addToHistory: (scan: ScanRecord) => void;
  setHistory: (scans: ScanRecord[]) => void;
}

export const useScanStore = create<ScanStore>((set) => ({
  currentScan: null,
  scanHistory: [],
  setCurrentScan: (scan) => set({ currentScan: scan }),
  addToHistory: (scan) =>
    set((state) => ({ scanHistory: [scan, ...state.scanHistory] })),
  setHistory: (scans) => set({ scanHistory: scans }),
}));

/** Returns fractional days since the most recent scan, or null if no scans. */
export function daysSinceLastScan(history: ScanRecord[]): number | null {
  if (history.length === 0) return null;
  const latest = history[0]; // history is desc by createdAt
  const msPerDay = 1000 * 60 * 60 * 24;
  return (Date.now() - new Date(latest.createdAt).getTime()) / msPerDay;
}

/** Returns the count of scans whose createdAt is within the last n days. */
export function scansInLastNDays(history: ScanRecord[], n: number): number {
  const cutoff = Date.now() - n * 24 * 60 * 60 * 1000;
  return history.filter((s) => new Date(s.createdAt).getTime() >= cutoff).length;
}

/**
 * Returns up to the last n overall_score values, oldest first.
 * history is assumed sorted desc (newest first).
 */
export function scoreHistoryLastN(history: ScanRecord[], n: number): number[] {
  return history
    .slice(0, n)
    .map((s) => s.overall_score)
    .reverse();
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest lib/__tests__/useScanStore.selectors.test.ts --no-coverage
```

Expected: PASS — all tests passed

- [ ] **Step 5: Commit**

```bash
git add stores/useScanStore.ts lib/__tests__/useScanStore.selectors.test.ts
git commit -m "feat: add daysSinceLastScan, scansInLastNDays, scoreHistoryLastN selectors"
```

---

## Task 7: `useUserStore` — streak field + `tickStreak` + test

**Files:**
- Modify: `stores/useUserStore.ts`
- Test: `lib/__tests__/useUserStore.streak.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/useUserStore.streak.test.ts`:

```typescript
import { computeNextStreak } from '../../stores/useUserStore';

describe('computeNextStreak', () => {
  const today = '2026-05-25';
  const yesterday = '2026-05-24';
  const twoDaysAgo = '2026-05-23';

  it('is a no-op when lastOpenedAt is today', () => {
    const result = computeNextStreak({ current: 5, lastOpenedAt: today }, today);
    expect(result).toEqual({ current: 5, lastOpenedAt: today });
  });

  it('increments when lastOpenedAt is yesterday', () => {
    const result = computeNextStreak({ current: 5, lastOpenedAt: yesterday }, today);
    expect(result).toEqual({ current: 6, lastOpenedAt: today });
  });

  it('resets to 1 when gap is more than one day', () => {
    const result = computeNextStreak({ current: 10, lastOpenedAt: twoDaysAgo }, today);
    expect(result).toEqual({ current: 1, lastOpenedAt: today });
  });

  it('sets streak to 1 on first ever open (empty lastOpenedAt)', () => {
    const result = computeNextStreak({ current: 0, lastOpenedAt: '' }, today);
    expect(result).toEqual({ current: 1, lastOpenedAt: today });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest lib/__tests__/useUserStore.streak.test.ts --no-coverage
```

Expected: FAIL — `computeNextStreak` not exported

- [ ] **Step 3: Update `useUserStore.ts`**

```typescript
// stores/useUserStore.ts
import { create } from 'zustand';

export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  language: 'en' | 'hi';
  skinType: string;
  mainConcern: string;
  waterIntake: string;
  sunscreenHabit: string;
  ageRange: string;
}

export interface StreakData {
  current: number;
  lastOpenedAt: string; // YYYY-MM-DD local date
}

interface UserStore {
  user: UserProfile | null;
  streak: StreakData;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  setLanguage: (lang: 'en' | 'hi') => void;
  tickStreak: () => void;
  logout: () => void;
}

/** Pure function — exported for testing. Returns the next streak state given today's local date string. */
export function computeNextStreak(streak: StreakData, today: string): StreakData {
  if (streak.lastOpenedAt === today) return streak;

  const last = streak.lastOpenedAt ? new Date(streak.lastOpenedAt) : null;
  const todayDate = new Date(today);

  if (last) {
    const diffDays = (todayDate.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
    if (Math.round(diffDays) === 1) {
      return { current: streak.current + 1, lastOpenedAt: today };
    }
  }

  return { current: 1, lastOpenedAt: today };
}

function localDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  streak: { current: 0, lastOpenedAt: '' },
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  updateUser: (partial) =>
    set((state) => ({ user: state.user ? { ...state.user, ...partial } : null })),
  setLanguage: (lang) =>
    set((state) => ({ user: state.user ? { ...state.user, language: lang } : null })),
  tickStreak: () => {
    const today = localDateString();
    const next = computeNextStreak(get().streak, today);
    set({ streak: next });
  },
  logout: () => set({ user: null, isAuthenticated: false, streak: { current: 0, lastOpenedAt: '' } }),
}));
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest lib/__tests__/useUserStore.streak.test.ts --no-coverage
```

Expected: PASS — 4 tests passed

- [ ] **Step 5: Commit**

```bash
git add stores/useUserStore.ts lib/__tests__/useUserStore.streak.test.ts
git commit -m "feat: add streak tracking to useUserStore with computeNextStreak helper"
```

---

## Task 8: `useRoutineStore` — new store + test

**Files:**
- Create: `stores/useRoutineStore.ts`
- Test: `lib/__tests__/useRoutineStore.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/__tests__/useRoutineStore.test.ts`:

```typescript
import { todayProgress, weeklyConsistency, computeToggleStep, computeMarkTipDone } from '../../stores/useRoutineStore';

type Completions = Record<string, { am: string[]; pm: string[]; tips: string[] }>;

const AM_STEPS = ['step-a', 'step-b', 'step-c'];
const PM_STEPS = ['step-d', 'step-e'];

describe('todayProgress', () => {
  it('returns 0 done for empty completions', () => {
    const result = todayProgress({}, '2026-05-25', AM_STEPS, PM_STEPS);
    expect(result).toEqual({ am: { done: 0, total: 3 }, pm: { done: 0, total: 2 } });
  });

  it('counts completed steps for today', () => {
    const completions: Completions = {
      '2026-05-25': { am: ['step-a', 'step-b'], pm: ['step-d'], tips: [] },
    };
    const result = todayProgress(completions, '2026-05-25', AM_STEPS, PM_STEPS);
    expect(result).toEqual({ am: { done: 2, total: 3 }, pm: { done: 1, total: 2 } });
  });

  it('ignores other dates', () => {
    const completions: Completions = {
      '2026-05-24': { am: ['step-a', 'step-b', 'step-c'], pm: ['step-d', 'step-e'], tips: [] },
    };
    const result = todayProgress(completions, '2026-05-25', AM_STEPS, PM_STEPS);
    expect(result.am.done).toBe(0);
  });
});

describe('weeklyConsistency', () => {
  it('returns 0 for no completions', () => {
    expect(weeklyConsistency({}, AM_STEPS, PM_STEPS)).toBe(0);
  });

  it('returns 100 for all steps done every day this week', () => {
    const completions: Completions = {};
    const stepsExpectedPerDay = AM_STEPS.length + PM_STEPS.length + 1; // +1 tip bonus
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      completions[key] = { am: [...AM_STEPS], pm: [...PM_STEPS], tips: ['some-tip'] };
    }
    expect(weeklyConsistency(completions, AM_STEPS, PM_STEPS)).toBe(100);
  });
});

describe('computeToggleStep', () => {
  it('adds a step id when not present', () => {
    const result = computeToggleStep({}, '2026-05-25', 'am', 'step-a');
    expect(result['2026-05-25'].am).toContain('step-a');
  });

  it('removes a step id when already present (toggle off)', () => {
    const existing: Completions = { '2026-05-25': { am: ['step-a'], pm: [], tips: [] } };
    const result = computeToggleStep(existing, '2026-05-25', 'am', 'step-a');
    expect(result['2026-05-25'].am).not.toContain('step-a');
  });
});

describe('computeMarkTipDone', () => {
  it('adds tip id to completions', () => {
    const result = computeMarkTipDone({}, '2026-05-25', 'tip-123');
    expect(result['2026-05-25'].tips).toContain('tip-123');
  });

  it('is idempotent — does not duplicate', () => {
    const existing: Completions = { '2026-05-25': { am: [], pm: [], tips: ['tip-123'] } };
    const result = computeMarkTipDone(existing, '2026-05-25', 'tip-123');
    expect(result['2026-05-25'].tips.filter((t) => t === 'tip-123')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest lib/__tests__/useRoutineStore.test.ts --no-coverage
```

Expected: FAIL — module not found

- [ ] **Step 3: Create `useRoutineStore.ts`**

```typescript
// stores/useRoutineStore.ts
import { create } from 'zustand';

export type DateKey = string; // YYYY-MM-DD local

export type Completions = Record<DateKey, { am: string[]; pm: string[]; tips: string[] }>;

interface RoutineStore {
  completions: Completions;
  toggleStep: (date: DateKey, period: 'am' | 'pm', stepId: string) => void;
  markTipDone: (date: DateKey, tipId: string) => void;
}

function emptyDay(): { am: string[]; pm: string[]; tips: string[] } {
  return { am: [], pm: [], tips: [] };
}

/** Pure — exported for testing */
export function computeToggleStep(
  completions: Completions,
  date: DateKey,
  period: 'am' | 'pm',
  stepId: string
): Completions {
  const day = completions[date] ?? emptyDay();
  const current = day[period];
  const updated = current.includes(stepId)
    ? current.filter((id) => id !== stepId)
    : [...current, stepId];
  return { ...completions, [date]: { ...day, [period]: updated } };
}

/** Pure — exported for testing */
export function computeMarkTipDone(
  completions: Completions,
  date: DateKey,
  tipId: string
): Completions {
  const day = completions[date] ?? emptyDay();
  if (day.tips.includes(tipId)) return completions; // idempotent
  return { ...completions, [date]: { ...day, tips: [...day.tips, tipId] } };
}

/** Pure — exported for testing. todayStr is YYYY-MM-DD. */
export function todayProgress(
  completions: Completions,
  todayStr: DateKey,
  amStepIds: string[],
  pmStepIds: string[]
): { am: { done: number; total: number }; pm: { done: number; total: number } } {
  const day = completions[todayStr] ?? emptyDay();
  return {
    am: { done: amStepIds.filter((id) => day.am.includes(id)).length, total: amStepIds.length },
    pm: { done: pmStepIds.filter((id) => day.pm.includes(id)).length, total: pmStepIds.length },
  };
}

/** Pure — exported for testing. Returns 0-100. */
export function weeklyConsistency(
  completions: Completions,
  amStepIds: string[],
  pmStepIds: string[]
): number {
  const stepsPerDay = amStepIds.length + pmStepIds.length + 1; // +1 tip bonus slot
  let totalDone = 0;
  let totalExpected = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const day = completions[key];
    totalExpected += stepsPerDay;
    if (day) {
      const amDone = amStepIds.filter((id) => day.am.includes(id)).length;
      const pmDone = pmStepIds.filter((id) => day.pm.includes(id)).length;
      const tipDone = day.tips.length > 0 ? 1 : 0;
      totalDone += amDone + pmDone + tipDone;
    }
  }

  if (totalExpected === 0) return 0;
  return Math.round((totalDone / totalExpected) * 100);
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  completions: {},
  toggleStep: (date, period, stepId) =>
    set({ completions: computeToggleStep(get().completions, date, period, stepId) }),
  markTipDone: (date, tipId) =>
    set({ completions: computeMarkTipDone(get().completions, date, tipId) }),
}));
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest lib/__tests__/useRoutineStore.test.ts --no-coverage
```

Expected: PASS — all tests passed

- [ ] **Step 5: Commit**

```bash
git add stores/useRoutineStore.ts lib/__tests__/useRoutineStore.test.ts
git commit -m "feat: add useRoutineStore with toggle, markTipDone, and consistency helpers"
```

---

## Task 9: i18n keys

**Files:**
- Modify: `i18n/en.json`
- Modify: `i18n/hi.json`

- [ ] **Step 1: Add keys to `i18n/en.json`**

Open `i18n/en.json` and append inside the JSON object before the closing `}`:

```json
  "home_greeting_morning": "Good morning",
  "home_greeting_afternoon": "Good afternoon",
  "home_greeting_evening": "Good evening",
  "home_greeting_night": "Glowing up tonight",
  "score_trend_baseline": "Your baseline · scan again to see your trend",
  "score_trend_up": "Glow up since last scan",
  "score_trend_down": "Small dip — let's bounce back",
  "score_trend_same": "Holding steady",
  "streak_day": "Day {{count}}",
  "streak_scans_week": "{{count}} scan this week",
  "streak_scans_week_plural": "{{count}} scans this week",
  "streak_routine_pct": "{{pct}}% routine",
  "hero_first_scan_title": "Scan your skin",
  "hero_first_scan_sub": "Takes 30 seconds",
  "hero_routine_am_title": "Morning routine",
  "hero_routine_pm_title": "Evening routine",
  "hero_routine_sub": "{{done}} of {{total}} done",
  "hero_stale_title": "Time to re-scan",
  "hero_stale_sub": "It's been {{days}} days. See how you're doing.",
  "hero_fresh_title": "Today's focus",
  "hero_default_title": "Scan again",
  "hero_default_sub": "Track your progress",
  "tip_header_concern": "For your {{concern}}",
  "tip_header_general": "Daily glow tip",
  "tip_mark_done": "Mark as done ✓",
  "tip_done": "Done ✓"
```

- [ ] **Step 2: Add keys to `i18n/hi.json`**

Open `i18n/hi.json` and append inside the JSON object before the closing `}`:

```json
  "home_greeting_morning": "शुभ प्रभात",
  "home_greeting_afternoon": "नमस्ते",
  "home_greeting_evening": "शुभ संध्या",
  "home_greeting_night": "आज रात भी glowing",
  "score_trend_baseline": "आपका बेसलाइन · ट्रेंड देखने के लिए फिर स्कैन करें",
  "score_trend_up": "पिछले स्कैन से सुधार",
  "score_trend_down": "थोड़ी गिरावट — वापस आएं",
  "score_trend_same": "स्थिर बने हुए हैं",
  "streak_day": "दिन {{count}}",
  "streak_scans_week": "इस हफ्ते {{count}} स्कैन",
  "streak_scans_week_plural": "इस हफ्ते {{count}} स्कैन",
  "streak_routine_pct": "{{pct}}% रूटीन",
  "hero_first_scan_title": "अपनी त्वचा स्कैन करें",
  "hero_first_scan_sub": "30 सेकंड लगते हैं",
  "hero_routine_am_title": "सुबह की दिनचर्या",
  "hero_routine_pm_title": "शाम की दिनचर्या",
  "hero_routine_sub": "{{done}} में से {{total}} पूरे",
  "hero_stale_title": "फिर से स्कैन करें",
  "hero_stale_sub": "{{days}} दिन हो गए। देखें कैसे हैं।",
  "hero_fresh_title": "आज का फोकस",
  "hero_default_title": "फिर स्कैन करें",
  "hero_default_sub": "अपनी प्रगति ट्रैक करें",
  "tip_header_concern": "आपकी {{concern}} के लिए",
  "tip_header_general": "आज की glow टिप",
  "tip_mark_done": "हो गया ✓",
  "tip_done": "हो गया ✓"
```

- [ ] **Step 3: Verify JSON is valid**

```bash
python3 -c "import json; json.load(open('i18n/en.json')); print('en.json OK')"
python3 -c "import json; json.load(open('i18n/hi.json')); print('hi.json OK')"
```

Expected: both print OK

- [ ] **Step 4: Commit**

```bash
git add i18n/en.json i18n/hi.json
git commit -m "feat: add i18n keys for home screen greeting, hero states, and tip card"
```

---

## Task 10: `HomeHeader` component

**Files:**
- Create: `components/home/HomeHeader.tsx`

- [ ] **Step 1: Create the component**

```bash
mkdir -p components/home
```

Create `components/home/HomeHeader.tsx`:

```typescript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface HomeHeaderProps {
  name: string;
  greeting: string; // already-resolved string from i18n, e.g. "Good morning"
  onAvatarPress: () => void;
}

export default function HomeHeader({ name, greeting, onAvatarPress }: HomeHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
      <View>
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#E07856', letterSpacing: 2.5, textTransform: 'uppercase' }}>
          {greeting}
        </Text>
        <Text style={{ fontSize: 28, fontFamily: 'Fraunces_700Bold', color: '#2D1810' }}>
          {name} ✨
        </Text>
      </View>
      <TouchableOpacity
        onPress={onAvatarPress}
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <Text style={{ fontSize: 22 }}>👩🏽</Text>
      </TouchableOpacity>
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/HomeHeader.tsx
git commit -m "feat: add HomeHeader component (time-aware greeting prop)"
```

---

## Task 11: `Sparkline` component

**Files:**
- Create: `components/home/Sparkline.tsx`

- [ ] **Step 1: Create the component**

`react-native-svg` is already installed. Create `components/home/Sparkline.tsx`:

```typescript
import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

interface SparklineProps {
  data: number[];   // score values, oldest first
  width?: number;
  height?: number;
  color?: string;
}

export default function Sparkline({ data, width = 80, height = 28, color = '#E07856' }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // avoid division by zero when all values are equal

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/Sparkline.tsx
git commit -m "feat: add Sparkline component using react-native-svg"
```

---

## Task 12: `ScoreTrendCard` component

**Files:**
- Create: `components/home/ScoreTrendCard.tsx`

- [ ] **Step 1: Create the component**

Create `components/home/ScoreTrendCard.tsx`:

```typescript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import Sparkline from './Sparkline';

interface ScoreTrendCardProps {
  currentScore: number;
  previousScore: number | null;
  history: number[]; // oldest first, up to 7 values
  onPress: () => void;
}

export default function ScoreTrendCard({ currentScore, previousScore, history, onPress }: ScoreTrendCardProps) {
  const { t } = useTranslation();
  const delta = previousScore !== null ? currentScore - previousScore : null;

  const deltaLabel = () => {
    if (delta === null) return null;
    if (delta > 0) return `▲ +${delta}`;
    if (delta < 0) return `▼ ${Math.abs(delta)}`;
    return '— same';
  };

  const deltaBg = () => {
    if (delta === null) return 'transparent';
    if (delta > 0) return '#DCFCE7';
    if (delta < 0) return '#FEF3C7';
    return '#F5F5F4';
  };

  const deltaColor = () => {
    if (delta === null) return '#2D1810';
    if (delta > 0) return '#4ADE80';
    if (delta < 0) return '#D97706';
    return '#78716C';
  };

  const subtitle = () => {
    if (delta === null) return t('score_trend_baseline');
    if (delta > 0) return t('score_trend_up');
    if (delta < 0) return t('score_trend_down');
    return t('score_trend_same');
  };

  return (
    <Animated.View entering={FadeInDown.springify()}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 20,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: 'rgba(224,120,86,0.08)',
          shadowColor: '#2D1810',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 20,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Score + delta */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 48, fontFamily: 'Fraunces_700Bold', color: '#E07856', lineHeight: 56 }}>
              {currentScore}
            </Text>
            {delta !== null && (
              <View style={{ backgroundColor: deltaBg(), borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: deltaColor() }}>
                  {deltaLabel()}
                </Text>
              </View>
            )}
          </View>
          {/* Sparkline */}
          <Sparkline data={history} width={80} height={28} color="#E07856" />
        </View>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(45,24,16,0.55)', marginTop: 8 }}>
          {subtitle()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/ScoreTrendCard.tsx
git commit -m "feat: add ScoreTrendCard with score, delta badge, and sparkline"
```

---

## Task 13: `StreakStrip` component

**Files:**
- Create: `components/home/StreakStrip.tsx`

- [ ] **Step 1: Create the component**

Create `components/home/StreakStrip.tsx`:

```typescript
import React from 'react';
import { View, Text } from 'react-native';

interface StreakStripProps {
  streakDays: number;
  scansThisWeek: number;
  routineConsistencyPct: number;
  hasAnyCompletions: boolean; // hide routine pill if user has never marked a step
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: 'rgba(224,120,86,0.08)',
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 10,
      alignItems: 'center',
    }}>
      {children}
    </View>
  );
}

export default function StreakStrip({ streakDays, scansThisWeek, routineConsistencyPct, hasAnyCompletions }: StreakStripProps) {
  const scanLabel = scansThisWeek === 1 ? '📸 1 scan this week' : `📸 ${scansThisWeek} scans this week`;

  return (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
      {streakDays > 0 && (
        <Pill>
          <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
            🔥 Day {streakDays}
          </Text>
        </Pill>
      )}
      <Pill>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
          {scanLabel}
        </Text>
      </Pill>
      {hasAnyCompletions && (
        <Pill>
          <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#2D1810' }}>
            ✅ {routineConsistencyPct}% routine
          </Text>
        </Pill>
      )}
    </View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/StreakStrip.tsx
git commit -m "feat: add StreakStrip component (streak, scans-this-week, routine consistency)"
```

---

## Task 14: `DynamicActionCard` component

**Files:**
- Create: `components/home/DynamicActionCard.tsx`

- [ ] **Step 1: Create the component**

Create `components/home/DynamicActionCard.tsx`:

```typescript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { HeroState } from '@/lib/home/types';

interface DynamicActionCardProps {
  state: HeroState;
  onPrimaryPress: () => void;
}

export default function DynamicActionCard({ state, onPrimaryPress }: DynamicActionCardProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function onPress() {
    scale.value = withSpring(0.97, { damping: 15 });
    setTimeout(() => { scale.value = withSpring(1); onPrimaryPress(); }, 100);
  }

  const config = (() => {
    switch (state.kind) {
      case 'first-scan':
        return {
          bg: '#E07856',
          icon: '🔍',
          title: 'Scan your skin',
          titleColor: 'white',
          subtitle: 'Takes 30 seconds',
          subtitleColor: 'rgba(255,255,255,0.75)',
          showProgressBar: false,
          progress: 0,
        };
      case 'routine-in-progress':
        return {
          bg: '#FBF2E0',
          icon: '🌿',
          title: state.period === 'am' ? 'Morning routine' : 'Evening routine',
          titleColor: '#2D1810',
          subtitle: `${state.done} of ${state.total} done`,
          subtitleColor: 'rgba(45,24,16,0.65)',
          showProgressBar: true,
          progress: state.total > 0 ? state.done / state.total : 0,
        };
      case 'stale-scan':
        return {
          bg: '#FFEFE3',
          icon: '✨',
          title: 'Time to re-scan',
          titleColor: '#2D1810',
          subtitle: `It's been ${state.daysSince} days. See how you're doing.`,
          subtitleColor: 'rgba(45,24,16,0.65)',
          showProgressBar: false,
          progress: 0,
        };
      case 'fresh-scan':
        return {
          bg: '#FFEFE3',
          icon: '🎯',
          title: "Today's focus",
          titleColor: '#2D1810',
          subtitle: state.topConcern,
          subtitleColor: 'rgba(45,24,16,0.65)',
          showProgressBar: false,
          progress: 0,
        };
      case 'default-rescan':
        return {
          bg: 'white',
          icon: '🔍',
          title: 'Scan again',
          titleColor: '#2D1810',
          subtitle: 'Track your progress',
          subtitleColor: 'rgba(45,24,16,0.65)',
          showProgressBar: false,
          progress: 0,
        };
    }
  })();

  return (
    <Animated.View style={[animStyle, { marginBottom: 16 }]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          backgroundColor: config.bg,
          borderRadius: 32,
          padding: 28,
          borderWidth: state.kind === 'default-rescan' ? 1.5 : 0,
          borderColor: state.kind === 'default-rescan' ? '#E07856' : 'transparent',
          overflow: 'hidden',
        }}
      >
        {state.kind === 'first-scan' && (
          <View style={{
            position: 'absolute', top: -40, right: -40,
            width: 160, height: 160, borderRadius: 80,
            backgroundColor: 'rgba(255,255,255,0.1)',
          }} />
        )}
        <Text style={{ fontSize: 36, marginBottom: 10 }}>{config.icon}</Text>
        <Text style={{ fontSize: 22, fontFamily: 'Fraunces_700Bold', color: config.titleColor, marginBottom: 4 }}>
          {config.title}
        </Text>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: config.subtitleColor }}>
          {config.subtitle}
        </Text>
        {config.showProgressBar && (
          <View style={{ marginTop: 14, height: 6, backgroundColor: 'rgba(45,24,16,0.1)', borderRadius: 3 }}>
            <View style={{
              height: 6,
              width: `${Math.round(config.progress * 100)}%`,
              backgroundColor: '#E07856',
              borderRadius: 3,
            }} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/DynamicActionCard.tsx
git commit -m "feat: add DynamicActionCard with 5 hero states and progress bar"
```

---

## Task 15: `QuickActionTile` component

**Files:**
- Create: `components/home/QuickActionTile.tsx`

- [ ] **Step 1: Create the component**

Create `components/home/QuickActionTile.tsx`:

```typescript
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface QuickActionTileProps {
  icon: string;
  label: string;
  bg: string;
  borderColor: string;
  onPress: () => void;
}

export default function QuickActionTile({ icon, label, bg, borderColor, onPress }: QuickActionTileProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: 20,
        padding: 20,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 8 }}>{icon}</Text>
      <Text style={{ fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#2D1810' }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/QuickActionTile.tsx
git commit -m "feat: add QuickActionTile component"
```

---

## Task 16: `ContextualTipCard` component

**Files:**
- Create: `components/home/ContextualTipCard.tsx`

- [ ] **Step 1: Create the component**

Create `components/home/ContextualTipCard.tsx`:

```typescript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { MicroTip } from '@/lib/home/types';

interface ContextualTipCardProps {
  tip: MicroTip;
  concernLabel: string | null; // e.g. "dark spots" — null means show general header
  isDone: boolean;
  onMarkDone: () => void;
  enterDelay?: number;
}

export default function ContextualTipCard({ tip, concernLabel, isDone, onMarkDone, enterDelay = 0 }: ContextualTipCardProps) {
  const doneStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDone ? 0.6 : 1, { duration: 300 }),
  }));

  const header = concernLabel
    ? `🟤 For your ${concernLabel}`
    : '✨ Daily glow tip';

  return (
    <Animated.View
      entering={FadeInDown.delay(enterDelay).springify()}
      style={doneStyle}
    >
      <View style={{
        borderRadius: 20,
        padding: 20,
        backgroundColor: '#FBF2E0',
        borderWidth: 1,
        borderColor: 'rgba(212,165,116,0.2)',
      }}>
        <Text style={{ fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#D4A574', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
          {header}
        </Text>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>{tip.emoji}</Text>
        <Text style={{ fontSize: 16, fontFamily: 'Fraunces_700Bold', color: '#2D1810', marginBottom: 4 }}>
          {tip.title}
        </Text>
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(45,24,16,0.65)', lineHeight: 20, marginBottom: 16 }}>
          {tip.body}
        </Text>
        <TouchableOpacity
          onPress={isDone ? undefined : onMarkDone}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: isDone ? 'rgba(224,120,86,0.1)' : '#E07856',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: isDone ? '#E07856' : 'white' }}>
            {isDone ? 'Done ✓' : 'Mark as done ✓'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/ContextualTipCard.tsx
git commit -m "feat: add ContextualTipCard with concern header, mark-done, and fade animation"
```

---

## Task 17: Rewrite home screen orchestrator

**Files:**
- Modify: `app/(tabs)/index.tsx`

This task replaces the entire home screen file. All the logic is already in helpers and components built in earlier tasks.

- [ ] **Step 1: Rewrite `app/(tabs)/index.tsx`**

```typescript
import React, { useEffect, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '@/stores/useUserStore';
import { useScanStore, daysSinceLastScan, scansInLastNDays, scoreHistoryLastN } from '@/stores/useScanStore';
import { useRoutineStore, todayProgress, weeklyConsistency } from '@/stores/useRoutineStore';

import { getGreeting } from '@/lib/home/getGreeting';
import { selectHeroState } from '@/lib/home/selectHeroState';
import { selectDailyTip } from '@/lib/home/selectDailyTip';

import tips from '@/data/tips.json';
import { MicroTip, SkinConcern } from '@/lib/home/types';
import { getRoutine } from '@/lib/routineEngine';

import AmbientBlobs from '@/components/AmbientBlobs';
import HomeHeader from '@/components/home/HomeHeader';
import ScoreTrendCard from '@/components/home/ScoreTrendCard';
import StreakStrip from '@/components/home/StreakStrip';
import DynamicActionCard from '@/components/home/DynamicActionCard';
import QuickActionTile from '@/components/home/QuickActionTile';
import ContextualTipCard from '@/components/home/ContextualTipCard';

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function localDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const user = useUserStore((s) => s.user);
  const streak = useUserStore((s) => s.streak);
  const tickStreak = useUserStore((s) => s.tickStreak);

  const scanHistory = useScanStore((s) => s.scanHistory);
  const completions = useRoutineStore((s) => s.completions);
  const markTipDone = useRoutineStore((s) => s.markTipDone);

  // Tick streak once on mount
  useEffect(() => { tickStreak(); }, []);

  const now = new Date();
  const nowHour = now.getHours();
  const todayKey = localDateKey();

  const greetingPeriod = getGreeting(nowHour);
  const greetingText = t(`home_greeting_${greetingPeriod}`);

  const scanCount = scanHistory.length;
  const daysSince = useMemo(() => daysSinceLastScan(scanHistory), [scanHistory]);
  const scansThisWeek = useMemo(() => scansInLastNDays(scanHistory, 7), [scanHistory]);
  const scoreHistory = useMemo(() => scoreHistoryLastN(scanHistory, 7), [scanHistory]);
  const currentScore = scanHistory[0]?.overall_score ?? null;
  const previousScore = scanHistory[1]?.overall_score ?? null;
  const lastConcern = scanHistory[0]?.top_concern ?? null;

  // Derive the user's actual routine step IDs (skin-type + concern specific)
  const userRoutine = useMemo(
    () => getRoutine(user?.skinType ?? 'all', user?.mainConcern ?? 'all'),
    [user?.skinType, user?.mainConcern]
  );
  const AM_STEP_IDS = useMemo(() => userRoutine.morning.map((s) => s.id), [userRoutine]);
  const PM_STEP_IDS = useMemo(() => userRoutine.night.map((s) => s.id), [userRoutine]);

  const routineToday = useMemo(
    () => todayProgress(completions, todayKey, AM_STEP_IDS, PM_STEP_IDS),
    [completions, todayKey, AM_STEP_IDS, PM_STEP_IDS]
  );

  const consistencyPct = useMemo(
    () => weeklyConsistency(completions, AM_STEP_IDS, PM_STEP_IDS),
    [completions, AM_STEP_IDS, PM_STEP_IDS]
  );

  const hasAnyCompletions = Object.keys(completions).length > 0;

  const heroState = selectHeroState({
    scanCount,
    daysSinceLastScan: daysSince,
    lastScanTopConcern: lastConcern,
    nowHour,
    routineToday,
  });

  // Map top_concern string (from Gemini) to SkinConcern enum for tip filtering
  const skinConcernMap: Record<string, SkinConcern> = {
    'acne': 'acne', 'breakout': 'acne', 'blemish': 'acne',
    'dark spot': 'darkSpots', 'dark spots': 'darkSpots', 'hyperpigmentation': 'darkSpots',
    'dryness': 'dryness', 'dry': 'dryness',
    'aging': 'aging', 'anti-aging': 'aging', 'wrinkle': 'aging', 'firmness': 'aging',
    'dullness': 'dullness', 'dull': 'dullness', 'radiance': 'dullness',
  };
  const userConcern: SkinConcern | null = lastConcern
    ? (skinConcernMap[lastConcern.toLowerCase()] ?? null)
    : null;

  const dailyTip = selectDailyTip({ tips: tips as MicroTip[], userConcern, dayOfYear: getDayOfYear() });
  const isTipDone = completions[todayKey]?.tips?.includes(dailyTip.id) ?? false;

  function onHeroPress() {
    if (heroState.kind === 'routine-in-progress' || heroState.kind === 'fresh-scan') {
      router.push('/routine');
    } else {
      router.push('/scan');
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5EE' }}>
      <AmbientBlobs />
      <ScrollView
        style={{ flex: 1, zIndex: 10 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          name={user?.name || 'Friend'}
          greeting={greetingText}
          onAvatarPress={() => router.push('/(tabs)/profile')}
        />

        {currentScore !== null && (
          <ScoreTrendCard
            currentScore={currentScore}
            previousScore={previousScore}
            history={scoreHistory}
            onPress={() => router.push('/(tabs)/progress')}
          />
        )}

        <StreakStrip
          streakDays={streak.current}
          scansThisWeek={scansThisWeek}
          routineConsistencyPct={consistencyPct}
          hasAnyCompletions={hasAnyCompletions}
        />

        <DynamicActionCard state={heroState} onPrimaryPress={onHeroPress} />

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <QuickActionTile
            icon="🧴"
            label={t('check_product')}
            bg="#FFEFE3"
            borderColor="rgba(224,120,86,0.1)"
            onPress={() => router.push('/product-check')}
          />
          <QuickActionTile
            icon="🌿"
            label={t('my_routine')}
            bg="#FBF2E0"
            borderColor="rgba(212,165,116,0.2)"
            onPress={() => router.push('/routine')}
          />
        </View>

        <ContextualTipCard
          tip={dailyTip}
          concernLabel={userConcern ? lastConcern?.toLowerCase() ?? null : null}
          isDone={isTipDone}
          onMarkDone={() => markTipDone(todayKey, dailyTip.id)}
          enterDelay={160}
        />
      </ScrollView>
    </View>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. If there are path alias errors for `@/data/tips.json`, add `"resolveJsonModule": true` to `tsconfig.json` compilerOptions and re-run.

- [ ] **Step 3: Run all tests to confirm nothing broke**

```bash
npx jest --no-coverage
```

Expected: all tests pass

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/index.tsx
git commit -m "feat: rewrite home screen as thin orchestrator with dynamic hero and progress-first layout"
```

---

## Task 18: `tsconfig.json` — enable JSON module imports

**Files:**
- Modify: `tsconfig.json`

- [ ] **Step 1: Verify JSON import works**

```bash
npx tsc --noEmit 2>&1 | grep -i "json\|tips"
```

If you see an error about importing `tips.json`, proceed. If no error, skip this task.

- [ ] **Step 2: Enable resolveJsonModule**

Open `tsconfig.json`. Inside `"compilerOptions"`, add:

```json
"resolveJsonModule": true
```

- [ ] **Step 3: Re-run type check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json
git commit -m "chore: enable resolveJsonModule for data/tips.json import"
```

---

## Self-Review Checklist

After completing all tasks, verify the following manually:

- [ ] Fresh install state: `scanHistory = []` → hero shows "Scan your skin" (terracotta CTA), tip is a `general` tip
- [ ] One scan done today: hero shows "Today's focus" with `top_concern`, tip filtered by concern
- [ ] 9-day-old scan: hero shows "Time to re-scan · It's been 9 days"
- [ ] 8am, AM routine incomplete: hero shows "Morning routine · N of M done" with progress bar
- [ ] Open app two days in a row: streak pill shows "Day 2"
- [ ] Skip a day, reopen: streak resets to "Day 1"
- [ ] Tap "Mark as done ✓": card fades to 60%, button becomes "Done ✓"
- [ ] Reopen app same day: tip card still shows done state
- [ ] Open tomorrow: different tip shown, done state cleared
- [ ] Score improves from 75 → 83: delta badge shows "▲ +8" in green
- [ ] Score drops from 83 → 79: delta badge shows "▼ 4" in amber
- [ ] Only 1 scan: sparkline hidden, baseline subtitle shown
- [ ] ≥2 scans: sparkline visible, terracotta polyline
