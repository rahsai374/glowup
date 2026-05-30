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

**Chosen: Static JSON bundle + Fuse.js in-memory search**

| Option | Verdict | Rationale |
|---|---|---|
| A) Static JSON in app bundle | **Selected** | 150-200 products ≈ 50-80KB. Offline-ready, zero Firestore reads, instant search. Updatable via EAS Update (OTA). |
| B) Firestore collection | Rejected | Overkill at this scale. Burns reads, needs network, still needs client-side fuzzy search. |
| C) Remote JSON (CDN) | Rejected | OTA updates already solve "update without rebuild". Extra fetch logic for no real gain. |

**Migration path:** When catalog exceeds ~500 products or needs admin editing, move data source to Firestore. The search/UI layer (Fuse.js, components) stays unchanged — only the data-loading hook changes.

---

## 3. Data Model

### 3.1 Product Interface

```typescript
// data/products.ts

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

## 4. Fuzzy Search

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

## 5. Product Images

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

## 6. Screen Design — Product Catalog

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

## 7. File Structure

```
data/
  products.ts          # Product type definitions + CATEGORY_EMOJI map
  products.json        # Seed data: ~150 product entries
hooks/
  useProductSearch.ts  # Fuse.js search hook with filter state
app/
  product-check.tsx    # Replaced: "Coming Soon" → full product catalog screen
```

**No new stores.** Product data is static (loaded from JSON import). Search/filter state is local to the screen via the `useProductSearch` hook. No Zustand store needed.

**No changes to routineData.ts.** The routine step `product` field stays independent. A future `productId` reference can link them later if needed.

---

## 8. Seed Data Sourcing Plan

### 8.1 Product Count Targets

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

### 8.2 Brand Coverage

Budget-friendly brands popular in Indian market:

**Pharmacy/Mass:** Himalaya, Pond's, Nivea, Lakme, Garnier, VLCC, Dabur, Patanjali, Vaseline, Lotus Herbals

**New-age/D2C:** Minimalist, The Derma Co, Plum, Dot & Key, Mamaearth, mCaffeine, WOW Skin Science, St. Botanica, Pilgrim

**Clinical/Accessible:** Cetaphil, Neutrogena, Simple, Bioderma (budget range), La Shield

**Ayurvedic:** Khadi Natural, Biotique, Forest Essentials (entry-level only), Kama Ayurveda (entry-level only)

### 8.3 Price Range

₹50 – ₹800. Products above ₹800 excluded. Each product gets a price-tier tag in its `tags` array:
- `budget` (₹50–₹200)
- `mid-range` (₹200–₹500)
- `premium-budget` (₹500–₹800)

These tags are searchable via Fuse.js (e.g. user types "budget" → matches all budget-tagged products). No separate price filter UI for MVP — tags + search cover this use case.

### 8.4 Data Compilation Method

Web search for "best budget [category] India [skin type]" across Amazon IN bestseller lists, Nykaa bestseller pages, and beauty review blogs. For each product: verify name, brand, current price range, skin type suitability, key concerns addressed, and grab Amazon CDN image URL.

### 8.5 Quality Checks

- Every product must have: name, brand, category, at least one skinType, price, description
- Image URLs verified as loadable at compile time
- No duplicate products (same product in different sizes counts as one entry, use most common size)
- Price accuracy: ±20% tolerance (prices fluctuate; seed data is indicative, not real-time)

---

## 9. Integration Points

### 9.1 Navigation

Product catalog is already routed at `/product-check`. No routing changes needed. Currently accessed from Home screen's product check card.

### 9.2 Analytics

Log events using existing analytics infrastructure:

| Event | When |
|---|---|
| `PRODUCT_CATALOG_VIEWED` | Screen mount |
| `PRODUCT_SEARCHED` | User submits search (debounce 500ms) with query param |
| `PRODUCT_FILTER_APPLIED` | Filter chip toggled, with filter type + value |
| `PRODUCT_TAPPED` | Product card pressed, with product ID |

### 9.3 i18n

Product names and descriptions stay in English for MVP (brand names are English, product names are English on packaging). The UI chrome (header, search placeholder, filter labels, empty state) gets `en` + `hi` translations added to the i18n namespace.

### 9.4 Future: Routine Linking

Not in this scope. Future work could add a `productId: string` field to `RoutineStep.product` to cross-reference the catalog. The catalog would then power both the browse screen and routine product recommendations.

---

## 10. Dependencies

| Package | Version | Purpose | Bundle impact |
|---|---|---|---|
| `fuse.js` | ^7.0 | Fuzzy search | ~5KB gzipped |

No other new dependencies. Uses existing `react-native-reanimated`, `expo-image` (or RN `Image`), and design system components.

---

## 11. Out of Scope

- Product detail modal/screen (tap does nothing for MVP beyond analytics logging — detail screen is a fast follow)
- "Buy now" / external links to Amazon/Nykaa (future feature)
- User reviews or ratings input
- Product comparison
- Firestore-backed product catalog
- Admin panel for product management
- Routine ↔ product cross-linking
- Hindi product names/descriptions
