# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

App scaffolded and in active development. All 14 screens exist. Auth, Zustand stores, i18n, Gemini integration, and OTA updates (EAS Update) are implemented. `PLAN.md` and `DESIGN.md` remain the source of truth for design and roadmap decisions. `glow up design magic patterns/` is the web prototype (React + Tailwind) used as design reference only.

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

**Stack:** Expo SDK 52 + TypeScript + Expo Router v3 (file-based nav) + NativeWind v4 + Zustand + Firebase + Gemini 2.0 Flash

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

**AI scan flow:** Camera/gallery → compress to <300KB → base64 encode → Gemini 2.0 Flash multimodal call with Q1+Q2 skin context → parse structured JSON → save to Firestore `users/{uid}/scans/{scanId}`.

**i18n:** i18next with `en` and `hi` namespaces. Hindi uses Hind font (`font-hindi` NativeWind class). English headings use Fraunces serif (`font-serif`).

**Gemini key:** `EXPO_PUBLIC_GEMINI_API_KEY` in `.env`. Client-side for MVP only — must move to Cloud Functions or Cloudflare Workers before any store submission. See PLAN.md §API Key Security Plan.

**Firestore schema:** `users/{uid}` for profile, `users/{uid}/scans/{scanId}` for scan results. Full schema in PLAN.md.

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

## Design Reference

`glow up design magic patterns/` is a working Vite + React + Tailwind prototype of all 14 screens. Run it with `bun install && bun dev` inside that directory to preview designs. Do not modify it — it is read-only reference.
