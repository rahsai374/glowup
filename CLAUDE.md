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

**Auth:** Firebase Phone OTP via REST API — no native Firebase SDK, no reCAPTCHA. See `lib/firebase.ts`.

**State:** Zustand stores. Firebase Auth state drives auth/tab route split.

**AI scan flow:** Camera → compress <300KB → base64 → Gemini 2.5 Flash multimodal → structured JSON → Firestore `users/{uid}/scans/{scanId}`.

**i18n:** i18next (`en`/`hi`). Hindi = Hind font (`font-hindi`), English headings = Fraunces (`font-serif`).

**Gemini key:** `EXPO_PUBLIC_GEMINI_API_KEY` in `.env`. Client-side for MVP — must move server-side before store submission. On the **paid Gemini API** (not free tier) — rate limit errors are not a timeout cause.

**Product data:** JSON in Firebase Storage, cached in AsyncStorage with bundled fallback. Store: `useProductStore`. Types: `lib/productTypes.ts`.

## Coding Rules

Rules learned from past code reviews. Check every item before writing code. Update this section after each review that surfaces a new pattern.

### i18n
- Every user-facing string must use `t('key')` — zero hardcoded English/Hindi.
- When adding new UI text, add keys to both `i18n/en.json` and `i18n/hi.json` before writing JSX.
- Hindi translations use Roman Hindi (transliterated script like "karo", "karne ke liye") + English terms — not Devanagari.

### Firestore
- Always use `{ merge: true }` with `.set()` unless intentionally replacing the entire document. Bare `.set()` silently wipes fields written by other code paths (device info, streaks, profile card data).
- `.update()` throws NOT_FOUND if the document doesn't exist. Prefer `.set({...}, { merge: true })` for partial writes that must be safe on first use.
- When success feedback depends on a Firestore write (hiding a card, showing "saved"), `await` the call and handle the failure path — don't fire-and-forget then claim success.

### Input validation
- When moving a `TextInput` between files, carry all its validation: `maxLength`, sanitization regex (`/[\x00-\x1F\x7F]/g`), required checks, placeholder i18n key.
- Name fields: `maxLength={50}`, strip control characters on `onChangeText`.

### State management
- Initialize local state from existing store values when editing existing data: `useState(user?.name ?? '')`, not `useState('')`.
- Guard save functions with `!user?.uid` early return when Firestore writes depend on the user being authenticated.

### DRY
- When a multi-step pattern (e.g. compute → save) appears in 2+ files, extract a shared helper immediately. Don't copy-paste. Current helper: `generateAndSaveRoutine` in `lib/firestore.ts`.

### Component extraction
- If a self-contained UI block (card, form, modal) exceeds ~30 lines of JSX inside a screen, extract it to `components/`. Pass data and callbacks as props.

## Design System

See `DESIGN.md` for colors, fonts, motion, blur blobs, and per-screen design briefs.

## Git Workflow

Every new feature or fix must follow this flow:
1. Create a new branch from latest `main` (`feat/...` or `fix/...`)
2. Implement and commit all changes on that branch
3. Raise a PR to `main`
4. Once merged, checkout `main` and pull latest (`git checkout main && git pull`)

Never commit feature work directly to `main`.

## Planned Enhancements

See `docs/ENHANCEMENTS.md` — read when asked about next steps or what to build.

## Key Library Capabilities

See `docs/LIBRARY_NOTES.md` — read before suggesting new packages.

## Design Reference

`glow up design magic patterns/` is a working Vite + React + Tailwind prototype of all 14 screens. Run it with `bun install && bun dev` inside that directory to preview designs. Do not modify it — it is read-only reference.
