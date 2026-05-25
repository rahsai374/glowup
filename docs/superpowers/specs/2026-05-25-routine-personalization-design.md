# Routine Personalization — Design Spec
_Date: 2026-05-25_

## Overview

Replace the current hardcoded routine screen with a heuristic-based personalized routine that adapts to each user's scan result. Every user gets a different set of steps and products based on their detected **skin type** and **top concern** from the Gemini scan.

No additional AI call is made on the routine screen — all logic is pure TypeScript running client-side.

---

## Product Tier (current)

**Option B** — Home remedies as primary step + widely available Indian drugstore products as upgrade option. All products ≤ ₹300. Brands: Himalaya, Biotique, Dabur, Vicco, Khadi Natural.

**Future migration: Option C** — Budget-first drugstore (Minimalist, Simple, Cetaphil, CeraVe ₹200–700) with home remedy as swap. To be triggered based on user feedback post-launch. Migration path: add a `tier: 'B' | 'C'` field to each step and filter by user preference.

---

## Personalization Signals Used

| Signal | Source | Used for |
|---|---|---|
| `skin_type` | Gemini scan result | Base routine bucket |
| `top_concern` | Gemini scan result | Concern-specific step add-ons |
| `mainConcern` | Onboarding Q1 | Normalizer fallback only |

**Not used in MVP:** `waterIntake`, `sunscreenHabit`, `ageRange` (deferred to post-launch).

---

## Architecture

### New Files

```
lib/
  routineData.ts       # Step pool (31 steps, fully seeded)
  routineEngine.ts     # getRoutine() pure function + concern normalizer
```

### Modified Files

```
app/routine.tsx        # Reads from scan store, calls getRoutine(), renders result
```

---

## Data Model

### Types (`lib/routineData.ts`)

```ts
type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'all';
type Concern  = 'acne' | 'dark_spots' | 'pigmentation' | 'dryness' | 'anti_aging' | 'all';
type TimeOfDay = 'morning' | 'night' | 'weekly';

interface RoutineStep {
  id: string;
  title: string;
  timeOfDay: TimeOfDay;
  priority: number;        // lower = shown first within a tab
  skinTypes: SkinType[];   // ['oily','combination'] or ['all']
  concerns: Concern[];     // ['acne'] or ['all']

  remedy: {
    label: string;         // e.g. "Besan + rose water"
    how: string;           // usage instruction
  };

  product: {
    name: string;          // e.g. "Himalaya Purifying Neem Face Wash"
    price: string;         // e.g. "₹75"
    tag: string;           // e.g. "Available at any chemist"
    amazonUrl: string | null;  // null for MVP — dummy button
  };
}
```

### Step Pool — Full Seed Data (31 steps)

#### Base Steps — `concerns: ['all']`

**Morning (8 steps)**

| id | title | skinTypes | remedy | product | price |
|---|---|---|---|---|---|
| morning-cleanse-oily | Cleanse | oily, combination | Besan + rose water paste — massage 60s, rinse cold | Himalaya Purifying Neem Face Wash | ₹75 |
| morning-cleanse-dry | Cleanse | dry, normal | Raw milk + honey — massage gently, rinse lukewarm | Himalaya Gentle Moisturizing Face Wash | ₹75 |
| morning-tone-all | Tone | all | Chilled rose water spritz / cotton pad | Dabur Gulabari Rose Water | ₹90 |
| morning-moisturise-oily | Moisturise | oily | Fresh aloe vera gel — thin layer, let absorb | Himalaya Aloe Vera Gel | ₹90 |
| morning-moisturise-combination | Moisturise | combination | Aloe vera gel — T-zone only, light on cheeks | Himalaya Aloe Vera Gel | ₹90 |
| morning-moisturise-dry | Moisturise | dry | Coconut oil + rose water blend — pat on damp skin | Biotique Bio Honey Cream | ₹150 |
| morning-moisturise-normal | Moisturise | normal | Aloe vera + 2 drops coconut oil — apply evenly | Himalaya Light Moisturizer | ₹120 |
| morning-sunscreen-all | Sunscreen | all | Zinc oxide powder in moisturizer (basic protection only) | Biotique Bio Sandalwood SPF 50+ | ₹180 |

