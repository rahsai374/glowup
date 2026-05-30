# Product Catalog & Search — Design Spec

**Date:** 2026-05-30
**Status:** Draft
**Scope:** Seed product database, in-memory fuzzy search, product browse screen

---

## 1. Objective

Replace the "Coming Soon" Product Check placeholder with a functional product catalog. Ship ~150 budget beauty products as seed data, organized by skin type and concern. Provide in-memory fuzzy search so users can find products by name, brand, or category — no backend needed.

**Target user:** Indian women looking for affordable skincare products (₹50–₹800) matched to their skin type and concerns.

---

## 2. Approach Decision

**Chosen: Firebase Storage JSON file + AsyncStorage cache + bundled fallback + Fuse.js in-memory search**

| Option | Verdict | Rationale |
|---|---|---|
| A) Static JSON only | Rejected | No ability to update products without OTA push or app rebuild. |
| B) Firestore collection (150 docs) | Rejected | Burns 150 reads per app open. Wastes Firestore quota better spent on user data/scans. |
| C) Firestore single document | Rejected | Works but still burns Firestore reads. 1MB doc size limit. |
| D) Firebase Storage JSON file | **Selected** | 1 file download (~50KB). Zero Firestore reads. No size limit. Costs only bandwidth (5GB/day free). Update by uploading a new file. |

**Why Firebase Storage:**
- Zero Firestore read cost — reserves quota for user profiles and scan history.
- ~50KB download per app open is negligible (even on slow Indian mobile networks: <200ms).
- Firebase Storage is already configured in the project (`lib/firebase.ts` exports `storage`).
- Update workflow: upload a new `products.json` to Firebase Storage console → reflected on next app open.
- Storage free tier: 5GB stored, 1GB/day downloads — effectively unlimited at this scale.

**Data flow:**
```
App open → read AsyncStorage cache → render UI immediately
        ↘ (or bundled fallback if no cache yet)
        → background (fire-and-forget): download products.json from Firebase Storage
        → on success: replace AsyncStorage cache + update in-memory state
        → on failure: do nothing — cached/bundled data stays, user never notices
```

**Critical constraint:** The background fetch MUST NOT block app load or product page load. The UI always renders from cache/bundle first. The fetch is fire-and-forget — if it succeeds, the product list silently updates; if it fails, nothing happens.

---

## 3. Data Model

### 3.1 Product Interface

```typescript
// lib/productTypes.ts

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
  matchScore: number;  // 0–100
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
  id: string;                    // kebab-case slug, e.g. "himalaya-neem-face-wash"
  name: string;                  // "Himalaya Purifying Neem Face Wash"
  brand: string;                 // "Himalaya"
  category: ProductCategory;     // "cleanser"
  concerns: Concern[];           // what concerns this product addresses
  price: number;                 // numeric ₹ value for sorting/filtering (e.g. 175)
  priceDisplay: string;          // "₹175" — pre-formatted for display
  size: string;                  // "150ml" / "50g"
  description: string;           // one-line product pitch (< 120 chars)
  imageUrl: string | null;       // Amazon/Nykaa CDN URL, null if unavailable
  tags: string[];                // ["bestseller", "ayurvedic", "dermat-recommended"]
  rating: number;                // approximate rating out of 5 (e.g. 4.3)

  // ── Per-skin-type match data (pre-computed) ──────────────────────────
  skinTypeMatch: Record<SkinType, SkinTypeMatch>;
  // Looked up by user's skin type at render time:
  //   const match = product.skinTypeMatch[userSkinType];
  //   match.suitability → "excellent" | "good" | "caution" | "avoid"
  //   match.matchScore  → 0–100

  // ── Ingredient analysis ──────────────────────────────────────────────
  keyIngredients: ProductIngredient[];

  // ── Expected improvements ────────────────────────────────────────────
  improvementsEn: string[];      // ["Visible reduction in dark spots", ...]
  improvementsHi: string[];      // ["काले धब्बे और झाइयों में कमी", ...]

  // ── Warnings / cautions ──────────────────────────────────────────────
  warningsEn: string[];          // general cautions (e.g. "Patch test first")
  warningsHi: string[];

  // ── Expected timeline ────────────────────────────────────────────────
  expectedTimeline: ProductTimeline[];
}
```

