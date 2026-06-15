# Product Match Score Rubric

This document defines how `skinTypeMatch[<skinType>].matchScore` values in `data/products-seed.json` are assigned. The score is the *base* match score (before scan-driven concern bonuses). The scoring engine adds up to +10 in concern bonuses on top, so base scores are capped at 85 to leave headroom — a final 100 is only reachable when a user's scan strongly matches the product's targeted concerns.

## Bands

| Band  | Suitability | Meaning                                                         | Typical tags                                                |
|-------|-------------|-----------------------------------------------------------------|-------------------------------------------------------------|
| 80–85 | excellent   | Top-tier match. Dermat-grade or cult-status product for this skin type. Max ~3–5 products per (skin_type, category). | `dermat-recommended`, `premium-budget`, evidence-backed key ingredient |
| 70–79 | excellent / good | Strong everyday pick. Well-formulated, widely-trusted brand.    | `bestseller`, `mid-range`, niacinamide/HA/salicylic-acid hero ingredient |
| 60–69 | good        | Solid budget or mass-market choice that works for this skin type. | `mass-market`, `budget`, Tier 2/3 brand                     |
| 45–59 | caution     | Usable but with tradeoffs (texture, alcohol content, mild irritation risk for this skin type). | Active ingredients that may sensitize, fragrance-containing |
| 25–44 | avoid       | Wrong category match for this skin type (oil-stripping cleanser for dry skin, heavy cream for oily skin). | —                                                            |
| 0–24  | avoid       | Reserved for products that are actively harmful for this skin type. Use sparingly. | —                                                            |

## Rules

1. **Base score ceiling is 85.** Never author a `matchScore` above 85. The engine reserves +10 for concern bonuses.
2. **A 100 final score means the product is excellent AND the user's scan shows multiple strong concern matches.** It is not "no better product exists" — it is "this product targets exactly what your scan flagged."
3. **Differentiate within a tier.** No two products should share the same `matchScore` for the same (skin_type, category) — break ties using `rating`, `dermat-recommended` tag, then alphabetical name.
4. **Cross-category scores are not comparable.** A cleanser at 82 and a moisturizer at 82 are both "top-tier in their category," not "equally good."

## Suitability label boundaries (computed in `scoringEngine.ts`)

- `excellent`: final score >= 80
- `good`: 65–79
- `caution`: 45–64
- `avoid`: < 45