**Night (5 steps)**

| id | title | skinTypes | remedy | product | price |
|---|---|---|---|---|---|
| night-cleanse-oily | Cleanse | oily, combination | Multani mitti + rose water — apply, 2 mins, rinse | Khadi Natural Neem & Tulsi Face Wash | ₹180 |
| night-cleanse-dry | Cleanse | dry, normal | Curd + honey — massage, rinse cool water | Himalaya Gentle Moisturizing Face Wash | ₹75 |
| night-nourish-oily | Night Gel | oily, combination | Aloe vera gel thin layer — leave overnight | Himalaya Aloe Vera Gel | ₹90 |
| night-nourish-dry | Night Oil | dry | Warm coconut oil — massage upward 2–3 mins | Biotique Bio Almond Oil | ₹150 |
| night-nourish-normal | Night Cream | normal | Aloe vera + 2 drops castor oil | Himalaya Revitalizing Night Cream | ₹220 |

**Weekly (2 steps)**

| id | title | skinTypes | remedy | product | price |
|---|---|---|---|---|---|
| weekly-exfoliate-oily | Exfoliate | oily, combination | Multani mitti + neem powder + rose water — 10 mins | Himalaya Tan Removal Walnut Scrub | ₹120 |
| weekly-exfoliate-dry | Exfoliate | dry, normal | Curd + sugar scrub — gentle circles 30–45s | Biotique Bio Papaya Revitalising Scrub | ₹180 |

#### Concern-Specific Steps

**Acne (4 steps)**

| time | skinTypes | step | remedy | product | price |
|---|---|---|---|---|---|
| morning | oily, combination | Spot Treatment | Neem + haldi paste on spots only, 10 mins | Biotique Winter Green Spot Correcting Cream | ₹150 |
| morning | dry, normal | Spot Treatment | Raw honey + neem oil dot on spots, 15 mins | Biotique Winter Green Spot Correcting Cream | ₹150 |
| night | all | Anti-Acne Night | Thin Vicco layer on problem areas overnight | Vicco Turmeric Skin Cream | ₹95 |
| weekly | all | Purifying Mask | Multani mitti + neem + haldi + rose water, 10 mins | Himalaya Purifying Neem Face Pack | ₹100 |

**Dark Spots (3 steps)**

| time | skinTypes | step | remedy | product | price |
|---|---|---|---|---|---|
| morning | all | Brightening Treatment | Grated potato juice + rose water on spots, 15 mins | Himalaya Clear Complexion Day Cream | ₹175 |
| night | all | Spot Fading | Haldi + raw honey dab on spots — leave 30 mins or overnight | Vicco Turmeric Skin Cream | ₹95 |
| weekly | all | Brightening Mask | Ripe papaya pulp on face — 15 mins | Biotique Bio Papaya Revitalising Scrub | ₹180 |

**Pigmentation (3 steps)**

| time | skinTypes | step | remedy | product | price |
|---|---|---|---|---|---|
| morning | all | Even Tone Treatment | Kasturi haldi + curd paste — full face, 15 mins | Biotique Bio Dandelion Anti-Ageing Serum | ₹240 |
| night | all | Brightening Night | Besan + kasturi haldi + curd — classic ubtan, 20 mins | Vicco Turmeric Skin Cream | ₹95 |
| weekly | all | Ubtan Mask | Besan + kasturi haldi + saffron in warm milk — scrub off | Biotique Bio Papaya Revitalising Scrub | ₹180 |

**Dryness (3 steps)**

| time | skinTypes | step | remedy | product | price |
|---|---|---|---|---|---|
| morning | all | Hydration Boost | Glycerin (₹30 at chemist) + rose water — pat on damp skin | Biotique Bio Honey Cream | ₹150 |
| night | all | Deep Nourish | Warm coconut + almond oil blend — massage upward, sleep with it | Biotique Bio Almond Oil | ₹150 |
| weekly | all | Hydrating Mask | Curd + honey + aloe vera gel — thick layer, 20 mins | Biotique Bio Honey Cream | ₹150 |

**Anti-Aging (3 steps)**