**Key decisions:**

- **`skinTypeMatch` is a Record keyed by SkinType** — pre-computed suitability + match score for each skin type. The UI looks up the user's skin type and displays the corresponding verdict. The `'all'` key provides a general-purpose fallback.
- **`keyIngredients`** — each ingredient has a `rating` (good/neutral/bad) and bilingual benefit text. Drives the ingredient analysis card in the results view.
- **`improvementsEn/Hi` + `expectedTimeline`** — pre-authored content describing what areas the product helps improve and when the user can expect results. This is the "is this product right for my skin" answer.
- **`warningsEn/Hi`** — general cautions (e.g. "Contains SLS — may dry out sensitive skin", "Patch test recommended"). Empty array if no warnings.
- **`price` is numeric** — enables sort-by-price and price range filtering. `priceDisplay` avoids runtime formatting.
- **`imageUrl` is nullable** — when null or when the URL fails to load, the UI falls back to a category emoji icon.
- **`concerns`** replaces the old `skinTypes` array — suitability is now captured in `skinTypeMatch`, so a flat `skinTypes` list is redundant.
- **Future: Gemini-powered verdicts.** In a later version, `skinTypeMatch`, `keyIngredients`, improvements, warnings, and timeline can be generated dynamically per user via Gemini instead of pre-computed. The UI stays the same — only the data source changes.

### 3.2 Category Emoji Map (fallback icons)

```typescript
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
```

### 3.3 Suitability Config (UI colors)

```typescript
export const SUITABILITY_CONFIG: Record<ProductSuitability, {
  labelEn: string; labelHi: string;
  bg: string; light: string; text: string; border: string;
}> = {
  excellent: {
    labelEn: 'Excellent Match', labelHi: 'बेहतरीन मैच',
    bg: '#22C55E', light: '#F0FDF4', text: '#15803D', border: '#BBF7D0',
  },
  good: {
    labelEn: 'Good Match', labelHi: 'अच्छा मैच',
    bg: '#10B981', light: '#ECFDF5', text: '#047857', border: '#A7F3D0',
  },
  caution: {
    labelEn: 'Use With Caution', labelHi: 'सावधानी से उपयोग करें',
    bg: '#F97316', light: '#FFF7ED', text: '#C2410C', border: '#FED7AA',
  },
  avoid: {
    labelEn: 'Not Recommended', labelHi: 'अनुशंसित नहीं',
    bg: '#EF4444', light: '#FEF2F2', text: '#B91C1C', border: '#FECACA',
  },
};
```

### 3.4 Sample Product Entry

