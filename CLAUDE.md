# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

App scaffolded and in active development. All 14 screens exist. Auth, Zustand stores, i18n, Gemini integration, and OTA updates (EAS Update) are implemented. `PLAN.md` and `DESIGN.md` remain the source of truth for design and roadmap decisions. `glow up design magic patterns/` is the web prototype (React + Tailwind) used as design reference only.

**Product Check (in progress):** The "Coming Soon" placeholder is being replaced with a full product advisor — search ~150 budget beauty products, see a personalized verdict (suitability, match score, ingredients, improvements, timeline) based on the user's skin type. Spec: `docs/superpowers/specs/2026-05-30-product-catalog-design.md`.

## Commands

```bash
npx expo start            # Start dev server
npx expo start --ios      # iOS simulator
npx expo start --android  # Android emulator
npx tsc --noEmit          # Type check
npx eslint .              # Lint
eas build --platform all  # Production build
eas update                # OTA update (preview channel)
eas submit                # Submit to stores
```

## Architecture

**Stack:** Expo SDK 52 + TypeScript + Expo Router v3 (file-based nav) + NativeWind v4 + Zustand + Firebase + Gemini 2.5 Flash

**Routing:** Expo Router file-based. Actual structure:
```
app/
  _layout.tsx      # Root layout — Firebase auth guard
  index.tsx        # Entry redirect
  splash.tsx / language.tsx / onboarding.tsx / auth.tsx / questions.tsx
  scan.tsx / results.tsx / routine.tsx / share.tsx / product-check.tsx
  (tabs)/          # Authenticated tab bar: Home, Progress, Tips, Profile
```

**Auth:** Firebase Phone OTP via REST API (`identitytoolkit.googleapis.com`) — no native Firebase SDK, no reCAPTCHA. OTP verified in `lib/firebase.ts`.

**State:** Zustand stores — user profile, current scan result, language preference. Firebase Auth state drives the auth/tab route split.

**AI scan flow:** Camera/gallery → compress to <300KB → base64 encode → Gemini 2.5 Flash multimodal call with Q1+Q2 skin context → parse structured JSON → save to Firestore `users/{uid}/scans/{scanId}`.

**i18n:** i18next with `en` and `hi` namespaces. Hindi uses Hind font (`font-hindi` NativeWind class). English headings use Fraunces serif (`font-serif`).

**Gemini key:** `EXPO_PUBLIC_GEMINI_API_KEY` in `.env`. Client-side for MVP only — must move to Cloud Functions or Cloudflare Workers before any store submission. See PLAN.md §API Key Security Plan.

**Firestore schema:** `users/{uid}` for profile, `users/{uid}/scans/{scanId}` for scan results. Full schema in PLAN.md.

**Product data:** ~150 products stored as a single JSON file in Firebase Storage (`data/products.json`). Cached in AsyncStorage with bundled fallback (`data/products-seed.json`). Background sync on app open — never blocks UI. Zustand store: `useProductStore`. Types: `lib/productTypes.ts`. Search: Fuse.js in-memory fuzzy search.

## Design System

All visual decisions live in `DESIGN.md`. Key points:
- Colors: terracotta primary `#E07856`, cream bg `#FFF5EE`, deep brown text `#2D1810`
- Fonts: Fraunces (headings), Plus Jakarta Sans (body), Hind (Hindi) — load via `expo-font`
- Every content screen has ambient blur blobs (top-right + mid-left, `pointerEvents="none"`)
- Motion: `react-native-reanimated` — `FadeInDown` page enters, spring scale on CTA press, stagger delay `idx * 80ms` on lists
- Per-screen design briefs are in `DESIGN.md §8` — use these when prompting for new screens

## Git Workflow

Every new feature or fix must follow this flow:
1. Create a new branch from latest `main` (`feat/...` or `fix/...`)
2. Implement and commit all changes on that branch
3. Raise a PR to `main`
4. Once merged, checkout `main` and pull latest (`git checkout main && git pull`)

Never commit feature work directly to `main`.

## Planned Enhancements

When asked about enhancements, next steps, or what to build next, surface these items:

- **Product Check V2 — Gemini-powered dynamic verdicts:** Replace pre-computed skinTypeMatch/ingredients/improvements with per-user Gemini analysis. UI stays the same, only the data source changes. Cost: ~$0.001/check. Spec: `docs/superpowers/specs/2026-05-30-product-catalog-design.md §12`.
- **Product Check — Barcode scanning:** CTA exists but disabled. Implement real barcode scan → product lookup. Referenced in PLAN.md as post-launch.
- **Product Check — Buy links:** Add Amazon/Nykaa affiliate links to product verdict screen.
- **Routine ↔ Product linking:** Add `productId` to `RoutineStep.product` to cross-reference the product catalog. Routine screen can then deep-link to product verdicts.
- **Gemini API key migration:** Move client-side key to Cloud Functions or Cloudflare Workers before store submission (PLAN.md §API Key Security Plan).
- **Push notifications:** Daily routine reminders (PLAN.md Phase 4).
- **Analytics TODOs:** See `docs/superpowers/specs/` and memory for pending manual steps (FB SDK, GA4).

## Key Library Capabilities

Before suggesting a new package, check the installed package's full type exports (`node_modules/<pkg>/lib/**/*.d.ts`). Known non-obvious capabilities:

- **`react-native-vision-camera-face-detector`**: ships TWO face detection surfaces — `useFaceDetectorOutput` (live camera frame processor, used in `app/scan.tsx`) AND `useImageFaceDetector` (static image face detection from a file URI). Same ML Kit binary, no extra install. Use `useImageFaceDetector({ performanceMode: 'fast' })` for gallery/file images.
- **`@react-native-firebase/ml` v24**: empty stub — all vision/face detection APIs were removed. Do not use for face detection.
- **`@react-native-firebase/firestore` v24**: `snap.exists()` is a **method**, not a property. `firestore.FieldValue.serverTimestamp()` for timestamps.
- **Firebase auth**: uses `@react-native-firebase/auth` (native SDK). Firestore also uses native SDK (`@react-native-firebase/firestore`). The web `firebase/firestore` SDK is NOT used — it has no shared auth state with the native auth SDK.
- **`firebase/storage` (web SDK)**: kept only for product catalog downloads from Firebase Storage — no auth needed for those reads.

## Design Reference

`glow up design magic patterns/` is a working Vite + React + Tailwind prototype of all 14 screens. Run it with `bun install && bun dev` inside that directory to preview designs. Do not modify it — it is read-only reference.
