# Personalized Product Scoring & Routine-Catalog Linking

**Date:** 2026-05-31
**Status:** Draft — pending dermatologist review
**Scope:** Client-side scoring engine + routine product linking. No Gemini calls, no UI redesign.

---

## 1. Problem

Product match scores are static per skin type. Two users with oily skin see identical scores regardless of their actual skin concerns. The app collects 10 scan metrics (hydration, blemish_prone, redness, oiliness, dark_spots, radiance, texture, firmness, wrinkles, dark_circles) but none feed into product scoring.

Additionally, routine steps have hardcoded product data (name, price, tag) with no link to the 143-product catalog. Users can't tap through to see ingredients, match scores, or alternatives.

## 2. Goals

1. Two users with the same skin type but different concerns see different product scores.
2. Scores are conservative — leave headroom for future products and Gemini V2.
3. Routine steps link to the product catalog, with a "See more options" path to product-check.
4. Zero regression — if scan data or product link is missing, existing behavior is preserved.

## 3. Personalized Scoring Engine

### 3.1 New file: `lib/scoringEngine.ts`

Pure function, no store dependency. Takes a `Product` and `ScanResult`, returns a personalized verdict.

```typescript
interface PersonalizedScore {
  matchScore: number;        // 0-85
  suitability: 'excellent' | 'good' | 'caution' | 'avoid';
  concernMatches: string[];  // which concerns matched elevated metrics
}

function getPersonalizedScore(product: Product, scanResult: ScanResult | null): PersonalizedScore;
```

### 3.2 Formula

```
baseScore = product.skinTypeMatch[userSkinType].matchScore * 0.75
concernBonus = sum of individual concern bonuses (capped at 15)
personalizedScore = clamp(baseScore + concernBonus, 0, 85)
```

**Damping factor: 0.75** — compresses static scores downward to create headroom.

**Hard cap: 85** — no product exceeds 85 until Gemini V2 or dermatologist-validated data.

### 3.3 Concern bonus mapping

Each product concern is checked against the user's scan metrics. Bonus per concern: 0-5 points. Total concern bonus capped at 15.

| Product concern | Scan metric | Severity calc |
|---|---|---|
| acne | blemish_prone | direct value |
| dark_spots | dark_spots | direct value |
| pigmentation | avg(dark_spots, 100 - radiance) | composite |
| dryness | 100 - hydration | inverted |
| anti_aging | avg(wrinkles, 100 - firmness) | composite |

**Bonus thresholds** (per concern):

| Severity | Threshold | Bonus |
|---|---|---|
| High | metric > 60 | +5 |
| Moderate | metric > 40 | +3 |
| Low | metric <= 40 | +1 |

Products with multiple matching concerns stack bonuses (e.g. a product targeting acne + dark_spots can earn up to +10 from those two concerns).

A product whose concerns don't match any elevated metric gets +0 or minimal (+1 each) bonus — its score stays damped, naturally ranking lower for this user.

### 3.4 Suitability labels (recalibrated)

| Score range | Label |
|---|---|
| 70-85 | excellent |
| 55-69 | good |
| 35-54 | caution |
| < 35 | avoid |

### 3.5 Fallback: no scan data

If the user has never scanned, `scanResult` is null:
- Score = `staticMatchScore * 0.75` (damped, no concern bonus)
- No "Personalized for you" badge shown
- Suitability derived from damped score using the same thresholds

### 3.6 Metrics NOT used (deferred for dermatologist)

The following scan metrics are collected but not factored into scoring in this version:
- redness
- oiliness
- texture
- dark_circles

These can be mapped to new product concerns in a future iteration after dermatologist review.

## 4. Routine-Catalog Linking

### 4.1 RoutineStep changes

Add optional `productId` field to the `RoutineStep` interface in `lib/routineData.ts`:

```typescript
export interface RoutineStep {
  // ... existing fields ...
  productId?: string;  // references Product.id in catalog
  product: {           // existing inline fallback (kept)
    name: string;
    price: string;
    tag: string;
    amazonUrl: string | null;
  };
}
```

Each existing routine step's hardcoded product is mapped to its catalog `id` where a match exists.

**Current coverage:** Of 17 unique products referenced in routine steps, only 5 exist in the catalog. The remaining 12 must be added to `products-seed.json` (and synced to Firebase Storage) as a prerequisite. Products to add:

- Biotique Bio Almond Oil
- Biotique Bio Dandelion Youth Anti-Ageing Serum
- Biotique Bio Honey Cream
- Biotique Bio Papaya Revitalising Scrub
- Biotique Bio Sandalwood SPF 50+ Sunscreen
- Biotique Winter Green Spot Correcting Anti-Acne Cream
- Himalaya Aloe Vera Gel
- Himalaya Clear Complexion Whitening Day Cream
- Himalaya Gentle Moisturizing Face Wash
- Himalaya Light Moisturizer
- Himalaya Tan Removal Walnut Scrub
- Khadi Natural Neem & Tulsi Face Wash