```json
{
  "id": "minimalist-salicylic-acid-cleanser",
  "name": "Minimalist 2% Salicylic Acid Face Wash",
  "brand": "Minimalist",
  "category": "cleanser",
  "concerns": ["acne", "dark_spots"],
  "price": 299,
  "priceDisplay": "₹299",
  "size": "100ml",
  "description": "Gentle BHA cleanser that unclogs pores without stripping moisture",
  "imageUrl": "https://m.media-amazon.com/images/I/51xKHOBpLkL._SL300_.jpg",
  "tags": ["bestseller", "dermat-recommended", "mid-range"],
  "rating": 4.3,

  "skinTypeMatch": {
    "oily":        { "suitability": "excellent", "matchScore": 92 },
    "combination": { "suitability": "good",      "matchScore": 78 },
    "dry":         { "suitability": "caution",   "matchScore": 45 },
    "normal":      { "suitability": "good",      "matchScore": 72 },
    "all":         { "suitability": "good",      "matchScore": 72 }
  },

  "keyIngredients": [
    {
      "name": "Salicylic Acid 2%",
      "nameHi": "सैलिसिलिक एसिड 2%",
      "benefitEn": "Unclogs pores, reduces acne and blackheads",
      "benefitHi": "रोमछिद्र खोलता है, मुंहासे और ब्लैकहेड्स कम करता है",
      "rating": "good"
    },
    {
      "name": "Zinc PCA",
      "nameHi": "ज़िंक PCA",
      "benefitEn": "Controls excess oil production",
      "benefitHi": "अतिरिक्त तेल उत्पादन नियंत्रित करता है",
      "rating": "good"
    },
    {
      "name": "SLS-Free Formula",
      "nameHi": "SLS-मुक्त फॉर्मूला",
      "benefitEn": "Gentle cleansing without stripping moisture",
      "benefitHi": "नमी छीने बिना सौम्य सफाई",
      "rating": "good"
    }
  ],

  "improvementsEn": [
    "Fewer breakouts and clearer skin",
    "Reduced blackheads and whiteheads",
    "Less oily T-zone throughout the day",
    "Smoother skin texture"
  ],
  "improvementsHi": [
    "कम मुंहासे और साफ़ त्वचा",
    "ब्लैकहेड्स और व्हाइटहेड्स में कमी",
    "दिनभर T-zone पर कम तेल",
    "मुलायम त्वचा"
  ],

  "warningsEn": [
    "May cause dryness if used more than twice daily",
    "Always follow with a moisturizer"
  ],
  "warningsHi": [
    "दिन में दो बार से ज़्यादा उपयोग करने पर रूखापन हो सकता है",
    "इसके बाद हमेशा मॉइस्चराइज़र लगाएं"
  ],

  "expectedTimeline": [
    {
      "weeksEn": "1–2 weeks",
      "weeksHi": "1–2 हफ़्ते",
      "resultEn": "Skin feels less oily, fewer new breakouts",
      "resultHi": "त्वचा कम तैलीय, नए मुंहासे कम"
    },
    {
      "weeksEn": "4 weeks",
      "weeksHi": "4 हफ़्ते",
      "resultEn": "Visible reduction in blackheads and acne marks",
      "resultHi": "ब्लैकहेड्स और एक्ने के निशान कम दिखने लगते हैं"
    },
    {
      "weeksEn": "8 weeks",
      "weeksHi": "8 हफ़्ते",
      "resultEn": "Clearer, smoother skin with controlled oil",
      "resultHi": "साफ़, मुलायम त्वचा और नियंत्रित तेल"
    }
  ]
}
```

---

## 4. Firebase Storage & Data Sync

### 4.1 Storage Layout

A single JSON file in Firebase Storage:

```
gs://{bucket}/data/products.json
```

This file contains the full product array — one file, one download, all products. At ~150 products this is approximately 50-80KB.

**Firebase Storage security rules:**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /data/products.json {
      allow read: if request.auth != null;
      allow write: if false;  // upload via Firebase console or Admin SDK only
    }
  }
}
```

### 4.2 Seed Data Upload

Upload the initial `products.json` to Firebase Storage. Two methods:

1. **Firebase console:** Storage → Upload file → `data/products.json` (manual, one-time)
2. **Script:** `node scripts/upload-products.js` using Firebase Admin SDK (for automation)

```
scripts/
  upload-products.js      # uploads data/products-seed.json → Storage as data/products.json
data/
  products-seed.json      # the compiled product list (also serves as bundled app fallback)
```

To update products later: edit `products-seed.json` (or prepare a new JSON) and re-upload to Firebase Storage. Next app open picks up the new data.

### 4.3 Product Store (Zustand)

```typescript
// stores/useProductStore.ts