| time | skinTypes | step | remedy | product | price |
|---|---|---|---|---|---|
| morning | all | Firming Treatment | Upward facial massage with almond oil — 3 mins | Biotique Bio Dandelion Anti-Ageing Serum | ₹240 |
| night | all | Nourishing Night | Castor + coconut oil (1:2) — massage upward, sleep with it | Himalaya Revitalizing Night Cream | ₹220 |
| weekly | all | Firming Mask | Egg white + honey — apply upward, leave till dry (~12 mins) | Biotique Bio Almond Oil | ₹150 |

---

## Routine Engine (`lib/routineEngine.ts`)

### Concern Validator

The Gemini prompt is updated to constrain `top_concern` to an enum — no fuzzy string matching needed:

**Change to `lib/gemini.ts` prompt:**
```
// Before
"top_concern": "<string>",

// After
"top_concern": "<acne|dark_spots|pigmentation|dryness|anti_aging>",
```

The validator simply checks if the returned value is a valid Concern key. If not (unexpected Gemini output), it defaults to `'all'`:

```ts
const VALID_CONCERNS: Concern[] = ['acne', 'dark_spots', 'pigmentation', 'dryness', 'anti_aging'];
function validateConcern(raw: string): Concern {
  return VALID_CONCERNS.includes(raw as Concern) ? (raw as Concern) : 'all';
}
```

This is language-agnostic — works regardless of Hindi/English app mode since the constraint is in the prompt instructions, not the UI language.

### `getRoutine(skinType, topConcern)` Logic

```
1. Validate topConcern → Concern key (or 'all')
2. Filter step pool:
     step.skinTypes includes skinType OR step.skinTypes includes 'all'
     AND (step.concerns includes concern OR step.concerns includes 'all')
3. Sort by priority (ascending)
4. Group by timeOfDay → { morning: Step[], night: Step[], weekly: Step[] }
5. Fallback: if any time slot has < 2 steps, backfill with concern='all' steps for that skinType
```

---

## UI Changes (`app/routine.tsx`)

### Data Flow
```
useScanStore.currentScan → skinType + top_concern
  → getRoutine(skinType, topConcern)
  → { morning[], night[], weekly[] }
  → rendered in tabs
```

### Card Layout (expanded state)
```
┌────────────────────────────────────┐
│ 1  Cleanse                      ↑  │
├────────────────────────────────────┤
│ 🏠 Home Remedy                      │
│ [remedy.label]                     │
│ [remedy.how — usage instructions]  │
├────────────────────────────────────┤
│ 🛍️ Product                          │
│ [product.name]                     │
│ [product.tag]            [price]   │
│       [ Buy on Amazon → ]          │  ← dummy, logs to console
└────────────────────────────────────┘
```

### Empty State (no scan)
If `currentScan` is null, do **not** show a routine. Instead render a full empty state screen:

```
┌────────────────────────────────────┐
│                                    │
│         ✨ (glow illustration)     │
│                                    │
│   Your routine will glow here      │
│                                    │
│  We need to see your skin first    │
│  to build a routine made just      │
│  for you.                          │
│                                    │
│    [ Scan Now & GlowUp 🌟 ]        │  ← navigates to /scan
│                                    │
└────────────────────────────────────┘
```

- Heading: `"Your routine will glow here"` (Fraunces, 24px)
- Body: `"We need to see your skin first to build a routine made just for you."` (Plus Jakarta Sans)
- CTA button: `"Scan Now & GlowUp 🌟"` — terracotta `#E07856`, navigates to `/scan`
- Ambient blobs rendered as usual behind the empty state
- Copy available in both `en` and `hi` i18n namespaces

---

## Prod Readiness Checklist

- [ ] Wire "Buy on Amazon" button with real affiliate deep links
- [ ] Migrate product tier to Option C based on user feedback
- [ ] Consider `ageRange` → unlock anti-aging steps for 30+
- [ ] Consider `sunscreenHabit: 'Never'` → extra sunscreen emphasis step
- [ ] Consider `waterIntake` → hydration step intensity modifier
- [ ] Move Gemini call to Cloud Functions before App Store submission

---

## Out of Scope (this spec)

- AI-generated routine (no Gemini call on routine screen)
- Real Amazon affiliate links
- Option C product tier
- Onboarding signal modifiers (waterIntake, sunscreenHabit, ageRange)
- Push notification reminders for routine steps