Each new product entry needs the full schema: concerns, skinTypeMatch (all 5 skin types), keyIngredients, improvements, warnings, and expectedTimeline in both English and Hindi.

The inline `product` field is retained as fallback for any unmapped steps.

### 4.2 Routine screen behavior

When rendering a routine step's product:

1. If `productId` exists AND product found in catalog:
   - Show product card with catalog data (name, brand, price, category tag)
   - Show personalized matchScore from `getPersonalizedScore()`
   - Tapping the card navigates to the product verdict screen (same as product-check)
   - Below the card, show "See more options" link
2. If `productId` missing OR product not found:
   - Render existing inline product data exactly as today
   - No score shown, no "See more" link
   - Zero regression

### 4.3 "See more options" behavior

Tapping "See more options" navigates to the product-check screen with pre-applied filters:
- `category` matching the routine step's product category (e.g. "cleanser")
- User's `top_concern` from their last scan

This surfaces personalized product rankings for that routine step's category.

### 4.4 Routine engine unchanged

The routine step selection logic (`lib/routineEngine.ts`) is NOT modified. It continues to filter `STEP_POOL` by skin type + concern and sort by priority. The only change is what data is displayed for each step's product recommendation.

## 5. Integration Points

### 5.1 Consumers of `getPersonalizedScore()`

1. **`app/(tabs)/product-check.tsx`** — replaces current static `product.skinTypeMatch[userSkinType]` lookup
2. **Routine screen** — scores the linked product for display
3. **Future:** any screen showing a product (home recommendations, etc.)

### 5.2 Data dependencies

- `getPersonalizedScore()` reads from: `Product` (from product store) + `ScanResult` (from scan store)
- No new stores, no new API calls, no Gemini usage

## 6. Scope Boundaries

**In scope:**
- New file: `lib/scoringEngine.ts`
- Modified: `lib/productTypes.ts` (if interface changes needed)
- Modified: `lib/routineData.ts` (add `productId` to interface + each step)
- Modified: `app/(tabs)/product-check.tsx` (use scoring engine)
- Modified: routine screen (render linked product + "See more")

**Out of scope:**
- No UI redesign of product-check or routine screens
- No new concern values (redness, texture, dark_circles) — dermatologist adds later
- No Gemini V2 dynamic verdicts
- No changes to scan flow or Gemini prompt
- No buy links or barcode scanning
- No routine engine logic changes

## 7. Example Scenarios

### Scenario A: Oily skin, high acne concern
User: skin_type=oily, blemish_prone=80, dark_spots=30
Product: Himalaya Neem Face Wash, static oily score=88, concerns=[acne]

- baseScore = 88 * 0.75 = 66
- concernBonus: acne + blemish_prone=80 (>60) = +5
- personalizedScore = 71 -> "excellent"

### Scenario B: Oily skin, dryness concern (unusual combo)
User: skin_type=oily, blemish_prone=20, hydration=30 (so 100-30=70)
Product: Himalaya Neem Face Wash, static oily score=88, concerns=[acne]

- baseScore = 88 * 0.75 = 66
- concernBonus: acne + blemish_prone=20 (<=40) = +1
- personalizedScore = 67 -> "good"

Different score for same product, same skin type. Personalization achieved.

### Scenario C: No scan data
User: never scanned
Product: Himalaya Neem Face Wash, static oily score=88

- baseScore = 88 * 0.75 = 66
- concernBonus = 0 (no scan data)
- personalizedScore = 66 -> "good"

### Scenario D: Product with multiple matching concerns
User: skin_type=dry, hydration=25 (severity=75), dark_spots=65
Product: moisturizer targeting [dryness, dark_spots], static dry score=80

- baseScore = 80 * 0.75 = 60
- dryness bonus: 100-25=75 (>60) = +5
- dark_spots bonus: 65 (>60) = +5
- concernBonus = 10
- personalizedScore = 70 -> "excellent"

## 8. Dermatologist Review Points

The following decisions are flagged for dermatologist input:

1. **Concern-metric mapping accuracy** — is blemish_prone the right proxy for acne product relevance? Should oiliness factor in?
2. **Bonus thresholds** — are 40/60 the right severity breakpoints, or should they vary by concern?
3. **Missing metrics** — should redness, texture, oiliness, or dark_circles map to existing or new product concerns?
4. **Damping factor** — is 0.75 too aggressive or too lenient?
5. **Cap at 85** — appropriate ceiling for client-side scoring?
6. **Anti-aging composite** — is avg(wrinkles, 100-firmness) a reasonable severity proxy?
7. **Pigmentation composite** — is avg(dark_spots, 100-radiance) reasonable?