interface ProductStore {
  products: Product[];
  lastSynced: number | null;
  hydrate: () => void;                    // sync load from cache/bundle
  syncFromStorage: () => Promise<void>;   // background fetch, fire-and-forget
}
```

### 4.4 Sync Flow

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import BUNDLED_PRODUCTS from '@/data/products-seed.json';

const CACHE_KEY = 'products_cache';

// Step 1: Called on app open — synchronous-ish, never blocks
function hydrate() {
  // Try cache first
  AsyncStorage.getItem(CACHE_KEY).then(cached => {
    if (cached) {
      set({ products: JSON.parse(cached) });
    }
  });
  // If no cache exists yet, bundled data is the initial state
}

// Step 2: Called after hydrate — fire-and-forget, non-blocking
async function syncFromStorage() {
  try {
    const url = await getDownloadURL(ref(storage, 'data/products.json'));
    const response = await fetch(url);
    if (!response.ok) return;
    const fresh: Product[] = await response.json();
    set({ products: fresh, lastSynced: Date.now() });
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
  } catch {
    // Silent failure — cached/bundled data stays untouched
  }
}
```

**Initialization in `_layout.tsx`:**

```typescript
// After auth resolves, alongside existing hydrateFromFirestore()
useProductStore.getState().hydrate();
useProductStore.getState().syncFromStorage(); // fire-and-forget, no await
```

### 4.5 Key Behaviors

- **Never blocks app load:** `hydrate()` reads from cache (fast) or falls back to bundled data. `syncFromStorage()` is called without `await` — true fire-and-forget.
- **Never blocks product page:** The product screen reads from the Zustand store, which is already populated from cache/bundle before the user can navigate there.
- **Cache only replaced on success:** If `syncFromStorage()` fails at any point (network error, parse error, Storage outage), the existing cache is untouched. The user keeps seeing the last known good data.
- **Silent update:** If the background fetch succeeds and the data changed, the Zustand store updates and the product screen re-renders with fresh data. No loading spinner, no flash — products just update in place.
- **Bundled fallback:** `BUNDLED_PRODUCTS` (imported from `data/products-seed.json`) is the Zustand store's initial state. This guarantees data exists even on first install with no network and no cache.

### 4.6 Bundled Fallback

`data/products-seed.json` is imported directly as the store's initial state:

```typescript
import BUNDLED_PRODUCTS from '@/data/products-seed.json';

// In store definition:
products: BUNDLED_PRODUCTS as Product[],
```

This file serves dual purpose:
1. **App fallback** — always available, no network needed
2. **Upload source** — the same file gets uploaded to Firebase Storage as the initial `products.json`

After upload, Firebase Storage is the authoritative source. The bundle is a safety net that may drift behind — acceptable for MVP.

---

## 5. Fuzzy Search

### 5.1 Library

**Fuse.js** (~5KB gzipped). Chosen over alternatives:

