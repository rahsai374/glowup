# Gender Collection & Profile Avatar Personalization

**Date:** 2026-06-01
**Status:** Approved

## Overview

Add gender collection to onboarding, persist to Firestore, and display a gender-differentiated illustrated avatar on the profile page. This provides a personalization signal for routines, notifications, and product recommendations.

## 1. Data & Storage

### Firestore Schema Addition

**Collection:** `users/{uid}`

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `gender` | `'male' \| 'female' \| 'unspecified'` | No | `'unspecified'` |

- Written in `saveProfile()` alongside `name`, `phone`, `skinType`, `mainConcern`, etc.
- Editable from profile screen (same as name)
- `'unspecified'` used when user selects "Prefer not to say" or skips selection

### Zustand Store

- Add `gender` field to `useUserStore` state
- Hydrate from Firestore in `hydrateFromFirestore()`
- Persist locally via AsyncStorage (same as other profile fields)

## 2. Onboarding UX — Name Step Modification

The existing final onboarding step (name input) becomes a combined name + gender screen:

### Layout (top to bottom)

1. **Title:** existing "What should we call you?" (localized)
2. **Name text input** (existing, unchanged)
3. **Gender selector label:** "Adding gender helps us personalize your routines" (localized)
4. **Three pill buttons:** `Male` / `Female` / `Prefer not to say`
   - Horizontal row, equal width
   - Unselected: outlined, terracotta border `#E07856` at 12% opacity
   - Selected: filled terracotta `#E07856`, white text
   - Default: nothing pre-selected
5. **Done button** (existing, unchanged)

### Behavior

- Gender selection is optional — tapping Done without choosing stores `'unspecified'`
- Only one pill can be selected at a time (radio behavior)
- Selection animates with spring scale (consistent with existing CTA animations)

### i18n Keys

| Key | English | Hindi |
|-----|---------|-------|
| `gender_helper` | "Adding gender helps us personalize your routines" | "जेंडर जोड़ने से हम आपकी रूटीन को personalize कर सकते हैं" |
| `gender_male` | "Male" | "पुरुष" |
| `gender_female` | "Female" | "महिला" |
| `gender_unspecified` | "Prefer not to say" | "बताना नहीं चाहते" |

## 3. Profile Avatar

### Assets

Three minimal line-art SVG illustrations:

| Gender | Visual Differentiation |
|--------|----------------------|
| `male` | Shorter hair, slightly angular jawline |
| `female` | Longer hair, softer features |
| `unspecified` | Androgynous — medium hair, neutral features |

### Style

- Stroke-based line art (not filled/detailed)
- Stroke color: `#2D1810` (deep brown) for contrast on cream
- Background: circular cream `#FFF5EE` with subtle terracotta border
- Size: 80x80pt on profile page
- Format: inline SVG via `react-native-svg` (no external asset loading)

### Placement

- Profile screen: replaces current avatar/placeholder area
- Displayed above user name

## 4. Profile Screen — Edit Gender

- Tapping the avatar or a dedicated "Edit" affordance opens gender selection
- Same three-pill UI as onboarding
- Change triggers `updateProfileField({ gender: newValue })` → Firestore merge write
- Avatar updates immediately on selection

## 5. Firestore Write Points

| Operation | Function | File | Trigger |
|-----------|----------|------|---------|
| Initial save | `saveProfile()` | `lib/firestore.ts` | Onboarding completion |
| Update | `updateProfileField()` | `lib/firestore.ts` | Profile edit |
| Hydrate | `hydrateFromFirestore()` | `lib/firestore.ts` | App launch |

## 6. Migration — Existing Users

- Existing users without `gender` field: treated as `'unspecified'`
- No migration script needed — field is optional
- Profile screen shows neutral avatar until they set gender
- Optional: show a one-time prompt on profile page encouraging them to add gender (not in this scope)

## 7. Future Usage (not implemented in this spec)

- Gemini prompt enrichment: pass gender for routine step count/product texture preferences
- Notification copy: subtle tone adaptation
- Product catalog: filter/boost gender-marketed items
- Analytics: segment by gender for engagement patterns

## 8. Files to Modify

- `app/questions.tsx` — add gender selector to name step
- `lib/firestore.ts` — include `gender` in `saveProfile()` and `hydrateFromFirestore()`
- `stores/useUserStore.ts` — add `gender` to store state
- `app/(tabs)/profile.tsx` — render avatar, add gender edit
- `i18n/en.json` — add gender keys
- `i18n/hi.json` — add gender keys
- New: `components/ProfileAvatar.tsx` — SVG avatar component
- New: `components/GenderSelector.tsx` — reusable pill selector (shared between onboarding and profile)
