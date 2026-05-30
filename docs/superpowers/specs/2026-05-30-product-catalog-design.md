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

export interface Product {
  id: string;                    // kebab-case slug, e.g. "himalaya-neem-face-wash"
  name: string;                  // "Himalaya Purifying Neem Face Wash"
  brand: string;                 // "Himalaya"
  category: ProductCategory;     // "cleanser"
  skinTypes: SkinType[];         // reuses existing type from routineData.ts
  concerns: Concern[];           // reuses existing type from routineData.ts
  price: number;                 // numeric ₹ value for sorting/filtering (e.g. 175)
  priceDisplay: string;          // "₹175" — pre-formatted for display
  size: string;                  // "150ml" / "50g"
  description: string;           // one-line product pitch (< 120 chars)
  imageUrl: string | null;       // Amazon/Nykaa CDN URL, null if unavailable
  tags: string[];                // ["bestseller", "ayurvedic", "dermat-recommended"]
  rating: number;                // approximate rating out of 5 (e.g. 4.3)
}
```

**Key decisions:**

- **`price` is numeric** — enables sort-by-price and price range filtering. `priceDisplay` avoids runtime formatting.
- **Reuses `SkinType` and `Concern`** from `lib/routineData.ts` — single source of truth, no type divergence.
- **`imageUrl` is nullable** — when null or when the URL fails to load, the UI falls back to a category emoji icon.
- **`tags` array** — flexible metadata for badges and secondary filtering (bestseller, ayurvedic, dermatologist-recommended, fragrance-free, etc.).
- **`rating`** — approximate average rating from Amazon/Nykaa at time of data compilation. Displayed as stars on product cards.

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

### 3.3 Sample Product Entry

```json
{
  "id": "minimalist-salicylic-acid-cleanser",
  "name": "Minimalist 2% Salicylic Acid Face Wash",
  "brand": "Minimalist",
  "category": "cleanser",
  "skinTypes": ["oily", "combination"],
  "concerns": ["acne", "dark_spots"],
  "price": 299,
  "priceDisplay": "₹299",
  "size": "100ml",
  "description": "Gentle BHA cleanser that unclogs pores without stripping moisture",
  "imageUrl": "https://m.media-amazon.com/images/I/51xKHOBpLkL._SL300_.jpg",
  "tags": ["bestseller", "dermat-recommended"],
  "rating": 4.3
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

### 4.1 Library

**Fuse.js** (~5KB gzipped). Chosen over alternatives:

| Library | Verdict | Why |
|---|---|---|
| Fuse.js | **Selected** | Best fuzzy/typo tolerance, lightweight, proven in RN, weighted multi-field search |
| FlexSearch | Rejected | Larger bundle, optimized for full-text (overkill for 150 products) |
| Custom prefix | Rejected | No typo tolerance ("sunscren" won't match "sunscreen") |
| MiniSearch | Rejected | Similar to Fuse.js but less RN community adoption |

### 4.2 Search Configuration

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

### 4.3 Search + Filter Pipeline

```
User input → Fuse.js fuzzy match → post-filter by active skin type chips
                                  → post-filter by active category chips
                                  → sorted results rendered
```

When search query is empty, all products are shown (filtered only by active chips), grouped by category.

### 4.4 Search Hook

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
      filtered = filtered.filter(p =>
        p.skinTypes.includes(skinTypeFilter) || p.skinTypes.includes('all')
      );
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

### 5.1 Source

Amazon India product images from public CDN URLs.

**URL format:** `https://m.media-amazon.com/images/I/{image-id}._SL300_.jpg`

The `_SL300_` suffix requests a 300px-wide version — adequate for product cards and fast to load. These URLs are:
- Publicly accessible (no auth)
- Served from Amazon's global CDN (fast in India)
- Stable for existing products (URLs persist for years)

### 5.2 Fallback Strategy

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

### 5.3 Image Risk & Mitigation

| Risk | Likelihood | Mitigation |
|---|---|---|
| Amazon changes URL format | Low | Emoji fallback renders gracefully. Batch-verify URLs on data updates. |
| Image removed for specific product | Medium | `onError` triggers emoji fallback. User still sees product info. |
| Slow load on poor network | Medium | Add `placeholder` color (cream bg) while loading. Images are ~15-30KB at SL300. |

---

## 7. Screen Design — Product Catalog

### 6.1 Screen Structure

The existing `app/product-check.tsx` is replaced with a full product browse screen.

```
┌─────────────────────────────────┐
│ ←  Product Guide      (header)  │
│    "Find your perfect match"    │
├─────────────────────────────────┤
│ 🔍 Search products...           │
├─────────────────────────────────┤
│ [Oily] [Dry] [Combo] [Normal]  │  ← skin type filter pills
│ [Cleanser] [Moisturizer] [Sun..│  ← category filter pills (scroll)
├─────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐      │
│ │  image   │ │  image   │      │  ← 2-column product grid
│ │  Brand   │ │  Brand   │      │
│ │  Name    │ │  Name    │      │
│ │  ₹175    │ │  ₹299    │      │
│ │  ★★★★☆  │ │  ★★★★★  │      │
│ └──────────┘ └──────────┘      │
│ ┌──────────┐ ┌──────────┐      │
│ │  ...     │ │  ...     │      │
│ └──────────┘ └──────────┘      │
│                                 │
│  (scrollable, pb-24)            │
└─────────────────────────────────┘
```

### 6.2 Design Tokens (per DESIGN.md)

| Element | Style |
|---|---|
| Background | `bg-[#FFF5EE]` with ambient blobs |
| Header | Fraunces h1 `"Product Guide"` + italic serif subline |
| Search bar | `bg-white rounded-2xl py-3 px-4 border border-[#E07856]/10` |
| Filter pills | Active: `bg-[#E07856] text-white rounded-xl`. Inactive: `bg-white border border-[#E07856]/15 rounded-xl` |
| Product card | `bg-white rounded-2xl p-3 border border-[#E07856]/10 shadow-soft` |
| Product image | `w-full aspect-square rounded-xl bg-[#FFF5EE]` (cream bg while loading) |
| Brand text | `text-[10px] uppercase tracking-widest text-[#2D1810]/40 font-sans` |
| Product name | `text-sm font-sans font-semibold text-[#2D1810]` (2 lines max) |
| Price badge | `text-sm font-bold text-[#E07856]` |
| Rating stars | `text-xs text-[#D4A574]` |
| Empty state | Centered emoji + "No products match" + "Clear filters" CTA |

### 6.3 Motion

| Element | Animation |
|---|---|
| Page enter | `FadeInDown.springify()` on header |
| Product cards | Staggered `FadeInDown.delay(idx * 60)` on initial load |
| Filter chip toggle | Spring scale (0.95 → 1.0) on press |
| Search → results | No transition (instant, in-memory) |

### 6.4 User's Skin Type Pre-selected

On first load, pre-select the user's self-reported skin type (from Q2 during onboarding, stored in user profile) as the default filter. The user can clear it or switch to another type. This makes the default view immediately relevant.

```typescript
const userSkinType = useUserStore(s => s.skinType);
const [skinTypeFilter, setSkinTypeFilter] = useState<SkinType | null>(userSkinType ?? null);
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

- Every product must have: name, brand, category, at least one skinType, price, description
- Image URLs verified as loadable at compile time
- No duplicate products (same product in different sizes counts as one entry, use most common size)
- Price accuracy: ±20% tolerance (prices fluctuate; seed data is indicative, not real-time)

---

## 10. Integration Points

### 10.1 Navigation

Product catalog is already routed at `/product-check`. No routing changes needed. Currently accessed from Home screen's product check card.

### 10.2 Analytics

Log events using existing analytics infrastructure:

| Event | When |
|---|---|
| `PRODUCT_CATALOG_VIEWED` | Screen mount |
| `PRODUCT_SEARCHED` | User submits search (debounce 500ms) with query param |
| `PRODUCT_FILTER_APPLIED` | Filter chip toggled, with filter type + value |
| `PRODUCT_TAPPED` | Product card pressed, with product ID |

### 10.3 i18n

Product names and descriptions stay in English for MVP (brand names are English, product names are English on packaging). The UI chrome (header, search placeholder, filter labels, empty state) gets `en` + `hi` translations added to the i18n namespace.

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

- Product detail modal/screen (tap does nothing for MVP beyond analytics logging — detail screen is a fast follow)
- "Buy now" / external links to Amazon/Nykaa (future feature)
- User reviews or ratings input
- Product comparison
- Admin panel for product management (use Firebase console directly)
- Routine ↔ product cross-linking
- Hindi product names/descriptions
- Real-time sync / push notifications on product updates — background fetch on app open is sufficient
- Conditional fetch (ETag/If-Modified-Since) — at ~50KB, re-downloading every app open is negligible