| Library | Verdict | Why |
|---|---|---|
| Fuse.js | **Selected** | Best fuzzy/typo tolerance, lightweight, proven in RN, weighted multi-field search |
| FlexSearch | Rejected | Larger bundle, optimized for full-text (overkill for 150 products) |
| Custom prefix | Rejected | No typo tolerance ("sunscren" won't match "sunscreen") |
| MiniSearch | Rejected | Similar to Fuse.js but less RN community adoption |

### 5.2 Search Configuration

```typescript
import Fuse from 'fuse.js';
import { Product } from '@/data/products';

const fuseOptions: Fuse.IFuseOptions<Product> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'brand', weight: 0.3 },
    { name: 'category', weight: 0.15 },
    { name: 'tags', weight: 0.15 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
};
```

**Weight rationale:**
- `name` highest (0.4) — users most often search by product name
- `brand` next (0.3) — "himalaya", "minimalist", "plum" are common queries
- `category` + `tags` (0.15 each) — enables "sunscreen", "ayurvedic" style searches

### 5.3 Search + Filter Pipeline

```
User input → Fuse.js fuzzy match → post-filter by active skin type chips
                                  → post-filter by active category chips
                                  → sorted results rendered
```

When search query is empty, all products are shown (filtered only by active chips), grouped by category.

### 5.4 Search Hook

```typescript
// hooks/useProductSearch.ts

export function useProductSearch(products: Product[]) {
  const [query, setQuery] = useState('');
  const [skinTypeFilter, setSkinTypeFilter] = useState<SkinType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | null>(null);

  const fuse = useMemo(() => new Fuse(products, fuseOptions), [products]);

  const results = useMemo(() => {
    let filtered = query.length >= 2
      ? fuse.search(query).map(r => r.item)
      : products;

    if (skinTypeFilter) {
      filtered = filtered.filter(p => {
        const match = p.skinTypeMatch[skinTypeFilter];
        return match && (match.suitability === 'excellent' || match.suitability === 'good');
      });
    }
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    return filtered;
  }, [query, skinTypeFilter, categoryFilter, fuse, products]);

  return { query, setQuery, skinTypeFilter, setSkinTypeFilter,
           categoryFilter, setCategoryFilter, results };
}
```

---

## 6. Product Images

### 6.1 Source

Amazon India product images from public CDN URLs.

**URL format:** `https://m.media-amazon.com/images/I/{image-id}._SL300_.jpg`

The `_SL300_` suffix requests a 300px-wide version — adequate for product cards and fast to load. These URLs are:
- Publicly accessible (no auth)
- Served from Amazon's global CDN (fast in India)
- Stable for existing products (URLs persist for years)

### 6.2 Fallback Strategy

```
imageUrl loads successfully → show product image
imageUrl fails (onError)   → show category emoji in a tinted circle
imageUrl is null           → show category emoji in a tinted circle
```

**Fallback component:**

```tsx
function ProductImage({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);

  if (!product.imageUrl || failed) {
    return (
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{CATEGORY_EMOJI[product.category]}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: product.imageUrl }}
      style={styles.image}
      onError={() => setFailed(true)}
    />
  );
}
```

### 6.3 Image Risk & Mitigation

| Risk | Likelihood | Mitigation |
|---|---|---|
| Amazon changes URL format | Low | Emoji fallback renders gracefully. Batch-verify URLs on data updates. |
| Image removed for specific product | Medium | `onError` triggers emoji fallback. User still sees product info. |
| Slow load on poor network | Medium | Add `placeholder` color (cream bg) while loading. Images are ~15-30KB at SL300. |

---

## 7. Screen Design — Product Check (3-Step Flow)

The screen has 3 states managed by local component state, matching the original design prototype. All 3 states live in `app/product-check.tsx` — no new routes.

```typescript
type Step = 'search' | 'analyzing' | 'results';
const [step, setStep] = useState<Step>('search');
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
```

### 7.1 Step 1 — Search & Browse

```
┌─────────────────────────────────┐
│ ←  Product Check       (header) │
│    "Is it right for your skin?" │
│    "Personalized for your       │
│     oily skin"                  │
├─────────────────────────────────┤
│ 🔍 Search products...           │
├─────────────────────────────────┤
│ ┌─ Scan Barcode ─────────────┐  │  ← dashed border CTA (future)
│ │  📷  Scan Barcode          │  │
│ └────────────────────────────┘  │
├─────────────────────────────────┤
│ POPULAR PRODUCTS                │
│ ┌────────────────────────────┐  │
│ │ 🧪  Plum Niacinamide Serum│  │  ← product list (not grid)
│ │     Serum • ₹385        → │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ 🍊  Mamaearth Vit C Wash  │  │
│ │     Face Wash • ₹249    → │  │
│ └────────────────────────────┘  │
│ ...                             │
└─────────────────────────────────┘
```

**Behavior:**
- Empty query shows top 4–6 popular products (sorted by rating or tagged `bestseller`)
- Typing filters via Fuse.js fuzzy search
- Tapping a product → sets `selectedProduct`, transitions to `analyzing` step
- Barcode scan CTA is present but disabled for MVP (shows "Coming soon" toast)
- Header subline shows user's skin type: "Personalized for your {skinType} skin"

### 7.2 Step 2 — Analyzing Animation

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         ┌──────────┐            │
│         │  ◌ spin  │            │
│         │   🧪     │            │  ← product emoji + spinning ring
│         └──────────┘            │
│                                 │
│     "Matching to your skin..."  │
│     "Analyzing 3 ingredients"   │
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Behavior:**
- Animated spinner ring around the product emoji (reanimated `withRepeat`)
- Shows "Matching to your skin..." text
- Shows ingredient count: "Analyzing {n} ingredients"
- Auto-transitions to `results` after ~2s delay (`setTimeout`)
- Pure animation — no actual computation happening (data is pre-computed)

### 7.3 Step 3 — Product Verdict

```
┌─────────────────────────────────┐
│ ←  (back to search)    (header) │
├─────────────────────────────────┤
│ ┌────────────────────────────┐  │
│ │ 🧪 Plum Niacinamide Serum │  │  ← product info
│ │    Plum • ₹385            │  │
│ ├────────────────────────────┤  │
│ │ ✅ Excellent Match         │  │  ← verdict band (color-coded)
│ │    For your oily skin     │  │
│ ├────────────────────────────┤  │
│ │ Match Score        92/100 │  │  ← animated progress bar
│ │ ████████████████████░░░░  │  │
│ └────────────────────────────┘  │
│                                 │
│ KEY INGREDIENTS                 │
│ ┌────────────────────────────┐  │
│ │ ✅ Salicylic Acid 2%      │  │  ← green = good
│ │    Unclogs pores, reduces │  │
│ │    acne and blackheads    │  │
│ ├────────────────────────────┤  │
│ │ ✅ Zinc PCA               │  │
│ │    Controls excess oil    │  │
│ └────────────────────────────┘  │
│                                 │
│ ✨ EXPECTED IMPROVEMENTS        │
│ ┌────────────────────────────┐  │
│ │ 1. Fewer breakouts        │  │
│ │ 2. Reduced blackheads     │  │
│ │ 3. Less oily T-zone      │  │
│ │ 4. Smoother texture       │  │
│ └────────────────────────────┘  │
│                                 │
│ 🕐 WHEN TO EXPECT RESULTS      │
│ ┌────────────────────────────┐  │
│ │ 1–2 weeks │ Less oily,    │  │
│ │           │ fewer breakout│  │
│ │ 4 weeks   │ Blackheads    │  │
│ │           │ visibly reduce│  │
│ │ 8 weeks   │ Clear, smooth │  │
│ │           │ controlled oil│  │
│ └────────────────────────────┘  │
│                                 │
│ ⚠️ IMPORTANT WARNINGS           │
│ ┌────────────────────────────┐  │
│ │ ⚠ May cause dryness if    │  │
│ │   used more than twice    │  │
│ │ ⚠ Always follow with a    │  │
│ │   moisturizer             │  │
│ └────────────────────────────┘  │
│                                 │
│ ┌────────────────────────────┐  │
│ │    Check Another Product   │  │  ← resets to search step
│ └────────────────────────────┘  │
└─────────────────────────────────┘
```

**Behavior:**
- Back button returns to search step (not router.back())
- Verdict band color from `SUITABILITY_CONFIG` based on `product.skinTypeMatch[userSkinType].suitability`
- Match score bar animates from 0 to `matchScore` over 1s
- Ingredients show color-coded icons: green (good), yellow (neutral), red (bad)
- Improvements numbered list in warm card
- Timeline shows week milestones with expected results
- Warnings section only shown if `warningsEn.length > 0`
- "Check Another Product" resets state to search step
- All text switches between En/Hi based on i18n language

### 7.4 Design Tokens

| Element | Style |
|---|---|
| Background | `bg-[#FFF5EE]` with ambient blobs |
| Header | Fraunces h1 + italic serif subline with user's skin type |
| Search bar | `bg-white rounded-2xl py-4 px-4 border border-[#E07856]/10` |
| Product list item | `bg-white rounded-2xl p-4 border border-[#E07856]/10 shadow-soft` |
| Verdict card | `bg-white rounded-3xl shadow-soft border border-[#E07856]/10` |
| Verdict band | Color from `SUITABILITY_CONFIG` — light bg + colored icon circle + bold label |
| Match score bar | `h-2.5 rounded-full` — color from suitability config |
| Ingredient card | `bg-white rounded-2xl p-4 border border-[#E07856]/10` |
| Ingredient icon | `w-8 h-8 rounded-full` — green-100/red-100/yellow-100 bg |
| Improvements card | `bg-[#FFF9F5] border border-[#D4A574]/30 rounded-2xl p-4` |
| Timeline card | `bg-white rounded-2xl p-4 border border-[#E07856]/10` |
| Warnings card | `bg-orange-50 border border-orange-200 rounded-2xl p-4` |
| "Check Another" CTA | `bg-white text-[#2D1810] border border-[#E07856]/20 rounded-2xl py-4` |

### 7.5 Motion

| Element | Animation |
|---|---|
| Step transitions | `AnimatePresence` — fade between search/analyzing/results |
| Analyzing spinner | `withRepeat(withTiming(360, 1000), -1)` rotation on ring |
| Analyzing pulse | `withRepeat(withTiming({scale: [1, 1.2, 1]}, 1500), -1)` on outer ring |
| Match score bar | `withTiming(width: matchScore%, 1000, easeOut)` |
| Ingredient cards | Stagger `FadeInDown.delay(idx * 100)` |
| Improvement items | Stagger `FadeInDown.delay(idx * 80)` |
| Product list items | Stagger `FadeInDown.delay(idx * 50)` |

### 7.6 User's Skin Type Pre-selected

The verdict is automatically personalized to the user's skin type from onboarding (Q2). No manual skin type selection needed on this screen — the header subline and all verdicts reflect the user's stored skin type.

```typescript
const userSkinType = useUserStore(s => s.skinType) as SkinType;
const match = selectedProduct?.skinTypeMatch[userSkinType];
// match.suitability → "excellent" | "good" | "caution" | "avoid"
// match.matchScore  → 0–100
```

---

## 8. File Structure

```
lib/
  productTypes.ts        # Product/ProductCategory types + CATEGORY_EMOJI map
data/
  products-seed.json     # Bundled fallback (~150 products) + Firebase Storage upload source
scripts/
  upload-products.js     # One-time Firebase Storage upload script (Firebase Admin SDK)
stores/
  useProductStore.ts     # Zustand store: products[], hydrate(), syncFromStorage()
hooks/
  useProductSearch.ts    # Fuse.js search hook with filter state
app/
  product-check.tsx      # Replaced: "Coming Soon" → full product catalog screen
```

**New Zustand store** (`useProductStore`) manages product data lifecycle: hydrate from AsyncStorage cache, fire-and-forget background sync from Firebase Storage, expose products array for the search hook.

**No changes to routineData.ts.** The routine step `product` field stays independent. A future `productId` reference can link them later if needed.

---

## 9. Seed Data Sourcing Plan

### 9.1 Product Count Targets

| Category | Count | Priority |
|---|---|---|
| Cleanser / Face Wash | 20 | High — most common entry product |
| Moisturizer | 20 | High — universal need |
| Sunscreen | 15 | High — Indian climate essential |
| Serum | 15 | Medium — growing segment |
| Toner | 12 | Medium |
| Face Mask | 12 | Medium |
| Exfoliator | 10 | Medium |
| Night Cream | 10 | Medium |
| Lip Care | 10 | Low |
| Spot Treatment | 10 | Low |
| Face Oil | 8 | Low |
| Eye Cream | 8 | Low |
| **Total** | **~150** | |

### 9.2 Brand Coverage

Budget-friendly brands popular in Indian market:

**Pharmacy/Mass:** Himalaya, Pond's, Nivea, Lakme, Garnier, VLCC, Dabur, Patanjali, Vaseline, Lotus Herbals

**New-age/D2C:** Minimalist, The Derma Co, Plum, Dot & Key, Mamaearth, mCaffeine, WOW Skin Science, St. Botanica, Pilgrim

**Clinical/Accessible:** Cetaphil, Neutrogena, Simple, Bioderma (budget range), La Shield

**Ayurvedic:** Khadi Natural, Biotique, Forest Essentials (entry-level only), Kama Ayurveda (entry-level only)

### 9.3 Price Range

₹50 – ₹800. Products above ₹800 excluded. Each product gets a price-tier tag in its `tags` array:
- `budget` (₹50–₹200)
- `mid-range` (₹200–₹500)
- `premium-budget` (₹500–₹800)

These tags are searchable via Fuse.js (e.g. user types "budget" → matches all budget-tagged products). No separate price filter UI for MVP — tags + search cover this use case.

### 9.4 Data Compilation Method

Web search for "best budget [category] India [skin type]" across Amazon IN bestseller lists, Nykaa bestseller pages, and beauty review blogs. For each product: verify name, brand, current price range, skin type suitability, key concerns addressed, and grab Amazon CDN image URL.

### 9.5 Quality Checks

- Every product must have: name, brand, category, price, description, skinTypeMatch (all 5 keys), at least 1 ingredient, at least 1 improvement
- Image URLs verified as loadable at compile time
- No duplicate products (same product in different sizes counts as one entry, use most common size)
- Price accuracy: ±20% tolerance (prices fluctuate; seed data is indicative, not real-time)

---

## 10. Integration Points

### 10.1 Navigation

Product catalog is already routed at `/product-check`. No routing changes needed. Currently accessed from Home screen's product check card.

### 10.2 Analytics

Log events using existing analytics infrastructure:

| Event | When | Params |
|---|---|---|
| `PRODUCT_CHECK_VIEWED` | Screen mount (search step) | — |
| `PRODUCT_SEARCHED` | User types in search bar (debounce 500ms) | `query` |
| `PRODUCT_SELECTED` | User taps a product card | `product_id`, `product_name` |
| `PRODUCT_VERDICT_VIEWED` | Results step renders | `product_id`, `suitability`, `match_score` |
| `PRODUCT_CHECK_ANOTHER` | User taps "Check Another Product" | — |

### 10.3 i18n

Product names stay in English (brand names are English on packaging). All other content is bilingual:
- **UI chrome** (header, search placeholder, verdict labels, section headings) → `en` + `hi` i18n keys
- **Ingredient names + benefits** → `name`/`nameHi`, `benefitEn`/`benefitHi` fields in data
- **Improvements** → `improvementsEn`/`improvementsHi` in data
- **Warnings** → `warningsEn`/`warningsHi` in data
- **Timeline** → `weeksEn`/`weeksHi`, `resultEn`/`resultHi` in data
- **Suitability labels** → `SUITABILITY_CONFIG` has `labelEn`/`labelHi`

### 10.4 Future: Routine Linking

Not in this scope. Future work could add a `productId: string` field to `RoutineStep.product` to cross-reference the catalog. The catalog would then power both the browse screen and routine product recommendations.

---

## 11. Dependencies

| Package | Version | Purpose | Status |
|---|---|---|---|
| `fuse.js` | ^7.0 | Fuzzy search | **New** (~5KB gzipped) |
| `@react-native-async-storage/async-storage` | ^2.1.0 | Local product cache | Already installed |
| `firebase/storage` | — | Download products.json | Already installed (`lib/firebase.ts` exports `storage`) |

No other new dependencies. Zero Firestore usage for this feature. Uses existing `react-native-reanimated`, `expo-image` (or RN `Image`), and design system components.

---

## 12. Out of Scope

- Barcode scanning (CTA is shown but disabled with "Coming soon" toast — future feature per PLAN.md)
- "Buy now" / external links to Amazon/Nykaa (future feature)
- Gemini-powered dynamic verdicts (V2 — replace pre-computed data with per-user AI analysis)
- User reviews or ratings input
- Product comparison between multiple products
- Admin panel for product management (use Firebase console directly)
- Routine ↔ product cross-linking
- Real-time sync / push notifications on product updates — background fetch on app open is sufficient
- Conditional fetch (ETag/If-Modified-Since) — at ~50-200KB, re-downloading every app open is negligible
